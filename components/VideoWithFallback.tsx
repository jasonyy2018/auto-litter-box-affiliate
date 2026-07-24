'use client';

import React, { useState } from 'react';

interface VideoWithFallbackProps {
    videoSrc: string;
    fallbackSrc: string;
    alt: string;
    className?: string;
    poster?: string;
}

export default function VideoWithFallback({
    videoSrc,
    fallbackSrc,
    alt,
    className = '',
    poster,
}: VideoWithFallbackProps) {
    const [videoFailed, setVideoFailed] = useState(false);

    return (
        <div className={`relative w-full h-full overflow-hidden ${className}`}>
            {!videoFailed ? (
                <video
                    src={videoSrc}
                    poster={poster || fallbackSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    onError={() => setVideoFailed(true)}
                />
            ) : (
                /* eslint-disable-next-html-element-suppress */
                <img
                    src={fallbackSrc}
                    alt={alt}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                />
            )}
        </div>
    );
}
