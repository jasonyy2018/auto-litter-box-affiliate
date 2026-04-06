// CJDropshipping API 2.0 Client
// Documentation: https://developers.cjdropshipping.com/api2.0/v1

const CJ_BASE_URL = 'https://developers.cjdropshipping.com/api2.0/v1';

import dns from 'node:dns';
import https from 'node:https';

try {
    dns.setDefaultResultOrder('ipv4first');
} catch (e) {
    // Ignore in edge environments
}

// Token cache
let cachedToken: { accessToken: string; expiry: number } | null = null;

// Native HTTPS wrapper to bypass NextJS undici connection pool bugs
function httpsFetch(url: string, options: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const reqOptions = {
            hostname: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            headers: options.headers || {},
        };

        const req = https.request(reqOptions, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                const response = {
                    ok: res.statusCode !== undefined && res.statusCode >= 200 && res.statusCode < 300,
                    status: res.statusCode,
                    statusText: res.statusMessage,
                    json: async () => {
                        try {
                            return JSON.parse(body);
                        } catch (err) {
                            console.error('CJ JSON parse error:', body.substring(0, 200));
                            throw err;
                        }
                    }
                };
                resolve(response);
            });
        });

        req.on('error', reject);
        req.setTimeout(60000, () => { // 60s timeout for slow GFW connections
             req.destroy();
             reject(new Error('CJ API Proxy/Timeout Error'));
        });

        if (options.body) {
            req.write(options.body);
        }
        req.end();
    });
}

export interface CJProduct {
    pid: string;
    productName: string;
    productNameEn: string;
    productSku: string;
    productImage: string;
    productWeight: number;
    productType: number;
    productUnit: string;
    sellPrice: number;
    categoryId: string;
    categoryName: string;
    sourceFrom: number;
    remark: string;
    createrTime: string;
    productImageSet: string[];
    variants: CJVariant[];
    description: string;
    packingWeight: number;
    packingLength: number;
    packingWidth: number;
    packingHeight: number;
    entryCode: string;
    entryNameEn: string;
    materialNameEn: string;
    materialKey: string;
    packingKey: string;
    productKey: string;
    productBrief: string;
    supplierName: string;
}

export interface CJVariant {
    vid: string;
    pid: string;
    variantName: string;
    variantNameEn: string;
    variantSku: string;
    variantUnit: string;
    variantProperty: string;
    variantKey: string;
    variantLength: number;
    variantWidth: number;
    variantHeight: number;
    variantWeight: number;
    variantVolume: number;
    variantSellPrice: number;
    variantImage: string;
    createTime: string;
}

export interface CJSearchResult {
    pageNum: number;
    pageSize: number;
    total: number;
    list: CJProduct[];
}

export interface CJApiResponse<T> {
    code: number;
    result: boolean;
    message: string;
    data: T;
    requestId: string;
}

/**
 * Get CJ Access Token using API Key
 */
export async function getAccessToken(): Promise<string> {
    // Check cache
    if (cachedToken && Date.now() < cachedToken.expiry) {
        return cachedToken.accessToken;
    }

    const apiKey = process.env.CJ_API_KEY;
    if (!apiKey) {
        throw new Error('CJ_API_KEY environment variable is not set');
    }

    const response = await httpsFetch(`${CJ_BASE_URL}/authentication/getAccessToken`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
    });

    if (!response.ok) {
        throw new Error(`CJ Auth failed: ${response.status} ${response.statusText}`);
    }

    const data: CJApiResponse<{ accessToken: string; refreshToken: string }> = await response.json();

    if (!data.result) {
        throw new Error(`CJ Auth error: ${data.message}`);
    }

    // Cache token for 14 days (token valid for 15 days, refresh early)
    cachedToken = {
        accessToken: data.data.accessToken,
        expiry: Date.now() + 14 * 24 * 60 * 60 * 1000,
    };

    return data.data.accessToken;
}

/**
 * Search CJ products
 */
