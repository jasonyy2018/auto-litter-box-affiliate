import * as fs from 'fs';
import * as path from 'path';

// Load .env file
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
            const [key, ...vals] = trimmed.split('=');
            if (key && !process.env[key.trim()]) {
                process.env[key.trim()] = vals.join('=').trim();
            }
        }
    }
}
process.env.CJ_API_KEY ||= 'CJ1277084@api@adc541e7b3614adba215eb7686504073';

import { getProductDetail } from '../lib/cjApi';
import { sanitizeCJDescription, stripHtmlTags, mapCJVariants, enrichProductImages } from '../lib/cjSanitizer';

const DATA_FILE = path.join(process.cwd(), 'data', 'shop-products.json');

function getDynamicMarkup(cost: number): number {
    if (cost < 10) return 3.5;
    if (cost < 50) return 2.5;
    if (cost < 150) return 2.2;
    return 1.6;
}

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  🔄 Comprehensive CJ Product, Images & Price Variant Enrichment');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const products = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const cjProducts = products.filter((p: any) => p.cjPid);

    console.log(`Found ${cjProducts.length} CJ products to process...`);
    console.log('');

    let updatedCount = 0;
    let totalVariantsAdded = 0;
    let totalImagesSynced = 0;

    for (let i = 0; i < cjProducts.length; i++) {
        const product = cjProducts[i];
        console.log(`[${i + 1}/${cjProducts.length}] Processing PID ${product.cjPid}: ${product.name.slice(0, 45)}...`);

        try {
            const detail = await getProductDetail(product.cjPid);

            // 1. Calculate main prices
            const costs = (detail.variants || []).map((v: any) => parseFloat(v.variantSellPrice)).filter((c: number) => !isNaN(c) && c > 0);
            const maxCost = Math.max(...costs, detail.sellPrice || 0);
            const threshold = maxCost > 50 ? Math.max(30, maxCost * 0.25) : 0;
            const mainVariants = (detail.variants || []).filter((v: any) => v.variantSellPrice >= threshold);
            const primaryVariant = mainVariants.length
                ? mainVariants.sort((a: any, b: any) => a.variantSellPrice - b.variantSellPrice)[0]
                : detail.variants?.[0];

            const newCostPrice = primaryVariant ? primaryVariant.variantSellPrice : (detail.sellPrice || product.costPrice || 0);
            const sellingPrice = parseFloat((newCostPrice * getDynamicMarkup(newCostPrice)).toFixed(2));
            const originalPrice = parseFloat((sellingPrice * 1.2).toFixed(2));

            product.costPrice = newCostPrice;
            product.price = sellingPrice;
            product.originalPrice = originalPrice;

            // 2. Map all CJ SKU variants
            const mappedVariants = mapCJVariants(
                detail.variants || [],
                detail.productSku || product.sku,
                newCostPrice,
                getDynamicMarkup
            );

            if (mappedVariants.length > 0) {
                product.variants = mappedVariants;
                totalVariantsAdded += mappedVariants.length;
            }

            // 3. Merge & Enrich full photo gallery
            const fullImages = enrichProductImages(
                detail.productImage || product.images?.[0],
                detail.productImageSet,
                mappedVariants
            );
            if (fullImages.length > 0) {
                product.images = fullImages;
                totalImagesSynced += fullImages.length;
            }

            // 4. Sanitize HTML description & clean plain text short description
            const rawDesc = detail.description || detail.productBrief || product.description || '';
            const cleanDesc = sanitizeCJDescription(rawDesc);
            if (cleanDesc) {
                product.description = cleanDesc;
                product.shortDescription = stripHtmlTags(detail.productBrief || rawDesc).slice(0, 200);
            }

            // 5. Update status & timestamp
            product.cjStatus = 'active';
            product.lastSyncedAt = new Date().toISOString();
            if (detail.productWeight) product.weight = detail.productWeight;

            updatedCount++;
            console.log(`   ✅ Synced: ${fullImages.length} images | ${mappedVariants.length} variants | Price: $${sellingPrice}`);
        } catch (err: any) {
            console.error(`   ❌ PID ${product.cjPid} error: ${err.message}`);
        }

        // Pause 1.5s between API calls to honor rate limits
        if (i < cjProducts.length - 1) {
            await sleep(1500);
        }
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), 'utf-8');

    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  🎉 Comprehensive Enrichment Complete!');
    console.log(`  Updated ${updatedCount} products`);
    console.log(`  Total gallery images synced: ${totalImagesSynced}`);
    console.log(`  Total variants mapped: ${totalVariantsAdded}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
