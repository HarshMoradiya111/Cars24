import React from 'react';

export function CarCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="h-48 bg-gray-200"></div>
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>

        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
}

export function CarGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <CarCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function BookingCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
      <div className="bg-gray-300 p-6">
        <div className="h-6 bg-gray-400 rounded w-1/2 mb-3"></div>
        <div className="h-4 bg-gray-400 rounded w-1/3 mb-4"></div>
        <div className="flex gap-4">
          <div className="h-4 bg-gray-400 rounded w-24"></div>
          <div className="h-4 bg-gray-400 rounded w-24"></div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/5 h-64 bg-gray-200 rounded-lg"></div>

          <div className="md:w-3/5 space-y-3">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-2 mt-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BookingListSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <BookingCardSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * Full page spinner (centered)
 */
export function LoadingSpinner({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col justify-center items-center min-h-[400px] space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
}

export function EmptyState({ 
  title = "No Results Found",
  description = "We couldn't find any items to display.",
  icon,
  action
}: {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
      {icon && (
        <div className="mb-4 text-gray-400">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{description}</p>
      {action}
    </div>
  );
}

export function ArticleCardSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse">
      <div className="h-48 bg-gray-200"></div>

      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        <div className="flex items-center gap-2 pt-2 border-t">
          <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
}
