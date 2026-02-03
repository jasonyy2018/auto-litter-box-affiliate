import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowDown, Sparkles, Timer, Box, Award, CheckCircle2, Plus } from 'lucide-react';
import { getAllProducts } from '@/lib/products';
import { generateMetadata as generateSeoMetadata } from '@/lib/seo';
import ProductCard from '@/components/ProductCard';
import ComparisonTable from '@/components/ComparisonTable';
import FAQ from '@/components/FAQ';

export const metadata: Metadata = generateSeoMetadata({
  title: 'Best Automatic Litter Boxes 2026 - Expert Reviews & Comparisons',
  description: 'Find the best automatic litter box for your cat in 2026. Expert reviews, side-by-side comparisons, and buying guides.',
  path: '/',
});

const trustItems = [
  { icon: <Timer className="w-[18px] h-[18px]" />, text: '6+ months testing' },
  { icon: <Box className="w-[18px] h-[18px]" />, text: '15+ products tested' },
  { icon: <Award className="w-[18px] h-[18px]" />, text: 'Expert reviewed' },
];

const faqs = [
  {
    question: 'How do automatic litter boxes actually work?',
    answer: 'Automatic litter boxes use sensors to detect when your cat has finished their business. After a short delay, a mechanism (usually a rotating drum or a sliding rake) separates clumps from clean litter, depositing waste into a sealed drawer.',
  },
  {
    question: 'What is the best litter to use?',
    answer: 'Most automatic litter boxes are designed for use with high-quality clumping clay litter. Some models, like the PetSafe ScoopFree, use specific crystal litter trays. Always check the manufacturer\'s recommendation for the best performance.',
  },
  {
    question: 'Are they safe for small cats or kittens?',
    answer: 'Most modern automatic litter boxes have safety sensors that detect weight and movement. However, they usually have a minimum weight requirement (typically around 3-5 lbs). We recommend using them for kittens only after they meet the weight threshold and are supervised.',
  },
  {
    question: 'How often do I need to empty it?',
    answer: 'For a single-cat household, the waste drawer typically needs emptying every 7-10 days. In multi-cat homes, you may need to empty it every 3-5 days. Odor control stays effective throughout this period thanks to sealed drawers and carbon filters.',
  },
];

export default function HomePage() {
  const products = getAllProducts().slice(0, 3);

  return (
    <div className="bg-[#F5F4F1]">
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="py-12 lg:py-24 px-6 lg:px-20 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C8F0D8] rounded-full mb-8 animate-fade-in">
              <span className="text-[12px] font-bold text-[#3D8A5A] uppercase tracking-wide">Updated for 2026</span>
            </div>

            <h1 className="text-5xl lg:text-[64px] font-bold text-[#1A1918] leading-[1.1] tracking-tight mb-6 animate-fade-in-up">
              Best Automatic Litter<br />Boxes for Cats
            </h1>

            <p className="text-[20px] text-[#6D6C6A] leading-[1.6] mb-10 font-medium max-w-[540px] animate-fade-in-up delay-100">
              Tired of scooping? We tested 15+ self-cleaning litter boxes for 6 months. Here are our top picks for 2026.
            </p>

            <div className="flex flex-wrap gap-4 mb-12 animate-fade-in-up delay-200">
              <Link
                href="#top-picks"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#3D8A5A] hover:bg-[#2D6A44] text-white font-bold rounded-[14px] transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                See Top Pick
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-[#1A1918] font-bold rounded-[14px] transition-all border border-[#D1D0CD] shadow-sm active:scale-95"
              >
                Compare All
              </Link>
            </div>

            <div className="flex flex-wrap gap-8 animate-fade-in-up delay-300">
              {trustItems.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-[#6D6C6A]">
                  <div className="w-5 h-5 text-[#3D8A5A]">
                    {item.icon}
                  </div>
                  <span className="text-[13px] font-bold text-[#9C9B99] uppercase tracking-wider">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative animate-fade-in-up delay-400">
            <div className="relative aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl border-[8px] border-white">
              <img
                src="https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=1200&auto=format&fit=crop"
                alt="Cat with automatic litter box"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Top Picks Section */}
      <section id="top-picks" className="py-24 px-6 lg:px-20 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 bg-white border border-[#E5E4E1] rounded-full mb-6 shadow-sm">
              <span className="text-[11px] font-bold text-[#1A1918] tracking-[2px] uppercase">Top Picks</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1A1918] mb-4">Our Top 3 Recommendations</h2>
            <p className="text-[#6D6C6A] text-lg max-w-2xl mx-auto font-medium">
              After 6 months of testing, these stood out for reliability, cat comfort, and value.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} variant="vertical" />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 px-6 lg:px-20 bg-[#F5F4F1]">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 bg-[#F5F4F1] rounded-full mb-6">
              <span className="text-[11px] font-bold text-[#9C9B99] tracking-[2px] uppercase">Comparison</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1A1918] mb-4">Compare All Features</h2>
            <p className="text-[#6D6C6A] text-lg max-w-2xl mx-auto font-medium">
              Side-by-side comparison to help you choose the Perfect Litter Box.
            </p>
          </div>
          <ComparisonTable products={products} />
        </div>
      </section>

      {/* Why Trust Us Section */}
      <section className="py-24 px-6 lg:px-20 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 bg-white border border-[#E5E4E1] rounded-full mb-6 shadow-sm">
              <span className="text-[11px] font-bold text-[#1A1918] tracking-[2px] uppercase">Privacy & Trust</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1A1918] mb-4">Real Testing, Real Results</h2>
            <p className="text-[#6D6C6A] text-lg font-medium">We don't just read specs. We live with these products.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: 'Independent Testing', desc: 'We buy all products we review. No freebies, no bias, just honest opinions from real cat owners.', icon: <Award className="w-10 h-10" /> },
              { title: '6+ Months Usage', desc: 'Each model is tested in real homes with multiple cats to see how it holds up over time.', icon: <Timer className="w-10 h-10" /> },
              { title: 'Expert Evaluation', desc: 'Our team includes vet technicians and behaviorists to ensure safety and comfort.', icon: <Sparkles className="w-10 h-10" /> },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center p-10 rounded-[32px] bg-[#F5F4F1] transition-all hover:shadow-lg group">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-[#3D8A5A] mb-8 group-hover:scale-110 transition-transform shadow-sm">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-[#1A1918] mb-4">{item.title}</h3>
                <p className="text-[#6D6C6A] leading-relaxed font-medium text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-8 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <div className="text-[11px] font-bold text-[#3D8A5A] tracking-[4px] uppercase mb-4">Help Center</div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1A1918] mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-[#E5E4E1] rounded-[24px] overflow-hidden group transition-all hover:border-[#3D8A5A]">
                <div className="px-10 py-8 flex justify-between items-center cursor-pointer">
                  <h4 className="text-xl font-bold text-[#1A1918] group-hover:text-[#3D8A5A] transition-colors">{faq.question}</h4>
                  <div className="w-10 h-10 rounded-full bg-[#F5F4F1] flex items-center justify-center text-[#3D8A5A] group-hover:bg-[#3D8A5A] group-hover:text-white transition-all">
                    <Plus className="w-6 h-6 transition-transform group-hover:rotate-90" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
