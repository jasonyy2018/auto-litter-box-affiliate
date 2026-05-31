import { NextRequest, NextResponse } from 'next/server';
import { getReferredOrders, getAffiliates } from '@/lib/affiliateSystem';
import { getVisibleProducts } from '@/lib/shopProducts';

export async function GET(request: NextRequest) {
    try {
        const session = request.cookies.get('affiliate_session')?.value;
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const affiliates = getAffiliates();
        const user = affiliates.find(u => u.username === session);
        if (!user) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
        }

        // Get referred orders for this user
        const allReferred = getReferredOrders();
        const myReferred = allReferred.filter(o => o.affiliateUsername === user.username);

        // Calculate summary metrics
        const totalClicks = user.clicks || 0;
        const totalOrders = myReferred.length;
        
        let pendingCommission = 0;
        let approvedCommission = 0;
        let totalRevenue = 0;

        for (const order of myReferred) {
            if (order.status === 'pending') {
                pendingCommission += order.commissionAmount;
            } else if (order.status === 'approved' || order.status === 'paid') {
                approvedCommission += order.commissionAmount;
            }
            if (order.status !== 'cancelled') {
                totalRevenue += order.subtotal;
            }
        }

        // Generate product referral links
        const products = getVisibleProducts();
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autolitterboxpro.com';
        
        const referralLinks = products.map(p => ({
            id: p.id,
            name: p.name,
            image: p.images[0] || '',
            price: p.price,
            referralUrl: `${siteUrl}/shop/${p.slug}?ref=${user.username}`
        }));

        return NextResponse.json({
            success: true,
            stats: {
                totalClicks,
                totalOrders,
                totalRevenue: parseFloat(totalRevenue.toFixed(2)),
                pendingCommission: parseFloat(pendingCommission.toFixed(2)),
                approvedCommission: parseFloat(approvedCommission.toFixed(2)),
            },
            orders: myReferred.map(o => ({
                orderId: o.orderId,
                subtotal: o.subtotal,
                commissionAmount: o.commissionAmount,
                status: o.status,
                createdAt: o.createdAt,
                productNames: o.productNames
            })),
            links: referralLinks
        });

    } catch (error) {
        console.error('Affiliate Stats error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Stats failed' },
            { status: 500 }
        );
    }
}
