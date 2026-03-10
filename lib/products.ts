export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  affiliateUrl: string;
  amazonUrl?: string;
  features: string[];
  pros: string[];
  cons: string[];
  specs: {
    dimensions: string;
    weight: string;
    capacity: string;
    litterType: string;
    cleaningCycle: string;
    noiseLevel: string;
    warranty: string;
    connectivity: string;
  };
  badge?: 'Best Overall' | 'Best Value' | 'Premium Pick' | 'Budget Pick' | 'Editor\'s Choice';
  rank: number;
  lastUpdated: string;
}

export const products: Product[] = [
  {
    id: 'generated-product-1',
    slug: 'generated-product-1',
    name: 'SmartyKat Premium Cat Tree Tower V3',
    brand: 'SmartyKat',
    tagline: 'High quality furniture for your feline friend',
    description: 'Provide the best for your cat with the SmartyKat Cat Tree Tower. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 114,
    originalPrice: 136,
    rating: 3.7,
    reviewCount: 1295,
    image: 'https://images.unsplash.com/photo-1574158622621-ce9f43f8eeb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1574158622621-ce9f43f8eeb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B06I7OXLPZ?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B06I7OXLPZ?tag=jyu0e-20',
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
    rank: 5,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-2',
    slug: 'generated-product-2',
    name: 'CatCraft Premium Premium Clumping Cat Litter V1',
    brand: 'CatCraft',
    tagline: 'High quality consumable for your feline friend',
    description: 'Provide the best for your cat with the CatCraft Premium Clumping Cat Litter. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 24,
    originalPrice: 36,
    rating: 4.2,
    reviewCount: 1017,
    image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1495360010541-f48722b34f7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0SEDP7L6V?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0SEDP7L6V?tag=jyu0e-20',
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
    rank: 6,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-3',
    slug: 'generated-product-3',
    name: 'CatCraft Premium Cat Carrier Backpack V4',
    brand: 'CatCraft',
    tagline: 'High quality travel for your feline friend',
    description: 'Provide the best for your cat with the CatCraft Cat Carrier Backpack. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 44,
    originalPrice: 50,
    rating: 3.7,
    reviewCount: 1694,
    image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0FIND6642?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0FIND6642?tag=jyu0e-20',
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
    rank: 7,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-4',
    slug: 'generated-product-4',
    name: 'Purina Premium Cat Tree Tower V4',
    brand: 'Purina',
    tagline: 'High quality furniture for your feline friend',
    description: 'Provide the best for your cat with the Purina Cat Tree Tower. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 92,
    originalPrice: 102,
    rating: 3.8,
    reviewCount: 4266,
    image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B036W3RIRC?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B036W3RIRC?tag=jyu0e-20',
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
    rank: 8,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-5',
    slug: 'generated-product-5',
    name: 'Frisco Premium Interactive Cat Toy V1',
    brand: 'Frisco',
    tagline: 'High quality toy for your feline friend',
    description: 'Provide the best for your cat with the Frisco Interactive Cat Toy. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 27,
    originalPrice: 38,
    rating: 4.4,
    reviewCount: 4655,
    image: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0A4J7OX1V?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0A4J7OX1V?tag=jyu0e-20',
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
    rank: 9,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-6',
    slug: 'generated-product-6',
    name: 'SmartyKat Premium Catnip Wall Balls V5',
    brand: 'SmartyKat',
    tagline: 'High quality toy for your feline friend',
    description: 'Provide the best for your cat with the SmartyKat Catnip Wall Balls. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 13,
    originalPrice: 32,
    rating: 4.5,
    reviewCount: 2378,
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B09Z9LKSK3?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B09Z9LKSK3?tag=jyu0e-20',
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
    rank: 10,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-7',
    slug: 'generated-product-7',
    name: 'Whisker Premium Interactive Cat Toy V4',
    brand: 'Whisker',
    tagline: 'High quality toy for your feline friend',
    description: 'Provide the best for your cat with the Whisker Interactive Cat Toy. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 23,
    originalPrice: 35,
    rating: 4.0,
    reviewCount: 1151,
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0H86DS7A8?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0H86DS7A8?tag=jyu0e-20',
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
    rank: 11,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-8',
    slug: 'generated-product-8',
    name: 'Purina Premium Premium Clumping Cat Litter V2',
    brand: 'Purina',
    tagline: 'High quality consumable for your feline friend',
    description: 'Provide the best for your cat with the Purina Premium Clumping Cat Litter. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 27,
    originalPrice: 49,
    rating: 3.7,
    reviewCount: 2445,
    image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0ZUCHD2B6?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0ZUCHD2B6?tag=jyu0e-20',
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
    rank: 12,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-9',
    slug: 'generated-product-9',
    name: 'SmartyKat Premium Cat Tree Tower V2',
    brand: 'SmartyKat',
    tagline: 'High quality furniture for your feline friend',
    description: 'Provide the best for your cat with the SmartyKat Cat Tree Tower. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 133,
    originalPrice: 143,
    rating: 4.1,
    reviewCount: 4337,
    image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0E0F3LPRI?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0E0F3LPRI?tag=jyu0e-20',
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
    rank: 13,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-10',
    slug: 'generated-product-10',
    name: 'Frisco Premium Stainless Steel Water Fountain V3',
    brand: 'Frisco',
    tagline: 'High quality fountain for your feline friend',
    description: 'Provide the best for your cat with the Frisco Stainless Steel Water Fountain. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 27,
    originalPrice: 33,
    rating: 4.2,
    reviewCount: 2386,
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0XXZ8BKOU?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0XXZ8BKOU?tag=jyu0e-20',
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
    rank: 14,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-11',
    slug: 'generated-product-11',
    name: 'CatCraft Premium Self-Cleaning Litter Box V3',
    brand: 'CatCraft',
    tagline: 'High quality litter box for your feline friend',
    description: 'Provide the best for your cat with the CatCraft Self-Cleaning Litter Box. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 521,
    originalPrice: 526,
    rating: 4.7,
    reviewCount: 3370,
    image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1495360010541-f48722b34f7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B01PCBKZSV?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B01PCBKZSV?tag=jyu0e-20',
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
    rank: 15,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-12',
    slug: 'generated-product-12',
    name: 'Purina Premium Stainless Steel Water Fountain V5',
    brand: 'Purina',
    tagline: 'High quality fountain for your feline friend',
    description: 'Provide the best for your cat with the Purina Stainless Steel Water Fountain. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 47,
    originalPrice: 63,
    rating: 4.9,
    reviewCount: 495,
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0LGWL3AJO?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0LGWL3AJO?tag=jyu0e-20',
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
    rank: 16,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-13',
    slug: 'generated-product-13',
    name: 'SmartyKat Premium Interactive Cat Toy V2',
    brand: 'SmartyKat',
    tagline: 'High quality toy for your feline friend',
    description: 'Provide the best for your cat with the SmartyKat Interactive Cat Toy. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 25,
    originalPrice: 49,
    rating: 3.9,
    reviewCount: 2002,
    image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1543852786-1cf6624b9987?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0Q3WLTB1Z?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0Q3WLTB1Z?tag=jyu0e-20',
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
    rank: 17,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-14',
    slug: 'generated-product-14',
    name: 'Arm & Hammer Premium Automatic Cat Feeder V2',
    brand: 'Arm & Hammer',
    tagline: 'High quality feeder for your feline friend',
    description: 'Provide the best for your cat with the Arm & Hammer Automatic Cat Feeder. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 114,
    originalPrice: 130,
    rating: 4.0,
    reviewCount: 1841,
    image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1543852786-1cf6624b9987?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0SXLIB2Z2?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0SXLIB2Z2?tag=jyu0e-20',
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
    rank: 18,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-15',
    slug: 'generated-product-15',
    name: 'CatLink Premium Premium Clumping Cat Litter V1',
    brand: 'CatLink',
    tagline: 'High quality consumable for your feline friend',
    description: 'Provide the best for your cat with the CatLink Premium Clumping Cat Litter. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 22,
    originalPrice: 43,
    rating: 4.2,
    reviewCount: 4577,
    image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1495360010541-f48722b34f7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0O34JKWQJ?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0O34JKWQJ?tag=jyu0e-20',
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
    rank: 19,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-16',
    slug: 'generated-product-16',
    name: 'Frisco Premium Interactive Cat Toy V4',
    brand: 'Frisco',
    tagline: 'High quality toy for your feline friend',
    description: 'Provide the best for your cat with the Frisco Interactive Cat Toy. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 23,
    originalPrice: 39,
    rating: 4.0,
    reviewCount: 2525,
    image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1495360010541-f48722b34f7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B09D57U42S?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B09D57U42S?tag=jyu0e-20',
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
    rank: 20,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-17',
    slug: 'generated-product-17',
    name: 'Purina Premium Self-Cleaning Litter Box V2',
    brand: 'Purina',
    tagline: 'High quality litter box for your feline friend',
    description: 'Provide the best for your cat with the Purina Self-Cleaning Litter Box. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 559,
    originalPrice: 564,
    rating: 4.7,
    reviewCount: 3319,
    image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0J9LOYLO4?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0J9LOYLO4?tag=jyu0e-20',
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
    rank: 21,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-18',
    slug: 'generated-product-18',
    name: 'SmartyKat Premium Automatic Cat Feeder V2',
    brand: 'SmartyKat',
    tagline: 'High quality feeder for your feline friend',
    description: 'Provide the best for your cat with the SmartyKat Automatic Cat Feeder. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 90,
    originalPrice: 110,
    rating: 4.8,
    reviewCount: 1128,
    image: 'https://images.unsplash.com/photo-1574158622621-ce9f43f8eeb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1574158622621-ce9f43f8eeb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B05SHHY1UF?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B05SHHY1UF?tag=jyu0e-20',
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
    rank: 22,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-19',
    slug: 'generated-product-19',
    name: 'CatCraft Premium Premium Clumping Cat Litter V1',
    brand: 'CatCraft',
    tagline: 'High quality consumable for your feline friend',
    description: 'Provide the best for your cat with the CatCraft Premium Clumping Cat Litter. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 26,
    originalPrice: 31,
    rating: 4.8,
    reviewCount: 710,
    image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B00P89EJWN?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B00P89EJWN?tag=jyu0e-20',
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
    rank: 23,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-20',
    slug: 'generated-product-20',
    name: 'PetKit Premium Stainless Steel Water Fountain V3',
    brand: 'PetKit',
    tagline: 'High quality fountain for your feline friend',
    description: 'Provide the best for your cat with the PetKit Stainless Steel Water Fountain. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 37,
    originalPrice: 57,
    rating: 3.6,
    reviewCount: 538,
    image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0SJZZJSZV?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0SJZZJSZV?tag=jyu0e-20',
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
    rank: 24,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-21',
    slug: 'generated-product-21',
    name: 'PetKit Premium Automatic Cat Feeder V3',
    brand: 'PetKit',
    tagline: 'High quality feeder for your feline friend',
    description: 'Provide the best for your cat with the PetKit Automatic Cat Feeder. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 109,
    originalPrice: 130,
    rating: 4.2,
    reviewCount: 4473,
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0WB773WSR?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0WB773WSR?tag=jyu0e-20',
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
    rank: 25,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-22',
    slug: 'generated-product-22',
    name: 'Whisker Premium Automatic Cat Feeder V3',
    brand: 'Whisker',
    tagline: 'High quality feeder for your feline friend',
    description: 'Provide the best for your cat with the Whisker Automatic Cat Feeder. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 73,
    originalPrice: 88,
    rating: 3.6,
    reviewCount: 4633,
    image: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B09FCXA31E?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B09FCXA31E?tag=jyu0e-20',
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
    rank: 26,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-23',
    slug: 'generated-product-23',
    name: 'Whisker Premium Odor Eliminator Gel V2',
    brand: 'Whisker',
    tagline: 'High quality accessory for your feline friend',
    description: 'Provide the best for your cat with the Whisker Odor Eliminator Gel. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 20,
    originalPrice: 30,
    rating: 3.8,
    reviewCount: 941,
    image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1543852786-1cf6624b9987?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0M4PHXVS1?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0M4PHXVS1?tag=jyu0e-20',
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
    rank: 27,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-24',
    slug: 'generated-product-24',
    name: 'CatLink Premium Automatic Cat Feeder V1',
    brand: 'CatLink',
    tagline: 'High quality feeder for your feline friend',
    description: 'Provide the best for your cat with the CatLink Automatic Cat Feeder. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 75,
    originalPrice: 95,
    rating: 3.9,
    reviewCount: 3643,
    image: 'https://images.unsplash.com/photo-1574158622621-ce9f43f8eeb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1574158622621-ce9f43f8eeb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0KH0V3K75?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0KH0V3K75?tag=jyu0e-20',
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
    rank: 28,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-25',
    slug: 'generated-product-25',
    name: 'CatCraft Premium Catnip Wall Balls V1',
    brand: 'CatCraft',
    tagline: 'High quality toy for your feline friend',
    description: 'Provide the best for your cat with the CatCraft Catnip Wall Balls. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 8,
    originalPrice: 15,
    rating: 4.7,
    reviewCount: 4108,
    image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1543852786-1cf6624b9987?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0CM2CBAWL?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0CM2CBAWL?tag=jyu0e-20',
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
    rank: 29,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-26',
    slug: 'generated-product-26',
    name: 'PetKit Premium Cat Tree Tower V1',
    brand: 'PetKit',
    tagline: 'High quality furniture for your feline friend',
    description: 'Provide the best for your cat with the PetKit Cat Tree Tower. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 84,
    originalPrice: 91,
    rating: 4.7,
    reviewCount: 3296,
    image: 'https://images.unsplash.com/photo-1574158622621-ce9f43f8eeb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1574158622621-ce9f43f8eeb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0YBJR6DPY?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0YBJR6DPY?tag=jyu0e-20',
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
    rank: 30,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-27',
    slug: 'generated-product-27',
    name: 'SmartyKat Premium Self-Cleaning Litter Box V5',
    brand: 'SmartyKat',
    tagline: 'High quality litter box for your feline friend',
    description: 'Provide the best for your cat with the SmartyKat Self-Cleaning Litter Box. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 488,
    originalPrice: 494,
    rating: 4.6,
    reviewCount: 370,
    image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B008RO69JV?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B008RO69JV?tag=jyu0e-20',
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
    rank: 31,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-28',
    slug: 'generated-product-28',
    name: 'PetKit Premium Cat Litter Trapping Mat V4',
    brand: 'PetKit',
    tagline: 'High quality accessory for your feline friend',
    description: 'Provide the best for your cat with the PetKit Cat Litter Trapping Mat. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 22,
    originalPrice: 41,
    rating: 4.2,
    reviewCount: 1343,
    image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0262VG9WJ?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0262VG9WJ?tag=jyu0e-20',
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
    rank: 32,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-29',
    slug: 'generated-product-29',
    name: 'SmartyKat Premium Self-Cleaning Litter Box V3',
    brand: 'SmartyKat',
    tagline: 'High quality litter box for your feline friend',
    description: 'Provide the best for your cat with the SmartyKat Self-Cleaning Litter Box. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 347,
    originalPrice: 367,
    rating: 4.0,
    reviewCount: 343,
    image: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0C7B2P7KF?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0C7B2P7KF?tag=jyu0e-20',
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
    rank: 33,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-30',
    slug: 'generated-product-30',
    name: 'SmartyKat Premium Cat Carrier Backpack V3',
    brand: 'SmartyKat',
    tagline: 'High quality travel for your feline friend',
    description: 'Provide the best for your cat with the SmartyKat Cat Carrier Backpack. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 38,
    originalPrice: 43,
    rating: 3.7,
    reviewCount: 114,
    image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B025NPOMOI?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B025NPOMOI?tag=jyu0e-20',
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
    rank: 34,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-31',
    slug: 'generated-product-31',
    name: 'Purina Premium Cat Litter Trapping Mat V1',
    brand: 'Purina',
    tagline: 'High quality accessory for your feline friend',
    description: 'Provide the best for your cat with the Purina Cat Litter Trapping Mat. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 28,
    originalPrice: 50,
    rating: 3.8,
    reviewCount: 2646,
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0SA5143CP?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0SA5143CP?tag=jyu0e-20',
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
    rank: 35,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-32',
    slug: 'generated-product-32',
    name: 'PetKit Premium Cat Tree Tower V2',
    brand: 'PetKit',
    tagline: 'High quality furniture for your feline friend',
    description: 'Provide the best for your cat with the PetKit Cat Tree Tower. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 113,
    originalPrice: 128,
    rating: 4.6,
    reviewCount: 4161,
    image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0JQ9SXMS6?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0JQ9SXMS6?tag=jyu0e-20',
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
    rank: 36,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-33',
    slug: 'generated-product-33',
    name: 'Arm & Hammer Premium Self-Cleaning Litter Box V3',
    brand: 'Arm & Hammer',
    tagline: 'High quality litter box for your feline friend',
    description: 'Provide the best for your cat with the Arm & Hammer Self-Cleaning Litter Box. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 571,
    originalPrice: 579,
    rating: 3.8,
    reviewCount: 327,
    image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1495360010541-f48722b34f7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0IDCQNZ4I?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0IDCQNZ4I?tag=jyu0e-20',
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
    rank: 37,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-34',
    slug: 'generated-product-34',
    name: 'Whisker Premium Catnip Wall Balls V2',
    brand: 'Whisker',
    tagline: 'High quality toy for your feline friend',
    description: 'Provide the best for your cat with the Whisker Catnip Wall Balls. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 9,
    originalPrice: 31,
    rating: 4.8,
    reviewCount: 1173,
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0GYPRRBY7?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0GYPRRBY7?tag=jyu0e-20',
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
    rank: 38,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-35',
    slug: 'generated-product-35',
    name: 'Frisco Premium Automatic Cat Feeder V2',
    brand: 'Frisco',
    tagline: 'High quality feeder for your feline friend',
    description: 'Provide the best for your cat with the Frisco Automatic Cat Feeder. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 80,
    originalPrice: 103,
    rating: 4.4,
    reviewCount: 4172,
    image: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0BMS1QRBN?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0BMS1QRBN?tag=jyu0e-20',
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
    rank: 39,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-36',
    slug: 'generated-product-36',
    name: 'Whisker Premium Premium Clumping Cat Litter V5',
    brand: 'Whisker',
    tagline: 'High quality consumable for your feline friend',
    description: 'Provide the best for your cat with the Whisker Premium Clumping Cat Litter. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 35,
    originalPrice: 42,
    rating: 4.3,
    reviewCount: 934,
    image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1495360010541-f48722b34f7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0T0TQIFJJ?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0T0TQIFJJ?tag=jyu0e-20',
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
    rank: 40,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-37',
    slug: 'generated-product-37',
    name: 'SmartyKat Premium Odor Eliminator Gel V1',
    brand: 'SmartyKat',
    tagline: 'High quality accessory for your feline friend',
    description: 'Provide the best for your cat with the SmartyKat Odor Eliminator Gel. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 11,
    originalPrice: 24,
    rating: 3.9,
    reviewCount: 2147,
    image: 'https://images.unsplash.com/photo-1574158622621-ce9f43f8eeb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1574158622621-ce9f43f8eeb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B023QCT22O?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B023QCT22O?tag=jyu0e-20',
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
    rank: 41,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-38',
    slug: 'generated-product-38',
    name: 'CatLink Premium Cat Carrier Backpack V5',
    brand: 'CatLink',
    tagline: 'High quality travel for your feline friend',
    description: 'Provide the best for your cat with the CatLink Cat Carrier Backpack. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 41,
    originalPrice: 65,
    rating: 4.8,
    reviewCount: 4330,
    image: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B01EPDL8RL?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B01EPDL8RL?tag=jyu0e-20',
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
    rank: 42,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-39',
    slug: 'generated-product-39',
    name: 'CatCraft Premium Automatic Cat Feeder V3',
    brand: 'CatCraft',
    tagline: 'High quality feeder for your feline friend',
    description: 'Provide the best for your cat with the CatCraft Automatic Cat Feeder. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 60,
    originalPrice: 82,
    rating: 4.2,
    reviewCount: 783,
    image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1543852786-1cf6624b9987?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0FUUN2BL5?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0FUUN2BL5?tag=jyu0e-20',
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
    rank: 43,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-40',
    slug: 'generated-product-40',
    name: 'Whisker Premium Cat Carrier Backpack V3',
    brand: 'Whisker',
    tagline: 'High quality travel for your feline friend',
    description: 'Provide the best for your cat with the Whisker Cat Carrier Backpack. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 38,
    originalPrice: 46,
    rating: 3.6,
    reviewCount: 777,
    image: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0QZDFAZIT?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0QZDFAZIT?tag=jyu0e-20',
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
    rank: 44,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-41',
    slug: 'generated-product-41',
    name: 'Arm & Hammer Premium Cat Litter Trapping Mat V2',
    brand: 'Arm & Hammer',
    tagline: 'High quality accessory for your feline friend',
    description: 'Provide the best for your cat with the Arm & Hammer Cat Litter Trapping Mat. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 22,
    originalPrice: 42,
    rating: 3.8,
    reviewCount: 4515,
    image: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0PF460PZD?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0PF460PZD?tag=jyu0e-20',
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
    rank: 45,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-42',
    slug: 'generated-product-42',
    name: 'CatLink Premium Catnip Wall Balls V1',
    brand: 'CatLink',
    tagline: 'High quality toy for your feline friend',
    description: 'Provide the best for your cat with the CatLink Catnip Wall Balls. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 14,
    originalPrice: 33,
    rating: 4.0,
    reviewCount: 3929,
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0SXCZSEJY?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0SXCZSEJY?tag=jyu0e-20',
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
    rank: 46,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-43',
    slug: 'generated-product-43',
    name: 'PetKit Premium Automatic Cat Feeder V5',
    brand: 'PetKit',
    tagline: 'High quality feeder for your feline friend',
    description: 'Provide the best for your cat with the PetKit Automatic Cat Feeder. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 102,
    originalPrice: 117,
    rating: 4.2,
    reviewCount: 5056,
    image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0HZNEZZNA?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0HZNEZZNA?tag=jyu0e-20',
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
    rank: 47,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-44',
    slug: 'generated-product-44',
    name: 'Frisco Premium Self-Cleaning Litter Box V4',
    brand: 'Frisco',
    tagline: 'High quality litter box for your feline friend',
    description: 'Provide the best for your cat with the Frisco Self-Cleaning Litter Box. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 320,
    originalPrice: 342,
    rating: 4.0,
    reviewCount: 2326,
    image: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0Z6H7V38G?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0Z6H7V38G?tag=jyu0e-20',
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
    rank: 48,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-45',
    slug: 'generated-product-45',
    name: 'SmartyKat Premium Premium Clumping Cat Litter V4',
    brand: 'SmartyKat',
    tagline: 'High quality consumable for your feline friend',
    description: 'Provide the best for your cat with the SmartyKat Premium Clumping Cat Litter. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 28,
    originalPrice: 51,
    rating: 3.8,
    reviewCount: 1166,
    image: 'https://images.unsplash.com/photo-1574158622621-ce9f43f8eeb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1574158622621-ce9f43f8eeb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0DJ935U6Y?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0DJ935U6Y?tag=jyu0e-20',
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
    rank: 49,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-46',
    slug: 'generated-product-46',
    name: 'Arm & Hammer Premium Cat Litter Trapping Mat V1',
    brand: 'Arm & Hammer',
    tagline: 'High quality accessory for your feline friend',
    description: 'Provide the best for your cat with the Arm & Hammer Cat Litter Trapping Mat. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 26,
    originalPrice: 31,
    rating: 3.8,
    reviewCount: 3856,
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0LPJWGXF6?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0LPJWGXF6?tag=jyu0e-20',
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
    rank: 50,
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'generated-product-47',
    slug: 'generated-product-47',
    name: 'Frisco Premium Stainless Steel Water Fountain V3',
    brand: 'Frisco',
    tagline: 'High quality fountain for your feline friend',
    description: 'Provide the best for your cat with the Frisco Stainless Steel Water Fountain. Designed with both your pet\'s comfort and your convenience in mind. Constructed from durable, pet-safe materials to ensure longevity and safety.',
    price: 31,
    originalPrice: 40,
    rating: 4.4,
    reviewCount: 4124,
    image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    affiliateUrl: 'https://www.amazon.com/dp/B0PIEV8O8T?tag=jyu0e-20',
    amazonUrl: 'https://www.amazon.com/dp/B0PIEV8O8T?tag=jyu0e-20',
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
    rank: 51,
    lastUpdated: new Date().toISOString().split('T')[0],
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getAllProducts(): Product[] {
  return products.sort((a, b) => a.rank - b.rank);
}

export function getProductsByBadge(badge: Product['badge']): Product[] {
  return products.filter((p) => p.badge === badge);
}

export function compareProducts(slugs: string[]): Product[] {
  return slugs
    .map((slug) => getProductBySlug(slug))
    .filter((p): p is Product => p !== undefined);
}

export function getRelatedProducts(slug: string, limit = 3): Product[] {
  return products.filter((p) => p.slug !== slug).slice(0, limit);
}
