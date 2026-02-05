import { Car } from "lucide-react";

const brands = [
  {
    name: "BMW",
    logo: "https://cdn.simpleicons.org/bmw",
  },
  {
    name: "Honda",
    logo: "https://cdn.simpleicons.org/honda",
  },
  {
    name: "Hyundai",
    logo: "https://cdn.simpleicons.org/hyundai",
  },
  {
    name: "Maruti Suzuki",
    logo: "https://cdn.simpleicons.org/suzuki",
  },
  {
    name: "Mercedes-Benz",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg",
  },
  {
    name: "Porsche",
    logo: "https://cdn.simpleicons.org/porsche",
  },
  {
    name: "Skoda",
    logo: "https://cdn.simpleicons.org/skoda",
  },
  {
    name: "Tata",
    logo: "https://cdn.simpleicons.org/tata",
  },
  {
    name: "Volkswagen",
    logo: "https://cdn.simpleicons.org/volkswagen",
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

    </div>
  );
}
