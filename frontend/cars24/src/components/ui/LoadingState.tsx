import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  type?: 'spinner' | 'skeleton';
  count?: number;
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'skeleton',
  count = 6,
  message,
}) => {
  if (type === 'spinner') {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-20">
        <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-orange-500 animate-spin mb-4" />
        {message && (
          <p className="text-sm sm:text-base text-gray-600">{message}</p>
        )}
      </div>
    );
  }

  // Skeleton cards
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
        >
          {/* Image skeleton */}
          <div className="w-full h-48 bg-gray-200" />

          {/* Content skeleton */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <div className="h-5 bg-gray-200 rounded w-3/4" />

            {/* Stats */}
            <div className="flex gap-2">
              <div className="h-4 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-20" />
            </div>

            {/* Price */}
            <div className="flex justify-between items-center pt-2">
              <div className="h-6 bg-gray-200 rounded w-24" />
              <div className="h-9 bg-gray-200 rounded w-28" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingState;
