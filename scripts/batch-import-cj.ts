import { searchProducts } from '../lib/cjApi';
import { addShopProducts, getAllShopProducts } from '../lib/shopProducts';

const KEYWORDS = [
    'cat litter',
    'automatic litter box',
    'self cleaning litter box',
    'cat litter box',
];
const TARGET = 200;
const MARKUP = 1.5;
const PAGE_SIZE = 50;

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  CJ Batch Import - Cat Litter Products');
    console.log('  Target: 200 products');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

    // Get existing product IDs to avoid duplicates
    const existing = getAllShopProducts();
    const existingPids = new Set(existing.map(p => p.cjPid));
    console.log(`Existing products: ${existing.length} (${existingPids.size} unique CJ PIDs)`);

    const seen = new Set<string>();
    const collected: any[] = [];

    for (const keyword of KEYWORDS) {
        if (collected.length >= TARGET) break;

        for (let page = 1; page <= 4; page++) {
            if (collected.length >= TARGET) break;

            console.log(`\n🔍 Searching "${keyword}" page ${page}...`);
            try {
                const result = await searchProducts(keyword, page, PAGE_SIZE);
                const products = result.list || [];
                console.log(`   Got ${products.length} results (total: ${result.total})`);

                for (const p of products) {
                    if (collected.length >= TARGET) break;
                    if (seen.has(p.pid)) continue;
                    if (existingPids.has(p.pid)) {
                        seen.add(p.pid);
                        continue;
                    }
                    seen.add(p.pid);
                    collected.push(p);
                }

                if (products.length < PAGE_SIZE) break;

                // Rate limit: 300s between calls
                if (collected.length < TARGET) {
                    const remaining = TARGET - collected.length;
                    console.log(`   Collected ${collected.length}/${TARGET} so far. Waiting 310s for rate limit... (${remaining} more to go)`);
                    for (let i = 310; i > 0; i -= 15) {
                        process.stdout.write(`\r   ⏳ ${i}s...`);
                        await sleep(15000);
                    }
                    console.log('\r   ✅ Cooldown complete!     ');
                }
            } catch (err: any) {
                console.error(`   ❌ Search failed: ${err.message}`);
                console.log('   Waiting 310s before retrying...');
                await sleep(310000);
                page--;
            }
        }
    }

    console.log(`\n\n📊 Total collected: ${collected.length} unique products`);
    if (collected.length === 0) {
        console.log('❌ No new products to import.');
        return;
    }

    // Take top 200
    const toImport = collected.slice(0, TARGET);
    console.log(`\n🔄 Importing ${toImport.length} products...`);

    const shopProducts = toImport.map((cj: any) => ({
        cjPid: cj.pid,
        name: cj.productNameEn || cj.productName,
        description: cj.description || cj.productBrief || '',
        shortDescription: cj.productBrief || cj.productNameEn || '',
        category: cj.categoryName || 'Cat Litter',
        images: cj.productImageSet?.length > 0
            ? cj.productImageSet
            : [cj.productImage].filter(Boolean),
        price: parseFloat((cj.sellPrice * MARKUP).toFixed(2)),
        costPrice: cj.sellPrice,
        originalPrice: parseFloat((cj.sellPrice * MARKUP * 1.2).toFixed(2)),
        currency: 'USD',
        variants: (cj.variants || []).map((v: any) => ({
            id: v.vid,
            name: v.variantNameEn || v.variantName,
            sku: v.variantSku,
            price: parseFloat((v.variantSellPrice * MARKUP).toFixed(2)),
            costPrice: v.variantSellPrice,
            image: v.variantImage || '',
            properties: v.variantProperty || '',
            inStock: true,
        })),
        weight: cj.productWeight || 0,
        sku: cj.productSku,
        inStock: true,
        visible: true,
        featured: false,
        tags: [],
    }));

    const imported = addShopProducts(shopProducts);

    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  ✅ Import Complete!`);
    console.log(`     ${imported.length} products imported`);
    console.log(`     Total shop products: ${existing.length + imported.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

    // Show first 10
    for (const p of imported.slice(0, 10)) {
        console.log(`  • ${p.name}`);
        console.log(`    $${p.price.toFixed(2)} | ${p.images.length} imgs | ${p.variants.length} vars`);
    }
    if (imported.length > 10) {
        console.log(`  ... and ${imported.length - 10} more`);
    }
    console.log('');
}

main().catch(err => {
    console.error('\n❌ Import failed:', err.message);
    process.exit(1);
});
