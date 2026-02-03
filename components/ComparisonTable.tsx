'use client';

import { CheckCircle2, MinusCircle, Star } from 'lucide-react';
import { Product } from '@/lib/products';
import BuyButton from './BuyButton';

interface ComparisonTableProps {
  products: Product[];
  showBuyButton?: boolean;
}

export default function ComparisonTable({ products, showBuyButton = true }: ComparisonTableProps) {
  if (products.length === 0) return null;

  return (
    <div className="bg-white rounded-[16px] border border-[#E5E4E1] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-[#F5F4F1]">
            <tr>
              <th className="px-8 py-6 text-left text-[13px] font-bold text-[#6D6C6A] uppercase tracking-wider w-[240px]">Feature</th>
              {products.map((product) => (
                <th key={product.id} className="px-8 py-6 text-center">
                   <div className="flex flex-col items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-16 h-16 object-contain" />
                      <span className="text-sm font-bold text-[#1A1918]">{product.name}</span>
                   </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E4E1]">
            <tr>
              <td className="px-8 py-4 text-sm font-medium text-[#6D6C6A]">Price</td>
              {products.map((p) => (
                <td key={p.id} className={`px-8 py-4 text-center text-sm font-bold ${p.badge === 'Best Value' ? 'text-[#3D8A5A]' : 'text-[#1A1918]'}`}>
                  ${p.price}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-8 py-4 text-sm font-medium text-[#6D6C6A]">Multi-Cat Support</td>
              {products.map((p) => (
                <td key={p.id} className="px-8 py-4 text-center">
                  <div className="flex justify-center">
                    {p.specs.capacity.includes('Multi') || parseInt(p.specs.capacity) > 2 ? (
                      <CheckCircle2 className="w-5 h-5 text-[#3D8A5A]" />
                    ) : (
                      <MinusCircle className="w-5 h-5 text-[#9C9B99]" />
                    )}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-8 py-4 text-sm font-medium text-[#6D6C6A]">App Control</td>
              {products.map((p) => (
                <td key={p.id} className="px-8 py-4 text-center">
                  <div className="flex justify-center">
                    {p.specs.connectivity.includes('WiFi') ? (
                      <CheckCircle2 className="w-5 h-5 text-[#3D8A5A]" />
                    ) : (
                      <MinusCircle className="w-5 h-5 text-[#9C9B99]" />
                    )}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-8 py-4 text-sm font-medium text-[#6D6C6A]">Noise Level</td>
              {products.map((p) => (
                <td key={p.id} className="px-8 py-4 text-center text-sm font-bold text-[#3D8A5A]">
                  {p.specs.noiseLevel.includes('< 50') ? 'Ultra-Quiet' : 'Quiet'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-8 py-4 text-sm font-medium text-[#6D6C6A]">Odor Control</td>
              {products.map((p) => (
                <td key={p.id} className="px-8 py-4 text-center text-sm font-bold text-[#3D8A5A]">
                  {p.id === 'litter-robot-4' ? 'Excellent' : 'Very Good'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-8 py-4 text-sm font-bold text-[#1A1918]">Our Rating</td>
              {products.map((p) => (
                <td key={p.id} className="px-8 py-4 text-center">
                   <div className="flex flex-col items-center gap-1">
                      <div className="text-lg font-bold text-[#1A1918]">{p.rating}/5</div>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < Math.floor(p.rating) ? 'fill-current' : 'text-gray-200'}`} />
                        ))}
                      </div>
                   </div>
                </td>
              ))}
            </tr>
            {showBuyButton && (
              <tr>
                <td className="px-8 py-6"></td>
                {products.map((p) => (
                  <td key={p.id} className="px-8 py-6 text-center">
                    <BuyButton productSlug={p.slug} productName={p.name} className="w-full text-xs py-2.5" />
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
