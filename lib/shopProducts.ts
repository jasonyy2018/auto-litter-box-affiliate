import { prisma } from './prisma';
import fallbackProductsJson from '@/data/shop-products.json';

// ====================== Type Exports ======================
export interface ShopProduct {
    id: string;
    cjPid: string;
    slug: string;
    name: string;
    description: string;
    shortDescription: string;
    category: string;
    images: string[];
    amazonLink?: string;
    affiliateLink?: string;
    price: number;
    costPrice: number;
    originalPrice?: number;
    currency: string;
    variants: ShopVariant[];
    weight: number;
    sku: string;
    inStock: boolean;
    visible: boolean;
    featured: boolean;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    cjStatus?: 'active' | 'discontinued' | 'unknown';
    discontinuedAt?: string;
    discontinuedReason?: string;
    lastSyncedAt?: string;
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

const fallbackProducts: ShopProduct[] = fallbackProductsJson as ShopProduct[];

// ====================== Mapping ======================

function mapVariant(v: any): ShopVariant {
    return {
        id: v.id,
        name: v.name,
        sku: v.sku,
        price: v.price,
        costPrice: v.costPrice,
        image: v.image || '',
        properties: v.properties || '',
        inStock: v.inStock,
    };
}

function mapProduct(p: any): ShopProduct {
    return {
        id: p.id,
        cjPid: p.cjPid || '',
        slug: p.slug,
        name: p.name,
        description: p.description,
        shortDescription: p.shortDescription || '',
        category: p.category?.name || 'Uncategorized',
        images: p.images || [],
        amazonLink: p.amazonLink,
        affiliateLink: p.affiliateLink,
        price: p.price,
        costPrice: p.costPrice,
        originalPrice: p.originalPrice || undefined,
        currency: p.currency,
        variants: (p.variants || []).map(mapVariant),
        weight: p.weight || 0,
        sku: p.sku,
        inStock: p.inStock,
        visible: p.visible,
        featured: p.featured,
        tags: p.tags || [],
        createdAt: p.createdAt?.toISOString?.() || p.createdAt,
        updatedAt: p.updatedAt?.toISOString?.() || p.updatedAt,
        cjStatus: (p as any).cjStatus || undefined,
        discontinuedAt: (p as any).discontinuedAt || undefined,
        discontinuedReason: (p as any).discontinuedReason || undefined,
        lastSyncedAt: (p as any).lastSyncedAt || undefined,
    };
}

// ====================== Public API ======================

export async function getAllShopProducts(): Promise<ShopProduct[]> {
    try {
        const products = await prisma.product.findMany({
            include: { variants: true, category: true },
            orderBy: { createdAt: 'desc' },
        });
        if (products.length > 0) return products.map(mapProduct);
    } catch (e) {
        console.warn('Prisma getAllShopProducts error, falling back to JSON data:', e);
    }
    return fallbackProducts;
}

export async function getVisibleProducts(): Promise<ShopProduct[]> {
    try {
        const products = await prisma.product.findMany({
            where: { visible: true },
            include: { variants: true, category: true },
            orderBy: { createdAt: 'desc' },
        });
        if (products.length > 0) return products.map(mapProduct);
    } catch (e) {
        console.warn('Prisma getVisibleProducts error, falling back to JSON data:', e);
    }
    return fallbackProducts.filter(p => p.visible !== false && p.cjStatus !== 'discontinued');
}

export async function getFeaturedProducts(): Promise<ShopProduct[]> {
    try {
        const products = await prisma.product.findMany({
            where: { visible: true, featured: true },
            include: { variants: true, category: true },
        });
        if (products.length > 0) return products.map(mapProduct);
    } catch (e) {
        console.warn('Prisma getFeaturedProducts error, falling back to JSON data:', e);
    }
    return fallbackProducts.filter(p => p.featured && p.visible !== false);
}

export async function getShopProductBySlug(slug: string): Promise<ShopProduct | undefined> {
    try {
        const product = await prisma.product.findUnique({
            where: { slug },
            include: { variants: true, category: true },
        });
        if (product) return mapProduct(product);
    } catch (e) {
        console.warn(`Prisma getShopProductBySlug(${slug}) error, checking JSON fallback:`, e);
    }
    return fallbackProducts.find(p => p.slug === slug);
}

export async function getShopProductById(id: string): Promise<ShopProduct | undefined> {
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: { variants: true, category: true },
        });
        if (product) return mapProduct(product);
    } catch (e) {
        console.warn(`Prisma getShopProductById(${id}) error, checking JSON fallback:`, e);
    }
    return fallbackProducts.find(p => p.id === id);
}

