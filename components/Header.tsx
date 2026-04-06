'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Cat, Menu, X, ShoppingBag, User } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useSession, signOut } from 'next-auth/react';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { itemCount, toggleCart } = useCart();
    const { data: session } = useSession();

    const navItems = [
        { label: 'Top Picks', href: '/best' },
        { label: 'Compare', href: '/compare' },
        { label: 'Shop', href: '/shop' },
        { label: 'Guides', href: '/guides/how-to-choose' },
        { label: 'Blog', href: '/blog' },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-[#E5E4E1] shadow-sm font-sans">
            <nav className="max-w-7xl mx-auto px-6 lg:px-20">
                <div className="flex justify-between items-center h-[80px]">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-[10px] group">
                        <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                            <Cat className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-[24px] text-text-primary tracking-tight">
                            Auto<span className="text-primary-600">Litter</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-[32px]">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="text-text-secondary hover:text-primary-600 font-semibold text-[15px] transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Cart & CTA */}
                    <div className="hidden lg:flex items-center gap-4">
                        <button
                            onClick={toggleCart}
                            className="relative p-2.5 text-text-secondary hover:text-primary-600 transition-colors"
                            aria-label="Shopping cart"
                        >
                            <ShoppingBag className="w-6 h-6" />
                            {itemCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce-in">
                                    {itemCount > 99 ? '99+' : itemCount}
                                </span>
                            )}
                        </button>

                        {session ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="p-2.5 text-text-secondary hover:text-primary-600 transition-colors flex items-center gap-2"
                                    aria-label="User menu"
                                >
                                    <User className="w-6 h-6" />
                                    <span className="text-sm font-semibold max-w-[100px] truncate">{session.user?.name || session.user?.email?.split('@')[0]}</span>
                                </button>
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E5E4E1] rounded-xl shadow-lg py-2">
                                        {session.user?.role === 'ADMIN' && (
                                            <Link href="/admin/products" className="block px-4 py-2 text-sm text-text-secondary hover:bg-surface-bg hover:text-primary-600" onClick={() => setIsUserMenuOpen(false)}>
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => signOut()}
                                            className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            Log Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center px-[24px] py-[10px] text-[15px] font-bold rounded-[12px] text-primary-600 bg-white border-2 border-primary-600 hover:bg-primary-50 transition-all active:scale-95 ml-2"
                            >
                                Log In
                            </Link>
                        )}
                        <Link
                            href="/shop"
                            className="inline-flex items-center justify-center px-[24px] py-[12px] text-[15px] font-bold rounded-[12px] text-white bg-primary-600 hover:bg-[#2D6A44] transition-all shadow-md hover:shadow-lg active:scale-95 ml-1"
                        >
                            Visit Shop
                        </Link>
                    </div>

                    {/* Mobile: Cart + Menu */}
                    <div className="lg:hidden flex items-center gap-2">
                        <button
                            onClick={toggleCart}
                            className="relative p-2 text-text-secondary hover:text-primary-600 transition-colors"
                            aria-label="Shopping cart"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {itemCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                    {itemCount > 99 ? '99+' : itemCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-text-secondary hover:text-primary-600 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="lg:hidden py-8 border-t border-gray-100 pb-10">
                        <div className="flex flex-col gap-6">
                            {navItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-text-secondary hover:text-primary-600 font-medium text-lg transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}
                            {session ? (
                                <>
                                    {session.user?.role === 'ADMIN' && (
                                        <Link
                                            href="/admin/products"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="text-text-secondary hover:text-primary-600 font-medium text-lg transition-colors flex items-center gap-2"
                                        >
                                            <User className="w-5 h-5" /> Admin Dashboard
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => signOut()}
                                        className="text-left text-red-600 hover:text-red-700 font-medium text-lg transition-colors"
                                    >
                                        Log Out ({session.user?.name || session.user?.email?.split('@')[0]})
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-text-secondary hover:text-primary-600 font-medium text-lg transition-colors flex items-center gap-2"
                                >
                                    <User className="w-5 h-5" /> Log In / Sign Up
                                </Link>
                            )}
                            <Link
                                href="/shop"
                                onClick={() => setIsMenuOpen(false)}
                                className="mt-4 inline-flex items-center justify-center px-6 py-4 text-base font-bold rounded-xl text-white bg-primary-600 active:scale-95 transition-transform"
                            >
                                Visit Shop
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;
