import { NextRequest, NextResponse } from 'next/server';
import { 
    getReferredOrders, 
    getAffiliates, 
    confirmReferredOrderShipped, 
    cancelReferredOrder,
    getCommissions,
    updateProductCommissionRate 
} from '@/lib/affiliateSystem';
import { getVisibleProducts } from '@/lib/shopProducts';

function checkAuth(request: NextRequest): boolean {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return false;
    const password = authHeader.replace('Bearer ', '');
    return password === process.env.ADMIN_PASSWORD;
}

export async function GET(request: NextRequest) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const affiliates = getAffiliates();
        const referredOrders = getReferredOrders();
        const commissions = getCommissions();
        const products = getVisibleProducts();

        // Map product details with custom rates
        const productRates = products.map(p => {
            const config = commissions.find(c => c.productId === p.id);
            return {
                id: p.id,
                name: p.name,
                price: p.price,
                sku: p.sku,
                commissionRate: config ? config.commissionRate : 0.10 // default 10%
            };
        });

        return NextResponse.json({
            success: true,
            data: {
                affiliates,
                referredOrders,
                productRates
            }
        });
    } catch (error) {
        console.error('Admin Affiliate GET error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to retrieve data' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { action, orderId, productId, rate } = body;

        if (action === 'ship_confirm') {
            if (!orderId) {
                return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
            }
            const updated = confirmReferredOrderShipped(orderId);
            if (!updated) {
                return NextResponse.json({ error: 'Referral order record not found' }, { status: 404 });
            }
            return NextResponse.json({ success: true, order: updated });
        }

        if (action === 'cancel_order') {
            if (!orderId) {
                return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
            }
            const updated = cancelReferredOrder(orderId);
            if (!updated) {
                return NextResponse.json({ error: 'Referral order record not found' }, { status: 404 });
            }
            return NextResponse.json({ success: true, order: updated });
        }

        if (action === 'update_rate') {
            if (!productId || rate === undefined) {
                return NextResponse.json({ error: 'Product ID and rate are required' }, { status: 400 });
            }
            const cleanRate = parseFloat(rate);
            if (isNaN(cleanRate) || cleanRate < 0 || cleanRate > 1) {
                return NextResponse.json({ error: 'Rate must be a number between 0 and 1' }, { status: 400 });
            }
            updateProductCommissionRate(productId, cleanRate);
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Admin Affiliate POST error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Operation failed' },
            { status: 500 }
        );
    }
}
