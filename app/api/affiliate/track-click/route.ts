import { NextRequest, NextResponse } from 'next/server';
import { trackAffiliateClick } from '@/lib/affiliateSystem';

export async function POST(request: NextRequest) {
    try {
        const { username } = await request.json();
        if (username) {
            trackAffiliateClick(username);
            return NextResponse.json({ success: true });
        }
        return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    } catch (error) {
        console.error('Track Click error:', error);
        return NextResponse.json({ error: 'Failed to track click' }, { status: 500 });
    }
}
