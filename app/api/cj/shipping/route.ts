import { NextRequest, NextResponse } from 'next/server';
import { getShopProductById } from '@/lib/shopProducts';
import { calculateFreight, getProductDetail, type CJFreightProduct } from '@/lib/cjApi';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { zip, items = [] } = body;

        if (!zip) {
            return NextResponse.json({ error: 'US ZIP code is required' }, { status: 400 });
        }

        if (!items || items.length === 0) {
            return NextResponse.json({ shippingCost: 0, isFree: true, message: 'Cart is empty' });
        }

        // 1. Calculate subtotal
        let subtotal = 0;
        for (const item of items) {
            subtotal += item.price * item.quantity;
        }

        // 2. Check for free shipping over $50
        if (subtotal >= 50.00) {
            return NextResponse.json({
                shippingCost: 0.00,
                isFree: true,
                message: 'Free Shipping on orders over $50!',
                method: 'Standard Shipping'
            });
        }

        // 3. If under $50, perform CJ dropshipping freight calculation
        const cjProductsToCalculate: CJFreightProduct[] = [];
        let fallbackCost = 9.95; // Base fallback shipping fee
        let totalItems = 0;

        for (const item of items) {
            totalItems += item.quantity;
            const product = getShopProductById(item.id);
            if (!product || !product.cjPid) {
                // If it's a custom/local product without CJ sync, add to fallback shipping
                continue;
            }

            // Determine variant VID
            let vid = '';
            const variantId = item.variantId;

            if (variantId && variantId !== 'cj-var-default') {
                // Strip prefix if present (e.g., 'cj-var-12345' -> '12345')
                vid = variantId.startsWith('cj-var-') ? variantId.replace('cj-var-', '') : variantId;
            }

            // If we don't have a valid VID, we can fetch product details from CJ API to locate the first variant's VID
            if (!vid || vid === 'default') {
                try {
                    const cjDetail = await getProductDetail(product.cjPid);
                    if (cjDetail && cjDetail.variants && cjDetail.variants.length > 0) {
                        // Find a variant matching the item or default to the first one
                        const foundVariant = cjDetail.variants.find(
                            v => v.variantSku === item.sku || v.variantNameEn === item.variantName
                        );
                        vid = foundVariant ? foundVariant.vid : cjDetail.variants[0].vid;
                    }
                } catch (e) {
                    console.warn(`[Shipping API] Failed to fetch variant VID for PID ${product.cjPid}:`, e);
                }
            }

            if (vid) {
                cjProductsToCalculate.push({
                    vid,
                    quantity: item.quantity
                });
            }
        }

        // If we have CJ products and CJ API key is configured, calculate live freight
        if (cjProductsToCalculate.length > 0 && process.env.CJ_API_KEY) {
            try {
                const freightOptions = await calculateFreight({
                    endCountryCode: 'US',
                    zip: zip.toString(),
                    products: cjProductsToCalculate
                });

                if (freightOptions && freightOptions.length > 0) {
                    // Filter options to find cheapest standard/USPS option, or just take the cheapest
                    // Sort by price ascending
                    const sortedOptions = [...freightOptions].sort((a, b) => a.freightPrice - b.freightPrice);
                    const selected = sortedOptions[0];

                    return NextResponse.json({
                        shippingCost: parseFloat(selected.freightPrice.toFixed(2)),
                        isFree: false,
                        message: `Calculated via ${selected.logisticName} (${selected.shippingTime})`,
                        method: selected.logisticName
                    });
                }
            } catch (err) {
                console.error('[Shipping API] Live shipping cost calculation failed:', err);
                // Fail silently and use fallback
            }
        }

        // 4. Dynamic Fallback Shipping calculation (if API key not set, API fails, or product has no vid)
        // Base rate: $9.95 for first item + $1.50 for each additional item
        const computedFallbackCost = fallbackCost + (totalItems - 1) * 1.50;
        return NextResponse.json({
            shippingCost: parseFloat(computedFallbackCost.toFixed(2)),
            isFree: false,
            message: 'Calculated via Standard Shipping (Fixed Rate)',
            method: 'Standard Shipping'
        });

    } catch (error) {
        console.error('[Shipping API] Error calculating shipping cost:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}
