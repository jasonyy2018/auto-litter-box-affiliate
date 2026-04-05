import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { encrypt, decrypt, maskSecret } from '@/lib/encryption';

function authenticate(request: NextRequest): boolean {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    return token === adminPassword;
}

/**
 * GET /api/admin/paypal — Get current PayPal configuration (masked)
 */
export async function GET(request: NextRequest) {
    if (!authenticate(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const config = await prisma.paymentConfig.findUnique({
            where: { provider: 'paypal' },
        });

        if (!config) {
            return NextResponse.json({
                success: true,
                configured: false,
                data: null,
            });
        }

        return NextResponse.json({
            success: true,
            configured: true,
            data: {
                clientId: config.clientId,
                clientSecret: maskSecret(decrypt(config.clientSecret)),
                mode: config.mode,
                isActive: config.isActive,
                lastVerified: config.lastVerified,
                merchantId: config.merchantId,
            },
        });
    } catch (error) {
        console.error('Get PayPal config error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to get config' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/admin/paypal — Save PayPal credentials
 */
export async function POST(request: NextRequest) {
    if (!authenticate(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        let { clientId, clientSecret, mode } = body;

        if (!clientId || !clientSecret) {
            return NextResponse.json(
                { error: 'Client ID and Client Secret are required' },
                { status: 400 }
            );
        }

        clientId = clientId.trim();
        clientSecret = clientSecret.trim();

        if (mode && !['sandbox', 'live'].includes(mode)) {
            return NextResponse.json(
                { error: 'Mode must be "sandbox" or "live"' },
                { status: 400 }
            );
        }

        // Encrypt the client secret before storing
        const encryptedSecret = encrypt(clientSecret);

        const config = await prisma.paymentConfig.upsert({
            where: { provider: 'paypal' },
            update: {
                clientId,
                clientSecret: encryptedSecret,
                mode: mode || 'sandbox',
                isActive: false, // Reset until verified
                lastVerified: null,
                merchantId: null,
            },
            create: {
                provider: 'paypal',
                clientId,
                clientSecret: encryptedSecret,
                mode: mode || 'sandbox',
                isActive: false,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'PayPal credentials saved. Please verify the connection.',
            data: {
                clientId: config.clientId,
                clientSecret: maskSecret(clientSecret),
                mode: config.mode,
                isActive: config.isActive,
            },
        });
    } catch (error) {
        console.error('Save PayPal config error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to save config' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/admin/paypal — Remove PayPal configuration
 */
export async function DELETE(request: NextRequest) {
    if (!authenticate(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await prisma.paymentConfig.delete({
            where: { provider: 'paypal' },
        }).catch(() => {
            // Ignore "record not found" errors
        });

        return NextResponse.json({
            success: true,
            message: 'PayPal configuration removed',
        });
    } catch (error) {
        console.error('Delete PayPal config error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to delete config' },
            { status: 500 }
        );
    }
}
