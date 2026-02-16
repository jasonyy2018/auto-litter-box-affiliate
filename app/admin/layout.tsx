'use client';

import React, { useState, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Settings, LogOut, Cat, ChevronRight } from 'lucide-react';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [isAuthed, setIsAuthed] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const pathname = usePathname();

    useEffect(() => {
        const stored = sessionStorage.getItem('admin-auth');
        if (stored) setIsAuthed(true);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Verify password by making an authenticated request
        try {
            const res = await fetch('/api/admin/products', {
                headers: { 'Authorization': `Bearer ${password}` },
            });
            if (res.ok) {
                sessionStorage.setItem('admin-auth', password);
                setIsAuthed(true);
            } else {
                setError('Invalid password');
            }
        } catch {
            setError('Connection error');
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('admin-auth');
        setIsAuthed(false);
        setPassword('');
    };

    if (!isAuthed) {
        return (
            <div className="min-h-screen bg-surface-bg flex items-center justify-center p-6">
                <div className="bg-white rounded-[32px] p-10 w-full max-w-md shadow-xl border border-[#E5E4E1]">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Cat className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-text-primary">Admin Dashboard</h1>
                        <p className="text-text-muted mt-1">Enter your password to continue</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Admin password"
                            className="w-full px-5 py-4 bg-surface-bg rounded-xl text-text-primary font-medium focus:outline-none focus:ring-2 focus:ring-primary-600/30 transition-all"
                            autoFocus
                        />
                        {error && (
                            <p className="text-red-500 text-sm font-medium">{error}</p>
                        )}
                        <button
                            type="submit"
                            className="w-full py-4 bg-primary-600 hover:bg-[#2D6A44] text-white font-bold rounded-xl transition-colors shadow-lg"
                        >
                            Log In
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const navItems = [
        { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
        { label: 'Products', href: '/admin/products', icon: <Package className="w-5 h-5" /> },
        { label: 'Pinterest', href: '/admin/pinterest', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" /></svg> },
    ];

    return (
        <div className="min-h-screen bg-surface-bg flex">
            {/* Sidebar */}
            <aside className="w-[280px] bg-white border-r border-[#E5E4E1] flex flex-col fixed h-full z-30">
                <div className="p-6 border-b border-[#E5E4E1]">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                            <Cat className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-text-primary text-lg">Admin</span>
                            <p className="text-[11px] text-text-muted font-medium">AutoLitter Shop</p>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map(item => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${isActive
                                    ? 'bg-primary-600 text-white shadow-md'
                                    : 'text-text-secondary hover:bg-surface-bg hover:text-text-primary'
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-[#E5E4E1]">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-text-muted hover:text-red-500 font-semibold text-sm rounded-xl hover:bg-red-50 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-[280px] p-8">
                {children}
            </main>
        </div>
    );
}
