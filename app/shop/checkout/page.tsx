'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/lib/CartContext';
import { useRouter } from 'next/navigation';
import { Shield, Lock } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

export default function CheckoutPage() {
    const { items, subtotal, clearCart, itemCount } = useCart();
    const router = useRouter();
    const [clientId, setClientId] = useState<string | null>(null);
    const [isClientLoaded, setIsClientLoaded] = useState(false);

    useEffect(() => {
        // Fetch PayPal client config if any
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

    if (!isClientLoaded) return null;
    if (itemCount === 0) return null;

    const shippingCost = 0.0; // Free shipping
    const orderTotal = subtotal + shippingCost;

    return (
        <div className="bg-white min-h-screen pt-12 pb-24">
            <div className="max-w-6xl mx-auto px-6">
                <h1 className="text-3xl font-bold text-text-primary mb-8 border-b pb-4">Secure Checkout</h1>
                
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Order Summary */}
                    <div>
                        <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                        <div className="bg-surface-bg p-6 rounded-2xl border border-[#E5E4E1] mb-6">
                            {items.map((item) => (
                                <div key={`${item.id}-${item.variantId || ''}`} className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-white shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-text-primary">{item.name}</p>
                                            {item.variantName && <p className="text-xs text-text-muted">{item.variantName}</p>}
                                            <p className="text-xs text-text-muted mt-1">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                            <div className="border-t border-[#E5E4E1] mt-6 pt-4 space-y-2">
                                <div className="flex justify-between text-text-secondary">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-text-secondary">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-text-primary mt-4">
                                    <span>Total</span>
                                    <span>${orderTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Section */}
                    <div>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-primary-600" />
                            Payment Method
                        </h2>
                        
                        {!clientId ? (
                            <div className="bg-orange-50 text-orange-800 p-6 rounded-xl border border-orange-200">
                                <p className="font-semibold mb-2">Payment Initializing or Unavailable</p>
                                <p className="text-sm">We are loading the payment providers or none are currently available. Please wait or contact support.</p>
                            </div>
                        ) : (
                            <div className="bg-white p-6 rounded-2xl border border-[#E5E4E1] shadow-sm relative z-0">
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
                                                body: JSON.stringify({ orderID: data.orderID })
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
                        
                        <div className="mt-8 flex items-start gap-4 text-sm text-text-muted bg-surface-bg p-4 rounded-xl">
                            <Shield className="w-8 h-8 text-primary-600 shrink-0" />
                            <p>
                                Payments are securely processed by PayPal. We never store your full payment information on our servers. Your transactions are protected with industry-leading encryption.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
