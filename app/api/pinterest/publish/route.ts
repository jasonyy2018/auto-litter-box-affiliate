import { NextRequest, NextResponse } from 'next/server';
import { PinterestClient, productToPin, blogPostToPin, getDefaultBoardId } from '@/lib/pinterest';
import { getProductBySlug } from '@/lib/products';

// Blog post metadata (simplified - no React content needed for pin generation)
const blogPostsMeta: Record<string, { slug: string; title: string; description: string; image?: string }> = {
    'is-automatic-litter-box-worth-it': {
        slug: 'is-automatic-litter-box-worth-it',
        title: 'Is an Automatic Litter Box Worth It? Honest Review',
        description: 'We break down the real costs, convenience gains, and potential drawbacks of automatic litter boxes. Read our honest take after 6 months of testing.',
        image: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=800',
    },
    'how-to-transition-cat': {
        slug: 'how-to-transition-cat',
        title: 'How to Transition Your Cat to an Automatic Litter Box',
        description: 'Step-by-step guide to help your cat transition smoothly to an automatic litter box. Tips from cat behaviorists and real cat owners.',
        image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800',
    },
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, id, boardId, password } = body;

        // Authenticate
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        if (password !== adminPassword) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Validate Pinterest config
        if (!process.env.PINTEREST_ACCESS_TOKEN) {
            return NextResponse.json(
                { error: 'Pinterest API not configured. Set PINTEREST_ACCESS_TOKEN in .env' },
                { status: 500 }
            );
        }

        const client = new PinterestClient();
        const targetBoardId = boardId || getDefaultBoardId();

        if (!targetBoardId) {
            return NextResponse.json(
                { error: 'No board ID provided. Set PINTEREST_BOARD_ID in .env or pass boardId.' },
                { status: 400 }
            );
        }

        let pinParams;

        if (type === 'product') {
            const product = getProductBySlug(id);
            if (!product) {
                return NextResponse.json({ error: `Product not found: ${id}` }, { status: 404 });
            }
            pinParams = productToPin(product, targetBoardId);
        } else if (type === 'blog') {
            const post = blogPostsMeta[id];
            if (!post) {
                return NextResponse.json({ error: `Blog post not found: ${id}` }, { status: 404 });
            }
            pinParams = blogPostToPin(post, targetBoardId);
        } else {
            return NextResponse.json({ error: 'Invalid type. Use "product" or "blog".' }, { status: 400 });
        }

        const pin = await client.createPin(pinParams);

        return NextResponse.json({
            success: true,
            pin: {
                id: pin.id,
                title: pinParams.title,
                link: pinParams.link,
            },
        });
    } catch (error) {
        console.error('Pinterest publish error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to publish pin' },
            { status: 500 }
        );
    }
}
