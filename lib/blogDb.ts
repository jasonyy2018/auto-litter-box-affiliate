import { prisma } from '@/lib/prisma';
import { blogPosts as fallbackBlogPosts, BlogPost as FallbackBlogPost } from '@/lib/blogPosts';

export interface UnifiedBlogPost {
    id: string;
    slug: string;
    title: string;
    description: string;
    readTime: string;
    date: string;
    author: string;
    content: string | import('react').ReactNode;
    faqs: { question: string; answer: string }[];
}

/**
 * Gets all blogs, preferentially from Prisma DB, falling back to static code files 
 * if the DB fails (e.g., when running via docker/github without postgres running correctly)
 * or if the DB is empty.
 */
export async function getAllUnifiedBlogs(): Promise<UnifiedBlogPost[]> {
    try {
        const dbBlogs = await prisma.blogPost.findMany({
            where: { published: true },
            orderBy: { publishedAt: 'desc' }
        });
        
        if (dbBlogs.length > 0) {
            return dbBlogs.map((b: any) => ({
                ...b,
                date: b.publishedAt.toLocaleDateString(),
                faqs: typeof b.faqs === 'string' ? JSON.parse(b.faqs) : (b.faqs as any),
                author: b.author || 'AutoLitterBox Team',
                readTime: b.readTime || '5 min read',
            }));
        }
    } catch {
        // Fallback to static
    }

    // Static fallback
    return Object.entries(fallbackBlogPosts).map(([slug, post]) => ({
        id: slug,
        slug,
        title: post.title,
        description: post.description,
        readTime: post.readTime,
        date: post.date,
        author: post.author,
        content: post.content,
        faqs: post.faqs || []
    }));
}

export async function getUnifiedBlogBySlug(slug: string): Promise<UnifiedBlogPost | null> {
    try {
        const dbBlog = await prisma.blogPost.findUnique({ where: { slug } });
        if (dbBlog) {
            return {
                ...dbBlog,
                date: dbBlog.publishedAt.toLocaleDateString(),
                faqs: typeof dbBlog.faqs === 'string' ? JSON.parse(dbBlog.faqs) : (dbBlog.faqs as any),
                author: dbBlog.author || 'AutoLitterBox Team',
                readTime: dbBlog.readTime || '5 min read',
            };
        }
    } catch {
        // Fallback
    }

    const staticPost = fallbackBlogPosts[slug];
    if (staticPost) {
        return {
            id: slug,
            slug,
            title: staticPost.title,
            description: staticPost.description,
            readTime: staticPost.readTime,
            date: staticPost.date,
            author: staticPost.author,
            content: staticPost.content,
            faqs: staticPost.faqs || []
        };
    }
    return null;
}
