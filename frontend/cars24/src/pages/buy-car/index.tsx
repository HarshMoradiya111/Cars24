"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { CarGridSkeleton, EmptyState } from "@/components/ui/SkeletonLoaders";
// API fetch disabled to show only user-added cars
import { ChevronDown, Heart, Search, Sliders, ShoppingCart, MapPin } from "lucide-react";
import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import React, { useEffect, useMemo, useState } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useLocation } from "@/context/LocationContext";
import { calculateRecommendedPrice, detectCarType, Region } from "@/lib/pricingEngine";
import { getcarSummaries } from "@/lib/Carapi";
import Fuse from "fuse.js";

// const cars = [
//   {
//     id: "fronx-2023",
//     title: "2023 Maruti FRONX DELTA PLUS 1.2L AGS",
//     km: "10,048",
//     fuel: "Petrol",
//     transmission: "Auto",
//     owner: "1st owner",
//     emi: "₹15,245/m",
//     price: "₹7.80 lakh",
//     location: "Metro Walk, Rohini, New Delhi",
//     image: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
//   },
//   {
//     id: "swift-2017",
//     title: "2017 Maruti Swift VXI (O)",
//     km: "60,056",
//     fuel: "Petrol",
//     transmission: "Manual",
//     owner: "1st owner",
//     emi: "₹7,214/m",
//     price: "₹3.69 lakh",
//     location: "Metro Walk, Rohini, New Delhi",
//     image: "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg",
//   },
//   {
//     id: "creta-2021",
//     title: "2021 Hyundai Creta SX IVT",
//     km: "20,500",
//     fuel: "Petrol",
//     transmission: "Auto",
//     owner: "1st owner",
//     emi: "₹18,999/m",
//     price: "₹11.20 lakh",
//     location: "Sector 29, Gurugram",
//     image: "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
//   },
//   {
//     id: "baleno-2020",
//     title: "2020 Maruti Baleno ZETA",
//     km: "30,000",
//     fuel: "Petrol",
//     transmission: "Manual",
//     owner: "2nd owner",
//     emi: "₹10,600/m",
//     price: "₹6.45 lakh",
//     location: "Karol Bagh, New Delhi",
//     image: "https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg",
//   },
//   {
//     id: "eco-2018",
//     title: "2018 Maruti Eeco 5 STR WITH A/C+HTR",
//     km: "45,000",
//     fuel: "Petrol",
//     transmission: "Manual",
//     owner: "1st owner",
//     emi: "₹5,300/m",
//     price: "₹3.10 lakh",
//     location: "Lajpat Nagar, New Delhi",
//     image: "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
//   },
//   {
//     id: "city-2019",
//     title: "2019 Honda City ZX CVT",
//     km: "25,000",
//     fuel: "Petrol",
//     transmission: "Auto",
//     owner: "1st owner",
//     emi: "₹16,500/m",
//     price: "₹9.95 lakh",
//     location: "South Ex, New Delhi",
//     image: "https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg",
//   },
//   {
//     id: "venue-2022",
//     title: "2022 Hyundai Venue SX Turbo",
//     km: "12,000",
//     fuel: "Petrol",
//     transmission: "Auto",
//     owner: "1st owner",
//     emi: "₹14,875/m",
//     price: "₹9.40 lakh",
//     location: "Noida Sector 63, Uttar Pradesh",
//     image: "https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg",
//   },
//   {
//     id: "altroz-2021",
//     title: "2021 Tata Altroz XT Petrol",
//     km: "18,000",
//     fuel: "Petrol",
//     transmission: "Manual",
//     owner: "1st owner",
//     emi: "₹9,350/m",
//     price: "₹6.75 lakh",
//     location: "Dwarka, New Delhi",
//     image: "https://images.pexels.com/photos/1280560/pexels-photo-1280560.jpeg",
//   },
// ];
interface Car {
  id: string;
  title: string;
  km: string;
  fuel: string;
  transmission: string;
  owner: string;
  emi: string;
  price: string;
  location: string;
  image: string;
  year?: number;
  brand?: string;
  recommendedPrice?: number;
  pricingExplanation?: string;
}
const parseAmount = (raw: string) => {
  if (!raw) return null;
  
  // If price is in lakh format (e.g., "₹ 6.80 lakh")
  if (/lakh/i.test(raw)) {
    const match = raw.match(/(\d+\.?\d*)\s*lakh/i);
    if (match) {
      const lakhValue = parseFloat(match[1]);
      return Math.round(lakhValue * 100000); // Convert lakh to rupees
    }
  }
  
  // Otherwise, extract all digits
  const digits = raw.toString().replace(/[^0-9.]/g, "");
  return digits ? Math.round(parseFloat(digits)) : null;
};

