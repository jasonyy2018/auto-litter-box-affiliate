'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/lib/CartContext';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Truck, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Link from 'next/link';

export default function CheckoutPage() {
    const { items, subtotal, clearCart, itemCount } = useCart();
    const router = useRouter();
    const [clientId, setClientId] = useState<string | null>(null);
    const [isClientLoaded, setIsClientLoaded] = useState(false);

    // Shipping address state
    const [fullName, setFullName] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');

    // Shipping calculation states
    const [shippingCost, setShippingCost] = useState<number | null>(subtotal >= 50 ? 0 : null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [shippingMessage, setShippingMessage] = useState(
        subtotal >= 50 ? 'Free Shipping on orders over $50!' : 'Enter a 5-digit US ZIP code to calculate shipping.'
    );
    const [shippingMethod, setShippingMethod] = useState(subtotal >= 50 ? 'Free Standard Shipping' : '');

    useEffect(() => {
        // Fetch PayPal client config
        fetch('/api/paypal/config')
            .then(res => res.json())
            .then(data => {
                if (data.clientId) {
                    setClientId(data.clientId);
                }
            })
            .catch(err => console.error('Failed to load PayPal config', err));
            
        setIsClientLoaded(true);
    }, []);

    useEffect(() => {
        if (isClientLoaded && itemCount === 0) {
            // Nothing to checkout!
            router.push('/shop');
        }
    }, [isClientLoaded, itemCount, router]);

    // Handle real-time shipping cost fetching
    useEffect(() => {
        if (subtotal >= 50) {
            setShippingCost(0);
            setShippingMessage('Free Shipping on orders over $50!');
            setShippingMethod('Free Standard Shipping');
            return;
        }

        if (zip.length === 5 && /^\d{5}$/.test(zip)) {
            const fetchShippingCost = async () => {
                setIsCalculating(true);
                try {
                    const res = await fetch('/api/cj/shipping', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ zip, items })
                    });
                    const data = await res.json();
                    if (data.shippingCost !== undefined) {
                        setShippingCost(data.shippingCost);
                        setShippingMessage(data.message || 'Calculated shipping cost');
                        setShippingMethod(data.method || 'Standard Shipping');
                    } else {
                        setShippingCost(9.95);
                        setShippingMessage('Failed to calculate. Using Standard rate.');
                        setShippingMethod('Standard Shipping');
                    }
                } catch (err) {
                    console.error('Error fetching shipping cost:', err);
                    setShippingCost(9.95);
                    setShippingMessage('Standard Shipping');
                } finally {
                    setIsCalculating(false);
                }
            };
            fetchShippingCost();
        } else {
            setShippingCost(null);
            setShippingMessage('Please enter a 5-digit US ZIP code to calculate shipping.');
            setShippingMethod('');
        }
    }, [zip, subtotal, items]);

    if (!isClientLoaded) return null;
    if (itemCount === 0) return null;

    const finalShippingCost = shippingCost !== null ? shippingCost : 0;
    const orderTotal = subtotal + finalShippingCost;

    // Check if the address form is completely filled and shipping is calculated
    const isAddressValid = 
        fullName.trim() !== '' && 
        streetAddress.trim() !== '' && 
        city.trim() !== '' && 
        state.trim() !== '' && 
        /^\d{5}$/.test(zip);

    const canPay = isAddressValid && shippingCost !== null;

    return (
        <div className="bg-[#FAF9F6] min-h-screen pt-12 pb-24">
            <div className="max-w-6xl mx-auto px-6">
                <div className="mb-8 flex items-center justify-between">
                    <Link href="/shop" className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Shop
                    </Link>
                    <h1 className="text-3xl font-extrabold text-text-primary flex items-center gap-2">
                        <Shield className="w-8 h-8 text-primary-600" />
                        Secure Checkout
                    </h1>
                </div>
                
                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Left Column: Address Form */}
                    <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-[#E5E4E1] shadow-sm">
                        <h2 className="text-2xl font-bold mb-6 text-text-primary flex items-center gap-2 border-b pb-4">
                            <Truck className="w-6 h-6 text-primary-600" />
                            1. Shipping Details
                        </h2>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-text-secondary mb-2">Full Name</label>
                                <input 
                                    type="text" 
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="John Doe" 
                                    className="w-full px-4 py-3 rounded-xl border border-[#E5E4E1] focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-text-secondary mb-2">Street Address</label>
                                <input 
                                    type="text" 
                                    value={streetAddress}
                                    onChange={(e) => setStreetAddress(e.target.value)}
                                    placeholder="123 Main St, Apt 4B" 
                                    className="w-full px-4 py-3 rounded-xl border border-[#E5E4E1] focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-text-secondary mb-2">City</label>
                                    <input 
                                        type="text" 
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder="Los Angeles" 
                                        className="w-full px-4 py-3 rounded-xl border border-[#E5E4E1] focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-text-secondary mb-2">State</label>
                                    <input 
                                        type="text" 
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                        placeholder="CA" 
                                        className="w-full px-4 py-3 rounded-xl border border-[#E5E4E1] focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-text-secondary mb-2">
                                    US ZIP Code
                                    {subtotal < 50 && (
                                        <span className="text-xs text-primary-600 font-normal ml-2">
                                            (Required for live shipping cost calculation)
                                        </span>
                                    )}
                                </label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        maxLength={5}
                                        value={zip}
                                        onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))}
                                        placeholder="90001" 
                                        className="w-full px-4 py-3 rounded-xl border border-[#E5E4E1] focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-mono tracking-wider"
                                    />
                                    {isCalculating && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary & Pay */}
                    <div className="lg:col-span-5 space-y-8">
                        
                        {/* Order Summary */}
                        <div className="bg-white p-8 rounded-3xl border border-[#E5E4E1] shadow-sm">
                            <h2 className="text-xl font-bold mb-6 text-text-primary border-b pb-4">Order Summary</h2>
                            <div className="space-y-4 max-h-48 overflow-y-auto pr-2 mb-6">
                                {items.map((item) => (
                                    <div key={`${item.id}-${item.variantId || ''}`} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-white shrink-0 border border-[#E5E4E1]">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-text-primary line-clamp-1">{item.name}</p>
                                                {item.variantName && <p className="text-[10px] text-text-muted">{item.variantName}</p>}
                                                <p className="text-[10px] text-text-muted">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="border-t border-[#E5E4E1] pt-4 space-y-3">
                                <div className="flex justify-between text-text-secondary text-sm">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-text-secondary text-sm items-center">
                                    <span>Shipping</span>
                                    {shippingCost === null ? (
                                        <span className="text-primary-600 text-xs flex items-center gap-1 font-medium">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            Pending ZIP code
                                        </span>
                                    ) : (
                                        <span className={shippingCost === 0 ? "text-green-600 font-bold" : "text-text-primary font-medium"}>
                                            {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                                        </span>
                                    )}
                                </div>
                                
                                {/* Shipping details card inside summary */}
                                <div className={`text-xs p-3 rounded-xl transition-all duration-300 ${
                                    shippingCost === null ? 'bg-orange-50 text-orange-800 border border-orange-100' : 'bg-green-50 text-green-800 border border-green-100'
                                }`}>
                                    {shippingCost === null ? (
                                        <p className="flex items-start gap-2">
                                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                            <span>{shippingMessage}</span>
                                        </p>
                                    ) : (
                                        <p className="flex items-start gap-2 font-medium">
                                            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-green-600" />
                                            <span>
                                                {shippingMessage} {shippingMethod && `(${shippingMethod})`}
                                            </span>
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-between text-lg font-bold text-text-primary mt-4 pt-4 border-t border-[#E5E4E1]">
                                    <span>Total</span>
                                    <span>${orderTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="bg-white p-8 rounded-3xl border border-[#E5E4E1] shadow-sm">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b pb-4">
                                <Lock className="w-5 h-5 text-primary-600" />
                                2. Payment Method
                            </h2>
                            
                            {!canPay ? (
                                <div className="bg-orange-50 text-orange-800 p-6 rounded-2xl border border-orange-200 text-sm">
                                    <p className="font-bold mb-2 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        Address Required
                                    </p>
                                    <p className="leading-relaxed">
                                        Please complete the Shipping Details form on the left. Specifically, enter a valid 5-digit US ZIP code to unlock payment options.
                                    </p>
                                </div>
                            ) : !clientId ? (
                                <div className="bg-orange-50 text-orange-800 p-6 rounded-2xl border border-orange-200">
                                    <p className="font-semibold mb-2">Payment Initializing...</p>
                                    <p className="text-sm">We are loading the payment providers. Please wait.</p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl relative z-0">
                                    <PayPalScriptProvider options={{ "clientId": clientId, currency: "USD" }}>
                                        <PayPalButtons
                                            createOrder={async () => {
                                                const res = await fetch('/api/paypal/create-order', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({
                                                        amount: orderTotal.toString(),
                                                        items: items.map(i => ({
                                                            name: i.name,
                                                            quantity: i.quantity,
                                                            price: i.price.toString()
                                                        }))
                                                    })
                                                });
                                                const orderData = await res.json();
                                                if (orderData.orderID) {
                                                    return orderData.orderID;
                                                } else {
                                                    throw new Error(orderData.error || 'Failed to create PayPal order');
                                                }
                                            }}
                                            onApprove={async (data: any, actions: any) => {
                                                const res = await fetch('/api/paypal/capture-order', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ 
                                                        orderID: data.orderID,
                                                        shippingAddress: {
                                                            fullName,
                                                            streetAddress,
                                                            city,
                                                            state,
                                                            zip
                                                        },
                                                        referredBy: localStorage.getItem('referred_by') || undefined,
                                                        items: items.map(i => ({
                                                            productId: i.id,
                                                            price: i.price,
                                                            quantity: i.quantity,
                                                            name: i.name
                                                        })),
                                                        subtotal: subtotal
                                                    })
                                                });
                                                const captureData = await res.json();
                                                if (captureData.success) {
                                                    clearCart();
                                                    router.push('/shop/order-success?orderId=' + data.orderID);
                                                } else {
                                                    alert('Payment failed: ' + captureData.error);
                                                }
                                            }}
                                            onError={(err) => {
                                                console.error("PayPal Checkout Error:", err);
                                            }}
                                            style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
                                        />
                                    </PayPalScriptProvider>
                                </div>
                            )}

                            <div className="mt-6 flex items-start gap-3 text-xs text-text-muted">
                                <Shield className="w-5 h-5 text-primary-600 shrink-0" />
                                <p>
                                    Payments are securely processed. Your delivery address will be safely passed to CJDropshipping to prepare shipment.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

