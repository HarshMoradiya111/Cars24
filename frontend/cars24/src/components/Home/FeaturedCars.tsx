'use client';

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const featuredCars = [
  {
    id: 1,
    title: "Best compact SUVs in 2026: real-world mileage tested",
    summary: "We drove five popular compact SUVs and compared comfort, mileage, and service costs.",
    author: "Harsh Moradiya",
    date: "2 days ago",
    comments: 14,
    image: "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg",
  },
  {
    id: 2,
    title: "Top 7 pre-owned sedans under ₹8 lakh",
    summary: "Budget-friendly sedans with low maintenance and strong resale value.",
    author: "Harsh Moradiya",
    date: "4 days ago",
    comments: 9,
    image: "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg",
  },
  {
    id: 3,
    title: "How to check a used car before buying",
    summary: "A 12‑point inspection guide to avoid hidden repairs and bad deals.",
    author: "Harsh Moradiya",
    date: "1 week ago",
    comments: 21,
    image: "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg",
  },
  {
    id: 4,
    title: "EV charging in India: what buyers must know",
    summary: "City-wise charging availability, cost per km, and range tips for daily use.",
    author: "Harsh Moradiya",
    date: "6 days ago",
    comments: 18,
    image: "https://images.pexels.com/photos/1104768/pexels-photo-1104768.jpeg",
  },
  {
    id: 5,
    title: "Maintenance costs: hatchback vs SUV over 5 years",
    summary: "A clear cost comparison including service, tires, and insurance.",
    author: "Harsh Moradiya",
    date: "3 days ago",
    comments: 11,
    image: "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg",
  },
];

export default function FeaturedCars() {
  const [activeCars, setActiveCars] = useState(featuredCars.slice(0, 3));

  return (
    <div className="py-8 sm:py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-5 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Featured articles</h2>
        <Link href="/blog" className="text-blue-600 hover:text-blue-700 font-medium flex items-center text-sm sm:text-base">
          View all
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {activeCars.map((car) => (
          <div key={car.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative h-40 sm:h-48 overflow-hidden">
              <img 
                src={car.image}
                alt={car.title}
                className="w-full h-full object-cover transition-transform hover:scale-105"
                loading="lazy"
              />
              <button className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full hover:bg-white touch-manipulation transition-colors" aria-label="Add to wishlist">
                <Heart className="h-4 w-4 text-gray-500 hover:text-red-500" />
              </button>
            </div>
            <div className="p-3 sm:p-4">
              <h3 className="font-bold text-base sm:text-lg mb-2 line-clamp-2 text-black">{car.title}</h3>
              <div className="mb-3">
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2">
                  {car.summary}
                </p>
                <Link href={`/blog/${car.id}`}>
                  <Button variant="link" className="px-0 text-blue-600 hover:text-blue-700 h-auto text-xs sm:text-sm">
                    Read more
                  </Button>
                </Link>
              </div>
              <div className="flex items-center text-xs text-gray-500 border-t pt-2 sm:pt-3 gap-1 overflow-x-auto">
                <div className="h-6 w-6 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                  <img 
                    src={`https://i.pravatar.cc/24?u=${car.id}`} 
                    alt={car.author}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="truncate">{car.author}</span>
                <span className="flex-shrink-0">•</span>
                <span className="flex-shrink-0">{car.date}</span>
                <span className="hidden sm:inline flex-shrink-0">•</span>
                <span className="hidden sm:inline flex-shrink-0">{car.comments} comments</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}