import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/paypal/config — Get PayPal client ID for frontend SDK
 * This is a PUBLIC endpoint (no auth needed) — only returns the client ID, never the secret
 */
export async function GET() {
    try {
        const config = await prisma.paymentConfig.findUnique({
            where: { provider: 'paypal' },
        });

        if (!config || !config.isActive) {
            return NextResponse.json({
                available: false,
            });
        }

        return NextResponse.json({
            available: true,
            clientId: config.clientId,
            mode: config.mode,
        });
    } catch (error) {
        console.error('PayPal config error:', error);
        return NextResponse.json({
            available: false,
        });
    }
}
