'use client';

import { useState, useRef } from 'react';

interface VideoWithFallbackProps {
  videoSrc: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
}

export default function VideoWithFallback({ videoSrc, fallbackSrc, alt, className = '' }: VideoWithFallbackProps) {
  const [videoFailed, setVideoFailed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {!videoFailed && (
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className={`w-full h-full object-cover absolute inset-0 ${imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity`}
          onError={() => setVideoFailed(true)}
        />
      )}
      <img
        src={fallbackSrc}
        alt={alt}
        className={`w-full h-full object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity`}
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  );
}
