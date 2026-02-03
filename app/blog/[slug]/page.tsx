import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { User, Clock, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { generateMetadata as generateSeoMetadata } from '@/lib/seo';

import { blogPosts } from '@/lib/blogPosts';

export async function generateStaticParams() {
   return Object.keys(blogPosts).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
   const { slug } = await params;
   const post = blogPosts[slug];
   if (!post) return {};

   return generateSeoMetadata({
      title: post.title,
      description: post.description,
      path: `/blog/${slug}`,
   });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
   const { slug } = await params;
   const post = blogPosts[slug];
   if (!post) notFound();

   return (
      <div className="bg-surface-bg min-h-screen font-sans">
         <section className="bg-white py-20 px-6 lg:px-[200px] border-b border-[#E5E4E1] animate-fade-in relative z-10">
            <div className="max-w-[1040px] mx-auto text-center flex flex-col items-center gap-8">
               <div className="inline-flex items-center px-4 py-2 bg-surface-bg rounded-full text-text-muted">
                  <span className="text-[14px] font-bold uppercase tracking-wider">Expert Insights</span>
               </div>

               <h1 className="text-[52px] font-bold text-text-primary leading-[1.1] tracking-tight">
                  {post.title}
               </h1>

               <div className="flex flex-wrap items-center justify-center gap-12 text-[14px] font-bold text-text-muted mb-4">
                  <div className="flex items-center gap-3 text-text-primary">
                     <div className="w-[52px] h-[52px] rounded-full bg-surface-bg flex items-center justify-center text-primary-600 shadow-md border-4 border-white">
                        <User className="w-6 h-6" />
                     </div>
                     <div className="text-left">
                        <div className="text-[15px] font-bold text-text-primary">{post.author}</div>
                        <div className="text-[13px] text-text-muted font-medium leading-tight">Editorial Lead</div>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <Clock className="w-4.5 h-4.5" />
                     <span>{post.readTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <span>Updated:</span>
                     <span className="text-text-primary">{post.date}</span>
                  </div>
               </div>

               <div className="w-full relative aspect-21/9 rounded-[48px] overflow-hidden shadow-2xl border-x-12 border-t-12 border-b-24 border-surface-bg mt-4">
                  <img
                     src="https://images.unsplash.com/photo-1762500824773-c171c77c29c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3Njk5MzE5MTZ8&ixlib=rb-4.1.0&q=80&w=1200"
                     className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000"
                     alt="Automatic litter box value analysis"
                  />
               </div>
            </div>
         </section>

         <div className="max-w-5xl mx-auto px-8 py-24">
            <div className="max-w-4xl mx-auto">
               {post.content}
            </div>

            <section className="mt-32 py-20 bg-primary-600 rounded-[64px] text-center text-white px-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
               <h2 className="text-3xl md:text-[44px] font-bold mb-8 relative z-10">Ready to Make the Switch?</h2>
               <p className="text-[#C8F0D8] text-xl mb-12 font-medium max-w-xl mx-auto leading-relaxed relative z-10">Join 10,000+ happy cat owners who have reclaimed their time and improved their home&apos;s freshness.</p>
               <div className="flex flex-wrap justify-center gap-6 relative z-10">
                  <Link href="/best" className="px-12 py-5 bg-white text-primary-600 font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                     See 2026 Top Picks
                  </Link>
                  <Link href="/guides" className="px-12 py-5 bg-[#2D6A44] text-white font-bold rounded-2xl transition-all border border-[#C8F0D8] hover:bg-[#255a3a]">
                     Read Buying Guide
                  </Link>
               </div>
            </section>
         </div>
      </div>
   );
}
