import React, { useState, useEffect } from 'react';
import { useLocation } from '@/context/LocationContext';
import { MapPin, ChevronDown, Loader2, X } from 'lucide-react';

const CitySelector: React.FC = () => {
  const {
    selectedCity,
    setSelectedCity,
    isDetecting,
    detectionError,
    detectLocation,
    availableCities
  } = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCities = availableCities.filter(city =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleDetectClick = () => {
    detectLocation();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.city-selector-dropdown')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative city-selector-dropdown w-full sm:w-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-orange-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 touch-manipulation"
        aria-label="Select city"
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">
            {isDetecting ? 'Detecting...' : selectedCity === null ? 'All Cities' : selectedCity || 'Select City'}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="fixed sm:absolute top-0 sm:top-full left-0 right-0 sm:left-auto sm:right-0 sm:mt-2 w-full sm:w-80 md:w-96 bg-white border-0 sm:border border-gray-200 rounded-none sm:rounded-lg shadow-2xl sm:shadow-xl z-[60] h-full sm:h-auto sm:max-h-96 overflow-hidden">
          {/* Mobile Header */}
          <div className="sm:hidden sticky top-0 bg-white z-10 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Select City</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Detect Location Button */}
          <div className="p-3 sm:p-3 border-b border-gray-200">
            <button
              onClick={handleDetectClick}
              disabled={isDetecting}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors touch-manipulation active:scale-95"
            >
              {isDetecting ? (
                <>
                  <Loader2 className="w-5 h-5 sm:w-4 sm:h-4 animate-spin" />
                  <span className="text-sm font-medium">Detecting Location...</span>
                </>
              ) : (
                <>
                  <MapPin className="w-5 h-5 sm:w-4 sm:h-4" />
                  <span className="text-sm font-medium">Detect My Location</span>
                </>
              )}
            </button>
            {detectionError && (
              <div className="mt-2 flex items-start gap-2 p-2 bg-red-50 rounded text-xs text-red-600">
                <X className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>{detectionError}</span>
              </div>
            )}
          </div>

          {/* Search Input */}
          <div className="p-3 sm:p-3 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm touch-manipulation"
            />
          </div>

          {/* City List */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
            <ul className="py-1">
              {/* All Cities Option */}
              <li>
                <button
                  onClick={() => {
                    setSelectedCity(null);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`w-full text-left px-4 py-3 sm:py-2.5 hover:bg-orange-50 active:bg-orange-100 transition-colors border-b border-gray-200 touch-manipulation ${
                    selectedCity === null ? 'bg-orange-100 text-orange-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-2">
                    <MapPin className={`w-5 h-5 sm:w-4 sm:h-4 flex-shrink-0 ${selectedCity === null ? 'text-orange-600' : 'text-gray-400'}`} />
                    <span className="text-sm font-medium">All Cities</span>
                  </div>
                </button>
              </li>

              {/* Individual Cities */}
              {filteredCities.length > 0 ? (
                filteredCities.map((city) => (
                  <li key={city}>
                    <button
                      onClick={() => handleCitySelect(city)}
                      className={`w-full text-left px-4 py-3 sm:py-2.5 hover:bg-orange-50 active:bg-orange-100 transition-colors touch-manipulation ${
                        selectedCity === city ? 'bg-orange-100 text-orange-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 sm:gap-2">
                        <MapPin className={`w-5 h-5 sm:w-4 sm:h-4 flex-shrink-0 ${selectedCity === city ? 'text-orange-600' : 'text-gray-400'}`} />
                        <span className="text-sm">{city}</span>
                      </div>
                    </button>
                  </li>
                ))
              ) : (
                <li className="p-4 text-center text-sm text-gray-500">
                  No cities found matching &quot;{searchTerm}&quot;
                </li>
              )}
            </ul>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 p-3 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-600 text-center">
              Select your city to see available cars and service centers
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitySelector;
