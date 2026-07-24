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
import { sanitizeCJDescription, mapCJVariants } from '../lib/cjSanitizer';

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
    console.log('  🔄 Syncing Full CJ Product Details, Variants & Clean Descriptions');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const products = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const cjProducts = products.filter((p: any) => p.cjPid);

    console.log(`Found ${cjProducts.length} CJ products to enrich...`);
    console.log('');

    let updatedCount = 0;
    let totalVariantsAdded = 0;

    for (let i = 0; i < cjProducts.length; i++) {
        const product = cjProducts[i];
        console.log(`[${i + 1}/${cjProducts.length}] Fetching detail for: ${product.name.slice(0, 45)}...`);

        try {
            const detail = await getProductDetail(product.cjPid);

            // 1. Map all CJ SKU variants
            const mappedVariants = mapCJVariants(
                detail.variants || [],
                detail.productSku || product.sku,
                product.costPrice || detail.sellPrice || 0,
                getDynamicMarkup
            );

            if (mappedVariants.length > 0) {
                product.variants = mappedVariants;
                totalVariantsAdded += mappedVariants.length;
            }

            // 2. Sanitize & clean HTML description
            const rawDesc = detail.description || detail.productBrief || product.description || '';
            const cleanDesc = sanitizeCJDescription(rawDesc);
            if (cleanDesc) {
                product.description = cleanDesc;
            }

            // 3. Update status & timestamp
            product.cjStatus = 'active';
            product.lastSyncedAt = new Date().toISOString();
            if (detail.productImageSet?.length > 0) {
                product.images = detail.productImageSet;
            }

            updatedCount++;
            console.log(`   ✅ Synced: ${mappedVariants.length} variants mapped | Clean description updated`);
        } catch (err: any) {
            console.error(`   ❌ Failed to sync PID ${product.cjPid}: ${err.message}`);
        }

        // Wait 1.5s between CJ API calls to respect rate limit
        if (i < cjProducts.length - 1) {
            await sleep(1500);
        }
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), 'utf-8');

    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  🎉 Enrichment Complete!');
    console.log(`  Updated ${updatedCount} products`);
    console.log(`  Total variants mapped: ${totalVariantsAdded}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
