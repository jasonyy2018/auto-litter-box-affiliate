'use client';

import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronDown, Package } from 'lucide-react';
import ShopProductCard from '@/components/ShopProductCard';
import type { ShopProduct } from '@/lib/shopProducts';

export default function ShopPage() {
    const [products, setProducts] = useState<ShopProduct[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [sortBy, setSortBy] = useState('newest');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, sortBy]);

    async function fetchProducts() {
        setLoading(true);
        try {
            const params = new URLSearchParams({ sort: sortBy });
            if (selectedCategory) params.set('category', selectedCategory);

            const res = await fetch(`/api/shop/products?${params.toString()}`);
            const data = await res.json();
            if (data.success) {
                setProducts(data.data.products);
                setCategories(data.data.categories);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    }

    const filteredProducts = searchQuery
        ? products.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : products;

    return (
        <div className="bg-surface-bg min-h-screen">
            {/* Hero */}
            <section className="bg-white py-16 px-6 lg:px-20 border-b border-[#E5E4E1]">
                <div className="max-w-[1400px] mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C8F0D8] rounded-full mb-6">
                        <Package className="w-4 h-4 text-primary-600" />
                        <span className="text-[12px] font-bold text-primary-600 uppercase tracking-wide">Official Shop</span>
                    </div>
                    <h1 className="text-4xl lg:text-[56px] font-bold text-text-primary leading-tight tracking-tight mb-4">
                        Cat Care Products
                    </h1>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto font-medium">
                        Premium automatic litter boxes and cat care accessories. Shipped directly to your door.
                    </p>
                </div>
            </section>

            {/* Filters & Products */}
            <section className="py-12 px-6 lg:px-20">
                <div className="max-w-[1400px] mx-auto">
                    {/* Filter Bar */}
                    <div className="flex flex-wrap items-center gap-4 mb-10 bg-white rounded-2xl p-4 border border-[#E5E4E1] shadow-sm">
                        {/* Search */}
                        <div className="flex-1 min-w-[200px] relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-surface-bg rounded-xl text-sm font-medium text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-600/20 transition-all"
                            />
                        </div>

                        {/* Category */}
                        <div className="relative">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="appearance-none pl-4 pr-10 py-3 bg-surface-bg rounded-xl text-sm font-medium text-text-primary cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                        </div>

                        {/* Sort */}
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none pl-4 pr-10 py-3 bg-surface-bg rounded-xl text-sm font-medium text-text-primary cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                            >
                                <option value="newest">Newest</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="name">Name A-Z</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                        </div>
                    </div>

                    {/* Product Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-white rounded-[24px] border border-[#E5E4E1] overflow-hidden animate-pulse">
                                    <div className="aspect-square bg-surface-bg" />
                                    <div className="p-6 space-y-3">
                                        <div className="h-3 bg-surface-bg rounded w-1/3" />
                                        <div className="h-5 bg-surface-bg rounded w-2/3" />
                                        <div className="h-4 bg-surface-bg rounded w-full" />
                                        <div className="h-6 bg-surface-bg rounded w-1/4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map(product => (
                                <ShopProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <Package className="w-16 h-16 text-[#D1D0CD] mb-4" />
                            <h3 className="text-xl font-bold text-text-primary mb-2">No products found</h3>
                            <p className="text-text-muted max-w-md">
                                {searchQuery
                                    ? 'Try adjusting your search or filters'
                                    : 'Products will appear here once imported from the admin dashboard.'}
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
