import { NextRequest, NextResponse } from 'next/server';
import {
    getAllShopProducts,
    addShopProduct,
    addShopProducts,
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

function getDynamicMarkup(cost: number): number {
    if (cost < 10) return 3.5;       // Accessories: 3.5x markup (e.g. $3 item -> $10.50)
    if (cost < 50) return 2.5;       // Medium items: 2.5x markup (e.g. $30 item -> $75.00)
    if (cost < 150) return 2.2;      // Standard boxes: 2.2x markup (e.g. $117 item -> $257.40)
    return 1.6;                      // High-end boxes: 1.6x markup (e.g. $426 item -> $681.60)
}

function processCJImportData(cj: any) {
    const variantCosts = (cj.variants || []).map((v: any) => v.variantSellPrice);
    const maxCost = Math.max(...variantCosts, cj.sellPrice || 0);
    
    // Primary variant threshold: cheapest variant that is at least 25% of maxCost (or $30) to filter out cheap accessory variants
    const threshold = maxCost > 50 ? Math.max(30, maxCost * 0.25) : 0;
    const mainVariants = (cj.variants || []).filter((v: any) => v.variantSellPrice >= threshold);
    const primaryVariant = mainVariants.length > 0 
        ? mainVariants.sort((a: any, b: any) => a.variantSellPrice - b.variantSellPrice)[0] 
        : cj.variants?.[0];

    const costPrice = primaryVariant ? primaryVariant.variantSellPrice : cj.sellPrice;
    const dynamicMarkup = getDynamicMarkup(costPrice);
    const sellingPrice = parseFloat((costPrice * dynamicMarkup).toFixed(2));

    const variants = (cj.variants || []).map((v: any) => {
        const vMarkup = getDynamicMarkup(v.variantSellPrice);
        return {
            id: v.vid,
            name: v.variantNameEn || v.variantName,
            sku: v.variantSku,
            price: parseFloat((v.variantSellPrice * vMarkup).toFixed(2)),
            costPrice: v.variantSellPrice,
            image: v.variantImage || '',
            properties: v.variantProperty || '',
            inStock: true,
        };
    });

    return {
        cjPid: cj.pid,
        name: cj.productNameEn || cj.productName,
        description: cj.description || cj.productBrief || '',
        shortDescription: cj.productBrief || cj.productNameEn || '',
        category: cj.categoryName || 'Uncategorized',
        images: cj.productImageSet?.length > 0
            ? cj.productImageSet
            : [cj.productImage].filter(Boolean),
        price: sellingPrice,
        costPrice,
        originalPrice: parseFloat((sellingPrice * 1.2).toFixed(2)),
        currency: 'USD',
        variants,
        weight: cj.productWeight,
        sku: cj.productSku,
        inStock: true,
        visible: true,
        featured: false,
        tags: [],
    };
}

// POST — import product(s) from CJ
export async function POST(request: NextRequest) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { cjProduct, cjProducts, customProduct } = body;

        if (customProduct) {
            const newProduct = addShopProduct(customProduct);
            return NextResponse.json({ success: true, data: newProduct });
        }

        // Batch import from CJ
        if (cjProducts && Array.isArray(cjProducts)) {
            const batchProducts = cjProducts.map((cj: any) => processCJImportData(cj));
            const newProducts = addShopProducts(batchProducts);
            return NextResponse.json({ success: true, data: newProducts, imported: newProducts.length });
        }

        // Single import from CJ
        if (!cjProduct || !cjProduct.pid) {
            return NextResponse.json({ error: 'Invalid CJ product data or custom product data' }, { status: 400 });
        }

        const productData = processCJImportData(cjProduct);
        const newProduct = addShopProduct(productData);

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
