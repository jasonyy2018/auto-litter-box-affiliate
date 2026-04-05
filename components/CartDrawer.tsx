'use client';

import React from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CartDrawer() {
    const router = useRouter();
    const { items, isOpen, closeCart, itemCount, subtotal, updateQuantity, removeFromCart, clearCart } = useCart();

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-60 transition-opacity"
                onClick={closeCart}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-full max-w-[440px] bg-white z-70 shadow-2xl flex flex-col animate-slide-in-right">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-[#E5E4E1]">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-6 h-6 text-primary-600" />
                        <h2 className="text-xl font-bold text-text-primary">Cart ({itemCount})</h2>
                    </div>
                    <button
                        onClick={closeCart}
                        className="w-10 h-10 rounded-full bg-surface-bg flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-8 py-6">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <ShoppingBag className="w-16 h-16 text-[#D1D0CD] mb-4" />
                            <p className="text-lg font-semibold text-text-primary mb-2">Your cart is empty</p>
                            <p className="text-text-muted text-sm mb-6">Browse our shop to find great products for your cat!</p>
                            <Link
                                href="/shop"
                                onClick={closeCart}
                                className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-[#2D6A44] transition-colors"
                            >
                                Browse Shop
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {items.map((item) => (
                                <div
                                    key={`${item.id}-${item.variantId || ''}`}
                                    className="flex gap-4 pb-6 border-b border-[#E5E4E1] last:border-0"
                                >
                                    {/* Image */}
                                    <div className="w-20 h-20 rounded-xl bg-surface-bg overflow-hidden shrink-0">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-text-primary truncate">{item.name}</h4>
                                        {item.variantName && (
                                            <p className="text-xs text-text-muted mt-0.5">{item.variantName}</p>
                                        )}
                                        <p className="text-primary-600 font-bold mt-1">${item.price.toFixed(2)}</p>

                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center gap-2 bg-surface-bg rounded-lg">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1, item.variantId)}
                                                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-lg transition-colors"
                                                >
                                                    <Minus className="w-3.5 h-3.5" />
                                                </button>
                                                <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.variantId)}
                                                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-lg transition-colors"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id, item.variantId)}
                                                className="text-text-muted hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-[#E5E4E1] px-8 py-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-text-secondary font-medium">Subtotal</span>
                            <span className="text-2xl font-bold text-text-primary">${subtotal.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-text-muted">Shipping calculated at checkout</p>
                        <button
                            onClick={() => {
                                closeCart();
                                router.push('/shop/checkout');
                            }}
                            className="w-full py-4 bg-primary-600 hover:bg-[#2D6A44] text-white font-bold rounded-xl transition-colors shadow-lg"
                        >
                            Checkout
                        </button>
                        <button
                            onClick={clearCart}
                            className="w-full py-3 text-text-muted hover:text-red-500 font-medium text-sm transition-colors"
                        >
                            Clear Cart
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
