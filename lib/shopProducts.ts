import { prisma } from './prisma';

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

// Prisma model doesn't have cjStatus etc. — we store them in a JSON field
// For now, we keep CJ-specific fields as part of the product record
// by storing them in a dedicated json field or as part of tags/description
// We'll use the Product model's built-in fields and store CJ status separately

// ====================== Public API ======================

export async function getAllShopProducts(): Promise<ShopProduct[]> {
    const products = await prisma.product.findMany({
        include: { variants: true, category: true },
        orderBy: { createdAt: 'desc' },
    });
    return products.map(mapProduct);
}

export async function getVisibleProducts(): Promise<ShopProduct[]> {
    const products = await prisma.product.findMany({
        where: { visible: true },
        include: { variants: true, category: true },
        orderBy: { createdAt: 'desc' },
    });
    return products.map(mapProduct);
}

export async function getFeaturedProducts(): Promise<ShopProduct[]> {
    const products = await prisma.product.findMany({
        where: { visible: true, featured: true },
        include: { variants: true, category: true },
    });
    return products.map(mapProduct);
}

export async function getShopProductBySlug(slug: string): Promise<ShopProduct | undefined> {
    const product = await prisma.product.findUnique({
        where: { slug },
        include: { variants: true, category: true },
    });
    return product ? mapProduct(product) : undefined;
}

export async function getShopProductById(id: string): Promise<ShopProduct | undefined> {
    const product = await prisma.product.findUnique({
        where: { id },
        include: { variants: true, category: true },
    });
    return product ? mapProduct(product) : undefined;
}

export async function addShopProduct(product: Omit<ShopProduct, 'id' | 'slug' | 'createdAt' | 'updatedAt'>): Promise<ShopProduct> {
    const { variants, category, ...productData } = product;

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
        } catch (e) {
            console.error(`Failed to update product ${id}:`, e);
        }
    }
}

export async function deleteShopProduct(id: string): Promise<boolean> {
    try {
        await prisma.product.delete({ where: { id } });
        return true;
    } catch {
        return false;
    }
}

export async function getProductsByCategory(category: string): Promise<ShopProduct[]> {
    const products = await prisma.product.findMany({
        where: { visible: true, category: { name: category } },
        include: { variants: true, category: true },
    });
    return products.map(mapProduct);
}

export async function getProductCategories(): Promise<string[]> {
    const categories = await prisma.category.findMany({
        select: { name: true },
        orderBy: { name: 'asc' },
    });
    return categories.map(c => c.name);
}