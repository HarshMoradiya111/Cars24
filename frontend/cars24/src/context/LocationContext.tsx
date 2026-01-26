import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ServiceCenter {
  id: string;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  type: 'pickup' | 'service';
}

export interface CityData {
  name: string;
  state: string;
  lat: number;
  lng: number;
  serviceCenters: ServiceCenter[];
}

interface LocationContextType {
  selectedCity: string | null;
  setSelectedCity: (city: string | null) => void;
  cityData: CityData | null;
  isDetecting: boolean;
  detectionError: string | null;
  detectLocation: () => void;
  availableCities: string[];
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const CITIES_DATA: { [key: string]: CityData } = {
  'Delhi': {
    name: 'Delhi',
    state: 'Delhi',
    lat: 28.6139,
    lng: 77.2090,
    serviceCenters: [
      {
        id: 'del-1',
        name: 'CARS24 Hub Dwarka',
        address: 'Sector 10, Dwarka, New Delhi - 110075',
        phone: '+91-9876543210',
        lat: 28.5921,
        lng: 77.0460,
        type: 'pickup'
      },
      {
        id: 'del-2',
        name: 'CARS24 Service Center Saket',
        address: 'Saket District Centre, New Delhi - 110017',
        phone: '+91-9876543211',
        lat: 28.5244,
        lng: 77.2066,
        type: 'service'
      },
      {
        id: 'del-3',
        name: 'CARS24 Hub Rohini',
        address: 'Sector 11, Rohini, New Delhi - 110085',
        phone: '+91-9876543212',
        lat: 28.7185,
        lng: 77.1116,
        type: 'pickup'
      },
      {
        id: 'del-4',
        name: 'CARS24 Service Center Noida',
        address: 'Sector 62, Noida - 201301',
        phone: '+91-9876543213',
        lat: 28.6270,
        lng: 77.3714,
        type: 'service'
      }
    ]
  },
  'Mumbai': {
    name: 'Mumbai',
    state: 'Maharashtra',
    lat: 19.0760,
    lng: 72.8777,
    serviceCenters: [
      {
        id: 'mum-1',
        name: 'CARS24 Hub Andheri',
        address: 'Andheri East, Mumbai - 400069',
        phone: '+91-9876543220',
        lat: 19.1136,
        lng: 72.8697,
        type: 'pickup'
      },
      {
        id: 'mum-2',
        name: 'CARS24 Service Center Powai',
        address: 'Powai, Mumbai - 400076',
        phone: '+91-9876543221',
        lat: 19.1197,
        lng: 72.9059,
        type: 'service'
      },
      {
        id: 'mum-3',
        name: 'CARS24 Hub Thane',
        address: 'Ghodbunder Road, Thane - 400607',
        phone: '+91-9876543222',
        lat: 19.2183,
        lng: 72.9781,
        type: 'pickup'
      },
      {
        id: 'mum-4',
        name: 'CARS24 Service Center Bandra',
        address: 'Bandra West, Mumbai - 400050',
        phone: '+91-9876543223',
        lat: 19.0596,
        lng: 72.8295,
        type: 'service'
      }
    ]
  },
  'Bangalore': {
    name: 'Bangalore',
    state: 'Karnataka',
    lat: 12.9716,
    lng: 77.5946,
    serviceCenters: [
      {
        id: 'blr-1',
        name: 'CARS24 Hub Whitefield',
        address: 'Whitefield, Bangalore - 560066',
        phone: '+91-9876543230',
        lat: 12.9698,
        lng: 77.7500,
        type: 'pickup'
      },
      {
        id: 'blr-2',
        name: 'CARS24 Service Center Koramangala',
        address: '5th Block, Koramangala, Bangalore - 560095',
        phone: '+91-9876543231',
        lat: 12.9352,
        lng: 77.6245,
        type: 'service'
      },
      {
        id: 'blr-3',
        name: 'CARS24 Hub Yeshwanthpur',
        address: 'Yeshwanthpur, Bangalore - 560022',
        phone: '+91-9876543232',
        lat: 13.0280,
        lng: 77.5385,
        type: 'pickup'
      },
      {
        id: 'blr-4',
        name: 'CARS24 Service Center Electronic City',
        address: 'Electronic City Phase 1, Bangalore - 560100',
        phone: '+91-9876543233',
        lat: 12.8456,
        lng: 77.6603,
        type: 'service'
      }
    ]
  },
  'Hyderabad': {
    name: 'Hyderabad',
    state: 'Telangana',
    lat: 17.3850,
    lng: 78.4867,
    serviceCenters: [
      {
        id: 'hyd-1',
        name: 'CARS24 Hub Gachibowli',
        address: 'Gachibowli, Hyderabad - 500032',
        phone: '+91-9876543240',
        lat: 17.4399,
        lng: 78.3489,
        type: 'pickup'
      },
      {
        id: 'hyd-2',
        name: 'CARS24 Service Center Madhapur',
        address: 'Madhapur, Hyderabad - 500081',
        phone: '+91-9876543241',
        lat: 17.4485,
        lng: 78.3908,
        type: 'service'
      },
      {
        id: 'hyd-3',
        name: 'CARS24 Hub Secunderabad',
        address: 'Secunderabad, Hyderabad - 500003',
        phone: '+91-9876543242',
        lat: 17.4399,
        lng: 78.4983,
        type: 'pickup'
      }
    ]
  },
  'Pune': {
    name: 'Pune',
    state: 'Maharashtra',
    lat: 18.5204,
    lng: 73.8567,
    serviceCenters: [
      {
        id: 'pun-1',
        name: 'CARS24 Hub Hinjewadi',
        address: 'Hinjewadi Phase 1, Pune - 411057',
        phone: '+91-9876543250',
        lat: 18.5912,
        lng: 73.7389,
        type: 'pickup'
      },
      {
        id: 'pun-2',
        name: 'CARS24 Service Center Kharadi',
        address: 'Kharadi, Pune - 411014',
        phone: '+91-9876543251',
        lat: 18.5515,
        lng: 73.9473,
        type: 'service'
      },
      {
        id: 'pun-3',
        name: 'CARS24 Hub Wakad',
        address: 'Wakad, Pune - 411057',
        phone: '+91-9876543252',
        lat: 18.5978,
        lng: 73.7644,
        type: 'pickup'
      }
    ]
  },
  'Chennai': {
    name: 'Chennai',
    state: 'Tamil Nadu',
    lat: 13.0827,
    lng: 80.2707,
    serviceCenters: [
      {
        id: 'che-1',
        name: 'CARS24 Hub OMR',
        address: 'Old Mahabalipuram Road, Chennai - 600096',
        phone: '+91-9876543260',
        lat: 12.9010,
        lng: 80.2279,
        type: 'pickup'
      },
      {
        id: 'che-2',
        name: 'CARS24 Service Center Anna Nagar',
        address: 'Anna Nagar, Chennai - 600040',
        phone: '+91-9876543261',
        lat: 13.0850,
        lng: 80.2101,
        type: 'service'
      },
      {
        id: 'che-3',
        name: 'CARS24 Hub Tambaram',
        address: 'Tambaram, Chennai - 600045',
        phone: '+91-9876543262',
        lat: 12.9249,
        lng: 80.1000,
        type: 'pickup'
      }
    ]
  },
  'Kolkata': {
    name: 'Kolkata',
    state: 'West Bengal',
    lat: 22.5726,
    lng: 88.3639,
    serviceCenters: [
      {
        id: 'kol-1',
        name: 'CARS24 Hub Salt Lake',
        address: 'Salt Lake City, Kolkata - 700091',
        phone: '+91-9876543270',
        lat: 22.5726,
        lng: 88.4177,
        type: 'pickup'
      },
      {
        id: 'kol-2',
        name: 'CARS24 Service Center Rajarhat',
        address: 'New Town, Rajarhat, Kolkata - 700156',
        phone: '+91-9876543271',
        lat: 22.5958,
        lng: 88.4759,
        type: 'service'
      },
      {
        id: 'kol-3',
        name: 'CARS24 Hub Howrah',
        address: 'Howrah, West Bengal - 711101',
        phone: '+91-9876543272',
        lat: 22.5958,
        lng: 88.2636,
        type: 'pickup'
      }
    ]
  },
  'Ahmedabad': {
    name: 'Ahmedabad',
    state: 'Gujarat',
    lat: 23.0225,
    lng: 72.5714,
    serviceCenters: [
      {
        id: 'ahm-1',
        name: 'CARS24 Hub SG Highway',
        address: 'SG Highway, Ahmedabad - 380015',
        phone: '+91-9876543280',
        lat: 23.0347,
        lng: 72.5073,
        type: 'pickup'
      },
      {
        id: 'ahm-2',
        name: 'CARS24 Service Center Vastrapur',
        address: 'Vastrapur, Ahmedabad - 380015',
        phone: '+91-9876543281',
        lat: 23.0395,
        lng: 72.5268,
        type: 'service'
      },
      {
        id: 'ahm-3',
        name: 'CARS24 Hub Naranpura',
        address: 'Naranpura, Ahmedabad - 380013',
        phone: '+91-9876543282',
        lat: 23.0478,
        lng: 72.5624,
        type: 'pickup'
      }
    ]
  }
};

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCity, setSelectedCityState] = useState<string | null>(null);
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionError, setDetectionError] = useState<string | null>(null);

  const availableCities = Object.keys(CITIES_DATA);

  useEffect(() => {
    // Try to load saved city from localStorage
    const savedCity = localStorage.getItem('selectedCity');
    if (savedCity === '') {
      // "All Cities" was saved
      setSelectedCityState(null);
      setCityData(null);
    } else if (savedCity && CITIES_DATA[savedCity]) {
      setSelectedCityState(savedCity);
      setCityData(CITIES_DATA[savedCity]);
    } else {
      // Auto-detect on first load
      detectLocation();
    }
  }, []);

  const setSelectedCity = (city: string | null) => {
    if (city === null) {
      // "All Cities" selected
      setSelectedCityState(null);
      setCityData(null);
      localStorage.setItem('selectedCity', '');
      setDetectionError(null);
    } else if (CITIES_DATA[city]) {
      setSelectedCityState(city);
      setCityData(CITIES_DATA[city]);
      localStorage.setItem('selectedCity', city);
      setDetectionError(null);
    }
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string | null> => {
    try {
      // Using OpenStreetMap Nominatim for reverse geocoding (free, no API key needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'CARS24-App'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Reverse geocoding failed');
      }

      const data = await response.json();
      
      // Extract city name from the response
      const cityName = data.address?.city || 
                      data.address?.town || 
                      data.address?.village || 
                      data.address?.state_district ||
                      null;

      if (cityName) {
        // Try to match with our available cities (case-insensitive)
        const matchedCity = availableCities.find(
          city => city.toLowerCase() === cityName.toLowerCase() ||
                  cityName.toLowerCase().includes(city.toLowerCase())
        );
        
        return matchedCity || null;
      }

      return null;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  };

  const detectLocation = () => {
    setIsDetecting(true);
    setDetectionError(null);

    if (!navigator.geolocation) {
      setDetectionError('Geolocation is not supported by your browser');
      setIsDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Try reverse geocoding
        const detectedCity = await reverseGeocode(latitude, longitude);

        if (detectedCity) {
          setSelectedCity(detectedCity);
          setIsDetecting(false);
        } else {
          // Fallback: Find nearest city based on coordinates
          let nearestCity: string | null = null;
          let minDistance = Infinity;

          Object.entries(CITIES_DATA).forEach(([cityName, cityInfo]) => {
            const distance = Math.sqrt(
              Math.pow(cityInfo.lat - latitude, 2) + 
              Math.pow(cityInfo.lng - longitude, 2)
            );
            if (distance < minDistance) {
              minDistance = distance;
              nearestCity = cityName;
            }
          });

          if (nearestCity) {
            setSelectedCity(nearestCity);
          } else {
            setDetectionError('Could not detect your city. Please select manually.');
          }
          setIsDetecting(false);
        }
      },
      (error) => {
        let errorMessage = 'Location detection failed. Please select your city manually.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please select your city manually.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable. Please select your city manually.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please select your city manually.';
            break;
        }
        
        setDetectionError(errorMessage);
        setIsDetecting(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <LocationContext.Provider
      value={{
        selectedCity,
        setSelectedCity,
        cityData,
        isDetecting,
        detectionError,
        detectLocation,
        availableCities
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
