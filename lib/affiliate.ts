// Affiliate link configuration and utilities

export const affiliateConfig = {
  amazon: {
    tag: 'autolitterbox-20',
    baseUrl: 'https://www.amazon.com/dp/',
  },
  tracking: {
    enabled: true,
    utmSource: 'autolitterboxpro',
    utmMedium: 'affiliate',
  },
};

export interface AffiliateLink {
  url: string;
  platform: 'amazon' | 'direct' | 'other';
  productId: string;
  productName: string;
}

/**
 * Generate an Amazon affiliate link with proper tracking
 */
export function generateAmazonLink(asin: string, campaignName?: string): string {
  const { tag, baseUrl } = affiliateConfig.amazon;
  let url = `${baseUrl}${asin}?tag=${tag}`;
  
  if (campaignName) {
    url += `&linkCode=ll1&camp=1789&creative=9325&ascsubtag=${campaignName}`;
  }
  
  return url;
}

/**
 * Add UTM parameters to any affiliate link
 */
export function addUtmParams(url: string, campaign: string): string {
  const { utmSource, utmMedium } = affiliateConfig.tracking;
  const separator = url.includes('?') ? '&' : '?';
  
  return `${url}${separator}utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${campaign}`;
}

/**
 * Track affiliate link click (placeholder for analytics integration)
 */
export function trackAffiliateClick(link: AffiliateLink): void {
  if (typeof window !== 'undefined' && affiliateConfig.tracking.enabled) {
    // Google Analytics 4 event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'affiliate_click', {
        event_category: 'affiliate',
        event_label: link.productName,
        platform: link.platform,
        product_id: link.productId,
      });
    }
    
    // Console log for development
    console.log('Affiliate click tracked:', {
      product: link.productName,
      platform: link.platform,
      url: link.url,
    });
  }
}

/**
 * Affiliate disclosure text
 */
export const affiliateDisclosure = {
  short: 'As an Amazon Associate and affiliate partner, we earn from qualifying purchases.',
  full: `Disclosure: AutoLitterBox Pro is reader-supported. When you buy through links on our site, we may earn an affiliate commission at no extra cost to you. This helps us continue to provide free, helpful content for cat owners. We only recommend products we believe in and have thoroughly researched.`,
  ftc: `This post contains affiliate links. As an Amazon Associate and partner of other affiliate programs, we earn from qualifying purchases. This means if you click on a link and make a purchase, we may receive a small commission at no additional cost to you. The opinions expressed here are our own and we only recommend products we personally use or believe will add value for our readers.`,
};

/**
 * Product affiliate links mapping
 */
export const productAffiliateLinks: Record<string, {
  amazon?: string;
  direct?: string;
  other?: string;
}> = {
  'litter-robot-4': {
    amazon: generateAmazonLink('B0BK2MTW2Q', 'lr4-review'),
    direct: 'https://www.litter-robot.com/litter-robot-4.html?ref=autolitterboxpro',
  },
  'petkit-pura-max': {
    amazon: generateAmazonLink('B09QKGZZ2K', 'petkit-review'),
    direct: 'https://www.petkit.com/products/pura-max?ref=autolitterboxpro',
  },
  'catlink-scooper': {
    amazon: generateAmazonLink('B08YNZQM2K', 'catlink-review'),
    direct: 'https://www.catlink.co/products/catlink-scooper-standard-pro?ref=autolitterboxpro',
  },
};

/**
 * Get affiliate link for a product
 */
export function getAffiliateLink(
  productSlug: string,
  preferredPlatform: 'amazon' | 'direct' = 'amazon'
): string | undefined {
  const links = productAffiliateLinks[productSlug];
  if (!links) return undefined;
  
  return links[preferredPlatform] || links.amazon || links.direct;
}

/**
 * Get all affiliate links for a product
 */
export function getAllAffiliateLinks(productSlug: string) {
  return productAffiliateLinks[productSlug] || {};
}

// Declare gtag for TypeScript
declare global {
  function gtag(...args: any[]): void;
}
