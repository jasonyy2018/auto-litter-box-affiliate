import { NextRequest, NextResponse } from 'next/server';
import { getShopProductBySlug, updateShopProduct } from '@/lib/shopProducts';
import { getProductDetail } from '@/lib/cjApi';

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const product = await getShopProductBySlug(slug);
    if (!product) {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    // Auto-enrich product description from CJ if it's currently brief or missing
    if (product.cjPid && (!product.description || product.description.length < 80 || product.description === product.name)) {
        try {
            const detail = await getProductDetail(product.cjPid);
            const fullDesc = detail.description || detail.productBrief || '';
            if (fullDesc && fullDesc.length > (product.description?.length || 0)) {
                await updateShopProduct(product.id, { description: fullDesc });
                product.description = fullDesc;
            }
        } catch (e) {
            console.error(`Auto-enrich CJ description failed for ${product.slug}:`, e);
        }
    }

    return NextResponse.json({ success: true, data: { product } });
}
