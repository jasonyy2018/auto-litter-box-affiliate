'use client';

import React, { useState, useEffect } from 'react';
import {
    Search, Plus, Pencil, Trash2, Eye, EyeOff, X, Download,
    ChevronLeft, ChevronRight, Star, Loader2, Check
} from 'lucide-react';
import type { ShopProduct } from '@/lib/shopProducts';

interface CJProductResult {
    pid: string;
    productName: string;
    productNameEn: string;
    productImage: string;
    sellPrice: number;
    categoryName: string;
    productImageSet: string[];
    variants: Array<{
        vid: string;
        variantNameEn: string;
        variantName: string;
        variantSku: string;
        variantSellPrice: number;
        variantImage: string;
        variantProperty: string;
    }>;
    description: string;
    productBrief: string;
    productSku: string;
    productWeight: number;
}

function getToken() {
    return sessionStorage.getItem('admin-auth') || '';
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<ShopProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [showImportModal, setShowImportModal] = useState(false);
    const [editProduct, setEditProduct] = useState<ShopProduct | null>(null);
    const [saveMessage, setSaveMessage] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        try {
            const res = await fetch('/api/admin/products', {
                headers: { 'Authorization': `Bearer ${getToken()}` },
            });
            const data = await res.json();
            if (data.success) setProducts(data.data);
        } catch (error) {
            console.error('Failed to fetch:', error);
        } finally {
            setLoading(false);
        }
    }

    async function toggleVisibility(product: ShopProduct) {
        const res = await fetch('/api/admin/products', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: product.id, visible: !product.visible }),
        });
        if (res.ok) fetchProducts();
    }

    async function toggleFeatured(product: ShopProduct) {
        const res = await fetch('/api/admin/products', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: product.id, featured: !product.featured }),
        });
        if (res.ok) fetchProducts();
    }

    async function deleteProduct(id: string) {
        if (!confirm('Are you sure you want to delete this product?')) return;
        const res = await fetch(`/api/admin/products?id=${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });
        if (res.ok) fetchProducts();
    }

    async function saveProduct(updates: Partial<ShopProduct>) {
        if (!editProduct) return;
        const res = await fetch('/api/admin/products', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: editProduct.id, ...updates }),
        });
        if (res.ok) {
            setSaveMessage('Saved!');
            setTimeout(() => setSaveMessage(''), 2000);
            fetchProducts();
            setEditProduct(null);
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Products</h1>
                    <p className="text-text-muted mt-1">{products.length} products total</p>
                </div>
                <button
                    onClick={() => setShowImportModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-[#2D6A44] text-white font-bold rounded-xl transition-colors shadow-lg"
                >
                    <Download className="w-5 h-5" />
                    Import from CJ
                </button>
            </div>

            {saveMessage && (
                <div className="mb-4 px-4 py-3 bg-green-50 text-green-700 rounded-xl flex items-center gap-2 font-medium">
                    <Check className="w-5 h-5" /> {saveMessage}
                </div>
            )}

            {/* Product Table */}
            <div className="bg-white rounded-2xl border border-[#E5E4E1] overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-text-muted mb-4">No products yet. Import products from CJDropshipping to get started.</p>
                        <button
                            onClick={() => setShowImportModal(true)}
                            className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl"
                        >
                            Import Products
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-surface-bg border-b border-[#E5E4E1]">
                                    <th className="text-left px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Product</th>
                                    <th className="text-left px-4 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Category</th>
                                    <th className="text-left px-4 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Cost</th>
                                    <th className="text-left px-4 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Price</th>
                                    <th className="text-left px-4 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                                    <th className="text-right px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5E4E1]">
                                {products.map(product => (
                                    <tr key={product.id} className="hover:bg-surface-bg/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-surface-bg rounded-xl overflow-hidden shrink-0">
                                                    {product.images[0] && (
                                                        <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-text-primary truncate max-w-[250px]">{product.name}</p>
                                                    <p className="text-xs text-text-muted">SKU: {product.sku}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-sm text-text-secondary">{product.category}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-sm text-text-muted">${product.costPrice.toFixed(2)}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-sm font-bold text-primary-600">${product.price.toFixed(2)}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${product.visible ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    {product.visible ? 'Visible' : 'Hidden'}
                                                </span>
                                                {product.featured && (
                                                    <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-md bg-yellow-50 text-yellow-600">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => toggleVisibility(product)}
                                                    className="w-9 h-9 rounded-lg flex items-center justify-center text-text-muted hover:text-primary-600 hover:bg-primary-50 transition-all"
                                                    title={product.visible ? 'Hide' : 'Show'}
                                                >
                                                    {product.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => toggleFeatured(product)}
                                                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${product.featured ? 'text-yellow-500 bg-yellow-50' : 'text-text-muted hover:text-yellow-500 hover:bg-yellow-50'
                                                        }`}
                                                    title={product.featured ? 'Unfeature' : 'Feature'}
                                                >
                                                    <Star className="w-4 h-4" fill={product.featured ? 'currentColor' : 'none'} />
                                                </button>
                                                <button
                                                    onClick={() => setEditProduct(product)}
                                                    className="w-9 h-9 rounded-lg flex items-center justify-center text-text-muted hover:text-blue-600 hover:bg-blue-50 transition-all"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteProduct(product.id)}
                                                    className="w-9 h-9 rounded-lg flex items-center justify-center text-text-muted hover:text-red-500 hover:bg-red-50 transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Import Modal */}
            {showImportModal && (
                <ImportModal
                    onClose={() => setShowImportModal(false)}
                    onImported={() => {
                        fetchProducts();
                        setShowImportModal(false);
                    }}
                />
            )}

            {/* Edit Modal */}
            {editProduct && (
                <EditModal
                    product={editProduct}
                    onClose={() => setEditProduct(null)}
                    onSave={saveProduct}
                />
            )}
        </div>
    );
}

