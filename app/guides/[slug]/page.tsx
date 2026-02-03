import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Calendar, User, Info, ShieldCheck, Zap, BookOpen } from 'lucide-react';
import { generateMetadata as generateSeoMetadata } from '@/lib/seo';
import { affiliateDisclosure } from '@/lib/affiliate';
import { getAllProducts } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

const guides: Record<string, {
   title: string;
   description: string;
   readTime: string;
   content: React.ReactNode;
   faqs: { question: string; answer: string }[];
}> = {
   'how-to-choose': {
      title: 'How to Choose an Automatic Litter Box',
      description: 'A comprehensive guide to help you select the perfect automatic litter box for your cat and home.',
      readTime: '10 min read',
      faqs: [
         {
            question: 'What size automatic litter box do I need?',
            answer: 'Consider your cat\'s size and weight. For cats over 15 lbs, choose a larger model like the Litter-Robot 4. For average-sized cats, most models will work well.',
         },
         {
            question: 'How much should I spend?',
            answer: 'Quality automatic litter boxes range from $400-$700. Budget options start around $400, while premium models are $600+. Consider it a long-term investment in convenience.',
         },
      ],
      content: (
         <div className="space-y-16">
            <section>
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-primary-600 text-white rounded-lg flex items-center justify-center font-bold text-xl">1</div>
                  <h2 className="text-2xl font-bold text-[#1A1918]">Size & Space Requirements</h2>
               </div>
               <p className="text-[#6D6C6A] leading-relaxed mb-6">
                  Automatic litter boxes are significantly larger than traditional ones. Before buying, measure your intended space and ensure there is a power outlet nearby.
               </p>
               <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-[#E5E4E1]">
                     <div className="text-xs font-bold text-[#9C9B99] uppercase mb-2">Small Cats</div>
                     <div className="font-bold text-[#1A1918]">Any Model</div>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-[#E5E4E1]">
                     <div className="text-xs font-bold text-[#9C9B99] uppercase mb-2">Medium Cats</div>
                     <div className="font-bold text-[#1A1918]">PETKIT Pura Max</div>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-[#E5E4E1]">
                     <div className="text-xs font-bold text-[#9C9B99] uppercase mb-2">Large Cats</div>
                     <div className="font-bold text-[#3D8A5A]">Litter-Robot 4</div>
                  </div>
               </div>
            </section>

            <section className="bg-white p-10 rounded-[24px] border border-[#E5E4E1]">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-primary-600 text-white rounded-lg flex items-center justify-center font-bold text-xl">2</div>
                  <h2 className="text-2xl font-bold text-[#1A1918]">Noise Level</h2>
               </div>
               <p className="text-[#6D6C6A] mb-8">If the box will be near your living or sleeping areas, noise is a critical factor.</p>
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex items-start gap-4">
                     <div className="w-12 h-12 bg-[#F5F4F1] rounded-xl flex items-center justify-center text-primary-600 flex-shrink-0">
                        <Zap className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="font-bold text-[#1A1918] mb-1">Ultra-Quiet</h4>
                        <p className="text-sm text-[#6D6C6A]">LR4 is under 50dB, barely audible in the next room.</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-4">
                     <div className="w-12 h-12 bg-[#F5F4F1] rounded-xl flex items-center justify-center text-primary-600 flex-shrink-0">
                        <Info className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="font-bold text-[#1A1918] mb-1">Standard</h4>
                        <p className="text-sm text-[#6D6C6A]">Budget models can be noisier during the cycle.</p>
                     </div>
                  </div>
               </div>
            </section>

            <section>
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-primary-600 text-white rounded-lg flex items-center justify-center font-bold text-xl">3</div>
                  <h2 className="text-2xl font-bold text-[#1A1918]">Safety Features</h2>
               </div>
               <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div className="p-8">
                     <ShieldCheck className="w-10 h-10 text-primary-600 mx-auto mb-4" />
                     <h4 className="font-bold text-[#1A1918] mb-2">Weight Sensors</h4>
                     <p className="text-xs text-[#6D6C6A]">Detects cat entry immediately.</p>
                  </div>
                  <div className="p-8">
                     <Zap className="w-10 h-10 text-primary-600 mx-auto mb-4" />
                     <h4 className="font-bold text-[#1A1918] mb-2">Infrared System</h4>
                     <p className="text-xs text-[#6D6C6A]">Stops if motion is detected.</p>
                  </div>
                  <div className="p-8">
                     <Info className="w-10 h-10 text-primary-600 mx-auto mb-4" />
                     <h4 className="font-bold text-[#1A1918] mb-2">Anti-Pinch</h4>
                     <p className="text-xs text-[#6D6C6A]">Physical safety overrides.</p>
                  </div>
               </div>
            </section>
         </div>
      ),
   },
};

export async function generateStaticParams() {
   return Object.keys(guides).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
   const { slug } = await params;
   const guide = guides[slug];
   if (!guide) return {};

   return generateSeoMetadata({
      title: guide.title,
      description: guide.description,
      path: `/guides/${slug}`,
   });
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
   const { slug } = await params;
   const guide = guides[slug];
   if (!guide) notFound();

   return (
      <div className="bg-[#F5F4F1] min-h-screen font-sans">
         {/* Hero Section */}
         <section className="bg-white py-[80px] px-6 lg:px-20 animate-fade-in border-b border-[#E5E4E1] relative z-10">
            <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
               <div className="inline-flex items-center px-[16px] py-[8px] bg-[#3D8A5A15] rounded-full">
                  <span className="text-[14px] font-bold text-[#3D8A5A] uppercase tracking-wider">Buyer's Guide 2026</span>
               </div>

               <h1 className="text-[52px] font-bold text-[#1A1918] leading-[1.1] tracking-tight">
                  How to Choose an<br />Automatic Litter Box
               </h1>

               <p className="text-[20px] text-[#6D6C6A] max-w-2xl font-normal leading-relaxed">
                  {guide.description}
               </p>

               <div className="flex items-center gap-4 mt-4">
                  <div className="w-[52px] h-[52px] bg-[#D89575] rounded-full flex items-center justify-center text-white font-bold text-[18px] shadow-md border-4 border-white">
                     MT
                  </div>
                  <div className="text-left">
                     <div className="text-[15px] font-bold text-[#1A1918]">Written by Michael Torres</div>
                     <div className="text-[13px] text-[#9C9B99] font-medium leading-tight">Cat behaviorist & product expert · {guide.readTime}</div>
                  </div>
               </div>
            </div>
         </section>

         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 py-16 px-6 lg:px-20">
            {/* Sidebar - Quick Info */}
            <aside className="hidden lg:block lg:col-span-3">
               <div className="sticky top-[120px] bg-white rounded-2xl p-8 border border-[#E5E4E1]">
                  <h3 className="text-[14px] font-bold text-[#1A1918] uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Key Factors</h3>
                  <ul className="space-y-4 text-[15px] font-medium text-[#6D6C6A]">
                     <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#3D8A5A]" />
                        Size & Capacity
                     </li>
                     <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#3D8A5A]" />
                        Noise Level
                     </li>
                     <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#3D8A5A]" />
                        Safety Features
                     </li>
                     <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#3D8A5A]" />
                        App Integration
                     </li>
                  </ul>
               </div>
            </aside>

            {/* Content */}
            <div className="lg:col-span-9">
               <div className="animate-fade-in-up">
                  {guide.content}
               </div>

               <section className="mt-16 bg-[#3D8A5A] rounded-[32px] p-12 text-center text-white shadow-xl">
                  <h2 className="text-[36px] font-bold mb-6">Ready to Find Your Match?</h2>
                  <p className="text-[18px] opacity-90 mb-10 max-w-xl mx-auto">
                     Our experts have narrowed down the market to the top 3 contenders for 2026.
                  </p>
                  <Link
                     href="/best"
                     className="inline-flex items-center gap-3 px-10 py-5 bg-white text-[#3D8A5A] font-bold rounded-2xl hover:bg-gray-50 transition-all shadow-xl active:scale-95"
                  >
                     See Our Top Picks
                     <ArrowRight className="w-6 h-6" />
                  </Link>
               </section>
            </div>
         </div>
      </div>
   );
}
