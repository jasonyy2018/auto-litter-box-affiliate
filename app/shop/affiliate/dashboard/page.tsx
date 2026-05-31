'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Lock, Users, Link as LinkIcon, DollarSign, BarChart3, Clock, CheckCircle, Copy, LogOut, Clipboard } from 'lucide-react';
import Link from 'next/link';

export default function AffiliateDashboard() {
    const [user, setUser] = useState<{ username: string; fullName: string; email: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalClicks: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingCommission: 0,
        approvedCommission: 0,
    });
    const [orders, setOrders] = useState<any[]>([]);
    const [links, setLinks] = useState<any[]>([]);
    
    // Auth inputs
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [authLoading, setAuthLoading] = useState(false);

    // Clipboard copy status
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const checkSession = async () => {
        try {
            const res = await fetch('/api/affiliate/auth');
            const data = await res.json();
            if (data.authenticated) {
                setUser(data.user);
                fetchStats();
            } else {
                setUser(null);
                setLoading(false);
            }
        } catch {
            setUser(null);
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/affiliate/stats');
            const data = await res.json();
            if (data.success) {
                setStats(data.stats);
                setOrders(data.orders);
                setLinks(data.links);
            }
        } catch (err) {
            console.error('Error fetching affiliate stats:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkSession();
    }, []);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError('');
        setAuthLoading(true);
        try {
            const payload = isRegister 
                ? { action: 'register', username, fullName, email, password }
                : { action: 'login', usernameOrEmail: username, password };

            const res = await fetch('/api/affiliate/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                setUser(data.user);
                fetchStats();
            } else {
                setAuthError(data.error || 'Authentication failed');
            }
        } catch (err) {
            setAuthError('An error occurred. Please try again.');
        } finally {
            setAuthLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/affiliate/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'logout' })
            });
            setUser(null);
            setOrders([]);
            setLinks([]);
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    const handleCopy = (url: string, index: number) => {
        navigator.clipboard.writeText(url);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    // Unauthenticated View - Login or Registration Form
    if (!user) {
        return (
            <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center py-12 px-6">
                <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#E5E4E1] shadow-xl relative overflow-hidden">
                    {/* Decorative gradient header */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 to-indigo-600"></div>
                    
                    <div className="text-center mb-8">
                        <Users className="w-12 h-12 text-primary-600 mx-auto mb-3" />
                        <h1 className="text-2xl font-extrabold text-text-primary">
                            {isRegister ? 'Join Affiliate Program' : 'Affiliate Portal'}
                        </h1>
                        <p className="text-text-muted text-sm mt-2">
                            {isRegister ? 'Start promoting and earn 10%+ commission' : 'Log in to track your referrals & earnings'}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-5">
                        {isRegister && (
                            <>
                                <div>
                                    <label className="block text-xs font-semibold text-text-secondary mb-1.5">Full Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={fullName}
                                        onChange={e => setFullName(e.target.value)}
                                        placeholder="Alice Smith"
                                        className="w-full px-4 py-2.5 rounded-xl border border-[#E5E4E1] focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 outline-none text-sm transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-text-secondary mb-1.5">Email Address</label>
                                    <input 
                                        type="email" 
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="alice@example.com"
                                        className="w-full px-4 py-2.5 rounded-xl border border-[#E5E4E1] focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 outline-none text-sm transition-all"
                                    />
                                </div>
                            </>
                        )}
                        <div>
                            <label className="block text-xs font-semibold text-text-secondary mb-1.5">Username</label>
                            <input 
                                type="text" 
                                required
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="alice123"
                                className="w-full px-4 py-2.5 rounded-xl border border-[#E5E4E1] focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 outline-none text-sm transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-text-secondary mb-1.5">Password</label>
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 rounded-xl border border-[#E5E4E1] focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 outline-none text-sm transition-all"
                            />
                        </div>

                        {authError && (
                            <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-200">
                                {authError}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={authLoading}
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                        >
                            {authLoading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : isRegister ? 'Register & Join' : 'Log In'}
                        </button>
                    </form>

                    <div className="text-center mt-6 pt-4 border-t border-[#E5E4E1]">
                        <button 
                            onClick={() => {
                                setIsRegister(!isRegister);
                                setAuthError('');
                            }}
                            className="text-primary-600 hover:text-primary-700 text-xs font-bold transition-all"
                        >
                            {isRegister ? 'Already have an affiliate account? Log in' : "Don't have an account yet? Register here"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Authenticated View - Dashboard Panel
    return (
        <div className="bg-[#FAF9F6] min-h-screen py-12 px-6">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header Profile Section */}
                <div className="bg-white p-6 rounded-3xl border border-[#E5E4E1] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-primary-600 font-bold text-sm">
                            <Shield className="w-4 h-4" />
                            Affiliate Program Active
                        </div>
                        <h1 className="text-2xl font-extrabold text-text-primary mt-1">
                            Welcome Back, {user.fullName}!
                        </h1>
                        <p className="text-text-muted text-xs font-mono mt-0.5">
                            Referral ID: {user.username}
                        </p>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-2 border border-red-200 shrink-0 self-start md:self-center"
                    >
                        <LogOut className="w-4 h-4" />
                        Log Out
                    </button>
                </div>

                {/* Dashboard Key Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    <div className="bg-white p-5 rounded-3xl border border-[#E5E4E1] shadow-sm">
                        <div className="flex justify-between items-start text-text-muted">
                            <span className="text-xs font-bold">Referral Clicks</span>
                            <BarChart3 className="w-4 h-4 text-primary-500" />
                        </div>
                        <p className="text-2xl font-extrabold text-text-primary mt-2">{stats.totalClicks}</p>
                    </div>

                    <div className="bg-white p-5 rounded-3xl border border-[#E5E4E1] shadow-sm">
                        <div className="flex justify-between items-start text-text-muted">
                            <span className="text-xs font-bold">Referred Orders</span>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                        </div>
                        <p className="text-2xl font-extrabold text-text-primary mt-2">{stats.totalOrders}</p>
                    </div>

                    <div className="bg-white p-5 rounded-3xl border border-[#E5E4E1] shadow-sm">
                        <div className="flex justify-between items-start text-text-muted">
                            <span className="text-xs font-bold">Referred Sales</span>
                            <DollarSign className="w-4 h-4 text-indigo-500" />
                        </div>
                        <p className="text-2xl font-extrabold text-text-primary mt-2">${stats.totalRevenue.toFixed(2)}</p>
                    </div>

                    <div className="bg-white p-5 rounded-3xl border border-[#E5E4E1] shadow-sm bg-orange-50/30 border-orange-100">
                        <div className="flex justify-between items-start text-orange-800">
                            <span className="text-xs font-bold">Pending Profit</span>
                            <Clock className="w-4 h-4 text-orange-500 animate-pulse" />
                        </div>
                        <p className="text-2xl font-extrabold text-orange-900 mt-2">${stats.pendingCommission.toFixed(2)}</p>
                    </div>

                    <div className="bg-white p-5 rounded-3xl border border-[#E5E4E1] shadow-sm bg-green-50 border-green-200">
                        <div className="flex justify-between items-start text-green-800">
                            <span className="text-xs font-bold">Approved Earnings</span>
                            <DollarSign className="w-4 h-4 text-green-600" />
                        </div>
                        <p className="text-2xl font-extrabold text-green-900 mt-2">${stats.approvedCommission.toFixed(2)}</p>
                    </div>
                </div>

                {/* Main Body Section */}
                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Generate Referral Links */}
                    <div className="lg:col-span-6 bg-white p-8 rounded-3xl border border-[#E5E4E1] shadow-sm space-y-6">
                        <h2 className="text-lg font-bold text-text-primary border-b pb-4 flex items-center gap-2">
                            <LinkIcon className="w-5 h-5 text-primary-600" />
                            My Distribution/Referral Links
                        </h2>
                        
                        <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
                            {links.map((link, idx) => (
                                <div key={link.id} className="p-4 rounded-2xl border border-[#E5E4E1] space-y-3 bg-surface-bg/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#E5E4E1] shrink-0 bg-white">
                                            <img src={link.image} alt={link.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-xs text-text-primary line-clamp-1">{link.name}</p>
                                            <p className="text-[10px] text-text-muted mt-0.5">Price: ${link.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            readOnly 
                                            value={link.referralUrl}
                                            className="w-full bg-white px-3 py-1.5 rounded-lg border border-[#E5E4E1] text-[10px] font-mono outline-none text-text-secondary select-all"
                                        />
                                        <button 
                                            onClick={() => handleCopy(link.referralUrl, idx)}
                                            className={`px-3 rounded-lg border text-xs font-bold transition-all shrink-0 flex items-center justify-center gap-1 ${
                                                copiedIndex === idx 
                                                    ? 'bg-green-50 border-green-200 text-green-700' 
                                                    : 'bg-white hover:bg-surface-bg border-[#E5E4E1] text-text-secondary'
                                            }`}
                                        >
                                            {copiedIndex === idx ? (
                                                <>
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3.5 h-3.5" />
                                                    Copy
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: referred Orders logs */}
                    <div className="lg:col-span-6 bg-white p-8 rounded-3xl border border-[#E5E4E1] shadow-sm space-y-6">
                        <h2 className="text-lg font-bold text-text-primary border-b pb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-primary-600" />
                            Referral Transaction Records
                        </h2>
                        
                        {orders.length === 0 ? (
                            <div className="text-center py-16 text-text-muted">
                                <Clock className="w-10 h-10 mx-auto mb-3 text-text-muted/40" />
                                <p className="text-sm font-semibold">No referrals yet</p>
                                <p className="text-xs mt-1">Distribute links to record referral sales and earn commission!</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
                                {orders.map((o) => (
                                    <div key={o.orderId} className="p-4 rounded-2xl border border-[#E5E4E1] flex justify-between items-center bg-white shadow-sm hover:shadow transition-all">
                                        <div className="space-y-1">
                                            <p className="font-extrabold text-xs text-text-primary">Order ID: {o.orderId.substring(0, 12)}...</p>
                                            <p className="text-[10px] text-text-muted line-clamp-1">{o.productNames.join(', ')}</p>
                                            <p className="text-[9px] text-text-muted font-mono">{new Date(o.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-extrabold text-sm text-text-primary">${o.subtotal.toFixed(2)}</p>
                                            <p className="text-[10px] text-green-600 font-bold mt-0.5">Comm: +${o.commissionAmount.toFixed(2)}</p>
                                            <span className={`inline-block text-[8px] px-2 py-0.5 rounded-full font-bold mt-1.5 uppercase ${
                                                o.status === 'pending' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                                                o.status === 'approved' || o.status === 'paid' ? 'bg-green-50 text-green-700 border border-green-100' :
                                                'bg-red-50 text-red-700 border border-red-100'
                                            }`}>
                                                {o.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
