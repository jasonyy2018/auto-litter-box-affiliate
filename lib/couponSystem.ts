import fs from 'fs';
import path from 'path';

const COUPONS_FILE = path.join(process.cwd(), 'data', 'coupons.json');

export interface Coupon {
    code: string;           // E.g. "SAVE10", "OFF50"
    type: 'percentage' | 'fixed';
    value: number;          // 0.10 for 10%, or 50 for $50.00
    minSubtotal?: number;   // Minimum purchase subtotal required
    expiryDate?: string;    // ISO date string
    isActive: boolean;
}

function readCoupons(): Coupon[] {
    try {
        if (!fs.existsSync(COUPONS_FILE)) {
            const dir = path.dirname(COUPONS_FILE);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            
            // Create default high-value mock coupons for conversion
            const defaultCoupons: Coupon[] = [
                {
                    code: 'SAVE10',
                    type: 'percentage',
                    value: 0.10,
                    minSubtotal: 0,
                    expiryDate: '2030-12-31T23:59:59.000Z',
                    isActive: true
                },
                {
                    code: 'LITTER50',
                    type: 'fixed',
                    value: 50.00,
                    minSubtotal: 200,
                    expiryDate: '2030-12-31T23:59:59.000Z',
                    isActive: true
                }
            ];
            fs.writeFileSync(COUPONS_FILE, JSON.stringify(defaultCoupons, null, 2), 'utf-8');
            return defaultCoupons;
        }
        const data = fs.readFileSync(COUPONS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

export function validateCoupon(code: string, subtotal: number): {
    isValid: boolean;
    discountAmount: number;
    message: string;
    coupon?: Coupon;
} {
    const list = readCoupons();
    const cleanCode = code.trim().toUpperCase();
    const coupon = list.find(c => c.code === cleanCode);

    if (!coupon) {
        return { isValid: false, discountAmount: 0, message: 'Invalid coupon code.' };
    }

    if (!coupon.isActive) {
        return { isValid: false, discountAmount: 0, message: 'This coupon is no longer active.' };
    }

    if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
        return { isValid: false, discountAmount: 0, message: 'This coupon has expired.' };
    }

    if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
        return { 
            isValid: false, 
            discountAmount: 0, 
            message: `Minimum purchase of $${coupon.minSubtotal.toFixed(2)} required for this coupon.` 
        };
    }

    let discountAmount = 0;
    if (coupon.type === 'percentage') {
        discountAmount = subtotal * coupon.value;
    } else if (coupon.type === 'fixed') {
        discountAmount = coupon.value;
    }

    // Limit discount to subtotal
    if (discountAmount > subtotal) {
        discountAmount = subtotal;
    }

    return {
        isValid: true,
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        message: coupon.type === 'percentage' 
            ? `${(coupon.value * 100).toFixed(0)}% Discount Applied!` 
            : `$${coupon.value.toFixed(2)} Discount Applied!`,
        coupon
    };
}
