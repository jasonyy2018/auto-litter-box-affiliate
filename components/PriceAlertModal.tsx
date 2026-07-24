'use client';

import React, { useState } from 'react';
import { Bell, Check, X, Mail } from 'lucide-react';

interface PriceAlertModalProps {
    productName: string;
    productSlug: string;
    currentPrice: number;
    isOpen: boolean;
    onClose: () => void;
}

export default function PriceAlertModal({
    productName,
    productSlug,
    currentPrice,
    isOpen,
    onClose,
}: PriceAlertModalProps) {
    const [email, setEmail] = useState('');
    const [targetPrice, setTargetPrice] = useState(Math.round(currentPrice * 0.9));
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/price-alert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    productSlug,
                    productName,
                    currentPrice,
                    targetPrice,
                }),
            });

            const data = await res.json();
            if (data.success) {
                setSuccess(true);
            } else {
                setError(data.error || 'Failed to set price alert.');
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-80 flex items-center justify-center p-6" onClick={onClose}>
            <div className="bg-white rounded-[32px] w-full max-w-[480px] p-8 relative shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 w-9 h-9 rounded-full bg-surface-bg flex items-center justify-center text-text-muted hover:bg-gray-200 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="w-14 h-14 bg-[#C8F0D8] rounded-2xl flex items-center justify-center text-primary-600 mb-6">
                    <Bell className="w-7 h-7" />
                </div>

                <h3 className="text-2xl font-bold text-text-primary mb-2">Price Drop Alert</h3>
                <p className="text-sm text-text-secondary font-medium mb-6">
                    Get an instant email alert when <strong className="text-text-primary">{productName}</strong> drops below your target price.
                </p>

                {success ? (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                        <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold text-green-800 mb-1">Alert Set Successfully!</h4>
                        <p className="text-xs text-green-700 font-medium">
                            We will email <strong className="font-bold">{email}</strong> as soon as the price drops to <strong>${targetPrice}</strong> or lower.
                        </p>
                        <button
                            onClick={onClose}
                            className="mt-6 px-6 py-2.5 bg-primary-600 text-white text-sm font-bold rounded-xl"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Your Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type="email"
                                    required
                                    placeholder="catlover@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-surface-bg rounded-xl text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider">Alert Target Price</label>
                                <span className="text-xs font-bold text-primary-600">Current: ${currentPrice}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-lg font-bold text-text-primary">$</span>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    max={currentPrice}
                                    value={targetPrice}
                                    onChange={(e) => setTargetPrice(parseInt(e.target.value) || targetPrice)}
                                    className="w-full px-4 py-3 bg-surface-bg rounded-xl text-base font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-xs font-medium text-red-500">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary-600 hover:bg-[#2D6A44] text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 mt-2"
                        >
                            {loading ? 'Setting Alert...' : `Notify Me at $${targetPrice}`}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
