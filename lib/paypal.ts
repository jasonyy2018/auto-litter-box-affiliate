// PayPal REST API v2 Client Library
// Docs: https://developer.paypal.com/docs/api/orders/v2/

const PAYPAL_SANDBOX_URL = 'https://api-m.sandbox.paypal.com';
const PAYPAL_LIVE_URL = 'https://api-m.paypal.com';

export interface PayPalCredentials {
    clientId: string;
    clientSecret: string;
    mode: 'sandbox' | 'live';
}

export interface PayPalOrderItem {
    name: string;
    quantity: number;
    unitPrice: string; // e.g. "29.99"
    currency?: string;
}

export interface PayPalOrderResult {
    id: string;
    status: string;
    links: Array<{
        href: string;
        rel: string;
        method: string;
    }>;
}

export interface PayPalCaptureResult {
    id: string;
    status: string;
    purchase_units: Array<{
        payments: {
            captures: Array<{
                id: string;
                status: string;
                amount: {
                    currency_code: string;
                    value: string;
                };
            }>;
        };
    }>;
    payer: {
        email_address: string;
        payer_id: string;
        name: {
            given_name: string;
            surname: string;
        };
    };
}

export interface PayPalVerifyResult {
    success: boolean;
    merchantId?: string;
    email?: string;
    error?: string;
}

/**
 * PayPal REST API v2 Client
 */
export class PayPalClient {
    private clientId: string;
    private clientSecret: string;
    private baseUrl: string;
    private accessToken: string | null = null;
    private tokenExpiry: number = 0;

    constructor(credentials: PayPalCredentials) {
        this.clientId = credentials.clientId;
        this.clientSecret = credentials.clientSecret;
        this.baseUrl = credentials.mode === 'live' ? PAYPAL_LIVE_URL : PAYPAL_SANDBOX_URL;
    }

    /**
     * Get OAuth 2.0 access token using client credentials
     */
    private async getAccessToken(): Promise<string> {
        // Return cached token if still valid (with 60s buffer)
        if (this.accessToken && Date.now() < this.tokenExpiry - 60000) {
            return this.accessToken;
        }

        const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

        const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'grant_type=client_credentials',
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error_description: response.statusText }));
            throw new Error(
                `PayPal auth error (${response.status}): ${error.error_description || error.error || JSON.stringify(error)}`
            );
        }

        const data = await response.json();
        this.accessToken = data.access_token;
        this.tokenExpiry = Date.now() + (data.expires_in * 1000);

        return data.access_token;
    }

    /**
     * Make an authenticated request to PayPal API
     */
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const token = await this.getAccessToken();
        const url = `${this.baseUrl}${endpoint}`;

        const response = await fetch(url, {
            ...options,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(
                `PayPal API error (${response.status}): ${error.message || error.details?.[0]?.description || JSON.stringify(error)}`
            );
        }

        // Some endpoints return 204 No Content
        if (response.status === 204) {
            return {} as T;
        }

        return response.json() as Promise<T>;
    }

    /**
     * Verify the connection by fetching user info
     */
    async verifyConnection(): Promise<PayPalVerifyResult> {
        try {
            const token = await this.getAccessToken();

            // Use userinfo endpoint to validate credentials and get merchant info
            const response = await fetch(`${this.baseUrl}/v1/identity/oauth2/userinfo?schema=paypalv1.1`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                return {
                    success: false,
                    error: `Verification failed (${response.status}): ${error.message || response.statusText}`,
                };
            }

            const data = await response.json();

            return {
                success: true,
                merchantId: data.payer_id || data.user_id,
                email: data.emails?.[0]?.value || data.email,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Connection failed',
            };
        }
    }

    /**
     * Create a PayPal order
     */
    async createOrder(
        amount: string,
        currency: string = 'USD',
        items: PayPalOrderItem[] = [],
        returnUrl?: string,
        cancelUrl?: string
    ): Promise<PayPalOrderResult> {
        const purchaseUnit: Record<string, unknown> = {
            amount: {
                currency_code: currency,
                value: amount,
            },
        };

        // Add item breakdown if items provided
        if (items.length > 0) {
            const itemTotal = items.reduce(
                (sum, item) => sum + parseFloat(item.unitPrice) * item.quantity, 0
            ).toFixed(2);

            purchaseUnit.amount = {
                currency_code: currency,
                value: amount,
                breakdown: {
                    item_total: {
                        currency_code: currency,
                        value: itemTotal,
                    },
                },
            };

            purchaseUnit.items = items.map(item => ({
                name: item.name.slice(0, 127), // PayPal name limit
                quantity: String(item.quantity),
                unit_amount: {
                    currency_code: item.currency || currency,
                    value: item.unitPrice,
                },
            }));
        }

        const orderData: Record<string, unknown> = {
            intent: 'CAPTURE',
            purchase_units: [purchaseUnit],
        };

        // Add application context for return/cancel URLs
        if (returnUrl || cancelUrl) {
            orderData.application_context = {
                return_url: returnUrl,
                cancel_url: cancelUrl,
                brand_name: 'AutoLitterBox Pro',
                shipping_preference: 'GET_FROM_FILE',
                user_action: 'PAY_NOW',
            };
        }

        return this.request<PayPalOrderResult>('/v2/checkout/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    }

    /**
     * Capture an approved order (after user authorizes payment)
     */
    async captureOrder(orderId: string): Promise<PayPalCaptureResult> {
        return this.request<PayPalCaptureResult>(
            `/v2/checkout/orders/${orderId}/capture`,
            { method: 'POST' }
        );
    }

    /**
     * Get order details
     */
    async getOrderDetails(orderId: string): Promise<PayPalOrderResult> {
        return this.request<PayPalOrderResult>(`/v2/checkout/orders/${orderId}`);
    }
}

/**
 * Get PayPal SDK script URL for client-side integration
 */
export function getPayPalScriptUrl(clientId: string, currency: string = 'USD'): string {
    return `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&intent=capture`;
}
