import Link from "next/link";
import { Car } from "lucide-react";

const categories = [
  {
    name: "Hatchback",
    icon: Car,
    href: "/cars/hatchback",
    image: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
  },
  {
    name: "Sedan",
    icon: Car,
    href: "/cars/sedan",
    image: "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg",
  },
  {
    name: "SUV",
    icon: Car,
    href: "/cars/suv",
    image: "https://images.pexels.com/photos/919073/pexels-photo-919073.jpeg",
  },
];

export default function CarCategories() {
  return (
    <div className="py-8 sm:py-10">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Browse by car type</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className="group relative flex flex-col items-center bg-gray-50 rounded-lg p-4 sm:p-6 hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
          >
            <div className="mb-2 sm:mb-3">
              <category.icon className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-blue-600" />
            </div>
            <span className="text-sm sm:text-base md:text-lg font-medium text-gray-900 text-center">{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}