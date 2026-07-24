'use client';

import React, { useState } from 'react';
import { CheckCircle2, MinusCircle, Star, Sparkles, Filter } from 'lucide-react';
import SafeImage from './SafeImage';
import { Product } from '@/lib/products';
import BuyButton from './BuyButton';

interface ComparisonTableProps {
  products: Product[];
  showBuyButton?: boolean;
}

export default function ComparisonTable({ products, showBuyButton = true }: ComparisonTableProps) {
  const [highlightDiff, setHighlightDiff] = useState(false);

  if (products.length === 0) return null;

  const rows = [
    {
      id: 'price',
      label: 'Price',
      getValue: (p: Product) => `$${p.price}`,
      isDifferent: new Set(products.map(p => p.price)).size > 1,
      render: (p: Product) => (
        <span className={`text-sm font-bold ${p.badge === 'Best Value' ? 'text-primary-600' : 'text-text-primary'}`}>
          ${p.price}
        </span>
      ),
    },
    {
      id: 'multiCat',
      label: 'Multi-Cat Support',
      getValue: (p: Product) => p.specs.capacity,
      isDifferent: new Set(products.map(p => p.specs.capacity)).size > 1,
      render: (p: Product) => (
        <div className="flex justify-center">
          {p.specs.capacity.includes('Multi') || parseInt(p.specs.capacity) > 2 ? (
            <CheckCircle2 className="w-5 h-5 text-primary-600" />
          ) : (
            <MinusCircle className="w-5 h-5 text-text-muted" />
          )}
        </div>
      ),
    },
    {
      id: 'appControl',
      label: 'App Control',
      getValue: (p: Product) => p.specs.connectivity,
      isDifferent: new Set(products.map(p => p.specs.connectivity)).size > 1,
      render: (p: Product) => (
        <div className="flex justify-center">
          {p.specs.connectivity.includes('WiFi') ? (
            <CheckCircle2 className="w-5 h-5 text-primary-600" />
          ) : (
            <MinusCircle className="w-5 h-5 text-text-muted" />
          )}
        </div>
      ),
    },
    {
      id: 'noiseLevel',
      label: 'Noise Level',
      getValue: (p: Product) => p.specs.noiseLevel,
      isDifferent: new Set(products.map(p => p.specs.noiseLevel)).size > 1,
      render: (p: Product) => (
        <span className="text-sm font-bold text-primary-600">
          {p.specs.noiseLevel.includes('< 50') ? 'Ultra-Quiet (<50dB)' : p.specs.noiseLevel}
        </span>
      ),
    },
    {
      id: 'odorControl',
      label: 'Odor Control Tech',
      getValue: (p: Product) => p.id === 'litter-robot-4' ? 'Sealed Drawer + Carbon Filter' : 'N50 Spray Deodorizer',
      isDifferent: new Set(products.map(p => p.id)).size > 1,
      render: (p: Product) => (
        <span className="text-sm font-bold text-text-primary">
          {p.id === 'litter-robot-4' ? 'Sealed Drawer + Carbon Filter' : p.id === 'petkit-pura-max' ? 'N50 Spray Deodorizer' : 'Double Carbon Filter'}
        </span>
      ),
    },
    {
      id: 'rating',
      label: 'Expert Rating',
      getValue: (p: Product) => p.rating,
      isDifferent: new Set(products.map(p => p.rating)).size > 1,
      render: (p: Product) => (
        <div className="flex flex-col items-center gap-1">
          <div className="text-lg font-bold text-text-primary">{p.rating}/5</div>
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.floor(p.rating) ? 'fill-current' : 'text-gray-200'}`} />
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-[24px] border border-[#E5E4E1] overflow-hidden shadow-sm">
      {/* Controls Bar */}
      <div className="px-8 py-4 bg-surface-bg border-b border-[#E5E4E1] flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
          <Filter className="w-4 h-4 text-primary-600" />
          <span>Interactive Comparison</span>
        </div>
        <button
          onClick={() => setHighlightDiff(!highlightDiff)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
            highlightDiff
              ? 'bg-primary-600 text-white shadow-primary-600/20'
              : 'bg-white text-text-primary border border-[#D1D0CD] hover:bg-gray-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          {highlightDiff ? 'Showing Differences' : 'Highlight Differences'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-[#F5F4F1]">
            <tr>
              <th className="px-8 py-6 text-left text-[13px] font-bold text-[#6D6C6A] uppercase tracking-wider w-[240px]">Feature</th>
              {products.map((product) => (
                <th key={product.id} className="px-8 py-6 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 relative">
                      <SafeImage src={product.image} alt={product.name} fill className="object-contain" />
                    </div>
                    <span className="text-sm font-bold text-[#1A1918]">{product.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E4E1]">
            {rows.map((row) => {
              const isHighlighted = highlightDiff && row.isDifferent;
              return (
                <tr
                  key={row.id}
                  className={`transition-colors ${
                    isHighlighted ? 'bg-amber-50/70 hover:bg-amber-50' : 'hover:bg-surface-bg/30'
                  }`}
                >
                  <td className="px-8 py-4 text-sm font-semibold text-[#6D6C6A] flex items-center gap-2">
                    {row.label}
                    {isHighlighted && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-200 text-amber-800">
                        Diff
                      </span>
                    )}
                  </td>
                  {products.map((p) => (
                    <td key={p.id} className="px-8 py-4 text-center">
                      {row.render(p)}
                    </td>
                  ))}
                </tr>
              );
            })}
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
