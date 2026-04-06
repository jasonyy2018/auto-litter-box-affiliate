import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { User, ShoppingBag, Settings, LogOut } from 'lucide-react';
import LogoutButton from './LogoutButton';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    return (
        <div className="bg-surface-bg min-h-[calc(100vh-80px)]">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E4E1] overflow-hidden">
                            <div className="p-6 border-b border-[#E5E4E1] bg-primary-50/30">
                                <h2 className="font-bold text-lg text-text-primary mb-1">My Account</h2>
                                <p className="text-sm text-text-muted truncate">{session.user?.email}</p>
                            </div>
                            <nav className="p-4 flex flex-col gap-2">
                                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-primary-50 text-primary-600 rounded-xl font-semibold transition-colors">
                                    <ShoppingBag className="w-5 h-5" />
                                    My Orders
                                </Link>
                                <Link href="#" className="flex items-center gap-3 px-4 py-3 text-text-secondary hover:bg-gray-50 hover:text-primary-600 rounded-xl font-medium transition-colors">
                                    <Settings className="w-5 h-5" />
                                    Settings
                                </Link>
                                {session.user?.role === 'ADMIN' && (
                                    <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-text-secondary hover:bg-gray-50 hover:text-primary-600 rounded-xl font-medium transition-colors mt-4 border-t border-gray-100 pt-6">
                                        <User className="w-5 h-5" />
                                        Admin Panel
                                    </Link>
                                )}
                                <LogoutButton />
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
