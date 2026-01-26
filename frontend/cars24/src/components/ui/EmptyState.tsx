import React from 'react';
import { Package, Search, MapPin, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  type?: 'no-cars' | 'no-results' | 'no-city' | 'error';
  title?: string;
  message?: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'no-cars',
  title,
  message,
  actionText,
  actionHref,
  onActionClick,
}) => {
  const getDefaultContent = () => {
    switch (type) {
      case 'no-results':
        return {
          icon: <Search className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />,
          title: 'No cars found',
          message: 'Try adjusting your filters or search criteria.',
          actionText: 'Clear Filters',
        };
      case 'no-city':
        return {
          icon: <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />,
          title: 'No cars in this city',
          message: 'No cars available in this city right now. Try selecting a different city or view all cities.',
          actionText: 'View All Cities',
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-400" />,
          title: 'Something went wrong',
          message: 'We couldn\'t load the cars. Please try again in a moment.',
          actionText: 'Retry',
        };
      default:
        return {
          icon: <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />,
          title: 'No cars available',
          message: 'No cars available in this city right now. Check back soon!',
          actionText: 'Browse All Cars',
        };
    }
  };

  const defaults = getDefaultContent();
  const displayTitle = title || defaults.title;
  const displayMessage = message || defaults.message;
  const displayActionText = actionText || defaults.actionText;

  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 text-center">
      <div className="mb-4 sm:mb-6">{defaults.icon}</div>
      <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
        {displayTitle}
      </h3>
      <p className="text-sm sm:text-base text-gray-600 max-w-md mb-6 sm:mb-8">
        {displayMessage}
      </p>
      {(actionHref || onActionClick) && (
        <>
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
            >
              {displayActionText}
            </Link>
          ) : (
            <button
              onClick={onActionClick}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
            >
              {displayActionText}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default EmptyState;
