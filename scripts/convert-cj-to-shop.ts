/**
 * Convert CJ search results to shop products
 * 
 * Usage: npx tsx scripts/convert-cj-to-shop.ts
 * 
 * Reads data/cj-search-results.json (raw CJ API V2 response)
 * and converts it to data/shop-products.json (shop format).
 * 
 * CJ API V2 field mapping:
 *   id -> pid, nameEn -> name, bigImage -> image, sellPrice -> price
 *   sku -> sku, categoryId -> category
 *   Products are in data.content.productList
 */

import * as fs from 'fs';
import * as path from 'path';

const CJ_RESULTS_FILE = path.join(process.cwd(), 'data', 'cj-search-results.json');
const SHOP_FILE = path.join(process.cwd(), 'data', 'shop-products.json');
const MARKUP = 2.5;

interface ShopVariant {
    id: string;
    name: string;
    sku: string;
    price: number;
    costPrice: number;
    image: string;
    properties: string;
    inStock: boolean;
}

interface ShopProduct {
    id: string;
    cjPid: string;
    slug: string;
    name: string;
    description: string;
    shortDescription: string;
    category: string;
    images: string[];
    price: number;
    costPrice: number;
    originalPrice: number;
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
}

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 80);
}

function main() {
    console.log('📦 Reading CJ search results...');

    if (!fs.existsSync(CJ_RESULTS_FILE)) {
        console.error('❌ CJ search results file not found:', CJ_RESULTS_FILE);
        process.exit(1);
    }

    const raw = JSON.parse(fs.readFileSync(CJ_RESULTS_FILE, 'utf-8'));

    // CJ API V2 response structure: data.content is an array with 1 element
    // containing { productList, relatedCategoryList, keyWord, keyWordOld }
    const contentWrapper = raw.data?.content?.[0] || raw.data?.content || raw.data || {};
    const products: any[] = contentWrapper.productList
        || contentWrapper.list
        || raw.data?.list
        || [];

    console.log(`   Found ${products.length} products`);

    if (!products.length) {
        console.error('❌ No products in search results');
        process.exit(1);
    }

    const shopProducts: ShopProduct[] = [];
    const usedSlugs = new Set<string>();

    for (let i = 0; i < products.length; i++) {
        const cj = products[i];

        // CJ V2 field mapping
        const cjId = cj.id || cj.pid || `unknown-${i}`;
        const cjName = cj.nameEn || cj.productNameEn || cj.productName || `Product ${i + 1}`;
        const cjImage = cj.bigImage || cj.productImage || '';
        const cjSellPrice = cj.sellPrice || 0;
        const cjSku = cj.sku || cj.productSku || `CJ-${cjId}`;
        const cjCategoryName = cj.categoryName || 'Smart Cat Litter Box';

        const costPrice = cjSellPrice;
        const sellPrice = Math.round(costPrice * MARKUP * 100) / 100;
        const originalPrice = Math.round(sellPrice * 1.3 * 100) / 100;

        const images: string[] = [];
        if (cjImage) images.push(cjImage);
        // V2 search results may not have imageSet, so just use bigImage

        const variants: ShopVariant[] = (cj.variants || []).map((v: any, vi: number) => ({
            id: `cj-var-${v.vid || vi}`,
            name: v.variantNameEn || v.variantName || `Variant ${vi + 1}`,
            sku: v.variantSku || `${cjSku}-V${vi}`,
            price: Math.round((v.variantSellPrice || costPrice) * MARKUP * 100) / 100,
            costPrice: v.variantSellPrice || costPrice,
            image: v.variantImage || '',
            properties: v.variantProperty || v.variantNameEn || '',
            inStock: true,
        }));

        let slug = generateSlug(cjName);
        let counter = 1;
        const originalSlug = slug;
        while (usedSlugs.has(slug)) {
            slug = `${originalSlug}-${counter}`;
            counter++;
        }
        usedSlugs.add(slug);

        shopProducts.push({
            id: `cj-${cjId}`,
            cjPid: cjId,
            slug,
            name: cjName,
            description: (cj.description || cj.productBrief || cjName),
            shortDescription: (cj.productBrief || cjName).slice(0, 200),
            category: cjCategoryName,
            images,
            price: sellPrice,
            costPrice,
            originalPrice,
            currency: 'USD',
            variants,
            weight: cj.productWeight || cj.packingWeight || 0,
            sku: cjSku,
            inStock: true,
            visible: true,
            featured: i < 3,
            tags: ['smart-litter-box', 'automatic', 'cat-care', 'cj-import'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
    }

    // Save
    fs.writeFileSync(SHOP_FILE, JSON.stringify(shopProducts, null, 2), 'utf-8');

    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  ✅ Conversion Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  Products: ${shopProducts.length}`);
    console.log(`  Saved to: ${SHOP_FILE}`);
    console.log('');
    for (const p of shopProducts) {
        const badge = p.featured ? ' ⭐' : '';
        console.log(`  • ${p.name}${badge}`);
        console.log(`    $${p.price.toFixed(2)} (cost: $${p.costPrice.toFixed(2)}) | ${p.images.length} imgs | ${p.variants.length} vars`);
    }
    console.log('');
}

main();
