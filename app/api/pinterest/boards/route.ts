import { NextRequest, NextResponse } from 'next/server';
import { PinterestClient } from '@/lib/pinterest';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const password = searchParams.get('password');

        // Authenticate
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        if (password !== adminPassword) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!process.env.PINTEREST_ACCESS_TOKEN) {
            return NextResponse.json(
                { error: 'Pinterest API not configured. Set PINTEREST_ACCESS_TOKEN in .env' },
                { status: 500 }
            );
        }

        const client = new PinterestClient();
        const result = await client.listBoards();

        return NextResponse.json({
            boards: result.items.map((board) => ({
                id: board.id,
                name: board.name,
                description: board.description,
                pinCount: board.pin_count,
            })),
        });
    } catch (error) {
        console.error('Pinterest boards error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch boards' },
            { status: 500 }
        );
    }
}
