import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'shop-products.json');

export interface ShopProduct {
    id: string;
    cjPid: string;                // CJ product ID
    slug: string;
    name: string;
    description: string;
    shortDescription: string;
    category: string;
    images: string[];
    amazonLink?: string;          // Amazon Affiliate Link
    affiliateLink?: string;       // Custom Affiliate Link
    price: number;                // Selling price (with markup)
    costPrice: number;            // CJ cost price
    originalPrice?: number;       // Strike-through price
    currency: string;
    variants: ShopVariant[];
    weight: number;
    sku: string;
    inStock: boolean;
    visible: boolean;             // Whether to show on shop page
    featured: boolean;            // Feature on homepage
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

export interface ShopVariant {
    id: string;
    name: string;
    sku: string;
    price: number;
    costPrice: number;
    image: string;
    properties: string;
    inStock: boolean;
}

function readProducts(): ShopProduct[] {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function writeProducts(products: ShopProduct[]): void {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), 'utf-8');
}

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 80);
}

export function getAllShopProducts(): ShopProduct[] {
    return readProducts();
}

export function getVisibleProducts(): ShopProduct[] {
    return readProducts().filter(p => p.visible);
}

export function getFeaturedProducts(): ShopProduct[] {
    return readProducts().filter(p => p.visible && p.featured);
}

export function getShopProductBySlug(slug: string): ShopProduct | undefined {
    return readProducts().find(p => p.slug === slug);
}

export function getShopProductById(id: string): ShopProduct | undefined {
    return readProducts().find(p => p.id === id);
}

export function addShopProduct(product: Omit<ShopProduct, 'id' | 'slug' | 'createdAt' | 'updatedAt'>): ShopProduct {
    const products = readProducts();

    let slug = generateSlug(product.name);
    // Ensure unique slug
    let counter = 1;
    let originalSlug = slug;
    while (products.some(p => p.slug === slug)) {
        slug = `${originalSlug}-${counter}`;
        counter++;
    }

    const newProduct: ShopProduct = {
        ...product,
        id: `shop-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        slug,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    products.push(newProduct);
    writeProducts(products);
    return newProduct;
}

export function updateShopProduct(id: string, updates: Partial<ShopProduct>): ShopProduct | null {
    const products = readProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    // Don't allow changing id or cjPid
    const { id: _id, cjPid: _cjPid, ...safeUpdates } = updates;

    products[index] = {
        ...products[index],
        ...safeUpdates,
        updatedAt: new Date().toISOString(),
    };

    writeProducts(products);
    return products[index];
}

export function deleteShopProduct(id: string): boolean {
    const products = readProducts();
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length === products.length) return false;
    writeProducts(filtered);
    return true;
}

export function getProductsByCategory(category: string): ShopProduct[] {
    return readProducts().filter(p => p.visible && p.category === category);
}

export function getProductCategories(): string[] {
    const products = readProducts().filter(p => p.visible);
    return [...new Set(products.map(p => p.category).filter(Boolean))];
}
