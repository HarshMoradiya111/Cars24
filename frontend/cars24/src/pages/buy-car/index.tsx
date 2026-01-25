"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
// API fetch disabled to show only user-added cars
import { ChevronDown, Heart, Search, Sliders } from "lucide-react";
import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import React, { useEffect, useState } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { calculateRecommendedPrice, detectCarType, Region } from "@/lib/pricingEngine";
import { getcarSummaries } from "@/lib/Carapi";

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
function LoaderCard() {
  const showDemoBanner = process.env.NEXT_PUBLIC_SHOW_DEMO_BANNER !== "false";
  return (
    <div className="bg-white rounded-lg shadow-md animate-pulse overflow-hidden">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  );
}
const index = () => {
  const { toggle, isSaved } = useWishlist();
  const [priceRange, setPriceRange] = useState([0, 5000000]); // 0 to 50 lakh
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [cars, setCars] = useState<Car[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [userLocation, setUserLocation] = useState<string>("New Delhi");
  const [selectedRegion, setSelectedRegion] = useState<Region>("Metro");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [showSortMenu, setShowSortMenu] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadCars = async () => {
      try {
        console.log("[buy-car] Loading cars from API...");
        const startTime = performance.now();
        const summaries = await getcarSummaries({ userLocation });
        const apiTime = performance.now() - startTime;
        console.log(`[buy-car] API response received in ${apiTime.toFixed(0)}ms:`, summaries);

        if (!Array.isArray(summaries)) {
          console.warn("[buy-car] API returned non-array:", typeof summaries);
          throw new Error("API returned non-array response");
        }

        const transformStart = performance.now();
        const carsWithPricing = summaries.map((c: any) => {
          const basePrice = parseAmount(c.price) || 0;
          const carType = detectCarType(c.title);
          const pricing = calculateRecommendedPrice(basePrice, carType, selectedRegion);
          return {
            id: c.id || c._id || c.carId || "",
            title: c.title || c.name || "",
            km: c.specs?.km || c.km || "N/A",
            fuel: c.specs?.fuel || c.fuel || "N/A",
            transmission: c.specs?.transmission || c.transmission || "N/A",
            owner: c.specs?.owner || c.owner || "N/A",
            emi: c.emi || "N/A",
            price: c.price || "N/A",
            location: c.location || "N/A",
            image: Array.isArray(c.images) && c.images.length > 0 ? c.images[0] : c.image || "",
            recommendedPrice: pricing.recommendedPrice,
            pricingExplanation: pricing.explanation,
          } as Car;
        });
        const transformTime = performance.now() - transformStart;
        console.log(`[buy-car] Transformed ${carsWithPricing.length} cars in ${transformTime.toFixed(0)}ms`);

        if (isMounted) {
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
    };
  }, [selectedRegion, userLocation]);
  
  // Filter and sort cars
  const filteredAndSortedCars = React.useMemo(() => {
    if (!cars) return null;
    
    console.log("[buy-car] Cars before filter:", cars.length, "Price range:", priceRange);
    
    // Filter by search query
    let filtered = cars.filter((car) => {
      const carPrice = parseAmount(car.price) || 0;
      const matchesSearch = searchQuery === "" || 
        car.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.fuel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.transmission.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by price range
      const matchesPrice = carPrice >= priceRange[0] && carPrice <= priceRange[1];
      
      // Filter by brand
      const matchesBrand = selectedBrands.length === 0 || 
        selectedBrands.some(brand => car.title.toLowerCase().includes(brand.toLowerCase()));
      
      if (!matchesPrice) {
        console.log(`[buy-car] Car filtered by price: ${car.title} (₹${carPrice}) outside range [${priceRange[0]}, ${priceRange[1]}]`);
      }
      
      return matchesSearch && matchesPrice && matchesBrand;
    });
    
    console.log("[buy-car] Cars after filter:", filtered.length);
    
    // Sort cars
    const sorted = [...filtered];
    if (sortOption === "price-low") {
      sorted.sort((a, b) => (parseAmount(a.price) || 0) - (parseAmount(b.price) || 0));
    } else if (sortOption === "price-high") {
      sorted.sort((a, b) => (parseAmount(b.price) || 0) - (parseAmount(a.price) || 0));
    } else if (sortOption === "km-low") {
      sorted.sort((a, b) => (parseInt(a.km.replace(/,/g, '')) || 0) - (parseInt(b.km.replace(/,/g, '')) || 0));
    } else if (sortOption === "year-new") {
      sorted.sort((a, b) => {
        const yearA = parseInt(a.title.match(/\d{4}/)?.[0] || '0');
        const yearB = parseInt(b.title.match(/\d{4}/)?.[0] || '0');
        return yearB - yearA;
      });
    }
    
    return sorted;
  }, [cars, searchQuery, priceRange, selectedBrands, sortOption]);
  
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
                    defaultValue={[0, 5000000]}
                    max={5000000}
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
                    {["Maruti", "Hyundai", "Honda", "Tata"].map((brand) => (
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedCars === null
                ? Array.from({ length: 6 }).map((_N_E_STYLE_LOAD, index) => (
                    <LoaderCard key={index} />
                  ))
                : filteredAndSortedCars.map((car) => (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
