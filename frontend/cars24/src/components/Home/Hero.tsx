import { Search } from "lucide-react";
import React, { useState } from "react";
import { Input } from "../ui/input";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="relative w-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg"
          alt="Happy woman driving car"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 h-full flex flex-col justify-center py-8 sm:py-12 md:py-20">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">
            Welcome to{" "}
            <span className="inline-flex items-center gap-1">
              <span className="bg-blue-600 text-white font-bold py-0.5 px-1 sm:py-1 sm:px-2 rounded-md text-sm sm:text-lg">
                CARS
              </span>
              <span className="text-orange-500 font-bold text-sm sm:text-lg">24</span>
            </span>
          </h1>
          <div className="flex flex-col space-y-0.5 sm:space-y-1">
            <h2 className="text-white text-lg sm:text-2xl md:text-4xl lg:text-5xl font-bold">
              better drives,
            </h2>
            <h2 className="text-white text-lg sm:text-2xl md:text-4xl lg:text-5xl font-bold">
              better lives.
            </h2>
          </div>
        </div>

        {/* Search bar and quick filters */}
        <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 md:p-6 max-w-4xl w-full">
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {/* Search input */}
            <div className="relative">
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white">
                <div className="pl-2 sm:pl-3 flex-shrink-0">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for your favorite cars"
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm sm:text-base text-black"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
