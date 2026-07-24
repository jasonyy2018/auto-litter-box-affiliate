'use client';

import React, { useState, useEffect } from 'react';
import SafeImage from './SafeImage';
import BuyButton from './BuyButton';
import { Star } from 'lucide-react';

interface StickyMobileBuyBarProps {
    productSlug: string;
    productName: string;
    price: number;
    rating: number;
    image: string;
}

export default function StickyMobileBuyBar({
    productSlug,
    productName,
    price,
    rating,
    image,
}: StickyMobileBuyBarProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show sticky bar after scrolling past 400px
            if (window.scrollY > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#E5E4E1] p-3 shadow-2xl animate-fade-in-up transition-all">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 relative rounded-lg bg-surface-bg overflow-hidden shrink-0 border border-[#E5E4E1]">
                        <SafeImage src={image} alt={productName} fill className="object-contain" />
                    </div>
                    <div className="min-w-0">
                        <h4 className="text-xs font-bold text-text-primary truncate">{productName}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-sm font-extrabold text-primary-600">${price}</span>
                            <div className="flex text-yellow-400 items-center">
                                <Star className="w-3 h-3 fill-current" />
                                <span className="text-[10px] font-bold text-text-muted ml-0.5">{rating}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="shrink-0">
                    <BuyButton
                        productSlug={productSlug}
                        productName={productName}
                        size="sm"
                        label="Buy Now"
                        className="py-2.5 px-4 text-xs font-bold shadow-md rounded-xl"
                    />
                </div>
            </div>
        </div>
    );
}
