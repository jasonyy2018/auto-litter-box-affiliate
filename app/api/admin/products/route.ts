import { NextRequest, NextResponse } from 'next/server';
import {
    getAllShopProducts,
    addShopProduct,
    updateShopProduct,
    deleteShopProduct,
} from '@/lib/shopProducts';
import type { CJProduct } from '@/lib/cjApi';

function checkAuth(request: NextRequest): boolean {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return false;
    const password = authHeader.replace('Bearer ', '');
    return password === process.env.ADMIN_PASSWORD;
}

// GET — list all products (admin view, includes hidden)
export async function GET(request: NextRequest) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const products = getAllShopProducts();
    return NextResponse.json({ success: true, data: products });
}

// POST — import product from CJ
export async function POST(request: NextRequest) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { cjProduct, markup = 1.5 } = body as { cjProduct: CJProduct; markup?: number };

        if (!cjProduct || !cjProduct.pid) {
            return NextResponse.json({ error: 'Invalid CJ product data' }, { status: 400 });
        }

        const sellingPrice = parseFloat((cjProduct.sellPrice * markup).toFixed(2));

        const newProduct = addShopProduct({
            cjPid: cjProduct.pid,
            name: cjProduct.productNameEn || cjProduct.productName,
            description: cjProduct.description || cjProduct.productBrief || '',
            shortDescription: cjProduct.productBrief || cjProduct.productNameEn || '',
            category: cjProduct.categoryName || 'Uncategorized',
            images: cjProduct.productImageSet?.length > 0
                ? cjProduct.productImageSet
                : [cjProduct.productImage].filter(Boolean),
            price: sellingPrice,
            costPrice: cjProduct.sellPrice,
            originalPrice: parseFloat((sellingPrice * 1.2).toFixed(2)),
            currency: 'USD',
            variants: (cjProduct.variants || []).map(v => ({
                id: v.vid,
                name: v.variantNameEn || v.variantName,
                sku: v.variantSku,
                price: parseFloat((v.variantSellPrice * markup).toFixed(2)),
                costPrice: v.variantSellPrice,
                image: v.variantImage || '',
                properties: v.variantProperty || '',
                inStock: true,
            })),
            weight: cjProduct.productWeight,
            sku: cjProduct.productSku,
            inStock: true,
            visible: true,
            featured: false,
            tags: [],
        });

        return NextResponse.json({ success: true, data: newProduct });
    } catch (error) {
        console.error('Import error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Import failed' },
            { status: 500 }
        );
    }
}

// PUT — update product
export async function PUT(request: NextRequest) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
        }

        const updated = updateShopProduct(id, updates);
        if (!updated) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Update failed' },
            { status: 500 }
        );
    }
}

// DELETE — remove product
export async function DELETE(request: NextRequest) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
        }

        const deleted = deleteShopProduct(id);
        if (!deleted) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Delete failed' },
            { status: 500 }
        );
    }
}
