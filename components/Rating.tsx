'use client';

import { Star, StarHalf } from 'lucide-react';

interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

export default function Rating({ value, max = 5, size = 'md', showValue = false }: RatingProps) {
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;
  const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const starSize = sizeClasses[size];

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {/* Full Stars */}
        {Array.from({ length: fullStars }).map((_, index) => (
          <Star
            key={`full-${index}`}
            className={`${starSize} text-yellow-400 fill-yellow-400`}
          />
        ))}

        {/* Half Star */}
        {hasHalfStar && (
          <div className="relative">
            <Star className={`${starSize} text-gray-300`} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={`${starSize} text-yellow-400 fill-yellow-400`} />
            </div>
          </div>
        )}

        {/* Empty Stars */}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <Star
            key={`empty-${index}`}
            className={`${starSize} text-gray-300`}
          />
        ))}
      </div>

      {showValue && (
        <span className="ml-1 text-sm font-medium text-gray-700">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
