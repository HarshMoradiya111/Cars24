import React, { useState } from "react";
import { useLocation } from "@/context/LocationContext";
import { MapPin, Phone, Navigation } from "lucide-react";

interface LocationMapProps {
  showServiceCenters?: boolean;
}

const LocationMap: React.FC<LocationMapProps> = ({
  showServiceCenters = true,
}) => {
  const { cityData, selectedCity } = useLocation();
  const [selectedType, setSelectedType] = useState<
    "all" | "pickup" | "service"
  >("all");

  if (!cityData || !selectedCity) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <MapPin className="w-12 h-12 text-gray-700 mx-auto mb-3" />
        <p className="text-gray-800 font-medium">Please select a city to view locations</p>
      </div>
    );
  }

  const filteredCenters = cityData.serviceCenters.filter(
    (center) => selectedType === "all" || center.type === selectedType
  );

  // Proper Google Maps embed
  const generateMapUrl = () => {
    const center = `${cityData.lat},${cityData.lng}`;
    return `https://maps.google.com/maps?q=${center}&z=12&output=embed`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Map */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-3 sm:p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="truncate">Locations in {selectedCity}</span>
          </h3>
        </div>

        <div className="relative w-full h-64 sm:h-80 md:h-96">
          <iframe
            src={generateMapUrl()}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            title={`Map of ${selectedCity}`}
          />
        </div>

        <div className="p-3 bg-gray-50 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-xs sm:text-sm text-gray-800 font-medium">View in Google Maps</p>
          <a
            href={`https://www.google.com/maps/search/CARS24+${selectedCity}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs sm:text-sm text-orange-600 font-medium hover:text-orange-700 touch-manipulation"
          >
            <Navigation className="w-3 h-3 sm:w-4 sm:h-4" />
            Open Maps
          </a>
        </div>
      </div>

      {/* Service Centers */}
      {showServiceCenters && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-3 sm:p-4 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Service Centers</h3>
              <span className="text-xs sm:text-sm text-gray-700 font-medium">
                {filteredCenters.length} location{filteredCenters.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {["all", "pickup", "service"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type as any)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors touch-manipulation active:scale-95 ${
                    selectedType === type
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {type === "all"
                    ? "All"
                    : type === "pickup"
                    ? "Pickup"
                    : "Service"}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y">
            {filteredCenters.map((center) => (
              <div key={center.id} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 truncate">{center.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-700 mb-2 line-clamp-2">{center.address}</p>

                    <div className="flex items-center gap-2 mb-2 text-xs sm:text-sm text-gray-800">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0" />
                      <a href={`tel:${center.phone}`} className="text-gray-800 hover:text-orange-600 touch-manipulation">
                        {center.phone}
                      </a>
                    </div>

                    <span
                      className={`inline-block px-2 py-1 text-xs rounded ${
                        center.type === "pickup"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {center.type === "pickup"
                        ? "Pickup Hub"
                        : "Service Center"}
                    </span>
                  </div>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap touch-manipulation active:scale-95 w-full sm:w-auto"
                  >
                    <Navigation className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Get Directions</span>
                    <span className="sm:hidden">Directions</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationMap;
