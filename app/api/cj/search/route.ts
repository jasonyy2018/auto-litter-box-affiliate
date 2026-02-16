import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/lib/cjApi';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const keyword = searchParams.get('keyword') || 'cat litter box';
        const page = parseInt(searchParams.get('page') || '1');
        const size = parseInt(searchParams.get('size') || '20');
        const categoryId = searchParams.get('categoryId') || undefined;
        const countryCode = searchParams.get('countryCode') || undefined;

        const result = await searchProducts(keyword, page, size, {
            categoryId,
            countryCode,
        });

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        console.error('CJ Search error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Search failed' },
            { status: 500 }
        );
    }
}
