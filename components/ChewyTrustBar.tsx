'use client';

import React from 'react';
import { Truck, RotateCcw, ShieldCheck, HeartHandshake } from 'lucide-react';

export const ChewyTrustBar: React.FC = () => {
    const trustItems = [
        {
            icon: Truck,
            title: 'Free 1-3 Day Express Shipping',
            subtitle: 'On all orders $49+ across the US',
            badge: 'FAST',
            badgeColor: 'bg-emerald-500/10 text-emerald-700',
        },
        {
            icon: RotateCcw,
            title: '365-Day Hassle-Free Returns',
            subtitle: '100% Unconditional satisfaction guarantee',
            badge: 'RISK-FREE',
            badgeColor: 'bg-blue-500/10 text-blue-700',
        },
        {
            icon: ShieldCheck,
            title: 'Autoship & Save 35%',
            subtitle: 'Flexible deliveries for litter & supplies',
            badge: 'SAVE EXTRA',
            badgeColor: 'bg-purple-500/10 text-purple-700',
        },
        {
            icon: HeartHandshake,
            title: '24/7 Pet Care Support',
            subtitle: 'Connect with verified pet care experts anytime',
            badge: '24/7 SUPPORT',
            badgeColor: 'bg-amber-500/10 text-amber-700',
        },
    ];

    return (
        <section className="w-full bg-gradient-to-r from-slate-900 via-primary-950 to-slate-900 text-white py-6 border-y border-slate-800">
            <div className="max-w-7xl mx-auto px-6 lg:px-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {trustItems.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={idx}
                                className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
                            >
                                <div className="p-2.5 rounded-lg bg-primary-600/20 text-primary-400 shrink-0 mt-0.5">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <h4 className="font-semibold text-[14px] text-white tracking-tight">
                                            {item.title}
                                        </h4>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.badgeColor}`}>
                                            {item.badge}
                                        </span>
                                    </div>
                                    <p className="text-[12px] text-slate-300 leading-snug">
                                        {item.subtitle}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ChewyTrustBar;
