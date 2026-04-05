import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/encryption';
import { PayPalClient } from '@/lib/paypal';

/**
 * POST /api/paypal/create-order — Create a PayPal checkout order
 * Called by frontend PayPal JS SDK buttons
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { amount, currency = 'USD', items = [] } = body;

        if (!amount || parseFloat(amount) <= 0) {
            return NextResponse.json(
                { error: 'Valid amount is required' },
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

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autolitterboxpro.com';

        // Create PayPal order
        const order = await client.createOrder(
            amount,
            currency,
            items.map((item: { name: string; quantity: number; price: string }) => ({
                name: item.name,
                quantity: item.quantity,
                unitPrice: item.price,
                currency,
            })),
            `${siteUrl}/shop/order-success`,
            `${siteUrl}/shop/cart`
        );

        return NextResponse.json({
            success: true,
            orderID: order.id,
            status: order.status,
        });
    } catch (error) {
        console.error('PayPal create-order error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create order' },
            { status: 500 }
        );
    }
}
