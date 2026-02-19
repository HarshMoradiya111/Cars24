"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { CarGridSkeleton, EmptyState } from "@/components/ui/SkeletonLoaders";
import { ChevronDown, Heart, Search, Sliders, ShoppingCart, MapPin, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import React, { useEffect, useMemo, useState } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useLocation } from "@/context/LocationContext";
import { calculateRecommendedPrice, detectCarType, Region } from "@/utils/pricingEngine";
import { getcarSummaries } from "@/services/carService";
import Fuse from "fuse.js";
import LoadingState from "@/components/ui/LoadingState";
import EmptyStateComponent from "@/components/ui/EmptyState";
import { useRouter } from "next/router";
import { formatCurrency, normalizeOwnerText, parseAmount, parseKmValue } from "@/utils/formatters";
import { notifyPriceDropIfNeeded } from "@/lib/realEventNotifications";

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
  const router = useRouter();
  const [priceRange, setPriceRange] = useState([0, 5000000]); // 0 to 50 lakh
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
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
  const [showFilters, setShowFilters] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading cars...");

  useEffect(() => {
    if (router.query.search && typeof router.query.search === 'string') {
      setSearchQuery(router.query.search);
    }
  }, [router.query.search]);
  
  const priceStats = useMemo(() => {
    if (!cars || cars.length === 0) return { min: 0, max: 5000000 };
    const amounts = cars.map((c) => parseAmount(c?.price) || 0).filter((n) => n >= 0);
    const min = amounts.length ? Math.min(...amounts) : 0;
    const max = amounts.length ? Math.max(...amounts, 5000000) : 5000000;
    return { min, max };
  }, [cars]);

  const availableBrands = useMemo(() => {
    if (!cars || cars.length === 0) return [] as string[];
    const set = new Set<string>();
    cars.forEach((car) => {
      if (car?.brand) {
        set.add(car.brand);
      } else if (car?.title) {
        const inferred = detectBrand(car.title);
        if (inferred) set.add(inferred);
      }
    });
    return Array.from(set).sort();
  }, [cars]);

  const loadCars = async (isRetry = false) => {
    try {
      if (isRetry) {
        setIsRetrying(true);
        setLoadingMessage("Retrying... Server might be waking up from cold start");
      } else {
        setLoading(true);
        setLoadingMessage("Loading cars...");
      }
      setError(null);

      console.time("API: Load Cars");
      const summaries = await getcarSummaries({ userLocation: selectedCity || "Delhi" });
      console.timeEnd("API: Load Cars");

      if (!summaries) {
        throw new Error("API returned null or undefined response");
      }

      let carsArray: any[] = [];
      if (Array.isArray(summaries)) {
        carsArray = summaries;
      } else if (summaries && typeof summaries === 'object') {
        if (Array.isArray(summaries.data)) {
          carsArray = summaries.data;
        } else if (Array.isArray(summaries.cars)) {
          carsArray = summaries.cars;
        }
      }

      if (carsArray.length === 0) {
        console.warn("[buy-car] API returned empty array");
      }

      const carsWithPricing = carsArray.map((c: any) => {
        const basePrice = parseAmount(c?.price) || 0;
        const title = c?.title || c?.name || "Unknown Car";
        const carType = detectCarType(title);
        const pricing = calculateRecommendedPrice(basePrice, carType, selectedRegion);
        const yearFromData = c?.specs?.year ?? extractYear(title);

        const stableId = c?.id || c?._id || c?.carId || `car-${Date.now()}-${Math.random()}`;

        // Only notify price drops for cars the user explicitly saved.
        if (isSaved(String(stableId))) {
          notifyPriceDropIfNeeded({
            carId: String(stableId),
            carName: String(title),
            newRecommendedPrice: pricing.recommendedPrice,
            url: `/buy-car/${String(stableId)}`,
          });
        }

        return {
          id: stableId,
          title,
          km: c?.specs?.km || c?.km || "N/A",
          fuel: c?.specs?.fuel || c?.fuel || "N/A",
          transmission: c?.specs?.transmission || c?.transmission || "N/A",
          owner: normalizeOwnerText(c?.specs?.owner || c?.owner || "N/A"),
          emi: c?.emi || "N/A",
          price: c?.price || "N/A",
          location: c?.location || "N/A",
          image: Array.isArray(c?.images) && c.images.length > 0 ? c.images[0] : c?.image || "",
          year: yearFromData,
          brand: c?.brand || c?.make || detectBrand(title),
          recommendedPrice: pricing.recommendedPrice,
          pricingExplanation: pricing.explanation,
        } as Car;
      });

      console.log(`[buy-car] ✓ Loaded ${carsWithPricing.length} cars successfully`);
      setCars(carsWithPricing);
      setError(null);
    } catch (err: any) {
      const errorMsg = err?.message || "Failed to load cars";
      console.error("[buy-car] ✗ Error loading cars:", errorMsg, err);
      setError(errorMsg);
      setCars([]); // Set to empty array instead of leaving null
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let messageTimer: NodeJS.Timeout;
    
    const init = async () => {
      if (!isMounted) return;
      
      // Update loading message after 5 seconds
      messageTimer = setTimeout(() => {
        if (isMounted && loading) {
          setLoadingMessage("Still loading... Server cold start can take up to 50 seconds on first request");
        }
      }, 5000);

      await loadCars();
    };

    init();

    return () => {
      isMounted = false;
      if (messageTimer) clearTimeout(messageTimer);
    };
  }, [selectedRegion, selectedCity]);

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
    if (!cars || cars.length === 0) return [];
    if (!searchQuery.trim() || !fuse) return cars;
    const results = fuse.search(searchQuery.trim());
    return results
      .sort((a, b) => (a?.score || 0) - (b?.score || 0))
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
    if (!cars || cars.length === 0) return [];
    if (!searchResults || searchResults.length === 0) return [];

    const base = searchQuery.trim() ? searchResults : cars;

    const filtered = base.filter((car) => {
      if (!car) return false; // Skip null/undefined cars
      
      const carPrice = parseAmount(car?.price) || 0;
      const kmValue = parseKmValue(car?.km) ?? 0;
      const yearValue = car?.year ?? extractYear(car?.title || "");

      const matchesPrice = carPrice >= priceRange[0] && carPrice <= priceRange[1];
      const matchesBrand =
        selectedBrands.length === 0 ||
        selectedBrands.some((brand) => {
          const brandLower = brand.toLowerCase();
          return (
            (car?.brand && car.brand.toLowerCase() === brandLower) ||
            (car?.title && car.title.toLowerCase().includes(brandLower))
          );
        });

      const matchesCity = !selectedCity || 
        (car?.location && car.location.toLowerCase().includes(selectedCity.toLowerCase()));
      
      const matchesFuel = fuelFilters.length === 0 || (car?.fuel && fuelFilters.includes(car.fuel));
      const matchesTransmission =
        transmissionFilters.length === 0 || (car?.transmission && transmissionFilters.includes(car.transmission));
      const matchesMileage = kmValue >= mileageRange[0] && kmValue <= mileageRange[1];
      const matchesYear =
        yearValue === null || yearValue === undefined
          ? true
          : yearValue >= yearRange[0] && yearValue <= yearRange[1];

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
        sorted.sort((a, b) => (parseAmount(a?.price) || 0) - (parseAmount(b?.price) || 0));
      } else if (sortOption === "price-high") {
        sorted.sort((a, b) => (parseAmount(b?.price) || 0) - (parseAmount(a?.price) || 0));
      } else if (sortOption === "km-low") {
        sorted.sort((a, b) => (parseKmValue(a?.km) || 0) - (parseKmValue(b?.km) || 0));
      } else if (sortOption === "year-new") {
        sorted.sort((a, b) => {
          const yearA = extractYear(a?.title || "") || 0;
          const yearB = extractYear(b?.title || "") || 0;
          return yearB - yearA;
        });
      }
    }

    return sorted;
  }, [cars, searchResults, searchQuery, priceRange, selectedBrands, selectedCity, sortOption, fuelFilters, transmissionFilters, mileageRange, yearRange]);
  
  const showDemoBanner = process.env.NEXT_PUBLIC_SHOW_DEMO_BANNER !== "false";
  
  const handleRetry = () => {
    loadCars(true);
  };
  
  return (
    <div className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white text-black">
        {error && showDemoBanner && !loading && !isRetrying && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 mb-1">Failed to load cars</p>
                <p className="text-xs text-red-700 mb-3">{error}</p>
                <Button
                  onClick={handleRetry}
                  size="sm"
                  variant="outline"
                  className="text-red-700 border-red-300 hover:bg-red-100"
                  disabled={isRetrying}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
                  {isRetrying ? 'Retrying...' : 'Retry'}
                </Button>
              </div>
            </div>
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
        {/* Mobile Filter Toggle Button */}
        <div className="md:hidden mb-4">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 text-black border-gray-300 bg-white hover:bg-gray-50"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Sliders className="h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
          <div className={`md:col-span-1 space-y-4 sm:space-y-6 ${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-sm sm:text-base font-semibold">Filters</h3>
                <button
                  onClick={() => {
                    setPriceRange([priceStats.min, priceStats.max]);
                    setSelectedBrands([]);
                    setFuelFilters([]);
                    setTransmissionFilters([]);
                    setMileageRange([0, 200000]);
                    setYearRange([2005, currentYear]);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear All
                </button>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label htmlFor="region-select" className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block">
                    Region (Pricing)
                  </label>
                  <select
                    id="region-select"
                    name="region"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value as Region)}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Metro">Metro</option>
                    <option value="Hilly">Hilly</option>
                    <option value="Rural">Rural</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Adjust prices based on region</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block">
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
                  <div className="flex justify-between mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-600">
                    <span>
                      ₹{(priceRange[0] / 100000).toFixed(2)} L
                    </span>
                    <span>
                      ₹{(priceRange[1] / 100000).toFixed(2)} L
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block">
                    Brand
                  </label>
                  <div className="space-y-1.5 sm:space-y-2 max-h-32 sm:max-h-none overflow-y-auto">
                    {(availableBrands.length ? availableBrands : ["Maruti", "Hyundai", "Honda", "Tata"]).map((brand) => (
                      <label key={brand} htmlFor={`brand-${brand}`} className="flex items-center">
                        <input
                          id={`brand-${brand}`}
                          name={`brand-${brand}`}
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 sm:w-4 sm:h-4"
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
                        <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block">Fuel Type</label>
                  <div className="space-y-1.5 sm:space-y-2 max-h-28 sm:max-h-none overflow-y-auto">
                    {["Petrol", "Diesel", "CNG", "Electric", "Hybrid"].map((fuel) => (
                      <label key={fuel} htmlFor={`fuel-${fuel}`} className="flex items-center">
                        <input
                          id={`fuel-${fuel}`}
                          name={`fuel-${fuel}`}
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 sm:w-4 sm:h-4"
                          checked={fuelFilters.includes(fuel)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFuelFilters([...fuelFilters, fuel]);
                            } else {
                              setFuelFilters(fuelFilters.filter((f) => f !== fuel));
                            }
                          }}
                        />
                        <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm">{fuel}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block">Transmission</label>
                  <div className="space-y-1.5 sm:space-y-2">
                    {["Manual", "Auto", "Automatic"].map((mode) => (
                      <label key={mode} htmlFor={`transmission-${mode}`} className="flex items-center">
                        <input
                          id={`transmission-${mode}`}
                          name={`transmission-${mode}`}
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 sm:w-4 sm:h-4"
                          checked={transmissionFilters.includes(mode)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTransmissionFilters([...transmissionFilters, mode]);
                            } else {
                              setTransmissionFilters(transmissionFilters.filter((m) => m !== mode));
                            }
                          }}
                        />
                        <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm">{mode}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block">Mileage (km)</label>
                  <Slider
                    defaultValue={[0, 200000]}
                    min={0}
                    max={200000}
                    step={1000}
                    value={mileageRange}
                    onValueChange={(value) => setMileageRange(value as [number, number])}
                  />
                  <div className="flex justify-between mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-600">
                    <span>{numberFormatter.format(mileageRange[0])} km</span>
                    <span>{numberFormatter.format(mileageRange[1])} km</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block">Year</label>
                  <Slider
                    defaultValue={[2005, currentYear]}
                    min={1995}
                    max={currentYear}
                    step={1}
                    value={yearRange}
                    onValueChange={(value) => setYearRange(value as [number, number])}
                  />
                  <div className="flex justify-between mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-600">
                    <span>{yearRange[0]}</span>
                    <span>{yearRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* cars grid */}
          <div className="md:col-span-3">
            <div className="flex flex-col gap-4 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">Used Cars in Delhi NCR</h1>
                  {selectedCity && (
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      Prices adjusted for <span className="font-semibold text-blue-600">{selectedCity}</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Search cars..."
                    className="pl-10 text-sm"
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
                    className="flex items-center text-black border-gray-300 bg-white hover:bg-gray-50 hover:text-black hover:border-gray-400 w-full sm:w-auto justify-center text-sm"
                    onClick={() => setShowSortMenu(!showSortMenu)}
                  >
                    <Sliders className="h-4 w-4 mr-1.5" />
                    Sort
                    <ChevronDown className="h-4 w-4 ml-1.5" />
                  </Button>
                  {showSortMenu && (
                    <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-full sm:w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                      <div className="py-1">
                        <button
                          onClick={() => { setSortOption("default"); setShowSortMenu(false); }}
                          className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm hover:bg-gray-100 active:bg-gray-200"
                        >
                          Default
                        </button>
                        <button
                          onClick={() => { setSortOption("price-low"); setShowSortMenu(false); }}
                          className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm hover:bg-gray-100 active:bg-gray-200"
                        >
                          Price: Low to High
                        </button>
                        <button
                          onClick={() => { setSortOption("price-high"); setShowSortMenu(false); }}
                          className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm hover:bg-gray-100 active:bg-gray-200"
                        >
                          Price: High to Low
                        </button>
                        <button
                          onClick={() => { setSortOption("km-low"); setShowSortMenu(false); }}
                          className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm hover:bg-gray-100 active:bg-gray-200"
                        >
                          Km Driven: Low to High
                        </button>
                        <button
                          onClick={() => { setSortOption("year-new"); setShowSortMenu(false); }}
                          className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm hover:bg-gray-100 active:bg-gray-200"
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
            {loading || isRetrying ? (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                    <p className="text-sm font-medium text-blue-800">{loadingMessage}</p>
                  </div>
                  <p className="text-xs text-blue-600">
                    {isRetrying ? "Retrying request..." : "First load may take 30-50 seconds due to server cold start"}
                  </p>
                </div>
                <LoadingState type="skeleton" count={6} />
              </div>
            ) : error ? (
              <EmptyStateComponent
                type="error"
                title="Failed to load cars"
                message={error}
                onActionClick={handleRetry}
                actionText="Try Again"
              />
            ) : !filteredAndSortedCars || filteredAndSortedCars.length === 0 ? (
              <EmptyStateComponent
                type={selectedCity ? "no-city" : "no-results"}
                title={selectedCity ? "No cars in this city" : "No cars found"}
                message={
                  selectedCity
                    ? `No cars available in ${selectedCity} right now. Try selecting a different city or view all cities.`
                    : "Try adjusting your filters or search query to find more cars."
                }
                actionText="Clear Filters"
                onActionClick={() => {
                  setSearchQuery("");
                  setPriceRange([priceStats.min, priceStats.max]);
                  setSelectedBrands([]);
                  setFuelFilters([]);
                  setTransmissionFilters([]);
                  setMileageRange([0, 200000]);
                  setYearRange([2005, currentYear]);
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedCars.map((car) => {
                  // Additional safety check per car
                  if (!car || !car.id) return null;
                  
                  return (
                    <Link
                      key={car.id}
                      href={`/buy-car/${car.id}`}
                      className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Image with full width and large height */}
                      <div className="relative w-full h-64 sm:h-72 bg-gray-100 overflow-hidden flex-shrink-0">
                        <SafeImage
                          src={Array.isArray((car as any)?.image) ? (car as any).image?.[0] : (car as any)?.image}
                          alt={car?.title || "Car image"}
                          fit="contain"
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            if (car?.id) {
                              toggle({
                                id: car.id,
                                title: car?.title || "Unknown",
                                image: car?.image || "",
                                price: car?.price || "N/A",
                                emi: car?.emi || "N/A",
                                location: car?.location || "N/A",
                              });
                            }
                          }}
                          className="absolute top-3 right-3 p-2 bg-white rounded-full hover:bg-gray-100 shadow-sm"
                          disabled={loading || isRetrying}
                        >
                          <Heart
                            className={`h-5 w-5 ${car?.id && isSaved(car.id) ? "text-red-500" : "text-gray-400"}`}
                            fill={car?.id && isSaved(car.id) ? "currentColor" : "none"}
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
                          {car?.title || "Unknown Car"}
                        </h3>

                        {/* Specs Row */}
                        <div className="flex items-center gap-3 text-xs text-gray-600 flex-wrap">
                          <span>{car?.km || "N/A"}</span>
                          <span>•</span>
                          <span>{car?.fuel || "N/A"}</span>
                          <span>•</span>
                          <span>{car?.transmission || "N/A"}</span>
                          <span>•</span>
                          <span>{normalizeOwnerText(car?.owner || "N/A")}</span>
                        </div>

                        {/* Pricing Section */}
                        <div className="space-y-2 border-t pt-3">
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Base Price</div>
                            <div className="font-semibold text-lg text-gray-900">
                              {formatCurrency(car?.price || "N/A", car?.price || "N/A")}
                            </div>
                          </div>
                          {typeof car?.recommendedPrice === "number" && (
                            <div>
                              <div className="text-xs text-gray-600 mb-1">Recommended Price</div>
                              <div className="font-bold text-lg text-green-600">
                                {formatCurrency(String(car.recommendedPrice), "")}
                              </div>
                              <div className="text-xs text-gray-500 mt-1 italic">
                                {car?.pricingExplanation || ""}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-1 text-xs text-gray-600 pt-2 border-t mt-auto">
                          <span>📍</span>
                          <span>{car?.location || "N/A"}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
