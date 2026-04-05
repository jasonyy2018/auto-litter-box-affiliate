'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Suspense } from 'react';

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    return (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-[#E5E4E1] max-w-lg w-full text-center">
            <CheckCircle className="w-20 h-20 text-primary-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-text-primary mb-4">Payment Successful!</h1>
            <p className="text-text-secondary leading-relaxed mb-8">
                Thank you for your order. We are processing it and will send a confirmation email with your shipping details shortly.
            </p>
            {orderId && (
                <div className="bg-surface-bg p-4 rounded-xl mb-8">
                    <p className="text-sm font-bold text-text-primary">Order Reference ID</p>
                    <p className="text-lg font-mono text-text-muted mt-1">{orderId}</p>
                </div>
            )}
            <Link
                href="/shop"
                className="inline-block w-full py-4 bg-primary-600 hover:bg-[#2D6A44] text-white font-bold text-lg rounded-xl transition-all shadow-lg"
            >
                Continue Shopping
            </Link>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <div className="min-h-screen bg-surface-bg flex items-center justify-center p-6 pt-24 pb-24">
            <Suspense fallback={<div className="animate-pulse w-20 h-20 bg-gray-200 rounded-full"></div>}>
                <OrderSuccessContent />
            </Suspense>
        </div>
    );
}
