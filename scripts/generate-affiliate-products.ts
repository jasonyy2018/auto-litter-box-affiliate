import fs from 'fs';
import path from 'path';

// Pre-defined categories for realistic generation
const categories = [
    { name: 'Self-Cleaning Litter Box', basePrice: 300, maxPrice: 600, tag: 'Litter Box' },
    { name: 'Cat Litter Trapping Mat', basePrice: 15, maxPrice: 40, tag: 'Accessory' },
    { name: 'Premium Clumping Cat Litter', basePrice: 20, maxPrice: 35, tag: 'Consumable' },
    { name: 'Automatic Cat Feeder', basePrice: 60, maxPrice: 120, tag: 'Feeder' },
    { name: 'Stainless Steel Water Fountain', basePrice: 25, maxPrice: 50, tag: 'Fountain' },
    { name: 'Odor Eliminator Gel', basePrice: 10, maxPrice: 20, tag: 'Accessory' },
    { name: 'Cat Tree Tower', basePrice: 50, maxPrice: 150, tag: 'Furniture' },
    { name: 'Interactive Cat Toy', basePrice: 15, maxPrice: 30, tag: 'Toy' },
    { name: 'Cat Carrier Backpack', basePrice: 35, maxPrice: 70, tag: 'Travel' },
    { name: 'Catnip Wall Balls', basePrice: 8, maxPrice: 15, tag: 'Toy' },
];

const unsplashImages = [
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1511044568932-338cba0ad803?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1543852786-1cf6624b9987?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1574158622621-ce9f43f8eeb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
];

const brands = ['PetKit', 'Whisker', 'CatLink', 'Purina', 'Arm & Hammer', 'SmartyKat', 'Frisco', 'CatCraft'];

function randomChoice(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomProduct(index: number) {
    const cat = randomChoice(categories);
    const brand = randomChoice(brands);
    const price = Math.floor(Math.random() * (cat.maxPrice - cat.basePrice + 1)) + cat.basePrice;
    const rating = (Math.random() * 1.5 + 3.5).toFixed(1); // 3.5 to 5.0
    const reviewCount = Math.floor(Math.random() * 5000) + 100;
    const image = randomChoice(unsplashImages);
    // Fake ASIN generation
    const asin = 'B0' + Math.random().toString(36).substring(2, 10).toUpperCase();

    return `  {
    id: 'generated-product-${index}',
    slug: 'generated-product-${index}',
    name: '${brand} Premium ${cat.name} V${Math.floor(Math.random() * 5) + 1}',
    brand: '${brand}',
    tagline: 'High quality ${cat.tag.toLowerCase()} for your feline friend',
    description: 'Provide the best for your cat with the ${brand} ${cat.name}. Designed with both your pet\\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: ${price},
    originalPrice: ${price + Math.floor(Math.random() * 20) + 5},
    rating: ${rating},
    reviewCount: ${reviewCount},
    image: '${image}',
    images: ['${image}'],
    affiliateUrl: 'https://www.amazon.com/dp/${asin}?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/${asin}?tag=jyu0e-20',
    features: [
      'Durable construction',
      'Pet-safe materials',
      'Easy to maintain',
      'Modern design',
      'Recommended by vets'
    ],
    pros: [
      'High-quality materials',
      'Great value for money',
      'Cats love it'
    ],
    cons: [
      'May take time for cats to adapt'
    ],
    specs: {
      dimensions: 'Standard size',
      weight: 'Varies',
      capacity: 'All cats',
      litterType: 'N/A',
      cleaningCycle: 'N/A',
      noiseLevel: 'Quiet',
      warranty: '1 year',
      connectivity: 'N/A'
    },
    rank: ${index + 4},
    lastUpdated: new Date().toISOString().split('T')[0],
  }`;
}

async function updateProductsFile() {
    const filePath = path.join(process.cwd(), 'lib', 'products.ts');
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // We want to insert 47 products right before "];\n\nexport function getProductBySlug"
    const insertionPointStr = "];\n\nexport function getProductBySlug";
    const insertionIdx = fileContent.indexOf(insertionPointStr);

    if (insertionIdx === -1) {
        console.error('Could not find insertion point!');
        process.exit(1);
    }

    const existingProductsMatch = fileContent.match(/id:\s*'generated-product/g);
    if (existingProductsMatch && existingProductsMatch.length > 0) {
        console.log('Generated products already exist, aborting to prevent duplicates.');
        process.exit(0);
    }

    const generatedList = [];
    for (let i = 1; i <= 47; i++) {
        generatedList.push(generateRandomProduct(i));
    }

    const newProductsStr = ',\n' + generatedList.join(',\n');

    const updatedContent =
        fileContent.substring(0, insertionIdx) +
        newProductsStr +
        '\n' +
        fileContent.substring(insertionIdx);

    fs.writeFileSync(filePath, updatedContent, 'utf-8');
    console.log('Successfully added 47 new products to lib/products.ts!');
}

updateProductsFile().catch(console.error);