export async function searchProducts(
    keyword: string,
    page = 1,
    size = 20,
    options?: {
        categoryId?: string;
        countryCode?: string;
        startSellPrice?: number;
        endSellPrice?: number;
    }
): Promise<CJSearchResult> {
    const token = await getAccessToken();

    const params = new URLSearchParams({
        keyWord: keyword,
        page: page.toString(),
        size: size.toString(),
    });

    if (options?.categoryId) params.set('categoryId', options.categoryId);
    if (options?.countryCode) params.set('countryCode', options.countryCode);
    if (options?.startSellPrice !== undefined) params.set('startSellPrice', options.startSellPrice.toString());
    if (options?.endSellPrice !== undefined) params.set('endSellPrice', options.endSellPrice.toString());

    const response = await httpsFetch(`${CJ_BASE_URL}/product/listV2?${params.toString()}`, {
        method: 'GET',
        headers: {
            'CJ-Access-Token': token,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`CJ Search failed: ${response.status} ${response.statusText}`);
    }

    const data: CJApiResponse<any> = await response.json();

    if (!data.result) {
        throw new Error(`CJ Search error: ${data.message}`);
    }

    // CJ API v2 listV2 response format varies:
    // - May return { content: [{ productList: [...] }], totalRecords, pageNumber }
    // - Or { list: [...], total, pageNum }
    // Normalize to our CJSearchResult format: { list, total, pageNum, pageSize }
    const raw = data.data;
    const normalized: CJSearchResult = {
        pageNum: raw.pageNumber ?? raw.pageNum ?? 1,
        pageSize: raw.pageSize ?? size,
        total: raw.totalRecords ?? raw.total ?? 0,
        list: [],
    };

    // Extract products from whichever format CJ returns
    let rawProducts: any[] = [];
    if (raw.list && Array.isArray(raw.list)) {
        rawProducts = raw.list;
    } else if (raw.content) {
        if (Array.isArray(raw.content) && raw.content.length > 0 && raw.content[0].productList) {
            rawProducts = raw.content[0].productList;
        } else if (raw.content.productList) {
            rawProducts = raw.content.productList;
        }
    }

    // Map CJ v2 field names to our CJProduct interface
    normalized.list = rawProducts.map((p: any) => ({
        pid: p.pid || p.id || '',
        productName: p.productName || p.nameEn || p.name || '',
        productNameEn: p.productNameEn || p.nameEn || p.name || '',
        productSku: p.productSku || p.sku || '',
        productImage: p.productImage || p.bigImage || '',
        productWeight: p.productWeight ?? p.weight ?? 0,
        productType: p.productType ?? 0,
        productUnit: p.productUnit || '',
        sellPrice: typeof p.sellPrice === 'string' ? parseFloat(p.sellPrice) : (p.sellPrice ?? 0),
        categoryId: p.categoryId || '',
        categoryName: p.categoryName || p.threeCategoryName || p.oneCategoryName || '',
        sourceFrom: p.sourceFrom ?? 0,
        remark: p.remark || '',
        createrTime: p.createrTime || p.createAt || '',
        productImageSet: p.productImageSet || (p.bigImage ? [p.bigImage] : []),
        variants: p.variants || [],
        description: p.description || '',
        packingWeight: p.packingWeight ?? 0,
        packingLength: p.packingLength ?? 0,
        packingWidth: p.packingWidth ?? 0,
        packingHeight: p.packingHeight ?? 0,
        entryCode: p.entryCode || '',
        entryNameEn: p.entryNameEn || '',
        materialNameEn: p.materialNameEn || '',
        materialKey: p.materialKey || '',
        packingKey: p.packingKey || '',
        productKey: p.productKey || '',
        productBrief: p.productBrief || p.description || '',
        supplierName: p.supplierName || '',
    }));

    return normalized;
}

/**
 * Get CJ product details by PID
 */
export async function getProductDetail(pid: string): Promise<CJProduct> {
    const token = await getAccessToken();

    const response = await httpsFetch(`${CJ_BASE_URL}/product/query?pid=${pid}`, {
        method: 'GET',
        headers: {
            'CJ-Access-Token': token,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`CJ Product detail failed: ${response.status} ${response.statusText}`);
    }

    const data: CJApiResponse<CJProduct> = await response.json();

    if (!data.result) {
        throw new Error(`CJ Product detail error: ${data.message}`);
    }

    return data.data;
}

/**
 * Get CJ product categories
 */
export async function getCategories(): Promise<unknown[]> {
    const token = await getAccessToken();

    const response = await httpsFetch(`${CJ_BASE_URL}/product/getCategory`, {
        method: 'GET',
        headers: {
            'CJ-Access-Token': token,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`CJ Categories failed: ${response.status} ${response.statusText}`);
    }

    const data: CJApiResponse<unknown[]> = await response.json();

    if (!data.result) {
        throw new Error(`CJ Categories error: ${data.message}`);
    }

    return data.data;
}
