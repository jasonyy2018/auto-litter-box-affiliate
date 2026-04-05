import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/encryption';
import { PayPalClient } from '@/lib/paypal';

function authenticate(request: NextRequest): boolean {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    return token === adminPassword;
}

/**
 * POST /api/admin/paypal/verify — Test PayPal connection with saved credentials
 */
export async function POST(request: NextRequest) {
    if (!authenticate(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const config = await prisma.paymentConfig.findUnique({
            where: { provider: 'paypal' },
        });

        if (!config) {
            return NextResponse.json(
                { error: 'PayPal is not configured. Please save credentials first.' },
                { status: 404 }
            );
        }

        // Decrypt secret and create client
        const clientSecret = decrypt(config.clientSecret);
        const client = new PayPalClient({
            clientId: config.clientId,
            clientSecret,
            mode: config.mode as 'sandbox' | 'live',
        });

        // Verify connection
        const result = await client.verifyConnection();

        if (result.success) {
            // Update config with verification status
            await prisma.paymentConfig.update({
                where: { provider: 'paypal' },
                data: {
                    isActive: true,
                    lastVerified: new Date(),
                    merchantId: result.merchantId || null,
                },
            });

            return NextResponse.json({
                success: true,
                message: 'PayPal connection verified successfully!',
                merchantId: result.merchantId,
                email: result.email,
                mode: config.mode,
            });
        } else {
            // Mark as inactive
            await prisma.paymentConfig.update({
                where: { provider: 'paypal' },
                data: {
                    isActive: false,
                    lastVerified: null,
                },
            });

            return NextResponse.json({
                success: false,
                error: result.error || 'Verification failed',
            });
        }
    } catch (error) {
        console.error('PayPal verify error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Verification failed' },
            { status: 500 }
        );
    }
}
