import { NextRequest, NextResponse } from 'next/server';
import { getProductDetail } from '@/lib/cjApi';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ pid: string }> }
) {
    try {
        const { pid } = await params;
        const product = await getProductDetail(pid);
        return NextResponse.json({ success: true, data: product });
    } catch (error) {
        console.error('CJ Product detail error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to get product' },
            { status: 500 }
        );
    }
}
