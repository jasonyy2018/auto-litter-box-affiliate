import fs from 'fs';
import path from 'path';

const AFFILIATES_FILE = path.join(process.cwd(), 'data', 'affiliates.json');
const COMMISSIONS_FILE = path.join(process.cwd(), 'data', 'commissions.json');
const REFERRED_ORDERS_FILE = path.join(process.cwd(), 'data', 'referred-orders.json');

export interface AffiliateUser {
    username: string; // Also used as referral code: ?ref=username
    fullName: string;
    email: string;
    passwordHash: string; // Plain password check or standard check
    clicks: number;       // Referred clicks count
    createdAt: string;
}

export interface CommissionConfig {
    productId: string;
    commissionRate: number; // Percentage (e.g. 0.15 = 15%)
}

export interface ReferredOrder {
    orderId: string;
    affiliateUsername: string;
    subtotal: number;
    commissionAmount: number;
    status: 'pending' | 'approved' | 'paid' | 'cancelled';
    createdAt: string;
    shippedAt?: string;
    productNames: string[];
}

// ----------------------------------------------------
// File I/O Helpers
// ----------------------------------------------------
function readJSON<T>(filePath: string): T[] {
    try {
        if (!fs.existsSync(filePath)) {
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf-8');
            return [];
        }
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function writeJSON<T>(filePath: string, data: T[]): void {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ----------------------------------------------------
// Affiliate Management
// ----------------------------------------------------
export function getAffiliates(): AffiliateUser[] {
    return readJSON<AffiliateUser>(AFFILIATES_FILE);
}

export function saveAffiliates(data: AffiliateUser[]): void {
    writeJSON<AffiliateUser>(AFFILIATES_FILE, data);
}

export function registerAffiliate(username: string, fullName: string, email: string, passwordHash: string): AffiliateUser | null {
    const list = getAffiliates();
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    
    if (list.some(u => u.username === cleanUsername || u.email === email.trim().toLowerCase())) {
        return null; // Username or email already exists
    }

    const newUser: AffiliateUser = {
        username: cleanUsername,
        fullName,
        email: email.trim().toLowerCase(),
        passwordHash,
        clicks: 0,
        createdAt: new Date().toISOString()
    };

    list.push(newUser);
    saveAffiliates(list);
    return newUser;
}

export function loginAffiliate(usernameOrEmail: string, passwordHash: string): AffiliateUser | null {
    const list = getAffiliates();
    const clean = usernameOrEmail.trim().toLowerCase();
    const user = list.find(u => u.username === clean || u.email === clean);
    if (user && user.passwordHash === passwordHash) {
        return user;
    }
    return null;
}

export function trackAffiliateClick(username: string): void {
    const list = getAffiliates();
    const user = list.find(u => u.username === username.toLowerCase());
    if (user) {
        user.clicks = (user.clicks || 0) + 1;
        saveAffiliates(list);
    }
}

// ----------------------------------------------------
// Commission Configurations (Product rates)
// ----------------------------------------------------
export function getCommissions(): CommissionConfig[] {
    return readJSON<CommissionConfig>(COMMISSIONS_FILE);
}

export function saveCommissions(data: CommissionConfig[]): void {
    writeJSON<CommissionConfig>(COMMISSIONS_FILE, data);
}

export function getProductCommissionRate(productId: string): number {
    const list = getCommissions();
    const config = list.find(c => c.productId === productId);
    return config ? config.commissionRate : 0.10; // Default 10% commission rate
}

export function updateProductCommissionRate(productId: string, commissionRate: number): void {
    const list = getCommissions();
    const idx = list.findIndex(c => c.productId === productId);
    if (idx !== -1) {
        list[idx].commissionRate = commissionRate;
    } else {
        list.push({ productId, commissionRate });
    }
    saveCommissions(list);
}

// ----------------------------------------------------
// Referred Orders Management
// ----------------------------------------------------
export function getReferredOrders(): ReferredOrder[] {
    return readJSON<ReferredOrder>(REFERRED_ORDERS_FILE);
}

export function saveReferredOrders(data: ReferredOrder[]): void {
    writeJSON<ReferredOrder>(REFERRED_ORDERS_FILE, data);
}

export function addReferredOrder(
    orderId: string,
    affiliateUsername: string,
    subtotal: number,
    items: Array<{ productId: string; price: number; quantity: number; name: string }>
): ReferredOrder | null {
    const list = getReferredOrders();
    
    // Check if order already registered
    if (list.some(o => o.orderId === orderId)) {
        return null;
    }

    const cleanUsername = affiliateUsername.toLowerCase().trim();
    const affiliates = getAffiliates();
    if (!affiliates.some(u => u.username === cleanUsername)) {
        return null; // Not a valid affiliate referral
    }

    // Calculate itemized commissions
    let totalCommission = 0;
    const productNames: string[] = [];

    for (const item of items) {
        const rate = getProductCommissionRate(item.productId);
        totalCommission += item.price * item.quantity * rate;
        productNames.push(item.name);
    }

    const newReferred: ReferredOrder = {
        orderId,
        affiliateUsername: cleanUsername,
        subtotal,
        commissionAmount: parseFloat(totalCommission.toFixed(2)),
        status: 'pending',
        createdAt: new Date().toISOString(),
        productNames
    };

    list.push(newReferred);
    saveReferredOrders(list);
    return newReferred;
}

export function confirmReferredOrderShipped(orderId: string): ReferredOrder | null {
    const list = getReferredOrders();
    const idx = list.findIndex(o => o.orderId === orderId);
    if (idx !== -1) {
        // Change status to approved on shipping
        list[idx].status = 'approved';
        list[idx].shippedAt = new Date().toISOString();
        saveReferredOrders(list);
        return list[idx];
    }
    return null;
}

export function cancelReferredOrder(orderId: string): ReferredOrder | null {
    const list = getReferredOrders();
    const idx = list.findIndex(o => o.orderId === orderId);
    if (idx !== -1) {
        list[idx].status = 'cancelled';
        saveReferredOrders(list);
        return list[idx];
    }
    return null;
}
