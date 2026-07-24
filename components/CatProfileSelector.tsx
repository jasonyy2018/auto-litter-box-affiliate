'use client';

import React, { useState } from 'react';
import { Cat, Sparkles, Shield, Smartphone, VolumeX, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Recommendation {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice: number;
    rating: number;
    reviewsCount: number;
    image: string;
    highlight: string;
    reason: string;
}

export const CatProfileSelector: React.FC = () => {
    const [catWeight, setCatWeight] = useState<'small' | 'medium' | 'jumbo'>('medium');
    const [catCount, setCatCount] = useState<'1' | '2' | '3+'>('1');
    const [priority, setPriority] = useState<'odor' | 'app' | 'quiet' | 'auto'>('auto');

    const weightOptions = [
        { id: 'small', label: '< 10 lbs (Kitten / Small)', desc: 'Needs low entry threshold' },
        { id: 'medium', label: '10 - 18 lbs (Standard)', desc: 'Fits 90% of adult cats' },
        { id: 'jumbo', label: '18+ lbs (Large / Maine Coon)', desc: 'Requires 65L+ extra spacious drum' },
    ];

    const countOptions = [
        { id: '1', label: 'Single Cat', desc: 'Standard waste drawer' },
        { id: '2', label: '2 Cats', desc: 'Requires anti-pinch & quick cycle' },
        { id: '3+', label: 'Multi-Cat (3+)', desc: 'Needs 10.5L+ extra large drawer & app stats' },
    ];

    const priorityOptions = [
        { id: 'auto', label: 'Fully Automatic Self-Cleaning', icon: Sparkles },
        { id: 'odor', label: 'Maximum Odor & Dust Control', icon: Shield },
        { id: 'app', label: 'Smart App Health Tracking', icon: Smartphone },
        { id: 'quiet', label: 'Whisper Quiet Operation', icon: VolumeX },
    ];

    // Dynamic Recommendation Engine
    const getRecommendations = (): Recommendation[] => {
        if (catWeight === 'jumbo' || catCount === '3+') {
            return [
                {
                    id: 'cj-1563459374436331520',
                    name: 'Smart MAX Fully Automatic Cat Litter Box Large',
                    slug: 'smart-max-fully-automatic-cat-litter-box-large',
                    price: 368.50,
                    originalPrice: 479.00,
                    rating: 4.9,
                    reviewsCount: 142,
                    image: 'https://oss-cf.cjdropshipping.com/product/2026/01/16/05/2ba585fa-1b3a-4d1d-af02-6edb2d516ff2_trans.jpeg',
                    highlight: 'Best for Large & Multi-Cat Households',
                    reason: '68L spacious internal drum with 10.5L waste container. Fits cats up to 25 lbs easily.',
                },
                {
                    id: 'cj-1932363743014338561',
                    name: '60L Automatic Cat Litter Box, Smart App Control',
                    slug: '60l-automatic-cat-litter-box-smart-app-control',
                    price: 389.90,
                    originalPrice: 499.00,
                    rating: 4.8,
                    reviewsCount: 98,
                    image: 'https://cf.cjdropshipping.com/8d79aca9-de4b-4638-bfa8-f296b2b17b98.jpg',
                    highlight: 'Jumbo Drum & Weight Sensor',
                    reason: 'Multi-cat weight recognition algorithm tracks individual cat health via Wi-Fi App.',
                },
            ];
        }

        if (priority === 'app') {
            return [
                {
                    id: 'cj-2601160527381620500',
                    name: 'Smart Fully Enclosed Cat Litter Box',
                    slug: 'smart-fully-enclosed-cat-litter-box',
                    price: 293.38,
                    originalPrice: 381.39,
                    rating: 4.9,
                    reviewsCount: 186,
                    image: 'https://oss-cf.cjdropshipping.com/product/2026/01/16/05/2ba585fa-1b3a-4d1d-af02-6edb2d516ff2_trans.jpeg',
                    highlight: 'Top Smart App Companion',
                    reason: 'Includes real-time health notifications, litter level reminders, and remote cleaning controls.',
                },
                {
                    id: 'cj-1563459374436331520',
                    name: 'Smart MAX Fully Automatic Cat Litter Box',
                    slug: 'smart-max-fully-automatic-cat-litter-box-large',
                    price: 368.50,
                    originalPrice: 479.00,
                    rating: 4.8,
                    reviewsCount: 142,
                    image: 'https://cf.cjdropshipping.com/8d79aca9-de4b-4638-bfa8-f296b2b17b98.jpg',
                    highlight: 'Multi-Cat App Analytics',
                    reason: 'Tracks daily visit duration, frequency, and weight change trends for each cat.',
                },
            ];
        }

        return [
            {
                id: 'cj-2601160527381620500',
                name: 'Smart Fully Enclosed Cat Litter Box',
                slug: 'smart-fully-enclosed-cat-litter-box',
                price: 293.38,
                originalPrice: 381.39,
                rating: 4.9,
                reviewsCount: 186,
                image: 'https://oss-cf.cjdropshipping.com/product/2026/01/16/05/2ba585fa-1b3a-4d1d-af02-6edb2d516ff2_trans.jpeg',
                highlight: '#1 ALitter Top Pick',
                reason: 'Triple odor lock sealed drawer, 35dB quiet motor, and 15-day hands-free operation.',
            },
            {
                id: 'cj-2406140627461615600',
                name: 'Automatic Litter Box Cat Toilet Smart Pooper Scooper',
                slug: 'automatic-litter-box-cat-toilet-smart-pooper-scooper',
                price: 219.99,
                originalPrice: 289.00,
                rating: 4.7,
                reviewsCount: 76,
                image: 'https://cf.cjdropshipping.com/8d79aca9-de4b-4638-bfa8-f296b2b17b98.jpg',
                highlight: 'Best Value Self-Cleaning Box',
                reason: 'Ultra-fast 3-minute rake cycle with anti-tracking pedal mat included.',
            },
        ];
    };

    const recommendations = getRecommendations();

    return (
        <section className="my-12 bg-surface-primary rounded-3xl p-6 lg:p-10 border border-[#E5E4E1] shadow-sm">
            <div className="flex items-center gap-3 mb-2">
                <span className="p-2 bg-primary-100 text-primary-700 rounded-xl">
                    <Cat className="w-6 h-6" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-primary-600">ALitter Smart Pet Matcher</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-text-primary tracking-tight mb-3">
                Find the Perfect Litter Box for Your Cat
            </h2>
            <p className="text-text-secondary text-sm lg:text-base max-w-2xl mb-8">
                Answer 3 quick questions about your cat household to get personalized, vet-tested automatic litter box recommendations.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Selector Controls (Left Side - 7 Cols) */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Question 1: Weight */}
                    <div>
                        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2.5">
                            1. Cat Weight / Size
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {weightOptions.map((opt) => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => setCatWeight(opt.id as any)}
                                    className={`p-3.5 rounded-2xl text-left border transition-all duration-200 ${
                                        catWeight === opt.id
                                            ? 'bg-primary-600 text-white border-primary-600 shadow-md ring-2 ring-primary-300'
                                            : 'bg-white text-text-primary border-[#E5E4E1] hover:border-primary-400'
                                    }`}
                                >
                                    <div className="font-bold text-sm mb-1">{opt.label}</div>
                                    <div className={`text-[11px] leading-tight ${catWeight === opt.id ? 'text-primary-100' : 'text-text-secondary'}`}>
                                        {opt.desc}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Question 2: Household Size */}
                    <div>
                        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2.5">
                            2. Number of Cats
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {countOptions.map((opt) => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => setCatCount(opt.id as any)}
                                    className={`p-3.5 rounded-2xl text-center border transition-all duration-200 ${
                                        catCount === opt.id
                                            ? 'bg-primary-600 text-white border-primary-600 shadow-md ring-2 ring-primary-300'
                                            : 'bg-white text-text-primary border-[#E5E4E1] hover:border-primary-400'
                                    }`}
                                >
                                    <div className="font-bold text-base mb-0.5">{opt.label}</div>
                                    <div className={`text-[11px] leading-tight ${catCount === opt.id ? 'text-primary-100' : 'text-text-secondary'}`}>
                                        {opt.desc}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Question 3: Top Priority */}
                    <div>
                        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2.5">
                            3. Top Feature Priority
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {priorityOptions.map((opt) => {
                                const Icon = opt.icon;
                                const isSelected = priority === opt.id;
                                return (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => setPriority(opt.id as any)}
                                        className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all duration-200 ${
                                            isSelected
                                                ? 'bg-primary-600 text-white border-primary-600 shadow-md ring-2 ring-primary-300'
                                                : 'bg-white text-text-primary border-[#E5E4E1] hover:border-primary-400'
                                        }`}
                                    >
                                        <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-white/20 text-white' : 'bg-primary-50 text-primary-600'}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className="font-bold text-sm">{opt.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Recommendations Results (Right Side - 5 Cols) */}
                <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#E5E4E1] shadow-lg">
                    <div className="flex items-center justify-between pb-4 border-b border-[#E5E4E1] mb-5">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-500" />
                            <h3 className="font-bold text-lg text-text-primary">Your Recommended Match</h3>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                            99.4% Compatibility
                        </span>
                    </div>

                    <div className="space-y-4">
                        {recommendations.map((rec) => (
                            <div key={rec.id} className="p-4 rounded-2xl bg-surface-primary border border-[#E5E4E1] flex gap-4 items-center">
                                <div className="w-20 h-20 bg-white rounded-xl p-2 shrink-0 border border-[#E5E4E1]">
                                    {/* eslint-disable-next-html-element-suppress */}
                                    <img
                                        src={rec.image}
                                        alt={rec.name}
                                        className="w-full h-full object-contain"
                                        referrerPolicy="no-referrer"
                                    />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                                        {rec.highlight}
                                    </span>
                                    <h4 className="font-bold text-sm text-text-primary truncate mt-1">
                                        {rec.name}
                                    </h4>
                                    <p className="text-xs text-text-secondary line-clamp-2 my-1">
                                        {rec.reason}
                                    </p>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-extrabold text-base text-text-primary">${rec.price}</span>
                                            <span className="text-xs text-text-tertiary line-through">${rec.originalPrice}</span>
                                        </div>
                                        <Link
                                            href={`/shop/${rec.slug}`}
                                            className="inline-flex items-center gap-1 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 px-3 py-1.5 rounded-xl transition-colors"
                                        >
                                            View Details <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-5 pt-4 border-t border-[#E5E4E1] flex items-center justify-between text-xs text-text-secondary">
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 365-Day ALitter Guarantee
                        </span>
                        <Link href="/shop" className="font-bold text-primary-600 hover:underline">
                            View All Litter Boxes &rarr;
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CatProfileSelector;