const formatCurrency = (value: string, fallback = "N/A") => {
  if (!value) return fallback;
  
  // If value already has lakh format like "₹6.80 lakh", just ensure rupee symbol
  if (/lakh/i.test(value)) {
    // Extract the numeric part with decimal
    const match = value.match(/(\d+\.?\d*)\s*lakh/i);
    if (match) {
      return `₹ ${match[1]} lakh`;
    }
    return value; // Return as-is if we can't parse
  }
  
  // Otherwise parse as number and convert to lakh
  const amount = parseAmount(value);
  if (amount === null) return fallback;
  
  const lakhValue = amount / 100000;
  return `₹ ${lakhValue.toFixed(2)} lakh`;
};

const parseKmValue = (raw: string) => {
  if (!raw) return null;
  const digits = raw.replace(/[^0-9]/g, "");
  return digits ? parseInt(digits, 10) : null;
};

const extractYear = (raw: string) => {
  const match = raw.match(/(19|20)\d{2}/);
  return match ? parseInt(match[0], 10) : null;
};

const numberFormatter = new Intl.NumberFormat("en-US");

const detectBrand = (title: string) => {
  const brands = [
    "Maruti",
    "Suzuki",
    "Hyundai",
    "Honda",
    "Tata",
    "Toyota",
    "Kia",
    "Renault",
    "Mahindra",
    "Volkswagen",
    "Skoda",
    "Scoda",
    "Ford",
    "Nissan",
    "MG",
    "Jeep",
    "Mercedes",
    "Mercedes-Benz",
    "BMW",
    "Audi",
    "Volvo",
    "Jaguar",
    "Land Rover",
    "Lexus",
    "Porsche",
    "Mini",
    "Fiat",
    "Citroen",
    "Peugeot",
    "Chevrolet",
    "Datsun",
    "Isuzu",
    "Mitsubishi",
    "Opel",
  ];
  const lower = title.toLowerCase();
  for (const b of brands) {
    if (lower.includes(b.toLowerCase())) return b;
  }
  return undefined;
};
const index = () => {
  const { toggle, isSaved } = useWishlist();
  const { selectedCity } = useLocation();
  const [priceRange, setPriceRange] = useState([0, 5000000]); // 0 to 50 lakh
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [cars, setCars] = useState<Car[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [userLocation, setUserLocation] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<Region>("Metro");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Car[]>([]);
  const [fuelFilters, setFuelFilters] = useState<string[]>([]);
  const [transmissionFilters, setTransmissionFilters] = useState<string[]>([]);
  const [mileageRange, setMileageRange] = useState<[number, number]>([0, 200000]);
  const currentYear = new Date().getFullYear();
  const [yearRange, setYearRange] = useState<[number, number]>([2005, currentYear]);
  const [sortOption, setSortOption] = useState("default");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading cars...");
  const priceStats = useMemo(() => {
    if (!cars || cars.length === 0) return { min: 0, max: 5000000 };
    const amounts = cars.map((c) => parseAmount(c.price) || 0).filter((n) => n >= 0);
    const min = amounts.length ? Math.min(...amounts) : 0;
    const max = amounts.length ? Math.max(...amounts, 5000000) : 5000000;
    return { min, max };
  }, [cars]);

  const availableBrands = useMemo(() => {
    if (!cars) return [] as string[];
    const set = new Set<string>();
    cars.forEach((car) => {
      if (car.brand) {
        set.add(car.brand);
      } else {
        const inferred = detectBrand(car.title);
        if (inferred) set.add(inferred);
      }
    });
    return Array.from(set).sort();
  }, [cars]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setLoadingMessage("Loading cars...");
    
    // Update loading message after 3 seconds
    const messageTimer = setTimeout(() => {
      if (isMounted && loading) {
        setLoadingMessage("Still loading... The server might be starting up (this can take up to 30s on first load)");
      }
    }, 3000);

    const loadCars = async () => {
      try {
        const summaries = await getcarSummaries({ userLocation });

        if (!Array.isArray(summaries)) {
          console.warn("[buy-car] API returned non-array:", typeof summaries);
          throw new Error("API returned non-array response");
        }

        const carsWithPricing = summaries.map((c: any) => {
          const basePrice = parseAmount(c.price) || 0;
          const carType = detectCarType(c.title);
          const pricing = calculateRecommendedPrice(basePrice, carType, selectedRegion);
          const title = c.title || c.name || "";
          const yearFromData = c.specs?.year ?? extractYear(title);
          return {
            id: c.id || c._id || c.carId || "",
            title,
            km: c.specs?.km || c.km || "N/A",
            fuel: c.specs?.fuel || c.fuel || "N/A",
            transmission: c.specs?.transmission || c.transmission || "N/A",
            owner: c.specs?.owner || c.owner || "N/A",
            emi: c.emi || "N/A",
            price: c.price || "N/A",
            location: c.location || "N/A",
            image: Array.isArray(c.images) && c.images.length > 0 ? c.images[0] : c.image || "",
            year: yearFromData,
            brand: c.brand || c.make || detectBrand(title),
            recommendedPrice: pricing.recommendedPrice,
            pricingExplanation: pricing.explanation,
          } as Car;
        });

        if (isMounted) {
          console.log(`[buy-car] Loaded ${carsWithPricing.length} cars from API`);
          setCars(carsWithPricing);
          setError(false);
        }
      } catch (err) {
        console.error("[buy-car] Failed to load cars from API", err);
        if (isMounted) {
          setError(true);
          setCars([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCars();

    return () => {
      isMounted = false;
      clearTimeout(messageTimer);
    };
  }, [selectedRegion, userLocation]);

  useEffect(() => {
    if (!cars || cars.length === 0) return;
    setPriceRange([priceStats.min, priceStats.max]);
  }, [cars, priceStats.min, priceStats.max]);

  const fuse = useMemo(() => {
    if (!cars || cars.length === 0) return null;
    return new Fuse(cars, {
      keys: [
        { name: "title", weight: 0.5 },
        { name: "location", weight: 0.2 },
        { name: "fuel", weight: 0.15 },
        { name: "transmission", weight: 0.15 },
      ],
      includeScore: true,
      threshold: 0.3,
      distance: 120,
      minMatchCharLength: 1,
    });
  }, [cars]);

  const searchResults = useMemo(() => {
    if (!cars) return null;
    if (!searchQuery.trim() || !fuse) return cars;
    const results = fuse.search(searchQuery.trim());
    return results
      .sort((a, b) => (a.score || 0) - (b.score || 0))
      .map((r) => r.item);
  }, [cars, fuse, searchQuery]);

  useEffect(() => {
    if (!fuse || !searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const query = searchQuery.trim().toLowerCase();
    const raw = fuse.search(query, { limit: 15 }).map((r) => r.item);
    const uniqueByTitle: Record<string, Car> = {};
    raw.forEach((item) => {
      const titleLower = item.title?.toLowerCase() || "";
      const brandLower = item.brand?.toLowerCase() || "";
      if (!titleLower.includes(query) && !brandLower.includes(query)) return;
      if (item.title && !uniqueByTitle[item.title]) {
        uniqueByTitle[item.title] = item;
      }
    });
    const nextSuggestions = Object.values(uniqueByTitle).slice(0, 5);
    setSuggestions(nextSuggestions);
  }, [fuse, searchQuery]);
  
  // Filter and sort cars
  const filteredAndSortedCars = useMemo(() => {
    if (!cars || !searchResults) return null;

    const base = searchQuery.trim() ? searchResults : cars;

    const filtered = base.filter((car) => {
      const carPrice = parseAmount(car.price) || 0;
      const kmValue = parseKmValue(car.km) ?? 0;
      const yearValue = car.year ?? extractYear(car.title);

      const matchesPrice = carPrice >= priceRange[0] && carPrice <= priceRange[1];
      const matchesBrand =
        selectedBrands.length === 0 ||
        selectedBrands.some((brand) => {
          const brandLower = brand.toLowerCase();
          return (
            (car.brand && car.brand.toLowerCase() === brandLower) ||
            car.title.toLowerCase().includes(brandLower)
          );
        });
      
      // City-based filtering - match if location contains selected city
      const matchesCity = !selectedCity || 
        car.location.toLowerCase().includes(selectedCity.toLowerCase());
      
      const matchesFuel = fuelFilters.length === 0 || fuelFilters.includes(car.fuel);
      const matchesTransmission =
        transmissionFilters.length === 0 || transmissionFilters.includes(car.transmission);
      const matchesMileage = kmValue >= mileageRange[0] && kmValue <= mileageRange[1];
      const matchesYear =
        yearValue === null || yearValue === undefined
          ? true
          : yearValue >= yearRange[0] && yearValue <= yearRange[1];

      if (!matchesPrice) {
        console.log(
          `[buy-car] Car filtered by price: ${car.title} (₹${carPrice}) outside range [${priceRange[0]}, ${priceRange[1]}]`
        );
      }

      return (
        matchesPrice &&
        matchesBrand &&
        matchesCity &&
        matchesFuel &&
        matchesTransmission &&
        matchesMileage &&
        matchesYear
      );
    });

    console.log("[buy-car] Cars after filter:", filtered.length);

    const sorted = [...filtered];
    if (!searchQuery.trim() || sortOption !== "default") {
      if (sortOption === "price-low") {
        sorted.sort((a, b) => (parseAmount(a.price) || 0) - (parseAmount(b.price) || 0));
      } else if (sortOption === "price-high") {
        sorted.sort((a, b) => (parseAmount(b.price) || 0) - (parseAmount(a.price) || 0));
      } else if (sortOption === "km-low") {
        sorted.sort((a, b) => (parseKmValue(a.km) || 0) - (parseKmValue(b.km) || 0));
      } else if (sortOption === "year-new") {
        sorted.sort((a, b) => {
          const yearA = extractYear(a.title) || 0;
          const yearB = extractYear(b.title) || 0;
          return yearB - yearA;
        });
      }
    }

    return sorted;
  }, [cars, searchResults, searchQuery, priceRange, selectedBrands, selectedCity, sortOption, fuelFilters, transmissionFilters, mileageRange, yearRange]);
  
  const showDemoBanner = process.env.NEXT_PUBLIC_SHOW_DEMO_BANNER !== "false";
  return (
    <div className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white text-black">
        {error && showDemoBanner && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ Using demo data - Backend API not connected. Configure MongoDB to see live data.
            </p>
          </div>
        )}
        {selectedCity && (
          <div className="mb-4 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-blue-800">
                Showing cars available in <strong>{selectedCity}</strong>
              </p>
            </div>
            <Link href="/locations" className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium active:text-blue-900 w-full sm:w-auto text-center sm:text-left">
              View Locations →
            </Link>
          </div>
        )}
        {selectedCity === null && (
          <div className="mb-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-green-800">
                Showing available cars from <strong>all cities</strong>
              </p>
            </div>
            <Link href="/locations" className="text-xs sm:text-sm text-green-600 hover:text-green-800 font-medium active:text-green-900 w-full sm:w-auto text-center sm:text-left">
              View Locations →
            </Link>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* filter */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-4">Filters</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Region (Pricing)
                  </label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value as Region)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Metro">Metro</option>
                    <option value="Hilly">Hilly</option>
                    <option value="Rural">Rural</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Adjust prices based on region</p>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Price Range
                  </label>
                  <Slider
                    defaultValue={[priceStats.min, priceStats.max]}
                    max={priceStats.max}
                    step={10000}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mt-2"
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>
                      ₹{(priceRange[0] / 100000).toFixed(2)} Lakh
                    </span>
                    <span>
                      ₹{(priceRange[1] / 100000).toFixed(2)} Lakh
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Brand
                  </label>
                  <div className="space-y-2">
                    {(availableBrands.length ? availableBrands : ["Maruti", "Hyundai", "Honda", "Tata"]).map((brand) => (
                      <label key={brand} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={selectedBrands.includes(brand)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedBrands([...selectedBrands, brand]);
                            } else {
                              setSelectedBrands(
                                selectedBrands.filter((b) => b !== brand)
                              );
                            }
                          }}
                        />
                        <span className="ml-2 text-sm">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Fuel Type</label>
                  <div className="space-y-2">
                    {["Petrol", "Diesel", "CNG", "Electric", "Hybrid"].map((fuel) => (
                      <label key={fuel} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={fuelFilters.includes(fuel)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFuelFilters([...fuelFilters, fuel]);
                            } else {
                              setFuelFilters(fuelFilters.filter((f) => f !== fuel));
                            }
                          }}
                        />
                        <span className="ml-2 text-sm">{fuel}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Transmission</label>
                  <div className="space-y-2">
                    {["Manual", "Auto", "Automatic"].map((mode) => (
                      <label key={mode} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={transmissionFilters.includes(mode)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTransmissionFilters([...transmissionFilters, mode]);
                            } else {
                              setTransmissionFilters(transmissionFilters.filter((m) => m !== mode));
                            }
                          }}
                        />
                        <span className="ml-2 text-sm">{mode}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Mileage (km)</label>
                  <Slider
                    defaultValue={[0, 200000]}
                    min={0}
                    max={200000}
                    step={1000}
                    value={mileageRange}
                    onValueChange={(value) => setMileageRange(value as [number, number])}
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>{numberFormatter.format(mileageRange[0])} km</span>
                    <span>{numberFormatter.format(mileageRange[1])} km</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Year</label>
                  <Slider
                    defaultValue={[2005, currentYear]}
                    min={1995}
                    max={currentYear}
                    step={1}
                    value={yearRange}
                    onValueChange={(value) => setYearRange(value as [number, number])}
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>{yearRange[0]}</span>
                    <span>{yearRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* cars grid */}
          <div className="md:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Used Cars in Delhi NCR</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={userLocation}
                    onChange={(e) => setUserLocation(e.target.value)}
                    placeholder="Your location"
                  />
                </div>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search cars..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  {suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-md z-20 max-h-60 overflow-y-auto">
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                          onClick={() => {
                            setSearchQuery(suggestion.title);
                            setSuggestions([]);
                          }}
                        >
                          <div className="font-medium text-gray-800">{suggestion.title}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <Button
                    variant="outline"
                    className="flex items-center text-black border-gray-300 bg-white hover:bg-gray-50 hover:text-black hover:border-gray-400"
                    onClick={() => setShowSortMenu(!showSortMenu)}
                  >
                    <Sliders className="h-4 w-4 mr-2" />
                    Sort
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                  {showSortMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <div className="py-1">
                        <button
                          onClick={() => { setSortOption("default"); setShowSortMenu(false); }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Default
                        </button>
                        <button
                          onClick={() => { setSortOption("price-low"); setShowSortMenu(false); }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Price: Low to High
                        </button>
                        <button
                          onClick={() => { setSortOption("price-high"); setShowSortMenu(false); }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Price: High to Low
                        </button>
                        <button
                          onClick={() => { setSortOption("km-low"); setShowSortMenu(false); }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Km Driven: Low to High
                        </button>
                        <button
                          onClick={() => { setSortOption("year-new"); setShowSortMenu(false); }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Year: Newest First
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cars Grid or Loading State */}
            {loading ? (
              <div className="space-y-4">
                <div className="text-center py-4">{loadingMessage}
                  <p className="text-sm text-gray-600">Loading cars... This may take a moment if the server is starting up.</p>
                </div>
                <CarGridSkeleton count={6} />
              </div>
            ) : filteredAndSortedCars && filteredAndSortedCars.length === 0 ? (
              <EmptyState
                title="No Cars Found"
                description="Try adjusting your filters or search query to find more cars."
                icon={<ShoppingCart className="h-16 w-16" />}
                action={
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setPriceRange([0, 5000000]);
                      setSelectedBrands([]);
                      setFuelFilters([]);
                      setTransmissionFilters([]);
                      setMileageRange([0, 200000]);
                      setYearRange([2005, currentYear]);
                    }}
                    variant="default"
                  >
                    Clear All Filters
                  </Button>
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedCars?.map((car) => (
                  <Link
                    key={car.id}
                    href={`/buy-car/${car.id}`}
                    className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                      {/* Image with full width and large height */}
                      <div className="relative w-full h-64 sm:h-72 bg-gray-100 overflow-hidden flex-shrink-0">
                        <SafeImage
                          src={Array.isArray((car as any).image) ? (car as any).image?.[0] : (car as any).image}
                          alt={car.title}
                          fit="contain"
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            toggle({
                              id: car.id,
                              title: car.title,
                              image: car.image,
                              price: car.price,
                              emi: car.emi,
                              location: car.location,
                            });
                          }}
                          className="absolute top-3 right-3 p-2 bg-white rounded-full hover:bg-gray-100 shadow-sm"
                        >
                          <Heart
                            className={`h-5 w-5 ${isSaved(car.id) ? "text-red-500" : "text-gray-400"}`}
                            fill={isSaved(car.id) ? "currentColor" : "none"}
                          />
                        </button>
                      </div>

                      {/* Car Details Below Image */}
                      <div className="flex-1 p-4 space-y-3 flex flex-col">
                        {/* Badge */}
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            O
                          </div>
                          <span className="text-xs font-semibold text-gray-700">Cars24 Owned Stock</span>
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-base text-gray-900 line-clamp-2">
                          {car.title}
                        </h3>

                        {/* Specs Row */}
                        <div className="flex items-center gap-3 text-xs text-gray-600 flex-wrap">
                          <span>{car.km}</span>
                          <span>•</span>
                          <span>{car.fuel}</span>
                          <span>•</span>
                          <span>{car.transmission}</span>
                          <span>•</span>
                          <span>{car.owner}</span>
                        </div>

                        {/* Pricing Section */}
                        <div className="space-y-2 border-t pt-3">
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Base Price</div>
                            <div className="font-semibold text-lg text-gray-900">
                              {formatCurrency(car.price, car.price)}
                            </div>
                          </div>
                          {typeof car.recommendedPrice === "number" && (
                            <div>
                              <div className="text-xs text-gray-600 mb-1">Recommended Price</div>
                              <div className="font-bold text-lg text-green-600">
                                {formatCurrency(String(car.recommendedPrice), "")}
                              </div>
                              <div className="text-xs text-gray-500 mt-1 italic">
                                {car.pricingExplanation}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-1 text-xs text-gray-600 pt-2 border-t mt-auto">
                          <span>📍</span>
                          <span>{car.location}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
