import { NextRequest, NextResponse } from 'next/server';
import { searchProducts, getProductDetail, type CJProduct } from '@/lib/cjApi';
import type { ShopProduct, ShopVariant } from '@/lib/shopProducts';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'shop-products.json');

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 80);
}

function getDynamicMarkup(cost: number): number {
    if (cost < 10) return 3.5;       // Accessories: 3.5x markup (e.g. $3 item -> $10.50)
    if (cost < 50) return 2.5;       // Medium items: 2.5x markup (e.g. $30 item -> $75.00)
    if (cost < 150) return 2.2;      // Standard boxes: 2.2x markup (e.g. $117 item -> $257.40)
    return 1.6;                      // High-end boxes: 1.6x markup (e.g. $426 item -> $681.60)
}

function convertCJProduct(cj: CJProduct, baseMarkup: number, index: number): ShopProduct {
    // Audit & filter out cheap accessory variants from defining the main product cost
    const variantCosts = (cj.variants || []).map(v => v.variantSellPrice);
    const maxCost = Math.max(...variantCosts, cj.sellPrice || 0);
    
    // Primary variant threshold: cheapest variant that is at least 25% of maxCost (or $30) to filter out $1 adapter bags
    const threshold = maxCost > 50 ? Math.max(30, maxCost * 0.25) : 0;
    const mainVariants = (cj.variants || []).filter(v => v.variantSellPrice >= threshold);
    const primaryVariant = mainVariants.length > 0 
        ? mainVariants.sort((a, b) => a.variantSellPrice - b.variantSellPrice)[0] 
        : cj.variants?.[0];

    const costPrice = primaryVariant ? primaryVariant.variantSellPrice : cj.sellPrice;
    const dynamicMarkup = getDynamicMarkup(costPrice);
    const sellPrice = Math.round(costPrice * dynamicMarkup * 100) / 100;
    const originalPrice = Math.round(sellPrice * 1.3 * 100) / 100;

    const images: string[] = [];
    if (cj.productImage) images.push(cj.productImage);
    if (cj.productImageSet?.length) {
        for (const img of cj.productImageSet) {
            if (img && !images.includes(img)) {
                images.push(img);
            }
        }
    }

    const variants: ShopVariant[] = (cj.variants || []).map((v, vi) => {
        const vMarkup = getDynamicMarkup(v.variantSellPrice);
        return {
            id: `cj-var-${v.vid || vi}`,
            name: v.variantNameEn || v.variantName || `Variant ${vi + 1}`,
            sku: v.variantSku || `${cj.productSku}-V${vi}`,
            price: Math.round(v.variantSellPrice * vMarkup * 100) / 100,
            costPrice: v.variantSellPrice,
            image: v.variantImage || '',
            properties: v.variantProperty || v.variantNameEn || '',
            inStock: true,
        };
    });

    // Clean up description HTML
    let description = cj.description || cj.productBrief || '';
    if (description.length > 5000) {
        description = description.slice(0, 5000);
    }

    const name = cj.productNameEn || cj.productName;

    return {
        id: `cj-${cj.pid}`,
        cjPid: cj.pid,
        slug: generateSlug(name),
        name,
        description,
        shortDescription: (cj.productBrief || name).slice(0, 200),
        category: cj.categoryName || 'Smart Cat Litter Box',
        images: images.slice(0, 10),
        price: sellPrice,
        costPrice,
        originalPrice,
        currency: 'USD',
        variants,
        weight: cj.productWeight || cj.packingWeight || 0,
        sku: cj.productSku || `CJ-${cj.pid}`,
        inStock: true,
        visible: true,
        featured: index < 3,
        tags: ['smart-litter-box', 'automatic', 'cat-care', 'cj-import'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => ({}));
        const keyword = body.keyword || 'automatic cat litter box';
        const size = Math.min(body.size || 20, 50);
        const markup = body.markup || 2.5;
        const clearExisting = body.clearExisting !== false; // Default: clear existing

        console.log(`[CJ Import] Searching for "${keyword}", size=${size}, markup=${markup}x`);

        // Step 1: Search CJ Products
        const searchResult = await searchProducts(keyword, 1, size);
        console.log(`[CJ Import] Found ${searchResult.total} products, fetching ${searchResult.list.length} details...`);

        if (!searchResult.list.length) {
            return NextResponse.json({
                success: false,
                error: 'No products found for the given keyword',
            }, { status: 404 });
        }

        // Step 2: Get product details for each result
        const detailedProducts: CJProduct[] = [];
        for (const product of searchResult.list) {
            try {
                const detail = await getProductDetail(product.pid);
                detailedProducts.push(detail);
                console.log(`[CJ Import] Got details for: ${detail.productNameEn || detail.productName}`);
            } catch (err) {
                console.warn(`[CJ Import] Failed to get details for ${product.pid}:`, err);
                // Use search result data as fallback
                detailedProducts.push(product);
            }
        }

        // Step 3: Convert to ShopProduct format
        const shopProducts = detailedProducts.map((cj, i) => convertCJProduct(cj, markup, i));

        // Ensure unique slugs
        const usedSlugs = new Set<string>();
        for (const product of shopProducts) {
            let slug = product.slug;
            let counter = 1;
            while (usedSlugs.has(slug)) {
                slug = `${product.slug}-${counter}`;
                counter++;
            }
            product.slug = slug;
            usedSlugs.add(slug);
        }

        // Step 4: Save to JSON file
        let existingProducts: ShopProduct[] = [];
        if (!clearExisting) {
            try {
                existingProducts = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
            } catch {
                existingProducts = [];
            }
        }

        const allProducts = clearExisting ? shopProducts : [...existingProducts, ...shopProducts];

        const dir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(DATA_FILE, JSON.stringify(allProducts, null, 2), 'utf-8');

        console.log(`[CJ Import] Successfully imported ${shopProducts.length} products`);

        return NextResponse.json({
            success: true,
            data: {
                imported: shopProducts.length,
                total: allProducts.length,
                products: shopProducts.map(p => ({
                    id: p.id,
                    cjPid: p.cjPid,
                    name: p.name,
                    price: p.price,
                    costPrice: p.costPrice,
                    images: p.images.length,
                    variants: p.variants.length,
                })),
            },
        });
    } catch (error) {
        console.error('[CJ Import] Error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Import failed' },
            { status: 500 }
        );
    }
}
