import { Search } from "lucide-react";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { useRouter } from "next/router";

const Hero = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const onSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      router.push(`/buy-car?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/buy-car");
    }
  };

  return (
    <div className="relative w-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/17377918/pexels-photo-17377918.jpeg"
          alt="Sports car"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
      </div>

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
          <h2 className="text-white text-lg sm:text-2xl md:text-4xl lg:text-5xl font-bold">
            better drives, better lives.
          </h2>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 md:p-6 max-w-4xl w-full">
          <form onSubmit={onSearch} className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 ml-2 sm:ml-3 flex-shrink-0" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && onSearch()}
              placeholder="Search for your favorite cars"
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm sm:text-base text-black"
            />
            <button
              type="submit"
              className="px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white font-semibold hover:bg-blue-700 text-sm sm:text-base whitespace-nowrap"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Hero;
