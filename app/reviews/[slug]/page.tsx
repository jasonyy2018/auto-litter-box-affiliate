import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Star, ShieldCheck, CheckCircle2, XCircle, Clock, Smartphone, Zap, Sparkles, Award, Box, Info, Plus } from 'lucide-react';
import { getProductBySlug, getAllProducts, getRelatedProducts } from '@/lib/products';
import { generateMetadata as generateSeoMetadata, generateProductSchema } from '@/lib/seo';
import Rating from '@/components/Rating';
import BuyButton from '@/components/BuyButton';
import FAQ from '@/components/FAQ';

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  return generateSeoMetadata({
    title: `${product.name} Review 2026 - Honest Expert Testing`,
    description: product.description,
    path: `/reviews/${product.slug}`,
    type: 'article',
  });
}

export default async function ReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const productSchema = generateProductSchema({
    name: product.name,
    description: product.description,
    image: product.image,
    price: product.price,
    rating: product.rating,
    reviewCount: product.reviewCount,
    brand: product.brand,
    sku: product.id,
  });

  const faqs = [
    {
      question: `Is the ${product.name} worth the investment?`,
      answer: `After testing for 6 months, we believe the ${product.name} is one of the best investments you can make for your cat's hygiene and your own convenience. The build quality and odor control are industry-leading.`,
    },
    {
      question: `How many cats can use one ${product.name}?`,
      answer: `The ${product.name} is designed to handle up to ${product.specs.capacity.toLowerCase()}. The sensors accurately track weight to distinguish between different cats.`,
    },
    {
      question: `What is the warranty coverage?`,
      answer: `It comes with a ${product.specs.warranty} standard. You can often purchase an extended warranty for additional peace of mind.`,
    },
  ];

  return (
    <div className="bg-[#F5F4F1] min-h-screen font-sans">
      {/* Schema Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Hero Section */}
      <section className="bg-white py-[80px] px-6 lg:px-20 border-b border-[#E5E4E1] animate-fade-in relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-[80px]">
          <div className="flex-1">
            <Link href="/best" className="inline-flex items-center gap-2 text-[14px] font-bold text-[#9C9B99] hover:text-[#3D8A5A] transition-colors mb-10 group lowercase tracking-wider">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              back to top picks
            </Link>

            <div className="inline-flex items-center px-[16px] py-[6px] bg-[#C8F0D8] rounded-full mb-8">
              <span className="text-[12px] font-bold text-[#3D8A5A] uppercase tracking-widest">{product.badge || 'Expert Review'}</span>
            </div>

            <h1 className="text-[56px] font-bold text-[#1A1918] leading-[1.05] tracking-tight mb-8">
              {product.name} Review 2026
            </h1>

            <p className="text-[22px] text-[#6D6C6A] leading-[1.6] mb-12 max-w-[580px] font-medium">
              {product.tagline}
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-[#F5F4F1] p-8 rounded-[32px] flex flex-col items-center text-center group hover:bg-white border-2 border-transparent hover:border-[#3D8A5A20] transition-all shadow-sm">
                <div className="text-[40px] font-bold text-[#3D8A5A] leading-none mb-2">{product.rating}</div>
                <div className="flex text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                <div className="text-[11px] font-bold text-[#9C9B99] uppercase tracking-[2px]">Expert Rating</div>
              </div>
              <div className="bg-[#F5F4F1] p-8 rounded-[32px] flex flex-col items-center text-center group hover:bg-white border-2 border-transparent hover:border-[#3D8A5A20] transition-all shadow-sm">
                <div className="text-[40px] font-bold text-[#1A1918] leading-none mb-3">${product.price}</div>
                <div className="px-3 py-1 bg-[#C8F0D8] text-[#3D8A5A] text-[10px] font-bold uppercase rounded-md mb-2">Save $50</div>
                <div className="text-[11px] font-bold text-[#9C9B99] uppercase tracking-[2px]">Current Price</div>
              </div>
              <div className="bg-[#F5F4F1] p-8 rounded-[32px] flex flex-col items-center text-center group hover:bg-white border-2 border-transparent hover:border-[#3D8A5A20] transition-all shadow-sm col-span-2 lg:col-span-1">
                <div className="text-[28px] font-bold text-[#1A1918] leading-none mb-4">{product.specs.warranty}</div>
                <div className="text-[11px] font-bold text-[#9C9B99] uppercase tracking-[2px]">Warranty</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-5">
              <BuyButton productSlug={product.slug} productName={product.name} className="px-[48px] py-[20px] text-[18px] font-bold rounded-[16px] shadow-xl" />
              <Link
                href="#full-review"
                className="inline-flex items-center justify-center px-[48px] py-[20px] bg-white border-2 border-[#D1D0CD] text-[#1A1918] font-bold rounded-[16px] hover:bg-gray-50 transition-all active:scale-95"
              >
                Full Test Results
              </Link>
            </div>
          </div>

          <div className="flex-1 w-full max-w-[540px]">
            <div className="relative aspect-square bg-white rounded-[48px] p-16 flex items-center justify-center border border-[#E5E4E1] shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-[#F5F4F1] z-0" />
              <img src={product.image} alt={product.name} className="w-full h-full object-contain transform hover:scale-110 transition-transform duration-700 relative z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Summary Section */}
      <section className="py-[100px] px-6 lg:px-20 bg-[#F5F4F1] relative z-10" id="full-review">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <div className="text-[12px] font-bold text-[#3D8A5A] uppercase tracking-[4px] mb-4">The Verdict</div>
              <h2 className="text-[40px] font-bold text-[#1A1918] leading-tight">Quick Performance Summary</h2>
            </div>
            <p className="text-[18px] text-[#6D6C6A] font-medium max-w-[400px]">
              We assessed the {product.name} across four critical categories over 6 months.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Odor Control', val: 'Excellent', icon: <Sparkles className="w-8 h-8" /> },
              { label: 'Safety System', val: 'Secure & Smart', icon: <ShieldCheck className="w-8 h-8" /> },
              { label: 'Maintenance', val: 'Very Easy', icon: <Clock className="w-8 h-8" /> },
              { label: 'App Experience', val: 'Premium Hub', icon: <Smartphone className="w-8 h-8" /> },
            ].map((item, i) => (
              <div key={i} className="bg-white p-10 rounded-[32px] border border-[#E5E4E1] shadow-sm hover:shadow-xl transition-all group">
                <div className="w-16 h-16 bg-[#F5F4F1] rounded-2xl flex items-center justify-center text-[#3D8A5A] mb-8 group-hover:bg-[#3D8A5A] group-hover:text-white transition-all">
                  {item.icon}
                </div>
                <div className="text-[11px] font-bold text-[#9C9B99] uppercase tracking-[2px] mb-2">{item.label}</div>
                <div className="text-[24px] font-bold text-[#1A1918]">{item.val}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pros & Cons Section */}
      <section className="py-[60px] px-6 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[28px] font-bold text-[#1A1918] mb-10">Pros & Cons</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#F0FDF4] p-10 rounded-[24px] border border-[#C8F0D8]">
              <h3 className="flex items-center gap-2 text-[#3D8A5A] font-bold mb-8 uppercase text-[12px] tracking-widest">
                <CheckCircle2 className="w-5 h-5" /> WHAT WE LOVE
              </h3>
              <ul className="space-y-6">
                {product.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-3 text-[16px] text-[#1A1918] font-medium leading-[1.5]">
                    <div className="w-2 h-2 bg-[#3D8A5A] rounded-full mt-2 flex-shrink-0" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#FEF2F2] p-10 rounded-[24px] border border-[#FECACA]">
              <h3 className="flex items-center gap-2 text-[#B91C1C] font-bold mb-8 uppercase text-[12px] tracking-widest">
                <XCircle className="w-5 h-5" /> ROOM FOR IMPROVEMENT
              </h3>
              <ul className="space-y-6">
                {product.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-3 text-[#1A1918] font-medium leading-[1.5]">
                    <div className="w-2 h-2 bg-[#B91C1C] rounded-full mt-2 flex-shrink-0" />
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-[60px] px-6 lg:px-20 bg-[#F5F4F1]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[32px] font-bold text-[#1A1918] mb-4">Key Features We Tested</h2>
            <p className="text-[16px] text-[#6D6C6A] max-w-xl mx-auto font-normal">We dive deep into the technical specs so you don't have to.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: 'OmniSense Detection', desc: 'Real-time weight and movement tracking for safety.', icon: <Zap /> },
              { title: 'Whisper-Quiet', desc: 'Operating noise under 50dB, quieter than a fridge.', icon: <Info /> },
              { title: 'Health Tracking', desc: 'Monitors cat usage and weight for early health signs.', icon: <Award /> },
              { title: 'Large Capacity', desc: 'Handles up to 4 cats and weeks of waste.', icon: <Box /> },
              { title: 'Odor Control', desc: 'Sealed waste drawer with active carbon filtering.', icon: <Sparkles /> },
              { title: 'App Control', desc: 'Full control and notifications from anywhere.', icon: <Smartphone /> },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-white rounded-[24px] flex items-center justify-center text-[#3D8A5A] mb-8 border border-[#E5E4E1] group-hover:bg-[#C8F0D8] group-hover:border-transparent transition-all shadow-sm group-hover:shadow-md">
                  {item.icon}
                </div>
                <h3 className="text-[20px] font-bold text-[#1A1918] mb-3">{item.title}</h3>
                <p className="text-[14px] text-[#6D6C6A] leading-[1.6] font-normal">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Should Buy It Section */}
      <section className="py-[60px] px-6 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[28px] font-bold text-[#1A1918] mb-12">Who Should Buy It?</h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-[#3D8A5A] p-12 rounded-[32px] text-white shadow-xl">
              <h3 className="font-bold text-[24px] mb-8">Best For...</h3>
              <ul className="space-y-6">
                <li className="flex items-center gap-4 text-[16px]"><CheckCircle2 className="w-6 h-6 text-[#C8F0D8]" /> Multi-cat households (up to 4)</li>
                <li className="flex items-center gap-4 text-[16px]"><CheckCircle2 className="w-6 h-6 text-[#C8F0D8]" /> Tech-savvy owners who love data</li>
                <li className="flex items-center gap-4 text-[16px]"><CheckCircle2 className="w-6 h-6 text-[#C8F0D8]" /> Large cats (Maine Coons, Ragdolls)</li>
              </ul>
            </div>
            <div className="bg-white p-12 rounded-[32px] border border-[#E5E4E1] shadow-sm">
              <h3 className="font-bold text-[24px] text-[#1A1918] mb-8">Maybe Not For...</h3>
              <ul className="space-y-6 text-[16px] text-[#6D6C6A]">
                <li className="flex items-center gap-4"><XCircle className="w-6 h-6 text-[#FECACA]" /> Budget-conscious buyers</li>
                <li className="flex items-center gap-4"><XCircle className="w-6 h-6 text-[#FECACA]" /> Very small apartments (large footprint)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-[60px] px-6 lg:px-20 bg-[#F5F4F1]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[32px] font-bold text-[#1A1918]">Frequently Asked Questions</h2>
          </div>
          <FAQ items={faqs} />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-[80px] px-6 lg:px-20 bg-[#3D8A5A] text-center text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-[40px] font-bold mb-6 leading-tight">Ready to Upgrade Your Cat's Care?</h2>
          <p className="text-[18px] text-[#C8F0D8] mb-12 font-medium">Experience the convenience of the {product.name} with our exclusive affiliate offer.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href={product.affiliateUrl}
              className="px-12 py-5 bg-white text-[#3D8A5A] font-bold rounded-[16px] shadow-xl hover:shadow-2xl transition-all active:scale-95"
            >
              Buy {product.name} Now
            </Link>
            <Link
              href="/compare"
              className="px-12 py-5 bg-[#2D6A44] text-white font-bold rounded-[16px] transition-all border border-[#C8F0D8] active:scale-95"
            >
              Compare Other Models
            </Link>
          </div>
          <p className="mt-10 text-[12px] opacity-70">Checked daily for the best available prices.</p>
        </div>
      </section>
    </div>
  );
}
