import { NextRequest, NextResponse } from 'next/server';
import { getShopProductBySlug } from '@/lib/shopProducts';

export async function GET(
    _req: NextRequest,
    { params }: { params: { slug: string } }
) {
    const product = getShopProductBySlug(params.slug);
    if (!product) {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { product } });
}
