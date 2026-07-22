'use client';

import { ExternalLink, ShoppingCart, ShieldCheck } from 'lucide-react';
import { getAffiliateLink, trackAffiliateClick } from '@/lib/affiliate';

interface BuyButtonProps {
  productSlug: string;
  productName: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  platform?: 'amazon' | 'direct';
  className?: string;
}

export default function BuyButton({
  productSlug,
  productName,
  label,
  size = 'md',
  platform = 'amazon',
  className = '',
}: BuyButtonProps) {
  const affiliateUrl = getAffiliateLink(productSlug, platform);

  const defaultLabel = platform === 'amazon'
    ? 'Check Price on Amazon'
    : 'Buy Direct';

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const handleClick = () => {
    trackAffiliateClick({
      url: affiliateUrl || '',
      platform,
      productId: productSlug,
      productName,
    });
  };

  if (!affiliateUrl) {
    return null;
  }

  return (
    <div className="flex flex-col items-center">
      <a
        href={affiliateUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={handleClick}
        className={`
          inline-flex items-center justify-center gap-2
          ${sizeClasses[size]}
          font-semibold rounded-xl text-white
          bg-gradient-to-r from-orange-500 to-red-500
          hover:from-orange-600 hover:to-red-600
          transition-all duration-200
          shadow-lg hover:shadow-xl
          transform hover:-translate-y-0.5
          ${className}
        `}
      >
        <ShoppingCart className="w-5 h-5" />
        <span>{label || defaultLabel}</span>
        <ExternalLink className="w-4 h-4" />
      </a>
      {(size === 'md' || size === 'lg') && (
        <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
          <ShieldCheck className="w-3 h-3" />
          <span>Price Verified</span>
        </div>
      )}
    </div>
  );
}
