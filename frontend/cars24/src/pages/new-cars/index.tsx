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
      "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg",
    rating: 4.5,
    reviews: 1250,
    launched: "Available Now",
  },
  {
    id: "2",
    name: "Hyundai Creta 2024",
    price: "₹11.00 - 20.15 Lakh",
    image:
      "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
    rating: 4.7,
    reviews: 2340,
    launched: "Available Now",
  },
  {
    id: "3",
    name: "Tata Nexon 2024",
    price: "₹8.09 - 15.50 Lakh",
    image:
      "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
    rating: 4.6,
    reviews: 1890,
    launched: "Available Now",
  },
  {
    id: "4",
    name: "Mahindra Scorpio-N",
    price: "₹13.60 - 24.54 Lakh",
    image:
      "https://images.pexels.com/photos/1637859/pexels-photo-1637859.jpeg",
    rating: 4.4,
    reviews: 980,
    launched: "Available Now",
  },
  {
    id: "5",
    name: "Kia Seltos 2024",
    price: "₹10.90 - 20.35 Lakh",
    image:
      "https://images.pexels.com/photos/3764984/pexels-photo-3764984.jpeg",
    rating: 4.5,
    reviews: 1560,
    launched: "Available Now",
  },
  {
    id: "6",
    name: "Honda City 2024",
    price: "₹11.82 - 16.35 Lakh",
    image:
      "https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg",
    rating: 4.6,
    reviews: 2100,
    launched: "Available Now",
  },
];

const NewCarsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");

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
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
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
          {newCars.map((car) => (
            <Link
              href={`/new-cars/${car.id}`}
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
                  <Button className="flex-1 bg-orange-600 hover:bg-orange-700">
                    View Details
                  </Button>
                </div>
              </div>
            </Link>
          ))}
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
          <Button
            size="lg"
            className="bg-white text-orange-600 hover:bg-gray-100"
          >
            Talk to an Expert
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewCarsPage;
