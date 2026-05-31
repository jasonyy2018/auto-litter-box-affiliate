import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/encryption';
import { PayPalClient } from '@/lib/paypal';

/**
 * POST /api/paypal/capture-order — Capture an approved PayPal order
 * Called after user approves payment in PayPal popup
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderID, referredBy, items, subtotal, shippingAddress } = body;

        if (!orderID) {
            return NextResponse.json(
                { error: 'Order ID is required' },
                { status: 400 }
            );
        }

        // Get PayPal config from database
        const config = await prisma.paymentConfig.findUnique({
            where: { provider: 'paypal' },
        });

        if (!config || !config.isActive) {
            return NextResponse.json(
                { error: 'PayPal payments are not currently available' },
                { status: 503 }
            );
        }

        // Decrypt secret and create client
        const clientSecret = decrypt(config.clientSecret);
        const client = new PayPalClient({
            clientId: config.clientId,
            clientSecret,
            mode: config.mode as 'sandbox' | 'live',
        });

        // Capture the payment
        const captureResult = await client.captureOrder(orderID);

        if (captureResult.status === 'COMPLETED') {
            const capture = captureResult.purchase_units?.[0]?.payments?.captures?.[0];

            // Update order in database if we have a matching order
            try {
                const existingOrder = await prisma.order.findUnique({
                    where: { paypalOrderId: orderID },
                });

                if (existingOrder) {
                    await prisma.order.update({
                        where: { paypalOrderId: orderID },
                        data: {
                            status: 'PAID',
                            paypalPaymentId: capture?.id,
                        },
                    });
                }
            } catch {
                // Order may not exist in our DB yet — that's okay for direct checkout
                console.log('No matching order found for PayPal order:', orderID);
            }

            // Register referred order in the affiliate system
            if (referredBy && items && items.length > 0) {
                try {
                    const { addReferredOrder } = require('@/lib/affiliateSystem');
                    addReferredOrder(orderID, referredBy, subtotal, items);
                } catch (affiliateErr) {
                    console.error('Failed to log referred order to affiliate system:', affiliateErr);
                }
            }

            // Auto place order on CJDropshipping
            if (items && items.length > 0 && shippingAddress && process.env.CJ_API_KEY) {
                try {
                    const { createCJOrder, getProductDetail } = require('@/lib/cjApi');
                    const { getShopProductById } = require('@/lib/shopProducts');
                    
                    const cjProducts = [];
                    for (const item of items) {
                        const product = getShopProductById(item.productId);
                        if (product && product.cjPid) {
                            let vid = '';
                            if (item.variantId && item.variantId !== 'cj-var-default') {
                                vid = item.variantId.startsWith('cj-var-') ? item.variantId.replace('cj-var-', '') : item.variantId;
                            }
                            
                            if (!vid || vid === 'default' || vid === 'cj-var-default') {
                                // Fetch real variant from CJ details
                                const detail = await getProductDetail(product.cjPid);
                                if (detail?.variants?.length > 0) {
                                    vid = detail.variants[0].vid;
                                }
                            }
                            
                            if (vid) {
                                cjProducts.push({
                                    vid,
                                    quantity: item.quantity
                                });
                            }
                        }
                    }
                    
                    if (cjProducts.length > 0) {
                        const cjResult = await createCJOrder({
                            orderNumber: orderID,
                            shippingCustomerName: shippingAddress.fullName,
                            shippingCountry: 'US',
                            shippingState: shippingAddress.state,
                            shippingCity: shippingAddress.city,
                            shippingAddress: shippingAddress.streetAddress,
                            shippingZip: shippingAddress.zip,
                            shippingPhone: shippingAddress.phone || '1234567890',
                            products: cjProducts
                        });
                        console.log('Successfully placed auto-dropship order on CJ:', cjResult);
                        
                        // Save the CJ Order ID to PostgreSQL
                        const existingOrder = await prisma.order.findUnique({
                            where: { paypalOrderId: orderID },
                        });
                        
                        if (existingOrder) {
                            await prisma.order.update({
                                where: { paypalOrderId: orderID },
                                data: {
                                    shippingAddress: {
                                        ...(existingOrder.shippingAddress as any || {}),
                                        cjOrderId: cjResult.cjOrderId,
                                        cjStatus: cjResult.status
                                    }
                                }
                            });
                        }
                    }
                } catch (cjErr) {
                    console.error('Failed to auto place dropshipping order on CJ:', cjErr);
                }
            }

            return NextResponse.json({
                success: true,
                status: 'COMPLETED',
                captureId: capture?.id,
                amount: capture?.amount,
                payer: {
                    email: captureResult.payer?.email_address,
                    name: captureResult.payer?.name
                        ? `${captureResult.payer.name.given_name} ${captureResult.payer.name.surname}`
                        : undefined,
                },
            });
        } else {
            return NextResponse.json({
                success: false,
                status: captureResult.status,
                error: `Payment not completed. Status: ${captureResult.status}`,
            });
        }
    } catch (error) {
        console.error('PayPal capture-order error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to capture payment' },
            { status: 500 }
        );
    }
}
