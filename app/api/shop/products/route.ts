import { NextRequest, NextResponse } from 'next/server';
import { getVisibleProducts, getProductCategories } from '@/lib/shopProducts';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category') || undefined;
        const sort = searchParams.get('sort') || 'newest';
        const page = parseInt(searchParams.get('page') || '1');
        const size = parseInt(searchParams.get('size') || '20');

        let products = getVisibleProducts();

        // Filter by category
        if (category) {
            products = products.filter(p => p.category === category);
        }

        // Sort
        switch (sort) {
            case 'price-asc':
                products.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                products.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                products.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'newest':
            default:
                products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
        }

        // Paginate
        const total = products.length;
        const start = (page - 1) * size;
        const paginated = products.slice(start, start + size);
        const categories = getProductCategories();

        return NextResponse.json({
            success: true,
            data: {
                products: paginated,
                total,
                page,
                size,
                totalPages: Math.ceil(total / size),
                categories,
            },
        });
    } catch (error) {
        console.error('Shop products error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to load products' },
            { status: 500 }
        );
    }
}
