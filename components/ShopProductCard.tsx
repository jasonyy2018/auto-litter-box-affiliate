'use client';

import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import type { ShopProduct } from '@/lib/shopProducts';

interface ShopProductCardProps {
    product: ShopProduct;
}

export default function ShopProductCard({ product }: ShopProductCardProps) {
    const { addToCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
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
            <div className="bg-white rounded-[24px] border border-[#E5E4E1] overflow-hidden flex flex-col transition-all hover:shadow-xl hover:-translate-y-1 duration-300 h-full">
                {/* Image */}
                <div className="relative aspect-square bg-surface-bg p-6 overflow-hidden">
                    {discount > 0 && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full z-10">
                            -{discount}%
                        </div>
                    )}
                    {product.images[0] ? (
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-muted">
                            <ShoppingCart className="w-12 h-12" />
                        </div>
                    )}
                    {/* Quick Add Button */}
                    <button
                        onClick={handleAddToCart}
                        className="absolute bottom-4 right-4 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:bg-[#2D6A44] hover:scale-110"
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col grow">
                    <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-2">{product.category}</p>
                    <h3 className="text-base font-bold text-text-primary mb-2 line-clamp-2 leading-tight group-hover:text-primary-600 transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-sm text-text-secondary line-clamp-2 mb-4 leading-relaxed">
                        {product.shortDescription}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-primary-600">${product.price.toFixed(2)}</span>
                            {product.originalPrice && (
                                <span className="text-sm text-text-muted line-through">${product.originalPrice.toFixed(2)}</span>
                            )}
                        </div>
                        <button
                            onClick={handleAddToCart}
                            className="px-4 py-2 bg-primary-600 text-white text-sm font-bold rounded-lg hover:bg-[#2D6A44] transition-colors lg:hidden"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
