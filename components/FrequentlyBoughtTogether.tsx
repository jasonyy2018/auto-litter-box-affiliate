'use client';

import React, { useState } from 'react';
import { Plus, Check, ShoppingBag, Sparkles, ShieldCheck } from 'lucide-react';
import { useCart } from '@/lib/CartContext';

interface BundleItem {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    image: string;
    isRequired?: boolean;
}

interface FrequentlyBoughtTogetherProps {
    mainProduct: {
        id: string;
        name: string;
        price: number;
        originalPrice?: number;
        images: string[];
    };
}

export const FrequentlyBoughtTogether: React.FC<FrequentlyBoughtTogetherProps> = ({ mainProduct }) => {
    const { addToCart } = useCart();
    const [selectedIds, setSelectedIds] = useState<string[]>([
        mainProduct.id,
        'bundle-liners-50',
        'bundle-odor-filter-6',
    ]);
    const [addedSuccess, setAddedSuccess] = useState(false);

    const bundleItems: BundleItem[] = [
        {
            id: mainProduct.id,
            name: mainProduct.name,
            price: mainProduct.price,
            originalPrice: mainProduct.originalPrice || parseFloat((mainProduct.price * 1.2).toFixed(2)),
            image: mainProduct.images[0] || '',
            isRequired: true,
        },
        {
            id: 'bundle-liners-50',
            name: 'Heavy-Duty Drawstring Waste Bags (50 Pack)',
            price: 18.99,
            originalPrice: 24.99,
            image: 'https://oss-cf.cjdropshipping.com/product/2026/01/16/05/2ba585fa-1b3a-4d1d-af02-6edb2d516ff2_trans.jpeg',
        },
        {
            id: 'bundle-odor-filter-6',
            name: 'Activated Carbon Odor Eliminator Pads (6 Pack)',
            price: 14.50,
            originalPrice: 19.99,
            image: 'https://cf.cjdropshipping.com/8d79aca9-de4b-4638-bfa8-f296b2b17b98.jpg',
        },
    ];

    const toggleItem = (id: string) => {
        if (id === mainProduct.id) return; // Main product cannot be unselected
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const activeItems = bundleItems.filter(item => selectedIds.includes(item.id));
    const rawTotal = activeItems.reduce((acc, item) => acc + item.price, 0);
    // Bundle discount: 10% off when all 3 items selected
    const isFullBundle = activeItems.length === 3;
    const bundleDiscount = isFullBundle ? rawTotal * 0.1 : 0;
    const finalTotal = rawTotal - bundleDiscount;

    const handleAddBundleToCart = () => {
        activeItems.forEach(item => {
            const itemPrice = isFullBundle ? parseFloat((item.price * 0.9).toFixed(2)) : item.price;
            addToCart({
                id: item.id,
                slug: mainProduct.id,
                name: item.name,
                price: itemPrice,
                image: item.image,
            });
        });
        setAddedSuccess(true);
        setTimeout(() => setAddedSuccess(false), 3000);
    };

    return (
        <section className="my-12 p-6 lg:p-8 bg-surface-primary rounded-3xl border border-[#E5E4E1] shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E4E1]">
                <div className="flex items-center gap-2">
                    <span className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                        <Sparkles className="w-5 h-5" />
                    </span>
                    <div>
                        <h3 className="font-extrabold text-xl text-text-primary">Frequently Bought Together</h3>
                        <p className="text-xs text-text-secondary">Chewy Bundle Saver: Add essential liners & odor filters to save extra 10%</p>
                    </div>
                </div>
                {isFullBundle && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-200">
                        🔥 Extra 10% Bundle Discount Applied!
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Images row with Plus sign (7 Cols) */}
                <div className="lg:col-span-7 flex flex-wrap items-center justify-center gap-4">
                    {bundleItems.map((item, idx) => {
                        const isChecked = selectedIds.includes(item.id);
                        return (
                            <React.Fragment key={item.id}>
                                {idx > 0 && <Plus className="w-5 h-5 text-text-tertiary shrink-0" />}
                                <div
                                    onClick={() => toggleItem(item.id)}
                                    className={`relative w-28 h-28 lg:w-32 lg:h-32 bg-white rounded-2xl p-3 border cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
                                        isChecked
                                            ? 'border-primary-600 shadow-md ring-2 ring-primary-200'
                                            : 'border-[#E5E4E1] opacity-50 grayscale hover:opacity-80'
                                    }`}
                                >
                                    {/* Checkbox badge */}
                                    <div
                                        className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs ${
                                            isChecked ? 'bg-primary-600' : 'bg-gray-300'
                                        }`}
                                    >
                                        <Check className="w-3.5 h-3.5" />
                                    </div>

                                    {/* eslint-disable-next-html-element-suppress */}
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-contain"
                                        referrerPolicy="no-referrer"
                                    />
                                    <span className="font-bold text-xs text-text-primary mt-1">${item.price}</span>
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* Checkbox list & Total Price CTA (5 Cols) */}
                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E5E4E1] shadow-sm">
                    <div className="space-y-3 mb-6">
                        {bundleItems.map(item => {
                            const isChecked = selectedIds.includes(item.id);
                            return (
                                <label
                                    key={item.id}
                                    className="flex items-start gap-3 cursor-pointer group"
                                >
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        disabled={item.isRequired}
                                        onChange={() => toggleItem(item.id)}
                                        className="mt-1 w-4 h-4 rounded text-primary-600 focus:ring-primary-500 cursor-pointer disabled:opacity-50"
                                    />
                                    <div className="text-xs">
                                        <span className={`font-semibold transition-colors ${isChecked ? 'text-text-primary' : 'text-text-tertiary'}`}>
                                            {item.isRequired ? <span className="font-bold text-primary-600">[This Item] </span> : null}
                                            {item.name}
                                        </span>
                                        <span className="font-bold text-text-primary ml-2">${item.price}</span>
                                    </div>
                                </label>
                            );
                        })}
                    </div>

                    <div className="pt-4 border-t border-[#E5E4E1] flex items-center justify-between mb-5">
                        <div>
                            <div className="text-xs text-text-secondary">Bundle Total ({activeItems.length} items):</div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-extrabold text-text-primary">${finalTotal.toFixed(2)}</span>
                                {isFullBundle && (
                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                                        Save ${(bundleDiscount).toFixed(2)}
                                    </span>
                                )}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleAddBundleToCart}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all shadow-md active:scale-95 ${
                                addedSuccess
                                    ? 'bg-emerald-600'
                                    : 'bg-primary-600 hover:bg-primary-700 shadow-primary-600/20'
                            }`}
                        >
                            <ShoppingBag className="w-4 h-4" />
                            {addedSuccess ? 'Bundle Added!' : 'Add Bundle to Cart'}
                        </button>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-text-secondary">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Eligible for <strong>Free 1-3 Day Express Shipping</strong> & 365-Day Returns</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FrequentlyBoughtTogether;
