import productsData from '@/data/products.json';

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
  badge?: 'Best Overall' | 'Best Value' | 'Premium Pick' | 'Budget Pick' | "Editor's Choice";
  rank: number;
  lastUpdated: string;
}

export const products: Product[] = productsData as Product[];

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
