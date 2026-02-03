import Link from 'next/link';
import { blogPosts } from '@/lib/blogPosts';
import { ArrowRight, Calendar, Clock, User } from 'lucide-react';

export const metadata = {
    title: 'Blog - AutoLitter Expert Insights',
    description: 'Latest guides, reviews, and tips for automatic litter box owners.',
};

export default function BlogIndexPage() {
    const posts = Object.entries(blogPosts).map(([slug, post]) => ({ slug, ...post }));

    return (
        <div className="bg-[#F5F4F1] min-h-screen font-sans">
            {/* Hero */}
            <section className="bg-white py-20 px-6 border-b border-[#E5E4E1]">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl font-bold text-[#1A1918] mb-6">Expert Litter Box Insights</h1>
                    <p className="text-xl text-[#6D6C6A] max-w-2xl mx-auto">Deep dives into the world of automated pet care.</p>
                </div>
            </section>

            {/* Grid */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <Link key={post.slug} href={`/blog/${post.slug}`} className="group bg-white rounded-[32px] p-8 border border-[#E5E4E1] hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col">
                            <div className="mb-6">
                                <div className="flex items-center gap-2 text-[11px] font-bold text-[#3D8A5A] uppercase tracking-[2px] mb-3">
                                    <Clock className="w-3 h-3" />
                                    {post.readTime}
                                </div>
                                <h2 className="text-2xl font-bold text-[#1A1918] group-hover:text-[#3D8A5A] transition-colors mb-3 leading-tight">{post.title}</h2>
                                <p className="text-[#6D6C6A] line-clamp-3 leading-relaxed">{post.description}</p>
                            </div>
                            <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-xs font-bold text-[#9C9B99]">
                                    <Calendar className="w-4 h-4" />
                                    {post.date}
                                </div>
                                <div className="w-8 h-8 rounded-full bg-[#F5F4F1] flex items-center justify-center text-[#1A1918] group-hover:bg-[#3D8A5A] group-hover:text-white transition-colors">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
