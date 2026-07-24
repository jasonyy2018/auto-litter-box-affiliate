'use client';

import React from 'react';
import { Smartphone, ShieldAlert, Wind, VolumeX, Sparkles, RefreshCw, Award } from 'lucide-react';

export const ProductHighlightsGrid: React.FC = () => {
    const highlights = [
        {
            icon: ShieldAlert,
            title: 'Multi-Sensor Anti-Pinch Safety',
            desc: 'Infrared & weight sensors immediately stop rotation if your cat approaches during a cycle.',
            tag: 'VET APPROVED',
            tagColor: 'bg-emerald-100 text-emerald-800',
        },
        {
            icon: Wind,
            title: 'Triple-Action Odor Elimination',
            desc: 'Sealed waste trap with activated carbon filters and ionic air purifier locks 99.2% of odor.',
            tag: 'ODOR LOCK',
            tagColor: 'bg-blue-100 text-blue-800',
        },
        {
            icon: Smartphone,
            title: 'Smart Wi-Fi App & Health Logs',
            desc: 'Monitor your cat’s bathroom frequency, duration, weight trends, and litter level status anytime.',
            tag: 'SMART APP',
            tagColor: 'bg-purple-100 text-purple-800',
        },
        {
            icon: VolumeX,
            title: 'Whisper-Quiet < 35dB Engine',
            desc: 'Ultra-silent gear mechanism operates quietly in the background without scaring sensitive cats.',
            tag: 'SILENT MOTOR',
            tagColor: 'bg-amber-100 text-amber-800',
        },
        {
            icon: Sparkles,
            title: '15-Day Hands-Free Capacity',
            desc: 'Generous 10.5L waste compartment allows single cat owners up to 15 days of zero scooping.',
            tag: 'HANDS-FREE',
            tagColor: 'bg-emerald-100 text-emerald-800',
        },
        {
            icon: RefreshCw,
            title: '10-Second Quick Disassembly',
            desc: 'Modular drum design detaches effortlessly without tools for quick water rinsing and cleaning.',
            tag: 'EASY CLEAN',
            tagColor: 'bg-[#E5E4E1] text-text-primary',
        },
    ];

    return (
        <section className="my-12 py-10 px-6 lg:px-10 bg-white rounded-3xl border border-[#E5E4E1] shadow-sm">
            <div className="flex items-center gap-2 mb-2">
                <span className="p-2 bg-primary-100 text-primary-700 rounded-xl">
                    <Award className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-primary-600">ALitter Quality Standards</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-text-primary tracking-tight mb-8">
                Why Pet Parents Love Our Smart Litter Boxes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {highlights.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={idx}
                            className="p-6 rounded-2xl bg-surface-primary border border-[#E5E4E1] hover:border-primary-300 hover:shadow-md transition-all duration-200"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white text-primary-600 rounded-2xl shadow-sm border border-[#E5E4E1]">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${item.tagColor}`}>
                                    {item.tag}
                                </span>
                            </div>
                            <h3 className="font-bold text-base text-text-primary mb-2">
                                {item.title}
                            </h3>
                            <p className="text-xs text-text-secondary leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default ProductHighlightsGrid;
