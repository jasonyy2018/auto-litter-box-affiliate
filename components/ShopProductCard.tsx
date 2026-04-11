'use client';

import Link from 'next/link';
import { ShoppingCart, AlertTriangle } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import type { ShopProduct } from '@/lib/shopProducts';

interface ShopProductCardProps {
    product: ShopProduct;
}

export default function ShopProductCard({ product }: ShopProductCardProps) {
    const { addToCart } = useCart();

    const isDiscontinued = product.cjStatus === 'discontinued';

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isDiscontinued) return;
        addToCart({
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.images[0] || '',
        });
    };

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <Link href={`/shop/${product.slug}`} className="group block">
            <div className={`bg-white rounded-[24px] border overflow-hidden flex flex-col transition-all duration-300 h-full ${
                isDiscontinued
                    ? 'border-red-200 opacity-75'
                    : 'border-[#E5E4E1] hover:shadow-xl hover:-translate-y-1'
            }`}>
                {/* Image */}
                <div className="relative aspect-square bg-surface-bg p-6 overflow-hidden">
                    {/* Discontinued Overlay */}
                    {isDiscontinued && (
                        <div className="absolute inset-0 bg-red-50/80 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center gap-2">
                            <div className="bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                已下架
                            </div>
                            {product.discontinuedReason && (
                                <p className="text-[10px] text-red-600 font-medium text-center px-4 max-w-[160px] leading-tight">
                                    {product.discontinuedReason.replace(/^CJ API:\s*/i, '').slice(0, 60)}
                                </p>
                            )}
                        </div>
                    )}

                    {!isDiscontinued && discount > 0 && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full z-10">
                            -{discount}%
                        </div>
                    )}
                    {product.images[0] ? (
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className={`w-full h-full object-contain transition-transform duration-500 ${
                                isDiscontinued ? 'grayscale' : 'group-hover:scale-110'
                            }`}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-muted">
                            <ShoppingCart className="w-12 h-12" />
                        </div>
                    )}
                    {/* Quick Add Button - only show for active products */}
                    {!isDiscontinued && (
                        <button
                            onClick={handleAddToCart}
                            className="absolute bottom-4 right-4 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:bg-[#2D6A44] hover:scale-110"
                        >
                            <ShoppingCart className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col grow">
                    <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-2">{product.category}</p>
                    <h3 className={`text-base font-bold mb-2 line-clamp-2 leading-tight transition-colors ${
                        isDiscontinued ? 'text-text-muted' : 'text-text-primary group-hover:text-primary-600'
                    }`}>
                        {product.name}
                    </h3>
                    <p className="text-sm text-text-secondary line-clamp-2 mb-4 leading-relaxed">
                        {product.shortDescription}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                            <span className={`text-xl font-bold ${isDiscontinued ? 'text-text-muted line-through' : 'text-primary-600'}`}>
                                ${product.price.toFixed(2)}
                            </span>
                            {!isDiscontinued && product.originalPrice && (
                                <span className="text-sm text-text-muted line-through">${product.originalPrice.toFixed(2)}</span>
                            )}
                        </div>
                        {isDiscontinued ? (
                            <span className="px-3 py-1.5 bg-red-50 text-red-500 text-xs font-bold rounded-lg border border-red-100">
                                已下架
                            </span>
                        ) : (
                            <button
                                onClick={handleAddToCart}
                                className="px-4 py-2 bg-primary-600 text-white text-sm font-bold rounded-lg hover:bg-[#2D6A44] transition-colors lg:hidden"
                            >
                                Add
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}