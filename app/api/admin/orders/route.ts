import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function checkAuth(request: NextRequest): boolean {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return false;
    const password = authHeader.replace('Bearer ', '');
    return password === process.env.ADMIN_PASSWORD;
}

// GET — list all orders
export async function GET(request: NextRequest) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const orders = await prisma.order.findMany({
            include: { user: true, items: true },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json({ success: true, data: orders });
    } catch (error) {
        console.error('Fetch orders error:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

// PUT — update order status (sync after-sales)
export async function PUT(request: NextRequest) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, status, trackingInfo } = body;

        if (!id || !status) {
            return NextResponse.json({ error: 'Order ID and Status required' }, { status: 400 });
        }

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                status,
                // optionally we could add trackingInfo JSON field to Order model,
                // if it's there or just dump to another table/metadata logic
            }
        });

        // Here an OpenClaw agent or human uses this API to push updates from CJ 
        // back to our store.

        return NextResponse.json({ success: true, data: updatedOrder });
    } catch (error) {
        console.error('Update order error:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
