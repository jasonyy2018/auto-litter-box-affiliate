'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Package, Truck, ArrowLeft, RefreshCw, ShoppingBag, CheckCircle, ExternalLink, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function AdminOrdersPage() {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<any[]>([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [sourcingLoading, setSourcingLoading] = useState<string | null>(null);

    function getToken() {
        return sessionStorage.getItem('admin-auth') || '';
    }

    const fetchOrders = async () => {
        setLoading(true);
        setErrorMsg('');
        try {
            const res = await fetch('/api/admin/orders', {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            const data = await res.json();
            if (data.success) {
                setOrders(data.data);
            } else {
                setErrorMsg(data.error || 'Failed to fetch orders. Please verify your admin session.');
            }
        } catch (err) {
            setErrorMsg('Failed to connect to order management service.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleUpdateStatus = async (orderId: string, newStatus: string) => {
        setErrorMsg('');
        setSuccessMsg('');
        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: orderId, status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                setSuccessMsg(`Order status updated to ${newStatus} successfully.`);
                fetchOrders();
            } else {
                setErrorMsg(data.error || 'Failed to update order status.');
            }
        } catch {
            setErrorMsg('Failed to connect to order endpoints.');
        }
    };

    const handleTriggerManualSourcing = async (order: any) => {
        setErrorMsg('');
        setSuccessMsg('');
        setSourcingLoading(order.id);

        try {
            // Sourcing POST handler
            const res = await fetch('/api/admin/orders/source', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ orderId: order.id })
            });
            const data = await res.json();
            if (data.success) {
                setSuccessMsg(`Successfully placed CJ Dropshipping Order for ${order.id}. CJ ID: ${data.cjOrderId}`);
                fetchOrders();
            } else {
                setErrorMsg(data.error || 'Failed to source order through CJDropshipping.');
            }
        } catch (err) {
            setErrorMsg('Connection error during manual sourcing operation.');
        } finally {
            setSourcingLoading(null);
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
                            <ShoppingBag className="w-8 h-8 text-primary-600" />
                            Order & Dropshipping Sourcing Panel
                        </h1>
                    </div>
                    <button 
                        onClick={fetchOrders}
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

                {/* Metrics Header */}
                <div className="grid md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-[#E5E4E1] shadow-sm">
                        <p className="text-xs font-bold text-text-muted">Total Sales Orders</p>
                        <p className="text-2xl font-extrabold text-text-primary mt-1">{orders.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-[#E5E4E1] shadow-sm">
                        <p className="text-xs font-bold text-text-muted">Unfulfilled / Processing</p>
                        <p className="text-2xl font-extrabold text-orange-600 mt-1">
                            {orders.filter(o => o.status === 'PAID' || o.status === 'PROCESSING').length}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-[#E5E4E1] shadow-sm">
                        <p className="text-xs font-bold text-text-muted">Sourced on CJDropshipping</p>
                        <p className="text-2xl font-extrabold text-indigo-600 mt-1">
                            {orders.filter(o => o.shippingAddress?.cjOrderId).length}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-[#E5E4E1] shadow-sm">
                        <p className="text-xs font-bold text-text-muted">Completed Deliveries</p>
                        <p className="text-2xl font-extrabold text-green-600 mt-1">
                            {orders.filter(o => o.status === 'DELIVERED').length}
                        </p>
                    </div>
                </div>

                {/* Orders Log */}
                <div className="bg-white rounded-3xl border border-[#E5E4E1] shadow-sm p-8 space-y-6">
                    <h2 className="text-lg font-bold text-text-primary border-b pb-4 flex items-center gap-2">
                        <Truck className="w-5 h-5 text-primary-600" />
                        Full Customer Sales & Fulfillment Logs
                    </h2>

                    {orders.length === 0 ? (
                        <div className="text-center py-16 text-text-muted">
                            <p className="text-sm font-semibold">No sales orders found.</p>
                            <p className="text-xs mt-1">Orders will appear here once customers complete the PayPal checkout flow.</p>
                        </div>
                    ) : (
                        <div className="space-y-6 max-h-[800px] overflow-y-auto pr-2">
                            {orders.map((order) => {
                                const address = order.shippingAddress || {};
                                const cjOrderId = address.cjOrderId;
                                const cjStatus = address.cjStatus || 'Not Sourced';

                                return (
                                    <div key={order.id} className="p-6 rounded-2xl border border-[#E5E4E1] space-y-4 hover:shadow-sm transition-all bg-white relative">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                                            <div>
                                                <p className="font-extrabold text-sm text-text-primary">Order ID: {order.id}</p>
                                                <p className="text-xs text-text-secondary mt-1">
                                                    Customer: <span className="font-bold text-text-primary">{order.user?.name || order.user?.email || 'Guest Buyer'}</span>
                                                </p>
                                                <p className="text-xs text-text-muted">
                                                    Placed: {new Date(order.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span className="text-xs font-semibold text-text-muted">Status:</span>
                                                <select 
                                                    value={order.status}
                                                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                                    className="bg-surface-bg border border-[#E5E4E1] rounded-xl px-3 py-1.5 text-xs font-bold text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-600"
                                                >
                                                    <option value="PENDING">PENDING</option>
                                                    <option value="PAID">PAID</option>
                                                    <option value="PROCESSING">PROCESSING</option>
                                                    <option value="SHIPPED">SHIPPED</option>
                                                    <option value="DELIVERED">DELIVERED</option>
                                                    <option value="CANCELLED">CANCELLED</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Order Items & Shipping Address Details */}
                                        <div className="grid md:grid-cols-2 gap-6 bg-surface-bg/50 p-4 rounded-xl border border-gray-100">
                                            <div>
                                                <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2">Order Products</p>
                                                <div className="space-y-2">
                                                    {order.items?.map((item: any) => (
                                                        <div key={item.id} className="flex justify-between items-center text-xs font-medium">
                                                            <span className="text-text-primary">{item.name || 'Litter Box Product'} x{item.quantity}</span>
                                                            <span className="text-text-secondary font-bold">${item.price.toFixed(2)}</span>
                                                        </div>
                                                    ))}
                                                    <div className="border-t pt-2 flex justify-between font-extrabold text-sm text-text-primary">
                                                        <span>Total Paid Amount:</span>
                                                        <span className="text-primary-600">${order.totalAmount.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2">Shipping Information</p>
                                                <p className="text-xs font-semibold text-text-primary">{address.fullName || 'No details provided'}</p>
                                                <p className="text-xs text-text-secondary mt-1">{address.streetAddress || address.street}</p>
                                                <p className="text-xs text-text-secondary">{address.city}, {address.state} {address.zip}</p>
                                                <p className="text-xs text-text-muted mt-1 font-mono">Tel: {address.phone}</p>
                                            </div>
                                        </div>

                                        {/* Dropshipping/CJ Sourcing status */}
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-2 border-t border-dashed">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
                                                    <Package className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <span className="text-xs font-bold text-text-secondary">CJDropshipping Order: </span>
                                                    {cjOrderId ? (
                                                        <>
                                                            <span className="text-xs font-bold text-indigo-600 font-mono ml-1">{cjOrderId}</span>
                                                            <span className="text-[10px] ml-2 font-bold px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 capitalize">
                                                                {cjStatus}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-xs text-text-muted italic ml-1">Not Sourced Yet</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Sourcing Controls */}
                                            <div className="shrink-0 flex gap-2 w-full md:w-auto justify-end">
                                                {!cjOrderId ? (
                                                    <button 
                                                        onClick={() => handleTriggerManualSourcing(order)}
                                                        disabled={sourcingLoading === order.id}
                                                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                                                    >
                                                        {sourcingLoading === order.id ? (
                                                            <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span>
                                                        ) : (
                                                            <CheckCircle className="w-3.5 h-3.5" />
                                                        )}
                                                        Place CJ Dropship Order
                                                    </button>
                                                ) : (
                                                    <a
                                                        href="https://cjdropshipping.com/myCJ.html#/my-cj-dropshipping/order-list"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="bg-white hover:bg-surface-bg border border-[#E5E4E1] text-text-secondary text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                        Track on CJ Portal
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
