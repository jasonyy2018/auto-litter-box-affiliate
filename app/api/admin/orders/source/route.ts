import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createCJOrder, getProductDetail } from '@/lib/cjApi';
import { getShopProductById } from '@/lib/shopProducts';

function checkAuth(request: NextRequest): boolean {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return false;
    const password = authHeader.replace('Bearer ', '');
    return password === process.env.ADMIN_PASSWORD;
}

export async function POST(request: NextRequest) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { orderId } = body;

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }

        // Fetch Order Details
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true }
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        const address = order.shippingAddress as any;
        if (!address) {
            return NextResponse.json({ error: 'Order is missing a valid shipping address' }, { status: 400 });
        }

        // Prevent duplicate sourcing
        if (address.cjOrderId) {
            return NextResponse.json({ 
                success: true, 
                cjOrderId: address.cjOrderId, 
                status: address.cjStatus || 'Existing' 
            });
        }

        const cjProducts = [];
        for (const item of order.items) {
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

        if (cjProducts.length === 0) {
            return NextResponse.json({ error: 'No CJDropshipping catalog products found in this order' }, { status: 400 });
        }

        // Call CJ Order Sourcing API
        const cjResult = await createCJOrder({
            orderNumber: order.paypalOrderId || order.id,
            shippingCustomerName: address.fullName,
            shippingCountry: 'US',
            shippingState: address.state,
            shippingCity: address.city,
            shippingAddress: address.streetAddress || address.street || '',
            shippingZip: address.zip,
            shippingPhone: address.phone || '1234567890',
            products: cjProducts
        });

        // Update database with cjOrderId and status
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                shippingAddress: {
                    ...address,
                    cjOrderId: cjResult.cjOrderId,
                    cjStatus: cjResult.status
                }
            }
        });

        return NextResponse.json({ 
            success: true, 
            cjOrderId: cjResult.cjOrderId, 
            status: cjResult.status 
        });

    } catch (error: any) {
        console.error('Manual dropshipping sourcing failed:', error);
        return NextResponse.json({ 
            error: error?.message || 'Dropshipping sourcing process crashed' 
        }, { status: 500 });
    }
}
