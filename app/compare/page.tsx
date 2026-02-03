import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, Scale, Box, Sparkles } from 'lucide-react';
import { getAllProducts } from '@/lib/products';
import { generateMetadata as generateSeoMetadata } from '@/lib/seo';
import ComparisonTable from '@/components/ComparisonTable';

export const metadata: Metadata = generateSeoMetadata({
  title: 'Automatic Litter Box Comparisons - Side by Side Guide',
  description: 'Side-by-side comparisons of top automatic litter boxes. See how Litter-Robot 4, PETKIT Pura Max, and CatLink Scooper compare in price, features, and performance.',
  path: '/compare',
});

const popularComparisons = [
  {
    title: 'Litter-Robot 4 vs PETKIT Pura Max',
    slug: 'litter-robot-vs-petkit',
    description: 'Premium choice vs Best value',
    badge: 'Most Popular',
    badgeColor: 'bg-[#3D8A5A]',
  },
  {
    title: 'PETKIT Pura Max vs CatLink Scooper',
    slug: 'petkit-vs-catlink',
    description: 'Mid-range battle for your home',
    badge: 'Comparison',
    badgeColor: 'bg-[#1A1918]',
  },
];

export default function ComparePage() {
  const products = getAllProducts();

  return (
    <div className="bg-[#F5F4F1] min-h-screen font-sans">
      {/* Hero Section */}
      <section className="bg-white py-[80px] px-6 lg:px-20 border-b border-[#E5E4E1] animate-fade-in text-center">
        <div className="max-w-[800px] mx-auto flex flex-col items-center gap-8">
          <div className="inline-flex items-center px-[16px] py-[8px] bg-[#3D8A5A15] rounded-full text-[#3D8A5A]">
            <span className="text-[14px] font-bold uppercase tracking-wider">Side-by-Side Guide</span>
          </div>
          <h1 className="text-[52px] font-bold text-[#1A1918] leading-[1.1] tracking-tight">
            Compare Automatic<br />Litter Boxes
          </h1>
          <p className="text-[20px] text-[#6D6C6A] max-w-2xl font-normal leading-relaxed">
            Confidently choose your next self-cleaner with in-depth comparisons tailored to your household's unique needs.
          </p>
        </div>
      </section>

      {/* Popular Comparisons */}
      <section className="py-24 px-8 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1A1918] mb-12">Popular Comparisons</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {popularComparisons.map((comparison) => (
              <Link
                key={comparison.slug}
                href={`/compare/${comparison.slug}`}
                className="group bg-white rounded-[32px] p-10 border border-[#E5E4E1] shadow-sm hover:shadow-xl transition-all hover:border-[#3D8A5A30] flex flex-col h-full"
              >
                <div className={`self-start ${comparison.badgeColor} text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-md mb-8`}>
                  {comparison.badge}
                </div>
                <h3 className="text-[32px] font-bold text-[#1A1918] group-hover:text-[#3D8A5A] transition-colors mb-4 leading-tight">
                  {comparison.title}
                </h3>
                <p className="text-[18px] text-[#6D6C6A] mb-10 font-medium leading-relaxed">
                  {comparison.description}
                </p>
                <div className="mt-auto flex items-center text-[#3D8A5A] font-bold gap-2 group-hover:gap-4 transition-all">
                  View Full Comparison
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Full Comparison Table */}
      <section className="py-24 px-8 lg:px-20 bg-white border-t border-[#E5E4E1]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="text-[11px] font-bold text-[#3D8A5A] tracking-[4px] uppercase mb-4">Comparison Data</div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1A1918] mb-6">Full Product Comparison</h2>
            <p className="text-[#6D6C6A] text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              Every detail matters when it comes to your cat&apos;s comfort and your home&apos;s cleanliness.
            </p>
          </div>
          <ComparisonTable products={products} />
        </div>
      </section>

      {/* Comparison Insights */}
      <section className="py-24 px-8 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1A1918] mb-12">Quick Choice Guide</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Best for Large Cats', desc: 'The Litter-Robot 4 leads with a 25 lbs capacity.', icon: <Box className="w-6 h-6" /> },
              { title: 'Best for Multi-Cat', desc: 'LR4 and PETKIT are our top picks for busy boxes.', icon: <Check className="w-6 h-6" /> },
              { title: 'Best on a Budget', desc: 'CatLink Scooper offers the best entry price.', icon: <Scale className="w-6 h-6" /> },
              { title: 'Best Odor Control', desc: 'PETKIT Pura Max features active deodorization.', icon: <Sparkles className="w-6 h-6" /> },
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-[#E5E4E1] shadow-sm transition-all hover:shadow-md">
                <div className="w-12 h-12 bg-[#F5F4F1] rounded-2xl flex items-center justify-center text-[#3D8A5A] mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-[#1A1918] mb-3">{item.title}</h3>
                <p className="text-[#6D6C6A] leading-relaxed font-medium text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
