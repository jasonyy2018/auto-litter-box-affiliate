'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { Box, Cat } from 'lucide-react';

interface SafeImageProps extends Omit<ImageProps, 'onError' | 'src'> {
    src?: string | null;
    fallbackSrc?: string;
    alt: string;
}

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1585692181606-4e3c8d7b5c3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';

export default function SafeImage({
    src,
    fallbackSrc = DEFAULT_FALLBACK,
    alt,
    className = '',
    fill,
    width,
    height,
    sizes,
    priority,
    ...props
}: SafeImageProps) {
    const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);
    const [hasError, setHasError] = useState<boolean>(!src);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const isExternalCdn = typeof imgSrc === 'string' && (
        imgSrc.includes('cbu01.alicdn.com') ||
        imgSrc.includes('cjdropshipping.com') ||
        imgSrc.includes('alicdn.com')
    );

    const handleError = () => {
        if (!hasError && imgSrc !== fallbackSrc) {
            setImgSrc(fallbackSrc);
            setHasError(true);
        }
    };

    if (hasError && imgSrc === fallbackSrc) {
        return (
            <div className={`relative flex flex-col items-center justify-center bg-gray-100 text-gray-400 p-4 rounded-xl ${fill ? 'w-full h-full' : ''} ${className}`}>
                <Cat className="w-8 h-8 mb-2 text-primary-500/50" />
                <span className="text-xs font-medium text-center text-text-muted">{alt || 'Product Image'}</span>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden ${fill ? 'w-full h-full' : ''} ${isLoading ? 'bg-gray-100 animate-pulse' : ''}`}>
            <Image
                {...props}
                src={imgSrc || fallbackSrc}
                alt={alt}
                fill={fill}
                width={!fill ? width : undefined}
                height={!fill ? height : undefined}
                sizes={sizes}
                priority={priority}
                className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setIsLoading(false)}
                onError={handleError}
                unoptimized={isExternalCdn}
            />
        </div>
    );
}
