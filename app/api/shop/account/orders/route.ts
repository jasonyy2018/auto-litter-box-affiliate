import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { getCJTracking } from '@/lib/cjApi';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const orders = await prisma.order.findMany({
            where: { userId: session.user.id },
            include: { items: true },
            orderBy: { createdAt: 'desc' }
        });

        // Hydrate orders with live CJDropshipping tracking info if available
        const hydratedOrders = await Promise.all(
            orders.map(async (order) => {
                const address = order.shippingAddress as any || {};
                const cjOrderId = address.cjOrderId;

                let trackingData = {
                    trackingNumber: null,
                    carrier: null,
                    status: order.status.toLowerCase(),
                    trackingLogs: []
                };

                if (cjOrderId) {
                    try {
                        // Query live tracking updates by order number
                        const liveTracking = await getCJTracking(order.paypalOrderId || order.id);
                        trackingData = {
                            trackingNumber: liveTracking.trackingNumber as any,
                            carrier: liveTracking.carrier as any,
                            status: liveTracking.status,
                            trackingLogs: liveTracking.trackingLogs as any
                        };
                    } catch (trackErr) {
                        console.error(`Failed to pull live tracking for order ${order.id}:`, trackErr);
                    }
                }

                return {
                    id: order.id,
                    status: order.status,
                    totalAmount: order.totalAmount,
                    createdAt: order.createdAt,
                    items: order.items,
                    shippingAddress: address,
                    tracking: trackingData
                };
            })
        );

        return NextResponse.json({ success: true, data: hydratedOrders });
    } catch (error: any) {
        console.error('Fetch customer orders error:', error);
        return NextResponse.json({ error: 'Failed to retrieve order history' }, { status: 500 });
    }
}
