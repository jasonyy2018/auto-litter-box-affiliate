// CJDropshipping API 2.0 Client
// Documentation: https://developers.cjdropshipping.com/api2.0/v1

const CJ_BASE_URL = 'https://developers.cjdropshipping.com/api2.0/v1';

// Token cache
let cachedToken: { accessToken: string; expiry: number } | null = null;

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

    const response = await fetch(`${CJ_BASE_URL}/authentication/getAccessToken`, {
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

    const response = await fetch(`${CJ_BASE_URL}/product/listV2?${params.toString()}`, {
        method: 'GET',
        headers: {
            'CJ-Access-Token': token,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`CJ Search failed: ${response.status} ${response.statusText}`);
    }

    const data: CJApiResponse<CJSearchResult> = await response.json();

    if (!data.result) {
        throw new Error(`CJ Search error: ${data.message}`);
    }

    return data.data;
}

/**
 * Get CJ product details by PID
 */
export async function getProductDetail(pid: string): Promise<CJProduct> {
    const token = await getAccessToken();

    const response = await fetch(`${CJ_BASE_URL}/product/query?pid=${pid}`, {
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

    const response = await fetch(`${CJ_BASE_URL}/product/getCategory`, {
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
