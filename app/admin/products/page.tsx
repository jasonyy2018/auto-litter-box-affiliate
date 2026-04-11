'use client';

import React, { useState, useEffect } from 'react';
import {
    Search, Plus, Pencil, Trash2, Eye, EyeOff, X, Download,
    ChevronLeft, ChevronRight, Star, Loader2, Check, RefreshCw,
    AlertTriangle, CheckCircle, HelpCircle, Clock
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

interface SyncSummary {
    total: number;
    active: number;
    discontinued: number;
    unknown: number;
    lastSyncedAt: string | null;
    discontinuedProducts: Array<{
        id: string;
        name: string;
        cjPid: string;
        discontinuedAt: string;
        discontinuedReason: string;
        visible: boolean;
    }>;
}

function getToken() {
    return sessionStorage.getItem('admin-auth') || '';
}

function CJStatusBadge({ status }: { status?: string }) {
    if (!status || status === 'unknown') {
        return (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-1 rounded-md bg-gray-100 text-gray-500">
                <HelpCircle className="w-3 h-3" />
                未同步
            </span>
        );
    }
    if (status === 'active') {
        return (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-1 rounded-md bg-green-50 text-green-600">
                <CheckCircle className="w-3 h-3" />
                在售
            </span>
        );
    }
    if (status === 'discontinued') {
        return (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-1 rounded-md bg-red-50 text-red-600">
                <AlertTriangle className="w-3 h-3" />
                已下架
            </span>
        );
    }
    return null;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<ShopProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [showImportModal, setShowImportModal] = useState(false);
    const [editProduct, setEditProduct] = useState<ShopProduct | null>(null);
    const [saveMessage, setSaveMessage] = useState('');
    const [syncStatus, setSyncStatus] = useState<SyncSummary | null>(null);
    const [syncing, setSyncing] = useState(false);
    const [syncMessage, setSyncMessage] = useState('');
    const [syncingProductId, setSyncingProductId] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
        fetchSyncStatus();
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

    async function fetchSyncStatus() {
        try {
            const res = await fetch('/api/cj/sync-status');
            const data = await res.json();
            if (data.success) setSyncStatus(data.data);
        } catch (error) {
            console.error('Failed to fetch sync status:', error);
        }
    }

    async function syncAllProducts() {
        if (!confirm('将检查所有 CJ 商品的上架状态，已下架商品将自动隐藏。此操作可能需要几分钟，确认继续？')) return;
        setSyncing(true);
        setSyncMessage('正在同步商品状态...');
        try {
            const res = await fetch('/api/cj/sync-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ autoHide: true }),
            });
            const data = await res.json();
            if (data.success) {
                const { synced, discontinued, errors } = data.data;
                setSyncMessage(`✅ 同步完成：检查 ${synced} 个商品，${discontinued} 个已下架，${errors} 个错误`);
                fetchProducts();
                fetchSyncStatus();
            } else {
                setSyncMessage(`❌ 同步失败：${data.error}`);
            }
        } catch (error) {
            setSyncMessage(`❌ 同步出错：${error instanceof Error ? error.message : '未知错误'}`);
        } finally {
            setSyncing(false);
            setTimeout(() => setSyncMessage(''), 8000);
        }
    }

    async function syncSingleProduct(product: ShopProduct) {
        setSyncingProductId(product.id);
        try {
            const res = await fetch('/api/cj/sync-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productIds: [product.id], autoHide: true }),
            });
            const data = await res.json();
            if (data.success) {
                fetchProducts();
                fetchSyncStatus();
            }
        } catch (error) {
            console.error('Single sync failed:', error);
        } finally {
            setSyncingProductId(null);
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
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Products</h1>
                    <p className="text-text-muted mt-1">{products.length} products total</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={syncAllProducts}
                        disabled={syncing}
                        className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg disabled:opacity-50"
                        title="检查所有 CJ 商品状态，自动下架已失效商品"
                    >
                        <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                        {syncing ? '同步中...' : '同步 CJ 状态'}
                    </button>
                    <button
                        onClick={() => setShowImportModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-[#2D6A44] text-white font-bold rounded-xl transition-colors shadow-lg"
                    >
                        <Download className="w-5 h-5" />
                        Import from CJ
                    </button>
                </div>
            </div>

            {/* Sync Status Summary */}
            {syncStatus && (
                <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl border border-[#E5E4E1] p-4">
                        <p className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-1">总商品</p>
                        <p className="text-2xl font-bold text-text-primary">{syncStatus.total}</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-[#E5E4E1] p-4">
                        <p className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-1">在售</p>
                        <p className="text-2xl font-bold text-green-600">{syncStatus.active}</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-[#E5E4E1] p-4">
                        <p className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-1">已下架</p>
                        <p className="text-2xl font-bold text-red-600">{syncStatus.discontinued}</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-[#E5E4E1] p-4">
                        <p className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-1">未同步</p>
                        <p className="text-2xl font-bold text-gray-500">{syncStatus.unknown}</p>
                        {syncStatus.lastSyncedAt && (
                            <p className="text-[10px] text-text-muted mt-1 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(syncStatus.lastSyncedAt).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Discontinued Products Alert */}
            {syncStatus && syncStatus.discontinued > 0 && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-red-700 mb-2">
                                发现 {syncStatus.discontinued} 个商品已在 CJDropshipping 下架
                            </p>
                            <div className="space-y-1">
                                {syncStatus.discontinuedProducts.map(p => (
                                    <div key={p.id} className="flex items-center gap-2 text-xs text-red-600">
                                        <span className="font-medium">{p.name}</span>
                                        {p.discontinuedReason && (
                                            <span className="text-red-400">— {p.discontinuedReason.replace(/^CJ API:\s*/i, '').slice(0, 80)}</span>
                                        )}
                                        {p.visible && (
                                            <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">仍在展示</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {syncMessage && (
                <div className={`mb-4 px-4 py-3 rounded-xl flex items-center gap-2 font-medium text-sm ${
                    syncMessage.startsWith('✅') ? 'bg-green-50 text-green-700' :
                    syncMessage.startsWith('❌') ? 'bg-red-50 text-red-700' :
                    'bg-blue-50 text-blue-700'
                }`}>
                    {syncing && <Loader2 className="w-4 h-4 animate-spin" />}
                    {syncMessage}
                </div>
            )}

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
                                    <th className="text-left px-4 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">状态</th>
                                    <th className="text-right px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5E4E1]">
                                {products.map(product => (
                                    <tr key={product.id} className={`hover:bg-surface-bg/50 transition-colors ${product.cjStatus === 'discontinued' ? 'bg-red-50/30' : ''}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-surface-bg rounded-xl overflow-hidden shrink-0 relative">
                                                    {product.images[0] && (
                                                        <img src={product.images[0]} alt="" className={`w-full h-full object-cover ${product.cjStatus === 'discontinued' ? 'grayscale opacity-60' : ''}`} />
                                                    )}
                                                    {product.cjStatus === 'discontinued' && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-red-500/20">
                                                            <AlertTriangle className="w-5 h-5 text-red-500" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    {(() => {
                                                        const link = product.amazonLink || product.affiliateLink || (product.cjPid && product.cjPid.length > 5 ? `https://cjdropshipping.com/product/${product.cjPid.toLowerCase()}.html` : null);
                                                        return link ? (
                                                            <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-text-primary hover:text-primary-600 hover:underline truncate max-w-[250px] block transition-colors">
                                                                {product.name}
                                                            </a>
                                                        ) : (
                                                            <p className="text-sm font-bold text-text-primary truncate max-w-[250px]">{product.name}</p>
                                                        );
                                                    })()}
                                                    <p className="text-xs text-text-muted mb-1.5 mt-0.5">SKU: {product.sku}</p>
                                                    {product.cjStatus === 'discontinued' && product.discontinuedReason && (
                                                        <p className="text-[10px] text-red-500 mb-1 max-w-[250px] truncate" title={product.discontinuedReason}>
                                                            ⚠️ {product.discontinuedReason.replace(/^CJ API:\s*/i, '')}
                                                        </p>
                                                    )}
                                                    {product.lastSyncedAt && (
                                                        <p className="text-[10px] text-text-muted">
                                                            同步: {new Date(product.lastSyncedAt).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    )}
                                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                                        {product.cjPid && product.cjPid.length > 5 && (
                                                            <a href={`https://cjdropshipping.com/product/${product.cjPid.toLowerCase()}.html`} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 hover:bg-blue-100 transition-colors">
                                                                CJ Source
                                                            </a>
                                                        )}
                                                        {product.amazonLink && (
                                                            <a href={product.amazonLink} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded border border-orange-100 hover:bg-orange-100 transition-colors">
                                                                Amazon
                                                            </a>
                                                        )}
                                                        {product.affiliateLink && (
                                                            <a href={product.affiliateLink} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded border border-purple-100 hover:bg-purple-100 transition-colors">
                                                                Affiliate
                                                            </a>
                                                        )}
                                                    </div>
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
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${product.visible ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                                        {product.visible ? 'Visible' : 'Hidden'}
                                                    </span>
                                                    {product.featured && (
                                                        <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-md bg-yellow-50 text-yellow-600">
                                                            Featured
                                                        </span>
                                                    )}
                                                </div>
                                                <CJStatusBadge status={product.cjStatus} />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                {/* Single product sync button */}
                                                {product.cjPid && (
                                                    <button
                                                        onClick={() => syncSingleProduct(product)}
                                                        disabled={syncingProductId === product.id}
                                                        className="w-9 h-9 rounded-lg flex items-center justify-center text-text-muted hover:text-blue-600 hover:bg-blue-50 transition-all"
                                                        title="检查此商品 CJ 状态"
                                                    >
                                                        <RefreshCw className={`w-4 h-4 ${syncingProductId === product.id ? 'animate-spin text-blue-600' : ''}`} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => toggleVisibility(product)}
                                                    className="w-9 h-9 rounded-lg flex items-center justify-center text-text-muted hover:text-primary-600 hover:bg-primary-50 transition-all"
                                                    title={product.visible ? 'Hide' : 'Show'}
                                                >
                                                    {product.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => toggleFeatured(product)}
                                                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${product.featured ? 'text-yellow-500 bg-yellow-50' : 'text-text-muted hover:text-yellow-500 hover:bg-yellow-50'}`}
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
    const [amazonLink, setAmazonLink] = useState(product.amazonLink || '');
    const [affiliateLink, setAffiliateLink] = useState(product.affiliateLink || '');

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-80 flex items-center justify-center p-6" onClick={onClose}>
            <div className="bg-white rounded-[32px] w-full max-w-[600px] max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-[#E5E4E1] sticky top-0 bg-white rounded-t-[32px] z-10">
                    <div>
                        <h2 className="text-xl font-bold text-text-primary">Edit Product</h2>
                        {product.cjStatus === 'discontinued' && (
                            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                此商品已在 CJDropshipping 下架
                            </p>
                        )}
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-surface-bg flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Discontinued Notice */}
                {product.cjStatus === 'discontinued' && (
                    <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-sm font-bold text-red-700 mb-1">⚠️ 商品已下架</p>
                        <p className="text-xs text-red-600">
                            {product.discontinuedReason || '该商品已在 CJDropshipping 下架或链接失效'}
                        </p>
                        {product.discontinuedAt && (
                            <p className="text-xs text-red-400 mt-1">
                                下架时间：{new Date(product.discontinuedAt).toLocaleString('zh-CN')}
                            </p>
                        )}
                    </div>
                )}

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

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Amazon Proxy Link</label>
                            <input
                                type="url"
                                value={amazonLink}
                                onChange={(e) => setAmazonLink(e.target.value)}
                                placeholder="https://amazon.com/dp/..."
                                className="w-full px-4 py-3 bg-surface-bg rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Custom Affiliate Link</label>
                            <input
                                type="url"
                                value={affiliateLink}
                                onChange={(e) => setAffiliateLink(e.target.value)}
                                placeholder="https://shareasale.com/r..."
                                className="w-full px-4 py-3 bg-surface-bg rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                            />
                        </div>
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
                            amazonLink: amazonLink || undefined,
                            affiliateLink: affiliateLink || undefined,
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