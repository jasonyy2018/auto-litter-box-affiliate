import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logAudit } from '@/lib/auditLog';

function checkAuth(request: NextRequest): boolean {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return false;
    const password = authHeader.replace('Bearer ', '');
    return password === process.env.ADMIN_PASSWORD;
}

// GET — list all blogs
export async function GET(request: NextRequest) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const blogs = await prisma.blogPost.findMany({
            orderBy: { publishedAt: 'desc' }
        });
        return NextResponse.json({ success: true, data: blogs });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
    }
}

// POST — create blog
export async function POST(request: NextRequest) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const start = Date.now();
    try {
        const body = await request.json();

        let { slug, title, description, content, author, readTime } = body;

        if (!slug) {
            slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }

        const newBlog = await prisma.blogPost.create({
            data: {
                slug,
                title,
                description,
                content,
                author: author || 'AI Assistant',
                readTime: readTime || '5 min read',
            }
        });

        await logAudit({
            source: 'admin',
            action: 'blog.create',
            actor: 'admin',
            details: { blogId: newBlog.id, title, slug },
            status: 'success',
            duration: Date.now() - start,
        });

        return NextResponse.json({ success: true, data: newBlog });
    } catch (error) {
        console.error('Create blog error:', error);
        await logAudit({
            source: 'admin', action: 'blog.create', status: 'error',
            details: { error: String(error) }, duration: Date.now() - start,
        });
        return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
    }
}

// PUT — update blog
export async function PUT(request: NextRequest) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const start = Date.now();
    try {
        const body = await request.json();
        const { id, ...updates } = body;
        if (!id) return NextResponse.json({ error: 'Blog ID required' }, { status: 400 });

        const updatedBlog = await prisma.blogPost.update({ where: { id }, data: updates });

        await logAudit({
            source: 'admin', action: 'blog.update', status: 'success',
            details: { blogId: id, updates }, duration: Date.now() - start,
        });

        return NextResponse.json({ success: true, data: updatedBlog });
    } catch (error) {
        console.error('Update blog error:', error);
        return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
    }
}

// DELETE — remove blog
export async function DELETE(request: NextRequest) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const start = Date.now();
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Blog ID required' }, { status: 400 });

        await prisma.blogPost.delete({ where: { id } });

        await logAudit({
            source: 'admin', action: 'blog.delete', status: 'success',
            details: { blogId: id }, duration: Date.now() - start,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete blog error:', error);
        return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
    }
}
