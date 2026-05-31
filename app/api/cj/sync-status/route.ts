import { NextRequest, NextResponse } from 'next/server';
import { checkProductStatus } from '@/lib/cjApi';
import { getAllShopProducts, bulkUpdateProducts } from '@/lib/shopProducts';

/** Run promises with at most `concurrency` in-flight at a time */
async function pLimit<T>(
    tasks: (() => Promise<T>)[],
    concurrency: number
): Promise<T[]> {
    const results: T[] = new Array(tasks.length);
    let index = 0;
    async function worker() {
        while (index < tasks.length) {
            const i = index++;
            results[i] = await tasks[i]();
        }
    }
    const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, worker);
    await Promise.all(workers);
    return results;
}

/**
 * GET /api/cj/sync-status
 * 获取当前商品同步状态摘要
 */
export async function GET() {
    try {
        const products = getAllShopProducts();
        const cjProducts = products.filter(p => p.cjPid);

        const summary = {
            total: cjProducts.length,
            active: cjProducts.filter(p => p.cjStatus === 'active').length,
            discontinued: cjProducts.filter(p => p.cjStatus === 'discontinued').length,
            unknown: cjProducts.filter(p => p.cjStatus === 'unknown' || !p.cjStatus).length,
            lastSyncedAt: cjProducts
                .map(p => p.lastSyncedAt)
                .filter(Boolean)
                .sort()
                .pop() || null,
            discontinuedProducts: cjProducts
                .filter(p => p.cjStatus === 'discontinued')
                .map(p => ({
                    id: p.id,
                    name: p.name,
                    cjPid: p.cjPid,
                    discontinuedAt: p.discontinuedAt,
                    discontinuedReason: p.discontinuedReason,
                    visible: p.visible,
                })),
        };

        return NextResponse.json({ success: true, data: summary });
    } catch (error) {
        console.error('[CJ Sync Status] GET error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to get sync status' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/cj/sync-status
 * 同步所有 CJ 商品状态，自动下架已失效商品
 * 
 * Body (optional):
 * - productIds: string[] - 只同步指定商品（不传则同步全部）
 * - autoHide: boolean - 是否自动隐藏下架商品（默认 true）
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => ({}));
        const productIds: string[] | undefined = body.productIds;
        const autoHide: boolean = body.autoHide !== false; // 默认 true

        const allProducts = getAllShopProducts();
        let productsToSync = allProducts.filter(p => p.cjPid);

        // 如果指定了商品 ID，只同步这些商品
        if (productIds && productIds.length > 0) {
            productsToSync = productsToSync.filter(p => productIds.includes(p.id));
        }

        if (productsToSync.length === 0) {
            return NextResponse.json({
                success: true,
                data: {
                    synced: 0,
                    discontinued: 0,
                    errors: 0,
                    results: [],
                },
            });
        }

        console.log(`[CJ Sync] Starting parallel sync for ${productsToSync.length} products (concurrency=5)...`);

        type SyncResult = {
            id: string;
            name: string;
            cjPid: string;
            previousStatus: string;
            newStatus: string;
            reason?: string;
            autoHidden?: boolean;
            updates?: Record<string, any>;
        };

        const now = new Date().toISOString();

        // Helper sleep function to prevent CJDropshipping API burst frequency limit errors
        const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

        // Run CJ API checks with frequency protection (sequential check with a 350ms delay between calls)
        const tasks = productsToSync.map((product, index) => async (): Promise<SyncResult> => {
            try {
                // Stagger starting times sequentially to protect the API gateway limit
                if (index > 0) {
                    await sleep(index * 350);
                }
                const statusResult = await checkProductStatus(product.cjPid);
                const previousStatus = product.cjStatus || 'unknown';

                const updates: Record<string, any> = {
                    cjStatus: statusResult.status,
                    lastSyncedAt: now,
                };

                let autoHidden = false;

                if (statusResult.status === 'discontinued') {
                    if (previousStatus !== 'discontinued') {
                        updates.discontinuedAt = now;
                        updates.discontinuedReason = statusResult.reason || 'Product discontinued on CJDropshipping';
                        if (autoHide && product.visible) {
                            updates.visible = false;
                            autoHidden = true;
                        }
                        console.log(`[CJ Sync] ⚠️ DISCONTINUED: ${product.name}`);
                    }
                } else if (statusResult.status === 'active') {
                    if (previousStatus === 'discontinued') {
                        updates.discontinuedAt = undefined;
                        updates.discontinuedReason = undefined;
                        console.log(`[CJ Sync] ✅ RE-ACTIVATED: ${product.name}`);
                    }
                } else {
                    console.warn(`[CJ Sync] ❓ Unknown status for ${product.name}: ${statusResult.reason}`);
                }

                return { id: product.id, name: product.name, cjPid: product.cjPid, previousStatus, newStatus: statusResult.status, reason: statusResult.reason, autoHidden, updates };
            } catch (err) {
                console.error(`[CJ Sync] Error checking ${product.name}:`, err);
                return { id: product.id, name: product.name, cjPid: product.cjPid, previousStatus: product.cjStatus || 'unknown', newStatus: 'unknown', reason: err instanceof Error ? err.message : 'Unknown error' };
            }
        });

        // Use low concurrency (2 tasks in flight) to keep server loads balanced while applying our sequential delay
        const rawResults = await pLimit(tasks, 2);

        // Single bulk write — one read + one write for all products
        const bulkUpdates: Record<string, Record<string, any>> = {};
        for (const r of rawResults) {
            if (r.updates) bulkUpdates[r.id] = r.updates;
        }
        bulkUpdateProducts(bulkUpdates);

        const results = rawResults.map(({ updates: _u, ...rest }) => rest);
        const discontinuedCount = results.filter(r => r.newStatus === 'discontinued').length;
        const errorCount = results.filter(r => r.newStatus === 'unknown').length;

        console.log(`[CJ Sync] Complete. Synced: ${results.length}, Discontinued: ${discontinuedCount}, Errors: ${errorCount}`);

        return NextResponse.json({
            success: true,
            data: {
                synced: results.length,
                discontinued: discontinuedCount,
                errors: errorCount,
                autoHide,
                results,
            },
        });
    } catch (error) {
        console.error('[CJ Sync Status] POST error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Sync failed' },
            { status: 500 }
        );
    }
}