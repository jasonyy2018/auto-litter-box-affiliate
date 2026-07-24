/**
 * CJ Dropshipping HTML Description, Plain Text Sanitizer & Variant Sync Helper
 */

// Helper to decode HTML entities (e.g. &lt;p&gt; -> <p>)
export function decodeHTMLEntities(str: string): string {
    if (!str) return '';
    return str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ');
}

// Strip all HTML tags to produce clean plain text for short descriptions & card previews
export function stripHtmlTags(str: string): string {
    if (!str) return '';
    const decoded = decodeHTMLEntities(str);
    return decoded
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

export function sanitizeCJDescription(raw: string): string {
    if (!raw) return '';

    // First, decode any double-escaped entities
    let html = decodeHTMLEntities(raw.trim());

    // 1. If raw string is plain text (no HTML tags), wrap paragraphs
    if (!/<[a-z][\s\S]*>/i.test(html)) {
        return html
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => `<p class="mb-4 leading-relaxed text-text-secondary">${line}</p>`)
            .join('\n');
    }

    // 2. Remove dangerous script/style tags and CJ supplier watermarks/contacts
    html = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/WhatsApp\s*:\s*\+?\d+/gi, '')
        .replace(/WeChat\s*:\s*\w+/gi, '');

    // 3. Strip fixed inline pixel widths/heights and hardcoded colors so it's 100% responsive
    html = html
        .replace(/style="[^"]*"/gi, (match) => {
            return match
                .replace(/width\s*:\s*\d+px;?/gi, '')
                .replace(/height\s*:\s*\d+px;?/gi, '')
                .replace(/font-family\s*:[^;"]+;?/gi, '')
                .replace(/font-size\s*:[^;"]+;?/gi, '')
                .replace(/color\s*:[^;"]+;?/gi, '')
                .replace(/background(-color)?\s*:[^;"]+;?/gi, '');
        })
        .replace(/\s(width|height|border|cellspacing|cellpadding)="\d*"/gi, '');

    // 4. Transform raw <img> tags into responsive, no-referrer lazy loaded images
    html = html.replace(
        /<img\s+([^>]*)\/?>/gi,
        (_match, attrs) => {
            let src = '';
            const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
            if (srcMatch) src = srcMatch[1];
            if (!src) return '';

            // Ensure HTTPS protocol
            if (src.startsWith('//')) src = 'https:' + src;

            return `<img src="${src}" referrerpolicy="no-referrer" loading="lazy" class="max-w-full h-auto rounded-2xl my-6 mx-auto block shadow-sm" alt="Product detail image" />`;
        }
    );

    // 5. Clean up redundant empty tags
    html = html
        .replace(/<font[^>]*>/gi, '')
        .replace(/<\/font>/gi, '')
        .replace(/<p[^>]*>\s*(<br\s*\/?>)?\s*<\/p>/gi, '')
        .replace(/<div>\s*<\/div>/gi, '');

    return html.trim();
}

export interface CJVariantInput {
    vid?: string;
    variantNameEn?: string;
    variantName?: string;
    variantSku?: string;
    variantSellPrice?: number | string;
    variantImage?: string;
    variantProperty?: string;
    inStock?: boolean;
}

export function mapCJVariants(rawVariants: CJVariantInput[], productSku: string, basePrice: number, getMarkupFn: (cost: number) => number) {
    if (!Array.isArray(rawVariants) || rawVariants.length === 0) {
        return [];
    }

    return rawVariants.map((v, i) => {
        const rawCost = typeof v.variantSellPrice === 'string' ? parseFloat(v.variantSellPrice) : (v.variantSellPrice || basePrice || 0);
        const costPrice = isNaN(rawCost) || rawCost <= 0 ? basePrice : rawCost;
        const markup = getMarkupFn(costPrice);
        const price = parseFloat((costPrice * markup).toFixed(2));
        const originalPrice = parseFloat((price * 1.2).toFixed(2));

        // Format clean variant name
        let name = v.variantNameEn || v.variantName || v.variantProperty || `Option ${i + 1}`;
        name = name.replace(/^CJ[A-Z0-9]+-/i, '').trim();

        return {
            id: v.vid || `cj-var-${i}`,
            name,
            sku: v.variantSku || `${productSku}-V${i}`,
            price,
            costPrice,
            originalPrice,
            image: v.variantImage || '',
            properties: v.variantProperty || name,
            inStock: v.inStock !== false,
        };
    });
}

// Merge main image, productImageSet, and variant images into a complete gallery
export function enrichProductImages(mainImage?: string, imageSet?: string[], variants?: any[]): string[] {
    const images: string[] = [];
    if (mainImage) images.push(mainImage);
    if (Array.isArray(imageSet)) {
        imageSet.forEach(img => {
            if (img && !images.includes(img)) images.push(img);
        });
    }
    if (Array.isArray(variants)) {
        variants.forEach(v => {
            if (v.image && !images.includes(v.image)) images.push(v.image);
        });
    }
    return images.filter(Boolean).map(url => url.startsWith('//') ? 'https:' + url : url);
}
