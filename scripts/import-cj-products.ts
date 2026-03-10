/**
 * CJDropshipping Product Import Script
 * 
 * Usage: npx tsx scripts/import-cj-products.ts
 * 
 * Makes only 2 API calls (auth + search) to respect CJ's strict rate limit
 * (1 request per 300 seconds). Uses search results directly without
 * fetching individual product details.
 */

import * as fs from 'fs';
import * as path from 'path';

const CJ_BASE_URL = 'https://developers.cjdropshipping.com/api2.0/v1';
const DATA_FILE = path.join(process.cwd(), 'data', 'shop-products.json');
const CJ_API_KEY = process.env.CJ_API_KEY || 'CJ1277084@api@adc541e7b3614adba215eb7686504073';

// ---------- Types ----------

interface CJVariant {
    vid: string;
    pid: string;
    variantName: string;
    variantNameEn: string;
    variantSku: string;
    variantSellPrice: number;
    variantImage: string;
    variantProperty: string;
    variantWeight: number;
}

interface CJProduct {
    pid: string;
    productName: string;
    productNameEn: string;
    productSku: string;
    productImage: string;
    productWeight: number;
    sellPrice: number;
    categoryId: string;
    categoryName: string;
    productImageSet: string[];
    variants: CJVariant[];
    description: string;
    packingWeight: number;
    productBrief: string;
}

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

// ---------- Helpers ----------

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 6): Promise<Response> {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        const response = await fetch(url, options);
        if (response.ok || (response.status !== 429 && response.status < 500)) {
            return response;
        }
        if (attempt < maxRetries) {
            try {
                const errorBody = await response.text();
                console.log(`   ⚠️ ${errorBody.slice(0, 150)}`);
            } catch { /* ignore */ }
            // CJ rate limit is 1 req/300s. Wait 310s to be safe on first retry,
            // then shorter delays for subsequent retries in case the cooldown already passed.
            const delays = [310000, 120000, 60000, 60000, 60000, 60000];
            const delay = delays[attempt] || 60000;
            console.log(`   ⏳ Rate limited (${response.status}). Waiting ${Math.round(delay / 1000)}s... (attempt ${attempt + 1}/${maxRetries})`);
            await sleep(delay);
        } else {
            return response;
        }
    }
    throw new Error('Max retries exceeded');
}

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 80);
}

