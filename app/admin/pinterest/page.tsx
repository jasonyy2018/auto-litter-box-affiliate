'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, Loader2, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { products } from '@/lib/products';
import type { Product } from '@/lib/products';

interface Board {
    id: string;
    name: string;
    description: string;
    pinCount: number;
}

interface PublishResult {
    id: string;
    success: boolean;
    error?: string;
}

export default function AdminPinterestPage() {
    const [boards, setBoards] = useState<Board[]>([]);
    const [selectedBoard, setSelectedBoard] = useState('');
    const [loading, setLoading] = useState(false);
    const [boardsLoading, setBoardsLoading] = useState(false);
    const [boardsError, setBoardsError] = useState('');
    const [publishStatus, setPublishStatus] = useState<Record<string, PublishResult>>({});

    const blogPosts = [
        {
            slug: 'is-automatic-litter-box-worth-it',
            title: 'Is an Automatic Litter Box Worth It? Honest Review',
            description: 'Real costs, convenience gains, and potential drawbacks after 6 months of testing.',
        },
        {
            slug: 'how-to-transition-cat',
            title: 'How to Transition Your Cat to an Automatic Litter Box',
            description: 'Step-by-step guide with tips from cat behaviorists and real cat owners.',
        },
    ];

    const getPassword = () => sessionStorage.getItem('admin-auth') || '';

    const fetchBoards = async () => {
        setBoardsLoading(true);
        setBoardsError('');
        try {
            const res = await fetch(`/api/pinterest/boards?password=${encodeURIComponent(getPassword())}`);
            const data = await res.json();
            if (res.ok && data.boards) {
                setBoards(data.boards);
                if (data.boards.length > 0 && !selectedBoard) {
                    setSelectedBoard(data.boards[0].id);
                }
            } else {
                setBoardsError(data.error || 'Failed to fetch boards');
            }
        } catch {
            setBoardsError('Connection error. Is PINTEREST_ACCESS_TOKEN configured?');
        }
        setBoardsLoading(false);
    };

    useEffect(() => {
        fetchBoards();
    }, []);

    const publishPin = async (type: 'product' | 'blog', id: string) => {
        const key = `${type}-${id}`;
        setPublishStatus((prev) => ({ ...prev, [key]: { id, success: false } }));
        setLoading(true);

        try {
            const res = await fetch('/api/pinterest/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    id,
                    boardId: selectedBoard,
                    password: getPassword(),
                }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setPublishStatus((prev) => ({
                    ...prev,
                    [key]: { id: data.pin?.id || id, success: true },
                }));
            } else {
                setPublishStatus((prev) => ({
                    ...prev,
                    [key]: { id, success: false, error: data.error || 'Publish failed' },
                }));
            }
        } catch {
            setPublishStatus((prev) => ({
                ...prev,
                [key]: { id, success: false, error: 'Connection error' },
            }));
        }
        setLoading(false);
    };

    const getStatusIcon = (key: string) => {
        const status = publishStatus[key];
        if (!status) return null;
        if (status.success) return <CheckCircle2 className="w-5 h-5 text-green-500" />;
        if (status.error) return <XCircle className="w-5 h-5 text-red-500" />;
        return <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />;
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary mb-2">Pinterest Manager</h1>
                <p className="text-text-secondary font-medium">
                    Publish products and blog posts to Pinterest boards.
                </p>
            </div>

            {/* Board Selector */}
            <div className="bg-white rounded-2xl border border-[#E5E4E1] p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-text-primary">Target Board</h2>
                    <button
                        onClick={fetchBoards}
                        disabled={boardsLoading}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-text-secondary hover:text-primary-600 transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${boardsLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {boardsError ? (
                    <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                        {boardsError}
                    </div>
                ) : boards.length > 0 ? (
                    <select
                        value={selectedBoard}
                        onChange={(e) => setSelectedBoard(e.target.value)}
                        className="w-full px-4 py-3 bg-surface-bg rounded-xl text-text-primary font-medium focus:outline-none focus:ring-2 focus:ring-primary-600/30"
                    >
                        {boards.map((board) => (
                            <option key={board.id} value={board.id}>
                                {board.name} ({board.pinCount} pins)
                            </option>
                        ))}
                    </select>
                ) : (
                    <p className="text-text-muted text-sm">
                        {boardsLoading ? 'Loading boards...' : 'No boards found. Configure PINTEREST_ACCESS_TOKEN in .env'}
                    </p>
                )}
            </div>

            {/* Products Section */}
            <div className="bg-white rounded-2xl border border-[#E5E4E1] p-6 mb-8">
                <h2 className="text-lg font-bold text-text-primary mb-4">Products</h2>
                <div className="space-y-3">
                    {products.map((product) => {
                        const key = `product-${product.slug}`;
                        const status = publishStatus[key];
                        return (
                            <div
                                key={product.id}
                                className="flex items-center justify-between p-4 bg-surface-bg rounded-xl"
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-12 h-12 rounded-lg object-cover"
                                    />
                                    <div>
                                        <div className="font-bold text-text-primary text-sm">{product.name}</div>
                                        <div className="text-text-muted text-xs">{product.brand} · ${product.price}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {getStatusIcon(key)}
                                    {status?.error && (
                                        <span className="text-red-500 text-xs max-w-[200px] truncate">{status.error}</span>
                                    )}
                                    <button
                                        onClick={() => publishPin('product', product.slug)}
                                        disabled={loading || !selectedBoard}
                                        className="px-4 py-2 bg-[#E60023] hover:bg-[#AD081B] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        Pin It
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Blog Posts Section */}
            <div className="bg-white rounded-2xl border border-[#E5E4E1] p-6">
                <h2 className="text-lg font-bold text-text-primary mb-4">Blog Posts</h2>
                <div className="space-y-3">
                    {blogPosts.map((post) => {
                        const key = `blog-${post.slug}`;
                        const status = publishStatus[key];
                        return (
                            <div
                                key={post.slug}
                                className="flex items-center justify-between p-4 bg-surface-bg rounded-xl"
                            >
                                <div>
                                    <div className="font-bold text-text-primary text-sm">{post.title}</div>
                                    <div className="text-text-muted text-xs mt-1 max-w-md truncate">
                                        {post.description}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {getStatusIcon(key)}
                                    {status?.error && (
                                        <span className="text-red-500 text-xs max-w-[200px] truncate">{status.error}</span>
                                    )}
                                    <button
                                        onClick={() => publishPin('blog', post.slug)}
                                        disabled={loading || !selectedBoard}
                                        className="px-4 py-2 bg-[#E60023] hover:bg-[#AD081B] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        Pin It
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Info Card */}
            <div className="mt-8 bg-primary-50 rounded-2xl border border-primary-200 p-6">
                <h3 className="font-bold text-primary-800 mb-2">Setup Guide</h3>
                <ol className="text-primary-700 text-sm space-y-2 list-decimal list-inside">
                    <li>Create a Pinterest Developer account at <a href="https://developers.pinterest.com" target="_blank" rel="noopener noreferrer" className="underline">developers.pinterest.com</a></li>
                    <li>Create an app and generate an access token with <code className="bg-primary-100 px-1.5 py-0.5 rounded">pins:write</code> and <code className="bg-primary-100 px-1.5 py-0.5 rounded">boards:read</code> permissions</li>
                    <li>Set <code className="bg-primary-100 px-1.5 py-0.5 rounded">PINTEREST_ACCESS_TOKEN</code> in your <code className="bg-primary-100 px-1.5 py-0.5 rounded">.env</code> file</li>
                    <li>Optionally set <code className="bg-primary-100 px-1.5 py-0.5 rounded">PINTEREST_BOARD_ID</code> for a default board</li>
                    <li>Refresh the boards list above and start pinning!</li>
                </ol>
            </div>
        </div>
    );
}
