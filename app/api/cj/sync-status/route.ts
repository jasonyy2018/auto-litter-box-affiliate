import { NextRequest, NextResponse } from 'next/server';
import { checkProductStatus } from '@/lib/cjApi';
import { getAllShopProducts, updateShopProduct } from '@/lib/shopProducts';

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

        console.log(`[CJ Sync] Starting sync for ${productsToSync.length} products...`);

        const results: Array<{
            id: string;
            name: string;
            cjPid: string;
            previousStatus: string;
            newStatus: string;
            reason?: string;
            autoHidden?: boolean;
        }> = [];

        let discontinuedCount = 0;
        let errorCount = 0;

        for (const product of productsToSync) {
            try {
                console.log(`[CJ Sync] Checking product: ${product.name} (PID: ${product.cjPid})`);

                const statusResult = await checkProductStatus(product.cjPid);
                const previousStatus = product.cjStatus || 'unknown';
                const now = new Date().toISOString();

                const updates: Record<string, any> = {
                    cjStatus: statusResult.status,
                    lastSyncedAt: now,
                };

                let autoHidden = false;

                if (statusResult.status === 'discontinued') {
                    discontinuedCount++;
                    // 只在首次发现下架时记录时间和原因
                    if (previousStatus !== 'discontinued') {
                        updates.discontinuedAt = now;
                        updates.discontinuedReason = statusResult.reason || 'Product discontinued on CJDropshipping';
                        // 自动隐藏下架商品
                        if (autoHide && product.visible) {
                            updates.visible = false;
                            autoHidden = true;
                        }
                        console.log(`[CJ Sync] ⚠️ Product DISCONTINUED: ${product.name} - ${statusResult.reason}`);
                    }
                } else if (statusResult.status === 'active') {
                    // 如果商品重新上架，清除下架信息
                    if (previousStatus === 'discontinued') {
                        updates.discontinuedAt = undefined;
                        updates.discontinuedReason = undefined;
                        console.log(`[CJ Sync] ✅ Product RE-ACTIVATED: ${product.name}`);
                    }
                } else {
                    errorCount++;
                    console.warn(`[CJ Sync] ❓ Unknown status for ${product.name}: ${statusResult.reason}`);
                }

                // 更新商品状态
                updateShopProduct(product.id, updates);

                results.push({
                    id: product.id,
                    name: product.name,
                    cjPid: product.cjPid,
                    previousStatus,
                    newStatus: statusResult.status,
                    reason: statusResult.reason,
                    autoHidden,
                });

                // 避免 CJ API 频率限制（每次请求间隔 1 秒）
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (err) {
                errorCount++;
                console.error(`[CJ Sync] Error checking ${product.name}:`, err);
                results.push({
                    id: product.id,
                    name: product.name,
                    cjPid: product.cjPid,
                    previousStatus: product.cjStatus || 'unknown',
                    newStatus: 'unknown',
                    reason: err instanceof Error ? err.message : 'Unknown error',
                });
            }
        }

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