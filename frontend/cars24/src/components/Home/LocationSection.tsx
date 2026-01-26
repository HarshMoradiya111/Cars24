import React from 'react';
import { useLocation } from '@/context/LocationContext';
import { MapPin, Navigation, Phone } from 'lucide-react';
import Link from 'next/link';

const LocationSection = () => {
  const { selectedCity, cityData } = useLocation();

  if (!selectedCity || !cityData) {
    return null;
  }

  const pickupHubs = cityData.serviceCenters.filter(c => c.type === 'pickup');
  const serviceCenters = cityData.serviceCenters.filter(c => c.type === 'service');

  return (
    <div className="py-8 sm:py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
            Visit Us in {selectedCity}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
            Find our nearest location for test drives, car inspections, and expert assistance
          </p>
        </div>

        {/* Location Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              {pickupHubs.length}
            </h3>
            <p className="text-sm sm:text-base text-gray-600">Pickup Hubs</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Navigation className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              {serviceCenters.length}
            </h3>
            <p className="text-sm sm:text-base text-gray-600">Service Centers</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              24/7
            </h3>
            <p className="text-sm sm:text-base text-gray-600">Support Available</p>
          </div>
        </div>

        {/* Featured Locations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {cityData.serviceCenters.slice(0, 2).map((center) => (
            <div key={center.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`p-3 sm:p-4 ${center.type === 'pickup' ? 'bg-blue-50' : 'bg-green-50'}`}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${center.type === 'pickup' ? 'text-blue-600' : 'text-green-600'}`} />
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">{center.name}</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{center.address}</p>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                      <a href={`tel:${center.phone}`} className="hover:text-orange-600 active:text-orange-700">
                        {center.phone}
                      </a>
                    </div>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-orange-500 text-white text-xs sm:text-sm rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap touch-manipulation active:scale-95 w-full sm:w-auto"
                  >
                    <Navigation className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="sm:inline">Directions</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center">
          <Link
            href="/locations"
            className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-orange-500 text-white text-sm sm:text-base font-medium rounded-lg hover:bg-orange-600 transition-colors touch-manipulation active:scale-95 w-full sm:w-auto"
          >
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            View All Locations & Map
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LocationSection;
