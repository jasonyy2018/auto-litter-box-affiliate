import { NextRequest, NextResponse } from 'next/server';
import { checkProductStatus, getProductDetail } from '@/lib/cjApi';
import { getAllShopProducts, bulkUpdateProducts } from '@/lib/shopProducts';

function getDynamicMarkup(cost: number): number {
    if (cost < 10) return 3.5;
    if (cost < 50) return 2.5;
    if (cost < 150) return 2.2;
    return 1.6;
}

async function pLimit<T>(tasks: (() => Promise<T>)[], concurrency: number): Promise<T[]> {
    const results: T[] = new Array(tasks.length);
    let index = 0;
    async function worker() {
        while (index < tasks.length) {
            const i = index++;
            results[i] = await tasks[i]();
        }
    }
    await Promise.all(Array.from({ length: Math.min(concurrency, tasks.length) }, worker));
    return results;
}

export async function GET() {
    try {
        const products = await getAllShopProducts();
        const cjProducts = products.filter(p => p.cjPid);
        return NextResponse.json({
            success: true,
            data: {
                total: cjProducts.length,
                active: cjProducts.filter(p => p.cjStatus === 'active').length,
                discontinued: cjProducts.filter(p => p.cjStatus === 'discontinued').length,
                unknown: cjProducts.filter(p => p.cjStatus === 'unknown' || !p.cjStatus).length,
                lastSyncedAt: cjProducts.map(p => p.lastSyncedAt).filter(Boolean).sort().pop() || null,
            },
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to get sync status' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { productIds } = await request.json().catch(() => ({}));
        const allProducts = await getAllShopProducts();
        let productsToSync = allProducts.filter(p => p.cjPid);
        if (productIds?.length) productsToSync = productsToSync.filter(p => productIds.includes(p.id));
        if (!productsToSync.length) return NextResponse.json({ success: true, data: { synced: 0 } });

        const results = await pLimit(
            productsToSync.map((product, index) => async () => {
                if (index > 0) await new Promise(r => setTimeout(r, 350));
                const previousStatus = product.cjStatus || 'unknown';
                try {
                    const statusResult = await checkProductStatus(product.cjPid);

                    if (statusResult.status === 'discontinued') {
                        await bulkUpdateProducts({
                            [product.id]: {
                                cjStatus: 'discontinued',
                                lastSyncedAt: new Date().toISOString(),
                                discontinuedAt: new Date().toISOString(),
                                discontinuedReason: statusResult.reason || 'Discontinued on CJ',
                                visible: false,
                            } as any,
                        });
                        return { id: product.id, name: product.name, cjPid: product.cjPid, previousStatus, newStatus: 'discontinued' };
                    }

                    const detail = await getProductDetail(product.cjPid);
                    const now = new Date().toISOString();

                    // Price sync
                    const costs = (detail.variants || []).map((v: any) => v.variantSellPrice);
                    const maxCost = Math.max(...costs, detail.sellPrice || 0);
                    const threshold = maxCost > 50 ? Math.max(30, maxCost * 0.25) : 0;
                    const mainVariants = (detail.variants || []).filter((v: any) => v.variantSellPrice >= threshold);
                    const primaryVariant = mainVariants.length
                        ? mainVariants.sort((a: any, b: any) => a.variantSellPrice - b.variantSellPrice)[0]
                        : detail.variants?.[0];
                    const newCostPrice = primaryVariant ? primaryVariant.variantSellPrice : detail.sellPrice;
                    const newPrice = parseFloat((newCostPrice * getDynamicMarkup(newCostPrice)).toFixed(2));
                    const priceChanged = newPrice !== product.price;

                    // Description sync
                    const newDesc = detail.description || detail.productBrief || '';
                    const descUpdated = newDesc && newDesc !== product.description;

                    // Build updates
                    const updates: Record<string, any> = {
                        cjStatus: 'active',
                        lastSyncedAt: now,
                        price: newPrice,
                        costPrice: newCostPrice,
                        originalPrice: parseFloat((newPrice * 1.2).toFixed(2)),
                        name: detail.productNameEn || detail.productName || product.name,
                    };
                    if (descUpdated) updates.description = newDesc;
                    if (detail.productImageSet?.length) updates.images = detail.productImageSet;
                    if (detail.productWeight) updates.weight = detail.productWeight;

                    await bulkUpdateProducts({ [product.id]: updates });

                    return {
                        id: product.id, name: product.name, cjPid: product.cjPid,
                        previousStatus, newStatus: 'active',
                        priceChanged: priceChanged ? `$${product.price} → $${newPrice}` : undefined,
                        descriptionUpdated: descUpdated,
                    };
                } catch (err: any) {
                    return {
                        id: product.id, name: product.name, cjPid: product.cjPid,
                        previousStatus, newStatus: 'unknown', reason: err.message,
                    };
                }
            }),
            2
        );

        return NextResponse.json({
            success: true,
            data: {
                synced: results.length,
                discontinued: results.filter(r => r.newStatus === 'discontinued').length,
                pricesUpdated: results.filter(r => r.priceChanged).length,
                descriptionsUpdated: results.filter(r => r.descriptionUpdated).length,
                errors: results.filter(r => r.newStatus === 'unknown').length,
                results,
            },
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Sync failed' }, { status: 500 });
    }
}