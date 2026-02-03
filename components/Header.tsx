'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Cat, Menu, X } from 'lucide-react';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { label: 'Top Picks', href: '/best' },
        { label: 'Compare', href: '/compare' },
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

                    {/* CTA */}
                    <div className="hidden lg:block">
                        <Link
                            href="https://www.litter-robot.com"
                            className="inline-flex items-center justify-center px-[24px] py-[12px] text-[15px] font-bold rounded-[12px] text-white bg-primary-600 hover:bg-[#2D6A44] transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                            Shop Litter-Robot
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
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
                            <Link
                                href="https://www.litter-robot.com"
                                className="mt-4 inline-flex items-center justify-center px-6 py-4 text-base font-bold rounded-xl text-white bg-primary-600 active:scale-95 transition-transform"
                            >
                                Shop Litter-Robot
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;
