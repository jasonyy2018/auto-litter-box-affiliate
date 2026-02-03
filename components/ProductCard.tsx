'use client';

import Link from 'next/link';
import { Star, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { Product } from '@/lib/products';
import BuyButton from './BuyButton';

interface ProductCardProps {
  product: Product;
  rank?: number;
  variant?: 'vertical' | 'horizontal';
}

export default function ProductCard({ product, rank, variant = 'vertical' }: ProductCardProps) {
  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case 'Best Overall':
        return 'bg-[#3D8A5A]';
      case 'Best Value':
        return 'bg-[#D89575]';
      case 'Premium Pick':
        return 'bg-[#1A1918]';
      default:
        return 'bg-[#3D8A5A]';
    }
  };

  if (variant === 'horizontal') {
    return (
      <div className="group bg-white rounded-[32px] border border-[#E5E4E1] overflow-hidden flex flex-col md:flex-row transition-all hover:shadow-xl relative mb-12">
        {product.badge && (
          <div className={`absolute top-0 left-8 ${getBadgeColor(product.badge)} text-white text-[10px] font-bold tracking-[2px] uppercase px-5 py-2.5 rounded-b-[12px] z-20`}>
            {product.badge}
          </div>
        )}

        {/* Left: Image */}
        <div className="md:w-[400px] bg-[#F5F4F1] p-12 flex items-center justify-center relative overflow-hidden flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto max-h-[350px] object-contain group-hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Right: Content */}
        <div className="flex-1 p-10 flex flex-col">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200'}`} />
              ))}
            </div>
            <span className="text-sm font-semibold text-[#1A1918]">{product.rating}</span>
            <span className="text-sm text-[#9C9B99] font-medium">({product.reviewCount} reviews)</span>
          </div>

          <h3 className="text-[32px] font-bold text-[#1A1918] mb-2 leading-tight">{product.name}</h3>

          <div className="flex items-center gap-4 mb-6">
            <div className="text-[32px] font-bold text-[#3D8A5A]">${product.price}</div>
            <div className="px-3 py-1 bg-[#C8F0D8] text-[#3D8A5A] text-[10px] font-bold uppercase rounded-md">Save $50</div>
          </div>

          <p className="text-[#6D6C6A] leading-relaxed mb-8 font-medium">
            {product.description}
          </p>

          <div className="mb-10">
            <div className="text-[16px] font-bold text-[#1A1918] mb-4">Why We Love It</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              {product.features.slice(0, 4).map((feature, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-[#6D6C6A] font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-[#3D8A5A] mt-0 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto flex flex-wrap gap-4">
            <BuyButton productSlug={product.slug} productName={product.name} className="px-[32px] py-[16px] font-bold rounded-[12px]" />
            <Link href={`/reviews/${product.slug}`} className="px-[32px] py-[16px] bg-white border border-[#D1D0CD] text-[#1A1918] font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 group/link">
              View Full Review <ChevronRight className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-[24px] border border-[#E5E4E1] overflow-hidden flex flex-col transition-all hover:shadow-xl relative h-full">
      {product.badge && (
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 ${getBadgeColor(product.badge)} text-white text-[10px] font-bold tracking-[2px] uppercase px-5 py-2.5 rounded-b-[12px] z-20`}>
          {product.badge}
        </div>
      )}

      {/* Image Container */}
      <div className="relative h-[320px] bg-[#F5F4F1] p-12 flex items-center justify-center overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      {/* Content */}
      <div className="p-10 flex flex-col flex-grow">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex text-yellow-400 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200'}`} />
            ))}
          </div>
          <h3 className="text-2xl font-bold text-[#1A1918] mb-1">{product.name}</h3>
          <div className="text-xl font-bold text-[#3D8A5A]">${product.price}</div>
        </div>

        <p className="text-[#6D6C6A] text-[15px] text-center leading-relaxed mb-8 font-medium">
          {product.tagline}
        </p>

        <div className="space-y-4 mb-10">
          {product.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-start gap-3 text-[15px] text-[#6D6C6A] font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#3D8A5A] mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto">
          <BuyButton
            productSlug={product.slug}
            productName={product.name}
            className="w-full py-4 text-[16px] font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
          />
        </div>
      </div>
    </div>
  );
}
