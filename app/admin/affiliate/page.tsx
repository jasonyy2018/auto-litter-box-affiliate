'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Users, DollarSign, Percent, CheckCircle, XCircle, ArrowLeft, RefreshCw, Truck } from 'lucide-react';
import Link from 'next/link';

export default function AdminAffiliatePage() {
    const [loading, setLoading] = useState(true);
    const [affiliates, setAffiliates] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [productRates, setProductRates] = useState<any[]>([]);
    
    // Commission modification state
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const [editingRate, setEditingRate] = useState('');

    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    function getToken() {
        return sessionStorage.getItem('admin-auth') || '';
    }

    const fetchData = async () => {
        setLoading(true);
        setErrorMsg('');
        try {
            const res = await fetch('/api/admin/affiliate', {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            const data = await res.json();
            if (data.success) {
                setAffiliates(data.data.affiliates);
                setOrders(data.data.referredOrders);
                setProductRates(data.data.productRates);
            } else {
                setErrorMsg(data.error || 'Failed to fetch admin affiliate data. Please verify your admin login status.');
            }
        } catch {
            setErrorMsg('Failed to connect to admin endpoints.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleShipConfirm = async (orderId: string) => {
        if (!confirm('Are you sure you want to ship confirm this order and approve its commission?')) return;
        setErrorMsg('');
        setSuccessMsg('');
        try {
            const res = await fetch('/api/admin/affiliate', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ action: 'ship_confirm', orderId })
            });
            const data = await res.json();
            if (data.success) {
                setSuccessMsg(`Order ${orderId} has been successfully ship confirmed and commission approved.`);
                fetchData();
            } else {
                setErrorMsg(data.error || 'Failed to confirm shipping.');
            }
        } catch {
            setErrorMsg('An error occurred during operation.');
        }
    };

    const handleCancelOrder = async (orderId: string) => {
        if (!confirm('Are you sure you want to cancel this referred order commission?')) return;
        setErrorMsg('');
        setSuccessMsg('');
        try {
            const res = await fetch('/api/admin/affiliate', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ action: 'cancel_order', orderId })
            });
            const data = await res.json();
            if (data.success) {
                setSuccessMsg(`Order ${orderId} commission has been cancelled.`);
                fetchData();
            } else {
                setErrorMsg(data.error || 'Failed to cancel order.');
            }
        } catch {
            setErrorMsg('An error occurred during operation.');
        }
    };

    const handleUpdateRate = async (productId: string) => {
        const parsed = parseFloat(editingRate);
        if (isNaN(parsed) || parsed < 0 || parsed > 100) {
            alert('Please enter a valid percentage between 0 and 100.');
            return;
        }
        setErrorMsg('');
        setSuccessMsg('');
        try {
            const res = await fetch('/api/admin/affiliate', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ action: 'update_rate', productId, rate: parsed / 100 })
            });
            const data = await res.json();
            if (data.success) {
                setSuccessMsg('Commission rate updated successfully.');
                setEditingProductId(null);
                fetchData();
            } else {
                setErrorMsg(data.error || 'Failed to update rate.');
            }
        } catch {
            setErrorMsg('An error occurred during operation.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-[#FAF9F6] min-h-screen py-12 px-6">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-4">
                    <div>
                        <Link href="/admin" className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors text-sm font-semibold mb-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Admin Dashboard
                        </Link>
                        <h1 className="text-3xl font-extrabold text-text-primary flex items-center gap-2">
                            <Percent className="w-8 h-8 text-primary-600" />
                            Affiliate & Commission Manager
                        </h1>
                    </div>
                    <button 
                        onClick={fetchData}
                        className="bg-white hover:bg-surface-bg border border-[#E5E4E1] p-3 rounded-2xl shadow-sm text-text-secondary transition-all"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>

                {/* Notifications */}
                {errorMsg && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-200 text-sm">
                        {errorMsg}
                    </div>
                )}
                {successMsg && (
                    <div className="bg-green-50 text-green-700 p-4 rounded-2xl border border-green-200 text-sm">
                        {successMsg}
                    </div>
                )}

                {/* Dashboard Metrics */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-[#E5E4E1] shadow-sm flex items-center gap-4">
                        <Users className="w-10 h-10 text-primary-600 shrink-0" />
                        <div>
                            <p className="text-xs font-bold text-text-muted">Registered Affiliates</p>
                            <p className="text-2xl font-extrabold text-text-primary mt-1">{affiliates.length}</p>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-3xl border border-[#E5E4E1] shadow-sm flex items-center gap-4">
                        <DollarSign className="w-10 h-10 text-green-600 shrink-0" />
                        <div>
                            <p className="text-xs font-bold text-text-muted">Total Referred Orders</p>
                            <p className="text-2xl font-extrabold text-text-primary mt-1">{orders.length}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-[#E5E4E1] shadow-sm flex items-center gap-4">
                        <Truck className="w-10 h-10 text-indigo-600 shrink-0" />
                        <div>
                            <p className="text-xs font-bold text-text-muted">Pending Ship Confirmations</p>
                            <p className="text-2xl font-extrabold text-text-primary mt-1">
                                {orders.filter(o => o.status === 'pending').length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Referred Orders and Affiliate Tracking */}
                    <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-[#E5E4E1] shadow-sm space-y-6">
                        <h2 className="text-lg font-bold text-text-primary border-b pb-4 flex items-center gap-2">
                            <Truck className="w-5 h-5 text-primary-600" />
                            Distribution Order Tracking & Shippments
                        </h2>
                        
                        {orders.length === 0 ? (
                            <div className="text-center py-12 text-text-muted">
                                <p className="text-sm">No affiliate referrals recorded yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-6 overflow-y-auto max-h-[550px] pr-2">
                                {orders.map((order) => (
                                    <div key={order.orderId} className="p-5 rounded-2xl border border-[#E5E4E1] space-y-4 hover:shadow-sm transition-all bg-white relative">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-extrabold text-sm text-text-primary">Order ID: {order.orderId}</p>
                                                <p className="text-xs text-text-secondary mt-1 font-semibold">
                                                    Promoter: <span className="text-primary-600">@{order.affiliateUsername}</span>
                                                </p>
                                                <p className="text-[10px] text-text-muted font-mono mt-0.5">
                                                    Items: {order.productNames.join(', ')}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-text-muted">{new Date(order.createdAt).toLocaleString()}</p>
                                                <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full font-bold mt-1 uppercase ${
                                                    order.status === 'pending' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                                                    order.status === 'approved' || order.status === 'paid' ? 'bg-green-50 text-green-700 border border-green-100' :
                                                    'bg-red-50 text-red-700 border border-red-100'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="border-t pt-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex gap-6 text-xs font-semibold">
                                                <div>
                                                    <span className="text-text-muted">Sale Subtotal:</span>
                                                    <span className="text-text-primary ml-1.5 font-bold">${order.subtotal.toFixed(2)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-text-muted">Calculated Commission:</span>
                                                    <span className="text-green-600 ml-1.5 font-extrabold">${order.commissionAmount.toFixed(2)}</span>
                                                </div>
                                            </div>

                                            {order.status === 'pending' && (
                                                <div className="flex gap-2 shrink-0">
                                                    <button 
                                                        onClick={() => handleShipConfirm(order.orderId)}
                                                        className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-sm flex items-center gap-1"
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                        Confirm Ship & Approve
                                                    </button>
                                                    <button 
                                                        onClick={() => handleCancelOrder(order.orderId)}
                                                        className="bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-red-200 transition-all flex items-center gap-1"
                                                    >
                                                        <XCircle className="w-3.5 h-3.5" />
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Commission Rates and Affiliates list */}
                    <div className="lg:col-span-4 space-y-8">
                        
                        {/* Commission Rates Configurator */}
                        <div className="bg-white p-6 rounded-3xl border border-[#E5E4E1] shadow-sm space-y-6">
                            <h2 className="text-md font-bold text-text-primary border-b pb-4 flex items-center gap-2">
                                <Percent className="w-4 h-4 text-primary-600" />
                                Product Commission Rates
                            </h2>
                            
                            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                                {productRates.map((prod) => (
                                    <div key={prod.id} className="p-3.5 rounded-xl border border-[#E5E4E1] space-y-2 bg-surface-bg/50">
                                        <p className="font-bold text-xs text-text-primary line-clamp-1">{prod.name}</p>
                                        <p className="text-[10px] text-text-muted">Price: ${prod.price.toFixed(2)} | SKU: {prod.sku}</p>
                                        
                                        <div className="flex items-center justify-between border-t pt-2 mt-2">
                                            {editingProductId === prod.id ? (
                                                <div className="flex gap-2 w-full">
                                                    <div className="relative w-full">
                                                        <input 
                                                            type="text" 
                                                            value={editingRate}
                                                            onChange={e => setEditingRate(e.target.value.replace(/\D/g, ''))}
                                                            placeholder="15" 
                                                            className="w-full bg-white pl-3 pr-6 py-1 rounded-lg border text-xs outline-none font-semibold text-text-primary"
                                                        />
                                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-text-muted">%</span>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleUpdateRate(prod.id)}
                                                        className="bg-primary-600 hover:bg-primary-700 text-white text-[10px] font-bold px-2 py-1 rounded-lg transition-all"
                                                    >
                                                        Save
                                                    </button>
                                                    <button 
                                                        onClick={() => setEditingProductId(null)}
                                                        className="bg-white hover:bg-surface-bg border text-text-secondary text-[10px] font-bold px-2 py-1 rounded-lg transition-all"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="text-[11px] font-semibold text-text-secondary">
                                                        Rate: <span className="text-primary-600 font-extrabold">{(prod.commissionRate * 100).toFixed(0)}%</span>
                                                    </span>
                                                    <button 
                                                        onClick={() => {
                                                            setEditingProductId(prod.id);
                                                            setEditingRate((prod.commissionRate * 100).toFixed(0));
                                                        }}
                                                        className="bg-white hover:bg-surface-bg border border-[#E5E4E1] text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all text-text-secondary"
                                                    >
                                                        Edit Rate
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* List of Registered Affiliates */}
                        <div className="bg-white p-6 rounded-3xl border border-[#E5E4E1] shadow-sm space-y-6">
                            <h2 className="text-md font-bold text-text-primary border-b pb-4 flex items-center gap-2">
                                <Users className="w-4 h-4 text-primary-600" />
                                Registered Affiliates
                            </h2>
                            
                            {affiliates.length === 0 ? (
                                <p className="text-xs text-text-muted text-center py-4">No promoters registered yet.</p>
                            ) : (
                                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                                    {affiliates.map((aff) => (
                                        <div key={aff.username} className="flex justify-between items-center p-3 rounded-xl border border-[#E5E4E1] bg-white">
                                            <div>
                                                <p className="font-bold text-xs text-text-primary">@{aff.username}</p>
                                                <p className="text-[10px] text-text-muted mt-0.5">{aff.fullName} | {aff.email}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-extrabold text-text-secondary">Clicks: {aff.clicks || 0}</p>
                                                <p className="text-[8px] text-text-muted mt-0.5">Joined: {new Date(aff.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