// ---- Import Modal ----
function ImportModal({ onClose, onImported }: { onClose: () => void; onImported: () => void }) {
    const [searchQuery, setSearchQuery] = useState('cat litter');
    const [results, setResults] = useState<CJProductResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [importing, setImporting] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [markup, setMarkup] = useState(1.5);

    async function handleSearch(newPage = 1) {
        if (!searchQuery.trim()) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/cj/search?keyword=${encodeURIComponent(searchQuery)}&page=${newPage}&size=12`);
            const data = await res.json();
            if (data.success && data.data) {
                setResults(data.data.list || []);
                setTotal(data.data.total || 0);
                setPage(newPage);
            }
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleImport(cjProduct: CJProductResult) {
        setImporting(cjProduct.pid);
        try {
            const res = await fetch('/api/admin/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cjProduct, markup }),
            });
            if (res.ok) {
                onImported();
            }
        } catch (error) {
            console.error('Import failed:', error);
        } finally {
            setImporting(null);
        }
    }

    useEffect(() => {
        handleSearch();
    }, []);

    const totalPages = Math.ceil(total / 12);

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-80 flex items-center justify-center p-6" onClick={onClose}>
            <div className="bg-white rounded-[32px] w-full max-w-[900px] max-h-[85vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-[#E5E4E1]">
                    <div>
                        <h2 className="text-xl font-bold text-text-primary">Import from CJDropshipping</h2>
                        <p className="text-sm text-text-muted mt-0.5">Search and import products into your shop</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-surface-bg flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search */}
                <div className="px-8 py-4 border-b border-[#E5E4E1] flex gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Search CJ products (e.g. cat litter, pet supplies)"
                            className="w-full pl-12 pr-4 py-3 bg-surface-bg rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-xs text-text-muted font-semibold whitespace-nowrap">Markup:</label>
                        <input
                            type="number"
                            value={markup}
                            onChange={(e) => setMarkup(parseFloat(e.target.value) || 1)}
                            step="0.1"
                            min="1"
                            className="w-16 px-3 py-3 bg-surface-bg rounded-xl text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                        />
                        <span className="text-xs text-text-muted">x</span>
                    </div>
                    <button
                        onClick={() => handleSearch()}
                        disabled={loading}
                        className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-[#2D6A44] transition-colors disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
                    </button>
                </div>

                {/* Results */}
                <div className="flex-1 overflow-y-auto px-8 py-6">
                    {loading ? (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="rounded-2xl border border-[#E5E4E1] overflow-hidden animate-pulse">
                                    <div className="aspect-square bg-surface-bg" />
                                    <div className="p-4 space-y-2">
                                        <div className="h-4 bg-surface-bg rounded w-3/4" />
                                        <div className="h-3 bg-surface-bg rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : results.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            {results.map(product => (
                                <div key={product.pid} className="rounded-2xl border border-[#E5E4E1] overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="aspect-square bg-surface-bg p-4">
                                        {product.productImage && (
                                            <img src={product.productImage} alt="" className="w-full h-full object-contain" />
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <p className="text-sm font-bold text-text-primary line-clamp-2 mb-1">
                                            {product.productNameEn || product.productName}
                                        </p>
                                        <p className="text-xs text-text-muted mb-2">{product.categoryName}</p>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-xs text-text-muted">Cost: </span>
                                                <span className="text-sm font-bold text-text-primary">${product.sellPrice.toFixed(2)}</span>
                                            </div>
                                            <div>
                                                <span className="text-xs text-text-muted">Sell: </span>
                                                <span className="text-sm font-bold text-primary-600">${(product.sellPrice * markup).toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleImport(product)}
                                            disabled={importing === product.pid}
                                            className="w-full mt-3 py-2.5 bg-primary-600 hover:bg-[#2D6A44] text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {importing === product.pid ? (
                                                <><Loader2 className="w-4 h-4 animate-spin" /> Importing...</>
                                            ) : (
                                                <><Plus className="w-4 h-4" /> Import</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-text-muted">No products found. Try a different search term.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-8 py-4 border-t border-[#E5E4E1] flex items-center justify-between">
                        <span className="text-sm text-text-muted">{total} results</span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleSearch(page - 1)}
                                disabled={page <= 1}
                                className="w-9 h-9 rounded-lg flex items-center justify-center border border-[#E5E4E1] hover:bg-surface-bg disabled:opacity-30 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-medium px-2">Page {page} / {totalPages}</span>
                            <button
                                onClick={() => handleSearch(page + 1)}
                                disabled={page >= totalPages}
                                className="w-9 h-9 rounded-lg flex items-center justify-center border border-[#E5E4E1] hover:bg-surface-bg disabled:opacity-30 transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ---- Edit Modal ----
function EditModal({ product, onClose, onSave }: {
    product: ShopProduct;
    onClose: () => void;
    onSave: (updates: Partial<ShopProduct>) => void;
}) {
    const [name, setName] = useState(product.name);
    const [shortDescription, setShortDescription] = useState(product.shortDescription);
    const [description, setDescription] = useState(product.description);
    const [price, setPrice] = useState(product.price);
    const [originalPrice, setOriginalPrice] = useState(product.originalPrice || 0);
    const [category, setCategory] = useState(product.category);
    const [visible, setVisible] = useState(product.visible);
    const [featured, setFeatured] = useState(product.featured);
    const [tags, setTags] = useState(product.tags.join(', '));

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-80 flex items-center justify-center p-6" onClick={onClose}>
            <div className="bg-white rounded-[32px] w-full max-w-[600px] max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-[#E5E4E1] sticky top-0 bg-white rounded-t-[32px] z-10">
                    <h2 className="text-xl font-bold text-text-primary">Edit Product</h2>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-surface-bg flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <div className="px-8 py-6 space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 bg-surface-bg rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Short Description</label>
                        <input
                            type="text"
                            value={shortDescription}
                            onChange={(e) => setShortDescription(e.target.value)}
                            className="w-full px-4 py-3 bg-surface-bg rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 bg-surface-bg rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-600/20 resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Selling Price ($)</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                                step="0.01"
                                className="w-full px-4 py-3 bg-surface-bg rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Original Price ($)</label>
                            <input
                                type="number"
                                value={originalPrice}
                                onChange={(e) => setOriginalPrice(parseFloat(e.target.value) || 0)}
                                step="0.01"
                                className="w-full px-4 py-3 bg-surface-bg rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Category</label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-3 bg-surface-bg rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Tags (comma-separated)</label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="cat, litter, automatic"
                            className="w-full px-4 py-3 bg-surface-bg rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                        />
                    </div>

                    <div className="flex gap-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={visible}
                                onChange={(e) => setVisible(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                            />
                            <span className="text-sm font-semibold text-text-primary">Visible in Shop</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={featured}
                                onChange={(e) => setFeatured(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                            />
                            <span className="text-sm font-semibold text-text-primary">Featured</span>
                        </label>
                    </div>

                    <div className="text-xs text-text-muted">
                        Cost price: ${product.costPrice.toFixed(2)} · Margin: ${(price - product.costPrice).toFixed(2)} ({((price - product.costPrice) / product.costPrice * 100).toFixed(0)}%)
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-[#E5E4E1] flex gap-3 sticky bottom-0 bg-white rounded-b-[32px]">
                    <button onClick={onClose} className="flex-1 py-3 border border-[#E5E4E1] text-text-primary font-bold rounded-xl hover:bg-surface-bg transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave({
                            name,
                            shortDescription,
                            description,
                            price,
                            originalPrice: originalPrice || undefined,
                            category,
                            visible,
                            featured,
                            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
                        })}
                        className="flex-1 py-3 bg-primary-600 hover:bg-[#2D6A44] text-white font-bold rounded-xl transition-colors shadow-lg"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
