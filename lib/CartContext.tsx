'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

export interface CartItem {
    id: string;
    slug: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    variantId?: string;
    variantName?: string;
}

interface CartContextType {
    items: CartItem[];
    isOpen: boolean;
    itemCount: number;
    subtotal: number;
    addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
    removeFromCart: (id: string, variantId?: string) => void;
    updateQuantity: (id: string, quantity: number, variantId?: string) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'autolitter-cart';

function loadCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function saveCart(items: CartItem[]): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
        // Silently fail
    }
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        setItems(loadCart());
        setIsLoaded(true);
    }, []);

    // Save cart to localStorage on change
    useEffect(() => {
        if (isLoaded) {
            saveCart(items);
        }
    }, [items, isLoaded]);

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const addToCart = useCallback((item: Omit<CartItem, 'quantity'>, quantity = 1) => {
        setItems(prev => {
            const existingIndex = prev.findIndex(
                i => i.id === item.id && i.variantId === item.variantId
            );

            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + quantity,
                };
                return updated;
            }

            return [...prev, { ...item, quantity }];
        });
        setIsOpen(true);
    }, []);

    const removeFromCart = useCallback((id: string, variantId?: string) => {
        setItems(prev => prev.filter(i => !(i.id === id && i.variantId === variantId)));
    }, []);

    const updateQuantity = useCallback((id: string, quantity: number, variantId?: string) => {
        if (quantity <= 0) {
            removeFromCart(id, variantId);
            return;
        }
        setItems(prev =>
            prev.map(i =>
                i.id === id && i.variantId === variantId ? { ...i, quantity } : i
            )
        );
    }, [removeFromCart]);

    const clearCart = useCallback(() => {
        setItems([]);
        setIsOpen(false);
    }, []);

    const openCart = useCallback(() => setIsOpen(true), []);
    const closeCart = useCallback(() => setIsOpen(false), []);
    const toggleCart = useCallback(() => setIsOpen(prev => !prev), []);

    return (
        <CartContext.Provider
            value={{
                items,
                isOpen,
                itemCount,
                subtotal,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                openCart,
                closeCart,
                toggleCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart(): CartContextType {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
