import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, XCircle, Scale, ShieldCheck } from 'lucide-react';
import { compareProducts, getProductBySlug } from '@/lib/products';
import { generateMetadata as generateSeoMetadata } from '@/lib/seo';
import ComparisonTable from '@/components/ComparisonTable';
import BuyButton from '@/components/BuyButton';
import FAQ from '@/components/FAQ';

const comparisons: Record<string, { slugs: string[]; title: string; description: string }> = {
  'litter-robot-vs-petkit': {
    slugs: ['litter-robot-4', 'petkit-pura-max'],
    title: 'Litter-Robot 4 vs PETKIT Pura Max',
    description: 'Compare the Litter-Robot 4 and PETKIT Pura Max automatic litter boxes. Which one is right for your cat?',
  },
  'petkit-vs-catlink': {
    slugs: ['petkit-pura-max', 'catlink-scooper'],
    title: 'PETKIT Pura Max vs CatLink Scooper',
    description: 'Compare PETKIT Pura Max and CatLink Scooper. Find out which mid-range automatic litter box offers better value.',
  },
};

export async function generateStaticParams() {
  return Object.keys(comparisons).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const comparison = comparisons[slug];
  if (!comparison) return {};

  return generateSeoMetadata({
    title: `${comparison.title} Comparison - 2026 Head-to-Head`,
    description: comparison.description,
    path: `/compare/${slug}`,
  });
}

export default async function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const comparison = comparisons[slug];
  if (!comparison) notFound();

  const products = compareProducts(comparison.slugs);
  if (products.length !== 2) notFound();

  const [product1, product2] = products;

  const faqs = [
    {
      question: `Which is better, ${product1.name} or ${product2.name}?`,
      answer: `Both are excellent choices. The ${product1.name} is better for those who prioritize premium features and reliability. The ${product2.name} is ideal for value-conscious buyers wanting great features at a lower price.`,
    },
  ];

  return (
    <div className="bg-[#F5F4F1] min-h-screen font-sans">
      <section className="bg-white py-20 px-8 lg:px-20 border-b border-[#E5E4E1]">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center px-3 py-1 bg-[#C8F0D8] text-[#3D8A5A] text-[10px] font-bold tracking-widest uppercase rounded-md mb-6">
             Head-to-Head Battle
          </div>
          <h1 className="text-3xl md:text-[52px] font-bold text-[#1A1918] mb-6 leading-[1.1] tracking-tight">
            {product1.name} <span className="text-[#9C9B99] font-normal italic mx-2">vs</span> {product2.name}
          </h1>
          <p className="text-lg text-[#6D6C6A] max-w-2xl mx-auto font-medium">
            We tested both models side-by-side in real-world homes to see which one deserves your investment.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 lg:px-20 py-20">
         <div className="grid md:grid-cols-2 gap-8 mb-20">
            {products.map((p) => (
              <div key={p.id} className={`p-10 rounded-[40px] border flex flex-col items-center text-center transition-all ${p.id === product1.id ? 'bg-[#3D8A5A] text-white border-transparent shadow-xl' : 'bg-white text-[#1A1918] border-[#E5E4E1] shadow-sm'}`}>
                 <div className={`text-[10px] font-bold tracking-[3px] uppercase mb-8 ${p.id === product1.id ? 'text-[#C8F0D8]' : 'text-[#9C9B99]'}`}>
                    {p.badge || 'Contender'}
                 </div>
                 <div className="w-full aspect-square max-w-[240px] bg-white/10 rounded-full p-8 mb-8 backdrop-blur-sm">
                    <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                 </div>
                 <h2 className="text-3xl font-bold mb-2">{p.name}</h2>
                 <div className={`text-2xl font-bold mb-8 ${p.id === product1.id ? 'text-white' : 'text-[#3D8A5A]'}`}>${p.price}</div>
                 <BuyButton productSlug={p.slug} productName={p.name} className={`w-full py-4 ${p.id === product1.id ? 'bg-white text-[#3D8A5A] hover:bg-gray-50' : ''}`} />
              </div>
            ))}
         </div>

         <div className="mb-20 bg-white p-12 rounded-[48px] border border-[#E5E4E1] shadow-sm">
            <h2 className="text-3xl font-bold text-[#1A1918] mb-12 text-center">Feature Breakdown</h2>
            <ComparisonTable products={products} showBuyButton={false} />
         </div>

         <div className="grid md:grid-cols-2 gap-12 mb-20">
            {products.map((p) => (
              <div key={p.id} className="bg-white p-10 rounded-[40px] border border-[#E5E4E1] shadow-sm">
                 <h3 className="text-xl font-bold text-[#1A1918] mb-8 pb-4 border-b border-gray-50">Why Choose {p.name}?</h3>
                 <ul className="space-y-4">
                    {p.pros.slice(0, 4).map((pro, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#6D6C6A] font-bold">
                        <CheckCircle2 className="w-5 h-5 text-[#3D8A5A] flex-shrink-0" />
                        {pro}
                      </li>
                    ))}
                 </ul>
              </div>
            ))}
         </div>

         <section className="bg-[#1A1918] rounded-[48px] p-16 text-center text-white relative overflow-hidden shadow-2xl mb-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#3D8A5A] text-white text-[10px] font-bold tracking-widest uppercase rounded-md mb-8">
               Final Recommendation
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Which Should You Buy?</h2>
            <p className="text-[#9C9B99] text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
               If budget is no object and you want the <span className="text-white font-bold">quietest, most advanced experience</span>, go with the {product1.name}. 
               If you want <span className="text-white font-bold">90% of the performance for 70% of the price</span>, the {product2.name} is the winner.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
               <BuyButton productSlug={product1.slug} productName={product1.name} label={`Get ${product1.name}`} className="px-10 py-4" />
               <BuyButton productSlug={product2.slug} productName={product2.name} label={`Get ${product2.name}`} className="px-10 py-4 bg-[#333333] border border-[#444444] hover:bg-[#444444]" />
            </div>
         </section>

         <div className="max-w-4xl mx-auto">
            <FAQ items={faqs} title="Comparison FAQ" />
         </div>
      </div>
    </div>
  );
}
