import { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/products';
import { siteConfig } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const products = getAllProducts();
  const baseUrl = siteConfig.url;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/best`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/deals`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
  ];

  // Product review pages
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/reviews/${product.slug}`,
    lastModified: new Date(product.lastUpdated),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Comparison pages
  const comparisonPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/compare/litter-robot-vs-petkit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/compare/petkit-vs-catlink`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Guide pages
  const guidePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/guides/how-to-choose`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guides/automatic-vs-traditional`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Blog pages
  const blogPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog/how-often-clean-litter`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/is-automatic-litter-box-worth-it`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  return [
    ...staticPages,
    ...productPages,
    ...comparisonPages,
    ...guidePages,
    ...blogPages,
  ];
}
