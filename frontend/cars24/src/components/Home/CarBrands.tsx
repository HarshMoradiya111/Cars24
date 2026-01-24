import { Car } from "lucide-react";

const brands = [
  {
    name: "Honda",
    logo: "https://www.honda.com/-/media/Honda-Homepage/Images/Logos/svg/Honda_Power_Of_Dreams_22.svg",
  },
  {
    name: "BMW",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg",
  },
  {
    name: "Mercedes-Benz",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg",
  },
];

export default function CarBrands() {
  return (
    <div className="py-6 sm:py-8 mt-3 sm:mt-4">
      <div className="text-center mb-4 sm:mb-6">
        <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
          <div className="h-px bg-gray-200 w-6 sm:w-10" />
          <div className="px-2 sm:px-4">
            <div className="flex items-center justify-center bg-orange-500 rounded-full p-1.5 sm:p-2">
              <Car size={20} className="text-white sm:w-6 sm:h-6" />
            </div>
          </div>
          <div className="h-px bg-gray-200 w-6 sm:w-10" />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 sm:gap-6 md:gap-8">
        {brands.map((brand) => (
          <div
            key={brand.name}
            className="flex flex-col items-center justify-center transition-transform hover:scale-105 active:scale-95 touch-manipulation"
          >
            <img
              src={brand.logo}
              alt={brand.name}
              className="h-10 sm:h-12 w-auto object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 sm:mt-8 text-center">
        <button className="text-orange-500 font-medium hover:text-orange-600 active:text-orange-700 transition-colors text-sm sm:text-base touch-manipulation">
          View all cars
        </button>
      </div>
    </div>
  );
}
