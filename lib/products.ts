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
    id: 'litter-robot-4',
    slug: 'litter-robot-4',
    name: 'Litter-Robot 4',
    brand: 'Whisker',
    tagline: 'The Most Advanced Self-Cleaning Litter Box',
    description: 'The Litter-Robot 4 is the latest and most advanced automatic litter box from Whisker. With improved sensors, quieter operation, and a sleek design, it sets the standard for premium self-cleaning litter boxes.',
    price: 699,
    originalPrice: 749,
    rating: 4.8,
    reviewCount: 3250,
    image: 'https://images.unsplash.com/photo-1656323666679-bb5b99fe2f04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3Njk5MzE4NDh8&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1656323666679-bb5b99fe2f04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3Njk5MzE4NDh8&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    affiliateUrl: 'https://www.litter-robot.com/litter-robot-4.html',
    amazonUrl: 'https://www.amazon.com/dp/B0BK2MTW2Q?tag=affiliate-20',
    features: [
      'OmniSense detection system',
      'Whisper-quiet operation',
      'Real-time tracking via app',
      'Multi-cat support (up to 4 cats)',
      'Automatic night light',
      'Premium carbon filter',
    ],
    pros: [
      'Best-in-class odor control',
      'Very quiet operation',
      'Excellent app with health insights',
      'Accommodates large cats up to 25 lbs',
      'Premium build quality',
      '90-day money-back guarantee',
    ],
    cons: [
      'Highest price point',
      'Large footprint',
      'Proprietary waste bags recommended',
    ],
    specs: {
      dimensions: '22" W x 27" D x 30" H',
      weight: '24 lbs',
      capacity: 'Up to 4 cats',
      litterType: 'Clumping clay litter',
      cleaningCycle: '7 minutes',
      noiseLevel: '< 50 dB',
      warranty: '1 year (3 years extended available)',
      connectivity: 'WiFi + Bluetooth',
    },
    badge: 'Best Overall',
    rank: 1,
    lastUpdated: '2024-01-15',
  },
  {
    id: 'petkit-pura-max',
    slug: 'petkit-pura-max',
    name: 'PETKIT Pura Max',
    brand: 'PETKIT',
    tagline: 'Smart Litter Box with xSecure System',
    description: 'The PETKIT Pura Max combines cutting-edge technology with a spacious design. Its xSecure multi-safety protection system and advanced odor elimination make it a top choice for multi-cat households.',
    price: 549,
    originalPrice: 599,
    rating: 4.6,
    reviewCount: 2180,
    image: 'https://images.unsplash.com/photo-1614666459373-a766431de1a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3Njk5MzE4ODJ8&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1614666459373-a766431de1a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3Njk5MzE4ODJ8&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    affiliateUrl: 'https://www.petkit.com/products/pura-max',
    amazonUrl: 'https://www.amazon.com/dp/B09QKGZZ2K?tag=affiliate-20',
    features: [
      'xSecure 5-point safety system',
      'Infrared + weight sensors',
      'N50 odor eliminator spray',
      'Extra-large capacity',
      'Smart app control',
      'Auto deodorization',
    ],
    pros: [
      'Excellent value for features',
      'Very spacious interior',
      'Multiple safety sensors',
      'Built-in deodorizer',
      'Modern aesthetic design',
    ],
    cons: [
      'App can be buggy at times',
      'Deodorizer refills add cost',
      'Slightly louder than competitors',
    ],
    specs: {
      dimensions: '20.5" W x 24" D x 25.5" H',
      weight: '22 lbs',
      capacity: 'Up to 3 cats',
      litterType: 'Clumping litter',
      cleaningCycle: '5 minutes',
      noiseLevel: '< 55 dB',
      warranty: '1 year',
      connectivity: 'WiFi',
    },
    badge: 'Best Value',
    rank: 2,
    lastUpdated: '2024-01-15',
  },
  {
    id: 'catlink-scooper',
    slug: 'catlink-scooper',
    name: 'CatLink Scooper Standard Pro',
    brand: 'CatLink',
    tagline: 'Reliable Self-Cleaning Made Simple',
    description: 'The CatLink Scooper Standard Pro offers reliable automatic cleaning with a focus on simplicity and durability. Its straightforward design makes it a great entry point into automatic litter boxes.',
    price: 399,
    originalPrice: 449,
    rating: 4.4,
    reviewCount: 1560,
    image: 'https://images.unsplash.com/photo-1762500824773-c171c77c29c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3Njk5MzE5MTZ8&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1762500824773-c171c77c29c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3Njk5MzE5MTZ8&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    affiliateUrl: 'https://www.catlink.co/products/catlink-scooper-standard-pro',
    amazonUrl: 'https://www.amazon.com/dp/B08YNZQM2K?tag=affiliate-20',
    features: [
      'Double odor control system',
      'Smart weight monitoring',
      'Health data tracking',
      'Anti-tracking mat included',
      'Quiet motor design',
      'Easy-clean drawer',
    ],
    pros: [
      'Best budget-friendly option',
      'Simple setup and operation',
      'Reliable performance',
      'Compact design',
      'Good app features',
    ],
    cons: [
      'Smaller capacity',
      'Not ideal for very large cats',
      'Fewer premium features',
    ],
    specs: {
      dimensions: '19" W x 22" D x 24" H',
      weight: '18 lbs',
      capacity: 'Up to 2 cats',
      litterType: 'Clumping litter',
      cleaningCycle: '6 minutes',
      noiseLevel: '< 52 dB',
      warranty: '1 year',
      connectivity: 'WiFi',
    },
    badge: 'Budget Pick',
    rank: 3,
    lastUpdated: '2024-01-15',
  },
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
