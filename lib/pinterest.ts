// Pinterest API v5 Client Library
// Docs: https://developers.pinterest.com/docs/api/v5/

const PINTEREST_API_BASE = 'https://api.pinterest.com/v5';

export interface PinterestPin {
    id: string;
    title: string;
    description: string;
    link: string;
    media_source: {
        source_type: string;
        url?: string;
    };
    board_id: string;
    created_at: string;
}

export interface PinterestBoard {
    id: string;
    name: string;
    description: string;
    pin_count: number;
    privacy: string;
}

export interface CreatePinParams {
    title: string;
    description: string;
    link: string;
    imageUrl: string;
    boardId: string;
    altText?: string;
}

export interface PinterestApiError {
    code: number;
    message: string;
}

/**
 * Pinterest API v5 Client
 */
export class PinterestClient {
    private accessToken: string;

    constructor(accessToken?: string) {
        const token = accessToken || process.env.PINTEREST_ACCESS_TOKEN;
        if (!token) {
            throw new Error('Pinterest access token is required. Set PINTEREST_ACCESS_TOKEN env variable.');
        }
        this.accessToken = token;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${PINTEREST_API_BASE}${endpoint}`;
        const response = await fetch(url, {
            ...options,
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(
                `Pinterest API error (${response.status}): ${error.message || JSON.stringify(error)}`
            );
        }

        return response.json() as Promise<T>;
    }

    /**
     * Create a new pin
     */
    async createPin(params: CreatePinParams): Promise<PinterestPin> {
        return this.request<PinterestPin>('/pins', {
            method: 'POST',
            body: JSON.stringify({
                title: params.title.slice(0, 100), // Pinterest title limit
                description: params.description.slice(0, 500), // Pinterest description limit
                link: params.link,
                board_id: params.boardId,
                alt_text: params.altText || params.title,
                media_source: {
                    source_type: 'image_url',
                    url: params.imageUrl,
                },
            }),
        });
    }

    /**
     * Get a pin by ID
     */
    async getPin(pinId: string): Promise<PinterestPin> {
        return this.request<PinterestPin>(`/pins/${pinId}`);
    }

    /**
     * Delete a pin
     */
    async deletePin(pinId: string): Promise<void> {
        await this.request(`/pins/${pinId}`, { method: 'DELETE' });
    }

    /**
     * List pins on a board
     */
    async listBoardPins(boardId: string, pageSize = 25): Promise<{ items: PinterestPin[] }> {
        return this.request<{ items: PinterestPin[] }>(
            `/boards/${boardId}/pins?page_size=${pageSize}`
        );
    }

    /**
     * List user's boards
     */
    async listBoards(pageSize = 25): Promise<{ items: PinterestBoard[] }> {
        return this.request<{ items: PinterestBoard[] }>(
            `/boards?page_size=${pageSize}`
        );
    }

    /**
     * Get a board by ID
     */
    async getBoard(boardId: string): Promise<PinterestBoard> {
        return this.request<PinterestBoard>(`/boards/${boardId}`);
    }
}

// ─── Helper Functions ────────────────────────────────────────────────────

import { Product } from './products';

interface BlogPostMeta {
    slug: string;
    title: string;
    description: string;
    image?: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://autolitterboxpro.com';

/**
 * Generate pin data from a product
 */
export function productToPin(product: Product, boardId: string): CreatePinParams {
    const hashtags = '#AutomaticLitterBox #CatCare #SmartHome #CatLovers #PetTech';
    const description = [
        `${product.badge ? `${product.badge} | ` : ''}${product.tagline}`,
        '',
        product.description.slice(0, 300),
        '',
        `💰 $${product.price}${product.originalPrice ? ` (was $${product.originalPrice})` : ''}`,
        `⭐ ${product.rating}/5 (${product.reviewCount} reviews)`,
        '',
        hashtags,
    ].join('\n');

    return {
        title: `${product.name} - ${product.tagline}`,
        description,
        link: `${SITE_URL}/reviews/${product.slug}`,
        imageUrl: product.image,
        boardId,
        altText: `${product.name} automatic litter box`,
    };
}

/**
 * Generate pin data from a blog post
 */
export function blogPostToPin(post: BlogPostMeta, boardId: string): CreatePinParams {
    const hashtags = '#CatCare #AutomaticLitterBox #PetOwner #CatTips';
    const description = [
        post.description,
        '',
        hashtags,
    ].join('\n');

    return {
        title: post.title,
        description,
        link: `${SITE_URL}/blog/${post.slug}`,
        imageUrl: post.image || `${SITE_URL}/images/og-image.jpg`,
        boardId,
        altText: post.title,
    };
}

/**
 * Check if Pinterest API is configured
 */
export function isPinterestConfigured(): boolean {
    return !!(process.env.PINTEREST_ACCESS_TOKEN && process.env.PINTEREST_BOARD_ID);
}

/**
 * Get default board ID from env
 */
export function getDefaultBoardId(): string {
    return process.env.PINTEREST_BOARD_ID || '';
}
