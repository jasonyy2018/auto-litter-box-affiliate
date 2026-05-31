import { NextRequest, NextResponse } from 'next/server';
import { validateCoupon } from '@/lib/couponSystem';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { code, subtotal } = body;

        if (!code) {
            return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
        }

        const parsedSubtotal = parseFloat(subtotal);
        if (isNaN(parsedSubtotal) || parsedSubtotal <= 0) {
            return NextResponse.json({ error: 'Valid subtotal is required' }, { status: 400 });
        }

        const result = validateCoupon(code, parsedSubtotal);
        return NextResponse.json(result);

    } catch (error) {
        console.error('Coupon validation API error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Validation failed' },
            { status: 500 }
        );
    }
}
