import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, productSlug, productName, currentPrice, targetPrice } = body;

        if (!email || !email.includes('@') || !productSlug) {
            return NextResponse.json({ success: false, error: 'Invalid parameters' }, { status: 400 });
        }

        console.log('Price alert registered:', { email, productSlug, productName, currentPrice, targetPrice });

        return NextResponse.json({
            success: true,
            message: 'Price drop alert registered successfully',
            data: { email, productSlug, targetPrice },
        });
    } catch {
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}
