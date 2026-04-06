'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Minus, Plus, ShoppingCart, ChevronRight, Truck, Shield, RotateCcw, Package } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import type { ShopProduct } from '@/lib/shopProducts';
import ShopProductCard from '@/components/ShopProductCard';

export default function ShopProductDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const { addToCart } = useCart();
    const [product, setProduct] = useState<ShopProduct | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<ShopProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState<string | undefined>(undefined);

    useEffect(() => {
        fetchProduct();
    }, [slug]);

    async function fetchProduct() {
        setLoading(true);
        try {
            const res = await fetch(`/api/shop/products`);
            const data = await res.json();
            if (data.success) {
                const found = data.data.products.find((p: ShopProduct) => p.slug === slug);
                setProduct(found || null);
                // Get related products (same category, different product)
                if (found) {
                    const related = data.data.products
                        .filter((p: ShopProduct) => p.id !== found.id)
                        .slice(0, 4);
                    setRelatedProducts(related);
                }
            }
        } catch (error) {
            console.error('Failed to fetch product:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="bg-white min-h-screen">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-20 py-12">
                    <div className="grid lg:grid-cols-2 gap-16 animate-pulse">
                        <div className="aspect-square bg-surface-bg rounded-[32px]" />
                        <div className="space-y-4">
                            <div className="h-4 bg-surface-bg rounded w-1/4" />
                            <div className="h-10 bg-surface-bg rounded w-3/4" />
                            <div className="h-6 bg-surface-bg rounded w-1/3" />
                            <div className="h-24 bg-surface-bg rounded" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Package className="w-16 h-16 text-[#D1D0CD] mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-text-primary mb-2">Product Not Found</h1>
                    <p className="text-text-muted mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
                    <Link href="/shop" className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl">
                        Back to Shop
                    </Link>
                </div>
            </div>
        );
    }

    const currentVariant = product.variants.find(v => v.id === selectedVariant);
    const displayPrice = currentVariant ? currentVariant.price : product.price;

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            slug: product.slug,
            name: product.name + (currentVariant ? ` - ${currentVariant.name}` : ''),
            price: displayPrice,
            image: currentVariant?.image || product.images[0] || '',
            variantId: selectedVariant,
            variantName: currentVariant?.name,
        }, quantity);
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Breadcrumb */}
            <div className="max-w-[1400px] mx-auto px-6 lg:px-20 py-6">
                <nav className="flex items-center gap-2 text-sm text-text-muted">
                    <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link href="/shop" className="hover:text-primary-600 transition-colors">Shop</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-text-primary font-medium truncate">{product.name}</span>
                </nav>
            </div>

            {/* Product Detail */}
            <div className="max-w-[1400px] mx-auto px-6 lg:px-20 pb-20">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Left: Images */}
                    <div>
                        <div className="aspect-square bg-surface-bg rounded-[32px] overflow-hidden mb-4">
                            {product.images[selectedImage] ? (
                                <img
                                    src={product.images[selectedImage]}
                                    alt={product.name}
                                    className="w-full h-full object-contain p-8"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-text-muted">
                                    <Package className="w-24 h-24" />
                                </div>
                            )}
                        </div>
                        {product.images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {product.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${selectedImage === i ? 'border-primary-600 scale-105' : 'border-[#E5E4E1] hover:border-primary-300'
                                            }`}
                                    >
                                        <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Info */}
                    <div className="flex flex-col">
                        <p className="text-sm text-text-muted uppercase tracking-wider font-semibold mb-2">{product.category}</p>
                        <h1 className="text-3xl lg:text-[40px] font-bold text-text-primary leading-tight mb-4">{product.name}</h1>

                        <div className="flex items-baseline gap-3 mb-6">
                            <span className="text-3xl font-bold text-primary-600">${displayPrice.toFixed(2)}</span>
                            {product.originalPrice && (
                                <span className="text-xl text-text-muted line-through">${product.originalPrice.toFixed(2)}</span>
                            )}
                            {product.originalPrice && (
                                <span className="px-3 py-1 bg-red-50 text-red-600 text-sm font-bold rounded-lg">
                                    Save ${(product.originalPrice - displayPrice).toFixed(2)}
                                </span>
                            )}
                        </div>

                        <p className="text-text-secondary leading-relaxed mb-8">{product.description || product.shortDescription}</p>

                        {/* Variants */}
                        {product.variants.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-3">Options</h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.variants.map(variant => (
                                        <button
                                            key={variant.id}
                                            onClick={() => setSelectedVariant(variant.id === selectedVariant ? undefined : variant.id)}
                                            className={`px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${selectedVariant === variant.id
                                                ? 'border-primary-600 bg-primary-50 text-primary-600'
                                                : 'border-[#E5E4E1] text-text-secondary hover:border-primary-300'
                                                }`}
                                        >
                                            {variant.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity & Add to Cart */}
                        <div className="flex items-center gap-4 mb-8">
                            {!product.amazonLink && !product.affiliateLink && (
                                <div className="flex items-center gap-1 bg-surface-bg rounded-xl border border-[#E5E4E1]">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 flex items-center justify-center hover:bg-gray-200 rounded-l-xl transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-12 h-12 flex items-center justify-center hover:bg-gray-200 rounded-r-xl transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                            {product.amazonLink || product.affiliateLink ? (
                                <a
                                    href={product.amazonLink || product.affiliateLink}
                                    target="_blank"
                                    rel="noopener noreferrer sponsored"
                                    className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-3"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    {product.amazonLink ? 'Buy on Amazon' : 'Buy Direct'} — ${(displayPrice * quantity).toFixed(2)}
                                </a>
                            ) : (
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 py-4 bg-primary-600 hover:bg-[#2D6A44] text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-3"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Add to Cart — ${(displayPrice * quantity).toFixed(2)}
                                </button>
                            )}
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[#E5E4E1]">
                            {[
                                { icon: <Truck className="w-5 h-5" />, label: 'Free Shipping', desc: 'On orders $50+' },
                                { icon: <Shield className="w-5 h-5" />, label: 'Secure Checkout', desc: '100% Protected' },
                                { icon: <RotateCcw className="w-5 h-5" />, label: 'Easy Returns', desc: '30-day policy' },
                            ].map((item, i) => (
                                <div key={i} className="text-center">
                                    <div className="w-10 h-10 bg-surface-bg rounded-full flex items-center justify-center mx-auto mb-2 text-primary-600">
                                        {item.icon}
                                    </div>
                                    <p className="text-xs font-bold text-text-primary">{item.label}</p>
                                    <p className="text-[11px] text-text-muted">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Description */}
                {product.description && (
                    <div className="mt-20 pt-16 border-t border-[#E5E4E1]">
                        <h2 className="text-2xl font-bold text-text-primary mb-6">Product Description</h2>
                        <div
                            className="prose prose-lg max-w-none text-text-secondary"
                            dangerouslySetInnerHTML={{ __html: product.description }}
                        />
                    </div>
                )}

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-20 pt-16 border-t border-[#E5E4E1]">
                        <h2 className="text-2xl font-bold text-text-primary mb-8">You May Also Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map(p => (
                                <ShopProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
