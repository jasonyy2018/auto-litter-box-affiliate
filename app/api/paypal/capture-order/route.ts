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
        const { orderID } = body;

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
