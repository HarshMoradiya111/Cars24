import React from 'react';
import LocationMap from '@/components/LocationMap';
import { useLocation } from '@/context/LocationContext';
import CitySelector from '@/components/CitySelector';
import { MapPin, Phone, Navigation } from 'lucide-react';

const LocationsPage = () => {
  const { selectedCity, cityData } = useLocation();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                Our Locations
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Find CARS24 pickup hubs and service centers near you
              </p>
            </div>
            <div className="flex-shrink-0">
              <CitySelector />
            </div>
          </div>
        </div>

        {/* City Info */}
        {selectedCity && cityData && (
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 text-white">
            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold">{selectedCity}, {cityData.state}</h2>
            </div>
            <p className="text-sm sm:text-base text-orange-100">
              We have {cityData.serviceCenters.length} locations in {selectedCity} to serve you better
            </p>
          </div>
        )}

        {/* Map and Service Centers */}
        <LocationMap showServiceCenters={true} />

        {/* Information Section */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg flex-shrink-0">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Pickup Hubs</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              Visit our pickup hubs to view and test drive cars. Our experts are available to help you find the perfect car.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
                <span>Wide selection of certified used cars</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
                <span>Test drive available</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
                <span>Expert assistance and guidance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
                <span>Instant financing options</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg flex-shrink-0">
                <Navigation className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Service Centers</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              Our service centers provide comprehensive maintenance and repair services for your car.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1 flex-shrink-0">•</span>
                <span>Regular maintenance and servicing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1 flex-shrink-0">•</span>
                <span>Genuine parts and accessories</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1 flex-shrink-0">•</span>
                <span>Trained technicians</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1 flex-shrink-0">•</span>
                <span>Quick turnaround time</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900 text-sm sm:text-base">Call Us</p>
                <p className="text-sm text-gray-600">1800-123-CARS (2277)</p>
                <p className="text-xs text-gray-500 mt-1">Mon-Sun: 9 AM - 9 PM</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900 text-sm sm:text-base">Visit Us</p>
                <p className="text-sm text-gray-600">Walk-ins welcome</p>
                <p className="text-xs text-gray-500 mt-1">All locations open daily</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Navigation className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900 text-sm sm:text-base">Book Appointment</p>
                <p className="text-sm text-gray-600">Schedule your visit</p>
                <p className="text-xs text-gray-500 mt-1">
                  <a href="/appointments" className="text-orange-600 hover:underline active:text-orange-700">
                    Book now →
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationsPage;
