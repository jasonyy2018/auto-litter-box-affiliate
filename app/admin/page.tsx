'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, ArrowRight, TrendingUp, Eye, DollarSign } from 'lucide-react';
import type { ShopProduct } from '@/lib/shopProducts';

export default function AdminDashboardPage() {
    const [products, setProducts] = useState<ShopProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        const token = sessionStorage.getItem('admin-auth');
        if (!token) return;

        try {
            const res = await fetch('/api/admin/products', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setProducts(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    }

    const visibleCount = products.filter(p => p.visible).length;
    const totalValue = products.reduce((sum, p) => sum + p.price, 0);
    const avgPrice = products.length > 0 ? totalValue / products.length : 0;

    const stats = [
        { label: 'Total Products', value: products.length, icon: <Package className="w-6 h-6" />, color: 'bg-blue-50 text-blue-600' },
        { label: 'Visible Products', value: visibleCount, icon: <Eye className="w-6 h-6" />, color: 'bg-green-50 text-green-600' },
        { label: 'Avg. Price', value: `$${avgPrice.toFixed(2)}`, icon: <DollarSign className="w-6 h-6" />, color: 'bg-purple-50 text-purple-600' },
        { label: 'Hidden', value: products.length - visibleCount, icon: <TrendingUp className="w-6 h-6" />, color: 'bg-orange-50 text-orange-600' },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
                <p className="text-text-muted mt-1">Manage your shop products and import from CJDropshipping.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 border border-[#E5E4E1] hover:shadow-md transition-shadow">
                        <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                            {stat.icon}
                        </div>
                        <p className="text-text-muted text-sm font-medium">{stat.label}</p>
                        <p className="text-2xl font-bold text-text-primary mt-1">
                            {loading ? '...' : stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <Link
                    href="/admin/products"
                    className="group bg-white rounded-2xl p-8 border border-[#E5E4E1] hover:shadow-lg hover:border-primary-300 transition-all flex items-center gap-6"
                >
                    <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                        <Package className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-text-primary group-hover:text-primary-600 transition-colors">Manage Products</h3>
                        <p className="text-sm text-text-muted">Import, edit, and manage your shop products</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                    href="/shop"
                    className="group bg-white rounded-2xl p-8 border border-[#E5E4E1] hover:shadow-lg hover:border-primary-300 transition-all flex items-center gap-6"
                >
                    <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                        <Eye className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-text-primary group-hover:text-green-600 transition-colors">View Shop</h3>
                        <p className="text-sm text-text-muted">Preview your public shop page</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                </Link>
            </div>

            {/* Recent Products */}
            {products.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#E5E4E1] overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#E5E4E1] flex items-center justify-between">
                        <h3 className="font-bold text-text-primary">Recent Products</h3>
                        <Link href="/admin/products" className="text-sm text-primary-600 font-semibold hover:underline">
                            View All
                        </Link>
                    </div>
                    <div className="divide-y divide-[#E5E4E1]">
                        {products.slice(0, 5).map(product => (
                            <div key={product.id} className="px-6 py-4 flex items-center gap-4 hover:bg-surface-bg transition-colors">
                                <div className="w-12 h-12 bg-surface-bg rounded-xl overflow-hidden shrink-0">
                                    {product.images[0] && (
                                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-text-primary truncate">{product.name}</p>
                                    <p className="text-xs text-text-muted">{product.category}</p>
                                </div>
                                <span className="text-sm font-bold text-primary-600">${product.price.toFixed(2)}</span>
                                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${product.visible ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    {product.visible ? 'Visible' : 'Hidden'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
