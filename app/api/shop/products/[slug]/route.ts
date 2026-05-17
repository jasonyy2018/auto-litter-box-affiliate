import { NextRequest, NextResponse } from 'next/server';
import { getShopProductBySlug } from '@/lib/shopProducts';

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const product = getShopProductBySlug(slug);
    if (!product) {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { product } });
}
