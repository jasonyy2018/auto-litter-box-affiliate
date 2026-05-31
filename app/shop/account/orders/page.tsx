'use client';

import React, { useState, useEffect } from 'react';
import { Package, Truck, Calendar, ShoppingBag, ChevronRight, Clipboard, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function CustomerOrdersPage() {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [copiedTracking, setCopiedTracking] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/shop/account/orders');
            const data = await res.json();
            if (data.success) {
                setOrders(data.data);
                if (data.data.length > 0) {
                    setSelectedOrder(data.data[0]);
                }
            }
        } catch (err) {
            console.error('Failed to load orders:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedTracking(true);
        setTimeout(() => setCopiedTracking(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    // Mapping live CJ status to numeric steps
    const getActiveStep = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'delivered') return 4;
        if (s === 'shipped') return 3;
        if (s === 'processing') return 2;
        return 1; // paid / pending
    };

    return (
        <div className="bg-[#FAF9F6] min-h-[calc(100vh-80px)] py-12 px-6 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E5E4E1] pb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-text-primary flex items-center gap-2.5">
                            <ShoppingBag className="w-8 h-8 text-primary-600" />
                            My Order History
                        </h1>
                        <p className="text-text-secondary text-sm mt-1">Track your smart litter box purchases and real-time shipping progress.</p>
                    </div>
                    <Link href="/shop" className="px-6 py-3 bg-white hover:bg-surface-bg border border-[#E5E4E1] text-text-secondary font-bold text-sm rounded-xl transition-all shadow-sm">
                        Continue Shopping
                    </Link>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-[#E5E4E1] p-16 text-center shadow-sm max-w-xl mx-auto space-y-6">
                        <div className="w-20 h-20 bg-surface-bg rounded-full flex items-center justify-center mx-auto text-[#D1D0CD]">
                            <Package className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-text-primary">No orders placed yet</h3>
                            <p className="text-text-secondary text-sm max-w-sm mx-auto">When you purchase self-cleaning litter boxes or filters, they will appear here with live tracking maps.</p>
                        </div>
                        <Link href="/shop" className="inline-block px-8 py-3.5 bg-primary-600 hover:bg-[#2D6A44] text-white font-bold rounded-xl transition-all shadow-lg">
                            Go to Shop
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-12 gap-8 items-start">
                        
                        {/* Left Side: Orders List (5 columns) */}
                        <div className="lg:col-span-5 space-y-4">
                            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider pl-1">All Purchases</h3>
                            <div className="space-y-4 max-h-[650px] overflow-y-auto pr-2">
                                {orders.map((order) => {
                                    const isSelected = selectedOrder?.id === order.id;
                                    const activeStep = getActiveStep(order.tracking?.status || order.status);

                                    return (
                                        <button
                                            key={order.id}
                                            onClick={() => setSelectedOrder(order)}
                                            className={`w-full text-left p-5 rounded-2xl border transition-all relative flex flex-col gap-3 group ${
                                                isSelected 
                                                    ? 'bg-white border-primary-500 shadow-md ring-1 ring-primary-500' 
                                                    : 'bg-white border-[#E5E4E1] hover:border-primary-300 hover:shadow-sm'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start w-full">
                                                <div>
                                                    <p className="font-extrabold text-sm text-text-primary group-hover:text-primary-600 transition-colors">
                                                        Order #{order.id.substring(0, 10)}...
                                                    </p>
                                                    <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5 font-semibold">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                                                    activeStep === 4 ? 'bg-green-50 text-green-700 border border-green-100' :
                                                    activeStep === 3 ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                                    'bg-orange-50 text-orange-700 border border-orange-100'
                                                }`}>
                                                    {order.tracking?.status || order.status}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2.5 bg-surface-bg/50 px-3 py-2 rounded-xl border border-gray-50/50">
                                                <div className="w-10 h-10 bg-white rounded-lg border border-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                                                    {order.items?.[0]?.image ? (
                                                        <img src={order.items[0].image} alt={order.items[0].name} className="w-full h-full object-contain p-1" />
                                                    ) : (
                                                        <Package className="w-5 h-5 text-text-secondary" />
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs font-bold text-text-primary truncate">{order.items?.[0]?.name || 'Smart Cat Litter Box'}</p>
                                                    <p className="text-[10px] text-text-secondary mt-0.5">
                                                        {order.items?.length > 1 ? `and ${order.items.length - 1} other items` : `Qty: ${order.items?.[0]?.quantity || 1}`}
                                                    </p>
                                                </div>
                                                <span className="text-xs font-extrabold text-primary-600 shrink-0">${order.totalAmount.toFixed(2)}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Side: Tracking Details & Live Progress (7 columns) */}
                        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-[#E5E4E1] shadow-sm space-y-8">
                            {selectedOrder && (() => {
                                const activeStep = getActiveStep(selectedOrder.tracking?.status || selectedOrder.status);
                                const trackingNum = selectedOrder.tracking?.trackingNumber;
                                const carrierName = selectedOrder.tracking?.carrier || 'USPS Sourcing';
                                const logs = selectedOrder.tracking?.trackingLogs || [];

                                return (
                                    <>
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-4">
                                            <div>
                                                <span className="text-[10px] font-bold uppercase text-primary-600 tracking-wider">Currently Tracking</span>
                                                <h2 className="text-lg font-extrabold text-text-primary mt-0.5">Order ID: {selectedOrder.id}</h2>
                                            </div>
                                            <div className="text-left sm:text-right">
                                                <p className="text-xs text-text-muted">Payment amount captured</p>
                                                <p className="text-md font-extrabold text-primary-600">${selectedOrder.totalAmount.toFixed(2)}</p>
                                            </div>
                                        </div>

                                        {/* Premium Progress Steps Timeline */}
                                        <div className="py-4">
                                            <div className="relative flex justify-between items-center w-full max-w-xl mx-auto">
                                                {/* Background line */}
                                                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[3px] bg-gray-100 z-0"></div>
                                                {/* Active highlighted line */}
                                                <div 
                                                    className="absolute left-0 top-1/2 -translate-y-1/2 h-[3px] bg-primary-600 transition-all duration-700 z-0"
                                                    style={{ width: `${((activeStep - 1) / 3) * 100}%` }}
                                                ></div>

                                                {/* Step 1: Paid */}
                                                <div className="flex flex-col items-center z-10 relative">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold text-xs transition-colors ${
                                                        activeStep >= 1 ? 'bg-primary-600 border-primary-600 text-white shadow-md' : 'bg-white border-gray-200 text-text-muted'
                                                    }`}>
                                                        {activeStep > 1 ? <CheckCircle2 className="w-5 h-5" /> : '1'}
                                                    </div>
                                                    <span className="text-[10px] font-bold text-text-primary mt-2">Paid</span>
                                                </div>

                                                {/* Step 2: Sourcing */}
                                                <div className="flex flex-col items-center z-10 relative">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold text-xs transition-colors ${
                                                        activeStep >= 2 ? 'bg-primary-600 border-primary-600 text-white shadow-md' : 'bg-white border-gray-200 text-text-muted'
                                                    }`}>
                                                        {activeStep > 2 ? <CheckCircle2 className="w-5 h-5" /> : '2'}
                                                    </div>
                                                    <span className="text-[10px] font-bold text-text-primary mt-2">Processing</span>
                                                </div>

                                                {/* Step 3: Shipped */}
                                                <div className="flex flex-col items-center z-10 relative">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold text-xs transition-colors ${
                                                        activeStep >= 3 ? 'bg-primary-600 border-primary-600 text-white shadow-md' : 'bg-white border-gray-200 text-text-muted'
                                                    }`}>
                                                        {activeStep > 3 ? <CheckCircle2 className="w-5 h-5" /> : '3'}
                                                    </div>
                                                    <span className="text-[10px] font-bold text-text-primary mt-2">Shipped</span>
                                                </div>

                                                {/* Step 4: Delivered */}
                                                <div className="flex flex-col items-center z-10 relative">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold text-xs transition-colors ${
                                                        activeStep >= 4 ? 'bg-primary-600 border-primary-600 text-white shadow-md' : 'bg-white border-gray-200 text-text-muted'
                                                    }`}>
                                                        '4'
                                                    </div>
                                                    <span className="text-[10px] font-bold text-text-primary mt-2">Delivered</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Shipment Tracking Number & Info Box */}
                                        {trackingNum ? (
                                            <div className="bg-surface-bg/50 p-5 rounded-2xl border border-[#E5E4E1] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-text-muted">USPS / DHL Tracking Code</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-sm font-extrabold text-text-primary">{trackingNum}</span>
                                                        <button 
                                                            onClick={() => copyToClipboard(trackingNum)}
                                                            className="text-text-muted hover:text-primary-600 p-1.5 rounded-lg hover:bg-white border border-transparent hover:border-[#E5E4E1] transition-all"
                                                        >
                                                            {copiedTracking ? (
                                                                <span className="text-[10px] font-bold text-green-600">Copied!</span>
                                                            ) : (
                                                                <Clipboard className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                    <p className="text-[10px] font-semibold text-text-muted">Carrier Partner: <span className="text-text-secondary">{carrierName}</span></p>
                                                </div>
                                                <a 
                                                    href={`https://www.17track.net/en/track?nums=${trackingNum}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full sm:w-auto px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm text-center"
                                                >
                                                    Track on 17Track Portal
                                                </a>
                                            </div>
                                        ) : (
                                            <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100 flex items-start gap-3">
                                                <Clock className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                                                <div>
                                                    <h4 className="text-xs font-bold text-orange-800">Your order is being sourced from dropship hub</h4>
                                                    <p className="text-[11px] text-orange-700 mt-1">We have locked your stocks in CJDropshipping. Once the shipping label is generated, tracking number and live updates will appear here.</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Live logs timeline */}
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider pl-1">Live Shipment Updates</h4>
                                            
                                            {logs.length === 0 ? (
                                                <div className="p-8 text-center bg-surface-bg/30 rounded-2xl border border-dashed border-[#E5E4E1] text-text-muted">
                                                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-[#D1D0CD]" />
                                                    <p className="text-xs">No parcel scans recorded yet.</p>
                                                    <p className="text-[10px] mt-0.5">Live transit updates will refresh here within 24-48 hours of dispatch.</p>
                                                </div>
                                            ) : (
                                                <div className="border-l-2 border-gray-100 ml-3.5 pl-6 space-y-6 max-h-[300px] overflow-y-auto pr-1">
                                                    {logs.map((log: any, li: number) => (
                                                        <div key={li} className="relative">
                                                            {/* Circle badge */}
                                                            <div className={`absolute -left-[31px] w-3 h-3 rounded-full border-2 ${
                                                                li === 0 ? 'bg-primary-600 border-primary-600' : 'bg-white border-gray-300'
                                                            }`}></div>
                                                            <p className={`text-xs font-bold ${li === 0 ? 'text-primary-600' : 'text-text-primary'}`}>{log.event}</p>
                                                            <p className="text-[10px] text-text-muted mt-0.5">{log.time}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                );
                            })()}
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}