function convertCJProduct(cj: any, markup: number, index: number): ShopProduct {
    const costString = String(cj.sellPrice || "0");
    const costPrice = parseFloat(costString.includes('--') ? costString.split('--')[0].trim() : costString);
    const sellPrice = Math.round(costPrice * markup * 100) / 100;
    const originalPrice = Math.round(sellPrice * 1.3 * 100) / 100;

    const images: string[] = [];
    if (cj.productImage || cj.bigImage) images.push(cj.productImage || cj.bigImage);
    if (cj.productImageSet?.length) {
        for (const img of cj.productImageSet) {
            if (img && !images.includes(img)) images.push(img);
        }
    }

    const variants: ShopVariant[] = (cj.variants || []).map((v: any, vi: number) => ({
        id: `cj-var-${v.vid || vi}`,
        name: v.variantNameEn || v.variantName || `Variant ${vi + 1}`,
        sku: v.variantSku || `${cj.productSku || cj.sku}-V${vi}`,
        price: Math.round((parseFloat(v.variantSellPrice) || costPrice) * markup * 100) / 100,
        costPrice: parseFloat(v.variantSellPrice) || costPrice,
        image: v.variantImage || '',
        properties: v.variantProperty || v.variantNameEn || '',
        inStock: true,
    }));

    if (variants.length === 0) {
        variants.push({
            id: `cj-var-default`,
            name: 'Default',
            sku: cj.productSku || cj.sku || `CJ-${cj.pid || cj.id}`,
            price: sellPrice,
            costPrice,
            image: images[0] || '',
            properties: 'Default',
            inStock: true,
        });
    }

    const name = cj.productNameEn || cj.productName || cj.nameEn || 'Imported Product';

    return {
        id: `cj-${cj.pid || cj.id}`,
        cjPid: cj.pid || cj.id,
        slug: generateSlug(name),
        name,
        description: (cj.description || cj.productBrief || name).slice(0, 5000),
        shortDescription: (cj.productBrief || name).slice(0, 200),
        category: cj.categoryName || 'Smart Cat Litter Box',
        images: images.slice(0, 10),
        price: sellPrice,
        costPrice,
        originalPrice,
        currency: 'USD',
        variants,
        weight: cj.productWeight || cj.packingWeight || 0,
        sku: cj.productSku || cj.sku || `CJ-${cj.pid || cj.id}`,
        inStock: true,
        visible: true,
        featured: index < 3,
        tags: ['smart-litter-box', 'automatic', 'cat-care', 'cj-import'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}

// ---------- Main ----------

async function main() {
    const KEYWORD = 'smart cat litter box';
    const SIZE = 50;
    const MARKUP = 2.5;

    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  🐱 CJDropshipping Product Import Script');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  Keyword:  "${KEYWORD}"`);
    console.log(`  Max products: ${SIZE}`);
    console.log(`  Price markup: ${MARKUP}x`);
    console.log('  📌 Note: CJ API rate limit is 1 req/300s');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

    // Step 1: Get access token
    console.log('🔑 Step 1/3: Getting CJ access token...');
    const authResponse = await fetchWithRetry(`${CJ_BASE_URL}/authentication/getAccessToken`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: CJ_API_KEY }),
    });

    if (!authResponse.ok) {
        throw new Error(`Auth failed: ${authResponse.status} ${authResponse.statusText}`);
    }

    const authData = await authResponse.json();
    if (!authData.result) {
        throw new Error(`Auth error: ${authData.message}`);
    }

    const accessToken = authData.data.accessToken;
    console.log('   ✅ Access token obtained!');
    console.log('');

    // CRITICAL: wait 310 seconds between auth and search to respect rate limit
    console.log('   ⏳ Waiting 310s for rate limit cooldown (CJ requires 300s between requests)...');
    for (let i = 310; i > 0; i -= 10) {
        process.stdout.write(`\r   ⏳ ${i}s remaining...    `);
        await sleep(10000);
    }
    console.log('\r   ✅ Cooldown complete!          ');
    console.log('');

    // Step 2: Search products (single API call gets all data we need)
    console.log(`🔍 Step 2/3: Searching "${KEYWORD}"...`);
    const searchParams = new URLSearchParams({
        keyWord: KEYWORD,
        page: '1',
        size: SIZE.toString(),
    });

    const searchResponse = await fetchWithRetry(`${CJ_BASE_URL}/product/listV2?${searchParams.toString()}`, {
        method: 'GET',
        headers: {
            'CJ-Access-Token': accessToken,
            'Content-Type': 'application/json',
        },
    });

    if (!searchResponse.ok) {
        throw new Error(`Search failed: ${searchResponse.status} ${searchResponse.statusText}`);
    }

    const searchData = await searchResponse.json();
    if (!searchData.result) {
        throw new Error(`Search error: ${searchData.message}`);
    }

    const products: any[] = searchData.data.content?.[0]?.productList || [];
    console.log(`   Found ${searchData.data.totalRecords} total, got ${products.length} results`);
    console.log('');

    if (!products.length) {
        console.error('❌ No products found!');
        process.exit(1);
    }

    // Step 3: Convert and save (no API calls needed)
    console.log('🔄 Step 3/3: Converting and saving...');
    const shopProducts = products.map((cj, i) => convertCJProduct(cj, MARKUP, i));

    // Ensure unique slugs
    const usedSlugs = new Set<string>();
    for (const product of shopProducts) {
        let slug = product.slug;
        let counter = 1;
        const originalSlug = slug;
        while (usedSlugs.has(slug)) {
            slug = `${originalSlug}-${counter}`;
            counter++;
        }
        product.slug = slug;
        usedSlugs.add(slug);
    }

    // Save
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(shopProducts, null, 2), 'utf-8');

    // Summary
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  ✅ Import Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  Products imported: ${shopProducts.length}`);
    console.log(`  Saved to: ${DATA_FILE}`);
    console.log('');
    console.log('  Products:');
    for (const p of shopProducts) {
        console.log(`    • ${p.name}`);
        console.log(`      $${p.price.toFixed(2)} (cost: $${p.costPrice.toFixed(2)}) | ${p.images.length} imgs | ${p.variants.length} vars`);
    }
    console.log('');
    console.log('  🎉 Shop page should auto-refresh with new products!');
    console.log('');
}

main().catch(err => {
    console.error('');
    console.error('❌ Import failed:', err.message);
    process.exit(1);
});
