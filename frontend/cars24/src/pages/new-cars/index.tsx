"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Car,
  Search,
  Filter,
  TrendingUp,
  Shield,
  Award,
  Star,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const brands = [
  "Maruti Suzuki",
  "Hyundai",
  "Tata",
  "Mahindra",
  "Kia",
  "Honda",
  "Toyota",
  "MG",
];

const newCars = [
  {
    id: "1",
    name: "Maruti Suzuki Swift 2024",
    price: "₹6.49 - 9.64 Lakh",
    image:
      "https://images.pexels.com/photos/5613885/pexels-photo-5613885.jpeg",
    rating: 4.5,
    reviews: 1250,
    launched: "Available Now",
  },
  {
    id: "2",
    name: "Hyundai Creta 2024",
    price: "₹11.00 - 20.15 Lakh",
    image:
      "https://imgs.search.brave.com/xDvrosz4OsKMMET3rkarHkF87QdgK1k7UAddrwc1_KY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWdk/LmFlcGxjZG4uY29t/LzY2NHgzNzQvbi9j/dy9lYy8xNjg2OTcv/Y3JldGEtbi1saW5l/LWV4dGVyaW9yLXJp/Z2h0LWZyb250LXRo/cmVlLXF1YXJ0ZXIt/MjUuanBlZz9pc2ln/PTAmcT04MA",
    rating: 4.7,
    reviews: 2340,
    launched: "Available Now",
  },
  {
    id: "3",
    name: "Tata Nexon 2024",
    price: "₹8.09 - 15.50 Lakh",
    image:
      "https://imgs.search.brave.com/Y46aj9hTg7EZXN6CTGXbDaR1PmYABm6tVN4xy628rZY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jb250/ZW50LmNhcmxlbG8u/Y29tL21lZGlhL21v/ZGVscy80NDQvaW50/ZXJpb3IvOTEud2Vi/cA",
    rating: 4.6,
    reviews: 1890,
    launched: "Available Now",
  },
  {
    id: "4",
    name: "Mahindra Scorpio-N",
    price: "₹13.60 - 24.54 Lakh",
    image:
      "https://imgs.search.brave.com/8k1OXWvymkOAmhZHfh_43Tj4adI7bYPMSWcrYarsSnI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/djNjYXJzLmNvbS9t/ZWRpYS9tb2RlbC1p/bWdzLzE2NTQ2Nzk0/MTUtc2NvcnBpby1u/LmpwZw",
    rating: 4.4,
    reviews: 980,
    launched: "Available Now",
  },
  {
    id: "5",
    name: "Kia Seltos 2024",
    price: "₹10.90 - 20.35 Lakh",
    image:
      "https://imgs.search.brave.com/BG_NOZs_9pvtRPeEEYYmmA7lZoKlO0qIcm8YdSzpoO4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMtY2RuLmNhcnMy/NC5jb20vcHJvZC9h/dXRvLW5ld3MyNC1j/bXMvbmV3c3Jvb20v/MjAyNS8xMi8xMC8y/NGU4NDUxYS03MmFl/LTQ0MDktOGZlYy02/MGI0ODhlNzExMDAt/a2lhLXNlbHRvcy0y/MDI2LWZyb250LXNp/ZGUtcHJvZmlsZS1r/aWEud2VicD93PTI3/NiZkcHI9MiZvcHRp/bWl6ZT1sb3cmZm9y/bWF0PWF1dG8mcXVh/bGl0eT01MA",
    rating: 4.5,
    reviews: 1560,
    launched: "Available Now",
  },
  {
    id: "6",
    name: "Honda City 2024",
    price: "₹11.82 - 16.35 Lakh",
    image:
      "https://imgs.search.brave.com/tmfBzNE1HBAwKilVVGzTofgCNrnHXha-HkghyZ1jjiw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWdk/LmFlcGxjZG4uY29t/LzY2NHgzNzQvbi9j/dy9lYy8xMzQyODcv/Y2l0eS1leHRlcmlv/ci1yaWdodC1mcm9u/dC10aHJlZS1xdWFy/dGVyLTIucG5nP2lz/aWc9MCZxPTgw",
    rating: 4.6,
    reviews: 2100,
    launched: "Available Now",
  },
];

const NewCarsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: "All",
    sortBy: "popularity",
  });

  // Filter cars based on search, brand, and filters
  const filteredCars = newCars.filter((car) => {
    const matchesSearch = car.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesBrand =
      selectedBrand === "All" || car.name.includes(selectedBrand);
    
    // Price filter - consider both base price and top price
    let matchesPrice = true;
    if (filters.priceRange !== "All") {
      const prices = car.price.split("-").map(p => parseFloat(p.replace(/[^0-9.]/g, "")));
      const minPrice = prices[0];
      const maxPrice = prices.length > 1 ? prices[1] : prices[0];
      
      if (filters.priceRange === "under10") {
        // Show if any variant is under 10 lakh
        matchesPrice = minPrice < 10;
      } else if (filters.priceRange === "10to15") {
        // Show if price range overlaps with 10-15 lakh
        matchesPrice = (minPrice >= 10 && minPrice < 15) || (maxPrice >= 10 && maxPrice < 15) || (minPrice < 10 && maxPrice >= 15);
      } else if (filters.priceRange === "15to20") {
        // Show if price range overlaps with 15-20 lakh
        matchesPrice = (minPrice >= 15 && minPrice < 20) || (maxPrice >= 15 && maxPrice < 20) || (minPrice < 15 && maxPrice >= 20);
      } else if (filters.priceRange === "above20") {
        // Show if any variant is above 20 lakh
        matchesPrice = maxPrice >= 20;
      }
    }
    
    return matchesSearch && matchesBrand && matchesPrice;
  });

  // Sort cars
  const sortedCars = [...filteredCars].sort((a, b) => {
    if (filters.sortBy === "priceLowToHigh") {
      const priceA = parseFloat(a.price.split("-")[0].replace(/[^0-9.]/g, ""));
      const priceB = parseFloat(b.price.split("-")[0].replace(/[^0-9.]/g, ""));
      return priceA - priceB;
    }
    if (filters.sortBy === "priceHighToLow") {
      const priceA = parseFloat(a.price.split("-")[0].replace(/[^0-9.]/g, ""));
      const priceB = parseFloat(b.price.split("-")[0].replace(/[^0-9.]/g, ""));
      return priceB - priceA;
    }
    if (filters.sortBy === "rating") {
      return b.rating - a.rating;
    }
    return 0; // popularity (default order)
  });

  const resetFilters = () => {
    setFilters({
      priceRange: "All",
      sortBy: "popularity",
    });
    setShowFilterModal(false);
  };

  const applyFilters = () => {
    setShowFilterModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore New Cars 2024
          </h1>
          <p className="text-xl text-orange-100 max-w-2xl">
            Find the perfect new car with detailed specs, prices, and expert
            reviews
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for new cars..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" onClick={() => setShowFilterModal(true)}>
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {(filters.priceRange !== "All" || filters.sortBy !== "popularity") && (
                <span className="ml-2 bg-orange-600 text-white text-xs px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </Button>
          </div>

          {/* Brand Filter */}
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Popular Brands
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedBrand("All")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedBrand === "All"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Brands
              </button>
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedBrand === brand
                      ? "bg-orange-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <Shield className="w-10 h-10 text-orange-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">
              Factory Warranty
            </h3>
            <p className="text-sm text-gray-600">
              Full manufacturer warranty coverage
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <Award className="w-10 h-10 text-orange-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Latest Models</h3>
            <p className="text-sm text-gray-600">
              Brand new 2024 models with latest features
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <TrendingUp className="w-10 h-10 text-orange-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">
              Best Financing
            </h3>
            <p className="text-sm text-gray-600">
              Competitive loan rates and easy EMI options
            </p>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCars.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No cars found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            sortedCars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                <div className="relative h-48">
                  <Image
                    src={car.image}
                    alt={car.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-orange-600 text-white px-2 py-1 rounded text-xs font-semibold">
                    {car.launched}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                    {car.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{car.rating}</span>
                    <span className="text-xs text-gray-500">
                      ({car.reviews} reviews)
                    </span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 mb-3">
                    {car.price}
                  </p>
                  <div className="flex gap-2">
                    <Link href={`/new-cars/${car.id}`} className="flex-1">
                      <Button className="w-full bg-orange-600 hover:bg-orange-700">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-800 rounded-lg p-8 mt-12 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
            Our experts can help you find the perfect car that matches your
            requirements and budget
          </p>
          <Link href="/contact">
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100"
            >
              Talk to an Expert
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Price Range
                </label>
                <div className="space-y-2">
                  {[
                    { value: "All", label: "All Prices" },
                    { value: "under10", label: "Under ₹10 Lakh" },
                    { value: "10to15", label: "₹10 - 15 Lakh" },
                    { value: "15to20", label: "₹15 - 20 Lakh" },
                    { value: "above20", label: "Above ₹20 Lakh" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="priceRange"
                        value={option.value}
                        checked={filters.priceRange === option.value}
                        onChange={(e) =>
                          setFilters({ ...filters, priceRange: e.target.value })
                        }
                        className="w-4 h-4 text-orange-600"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters({ ...filters, sortBy: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="popularity">Popularity</option>
                  <option value="priceLowToHigh">Price: Low to High</option>
                  <option value="priceHighToLow">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="flex-1"
                >
                  Reset
                </Button>
                <Button
                  onClick={applyFilters}
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewCarsPage;