export async function addShopProduct(product: Omit<ShopProduct, 'id' | 'slug' | 'createdAt' | 'updatedAt'>): Promise<ShopProduct> {
    const { variants, category, ...productData } = product;

    try {
        const created = await prisma.product.create({
            data: {
                ...productData as any,
                categoryId: undefined,
                variants: {
                    create: (variants || []).map((v: ShopVariant) => ({
                        name: v.name,
                        sku: v.sku,
                        price: v.price,
                        costPrice: v.costPrice,
                        image: v.image,
                        properties: v.properties,
                        inStock: v.inStock,
                    })),
                },
            },
            include: { variants: true, category: true },
        });
        return mapProduct(created);
    } catch (e) {
        console.warn('Prisma addShopProduct fallback:', e);
        const newProduct: ShopProduct = {
            ...product,
            id: `cj-${Date.now()}`,
            slug: (product.name || 'product').toLowerCase().replace(/[^a-z0-9]/g, '-'),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        fallbackProducts.unshift(newProduct);
        return newProduct;
    }
}

export async function addShopProducts(products: Array<Omit<ShopProduct, 'id' | 'slug' | 'createdAt' | 'updatedAt'>>): Promise<ShopProduct[]> {
    const results: ShopProduct[] = [];
    for (const product of products) {
        results.push(await addShopProduct(product));
    }
    return results;
}

export async function updateShopProduct(id: string, updates: Partial<ShopProduct>): Promise<ShopProduct | null> {
    const { id: _id, cjPid: _cjPid, variants: _variants, createdAt: _createdAt, updatedAt: _updatedAt, category: _category, ...safeUpdates } = updates;

    try {
        const updated = await prisma.product.update({
            where: { id },
            data: safeUpdates as any,
            include: { variants: true, category: true },
        });
        return mapProduct(updated);
    } catch {
        const index = fallbackProducts.findIndex(p => p.id === id);
        if (index !== -1) {
            fallbackProducts[index] = { ...fallbackProducts[index], ...updates };
            return fallbackProducts[index];
        }
        return null;
    }
}

export async function bulkUpdateProducts(updates: Record<string, Partial<ShopProduct>>): Promise<void> {
    for (const [id, update] of Object.entries(updates)) {
        const { id: _id, cjPid: _cjPid, variants: _variants, createdAt: _createdAt, updatedAt: _updatedAt, category: _category, ...safeUpdates } = update;
        try {
            await prisma.product.update({
                where: { id },
                data: safeUpdates as any,
            });
        } catch {
            const index = fallbackProducts.findIndex(p => p.id === id);
            if (index !== -1) {
                fallbackProducts[index] = { ...fallbackProducts[index], ...update };
            }
        }
    }
}

export async function deleteShopProduct(id: string): Promise<boolean> {
    try {
        await prisma.product.delete({ where: { id } });
        return true;
    } catch {
        const index = fallbackProducts.findIndex(p => p.id === id);
        if (index !== -1) {
            fallbackProducts.splice(index, 1);
            return true;
        }
        return false;
    }
}

export async function getProductsByCategory(category: string): Promise<ShopProduct[]> {
    try {
        const products = await prisma.product.findMany({
            where: { visible: true, category: { name: category } },
            include: { variants: true, category: true },
        });
        if (products.length > 0) return products.map(mapProduct);
    } catch (e) {
        console.warn('Prisma getProductsByCategory error, fallback:', e);
    }
    return fallbackProducts.filter(p => p.category === category && p.visible !== false);
}

export async function getProductCategories(): Promise<string[]> {
    try {
        const categories = await prisma.category.findMany({
            select: { name: true },
            orderBy: { name: 'asc' },
        });
        if (categories.length > 0) return categories.map(c => c.name);
    } catch (e) {
        console.warn('Prisma getProductCategories error, fallback:', e);
    }
    const categories = Array.from(new Set(fallbackProducts.map(p => p.category))).sort();
    return categories;
}