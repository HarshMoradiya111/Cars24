"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const reviews = [
  {
    id: 1,
    name: "Ritika Shah",
    message: "Smooth buying experience with clear pricing. The inspection report matched the car exactly.",
    rating: 5,
    date: "12 Jan 2026",
    avatar: "https://i.pravatar.cc/48?img=15",
  },
  {
    id: 2,
    name: "Amit Desai",
    message: "Financing was quick and transparent. Delivery was on time and the team was helpful.",
    rating: 4,
    date: "28 Dec 2025",
    avatar: "https://i.pravatar.cc/48?img=32",
  },
  {
    id: 3,
    name: "Neha Rao",
    message: "Loved the service booking flow. The pickup and return were punctual and the car felt new after service.",
    rating: 5,
    date: "05 Jan 2026",
    avatar: "https://i.pravatar.cc/48?img=47",
  },
];

export default function CustomerReviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const nextReview = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };
  
  const prevReview = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
  };

  return (
    <div className="py-10 sm:py-12">
      <div className="bg-gray-50 rounded-xl sm:rounded-2xl py-6 sm:py-8 px-4 sm:px-6 md:px-10">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">What motivates us</h2>
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <div className="text-3xl sm:text-4xl font-bold text-blue-600">4.5+</div>
            <div className="text-left">
              <div className="text-xs sm:text-sm font-medium">Average</div>
              <div className="text-xs sm:text-sm text-gray-600">online rating</div>
            </div>
          </div>
          <div className="flex justify-center mt-2 sm:mt-3 gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`h-3 w-3 sm:h-4 sm:w-4 ${star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-yellow-400"}`} 
              />
            ))}
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto relative">
          <div className="flex overflow-hidden">
            {reviews.map((review, index) => (
              <div 
                key={review.id}
                className={`w-full flex-shrink-0 transition-all duration-300 ease-in-out transform ${
                  index === currentIndex ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 absolute"
                }`}
                style={{ left: index === currentIndex ? 0 : "100%" }}
              >
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                  <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <img 
                      src={review.avatar}
                      alt={review.name}
                      className="h-10 w-10 sm:h-12 sm:w-12 rounded-full flex-shrink-0"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base">{review.name}</h4>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 sm:h-4 sm:w-4 ${
                              i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 flex-shrink-0 whitespace-nowrap">{review.date}</div>
                  </div>
                  <p className="text-gray-700 text-sm sm:text-base line-clamp-3">{review.message}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center items-center mt-5 sm:mt-6 gap-2 sm:gap-3 flex-wrap">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={prevReview}
              className="rounded-full h-9 w-9 sm:h-10 sm:w-10 touch-manipulation"
              aria-label="Previous review"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-1.5 sm:gap-2">
              {reviews.map((_, index) => (
                <div 
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={nextReview}
              className="rounded-full h-9 w-9 sm:h-10 sm:w-10 touch-manipulation"
              aria-label="Next review"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}