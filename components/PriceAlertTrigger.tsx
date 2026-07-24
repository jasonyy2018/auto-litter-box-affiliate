'use client';

import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import PriceAlertModal from './PriceAlertModal';

interface PriceAlertTriggerProps {
    productName: string;
    productSlug: string;
    price: number;
}

export default function PriceAlertTrigger({
    productName,
    productSlug,
    price,
}: PriceAlertTriggerProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-4 bg-white border-2 border-[#D1D0CD] hover:border-primary-600 text-text-primary font-bold rounded-[16px] transition-all hover:bg-primary-50/50 shadow-sm active:scale-95 text-sm"
            >
                <Bell className="w-4 h-4 text-primary-600" />
                <span>Set Price Alert</span>
            </button>

            <PriceAlertModal
                productName={productName}
                productSlug={productSlug}
                currentPrice={price}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}
