import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Star,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  CheckCircle,
  Info,
  ArrowLeft,
} from "lucide-react";

// Car data - same as in new-cars/index.tsx
const newCarsData = [
  {
    id: "1",
    name: "Maruti Suzuki Swift 2024",
    brand: "Maruti Suzuki",
    price: "₹6.49 - 9.64 Lakh",
    exShowroomPrice: "₹6.49 Lakh",
    onRoadPrice: "₹7.85 Lakh",
    image: "https://images.pexels.com/photos/5613885/pexels-photo-5613885.jpeg",
    images: [
      "https://images.pexels.com/photos/5613885/pexels-photo-5613885.jpeg",
      "https://imgs.search.brave.com/C7vG8hPzqxXYCL7J0RV7KBx_VFkG0pZHoqXLlYWe6Ug/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWdk/LmFlcGxjZG4uY29t/LzY0MHgzNjAvbi9j/dy9lYy8xNTc0NTEv/c3dpZnQtZXh0ZXJp/b3ItcmlnaHQtZnJv/bnQtdGhyZWUtcXVh/cnRlci0zLmpwZWc_/aXNpZz0wJnE9ODA",
      "https://imgs.search.brave.com/xW0nPSQkDi_jYt2mC7FjXN6zS3XhzKQY3B0jIVx8JxM/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWdk/LmFlcGxjZG4uY29t/LzY0MHgzNjAvbi9j/dy9lYy8xNTc0NTEv/c3dpZnQtaW50ZXJp/b3ItZGFzaGJvYXJk/LmpwZWc_aXNpZz0w/JnE9ODA",
    ],
    rating: 4.5,
    reviews: 1250,
    launched: "Available Now",
    description: "The Maruti Suzuki Swift 2024 is a stylish hatchback known for its sporty design, fuel efficiency, and agile handling. Perfect for city driving with modern features and reliable performance.",
    specs: {
      engine: "1.2L Petrol",
      power: "89 bhp @ 6000 rpm",
      torque: "113 Nm @ 4400 rpm",
      transmission: "5-Speed Manual / AMT",
      fuelType: "Petrol",
      mileage: "22.38 - 23.76 kmpl",
      seating: "5 Seater",
      bootSpace: "268 L",
      fuelTank: "37 L",
      length: "3845 mm",
      width: "1735 mm",
      height: "1530 mm",
    },
    features: [
      "Dual Front Airbags",
      "ABS with EBD",
      "Rear Parking Sensors",
      "7-inch Touchscreen Infotainment",
      "Automatic Climate Control",
      "Push Button Start/Stop",
      "Cruise Control",
      "Apple CarPlay & Android Auto",
    ],
    colors: ["Pearl Metallic Midnight Blue", "Splendid Silver", "Solid Fire Red", "Pearl Arctic White"],
    variants: [
      { name: "LXI", price: "₹6.49 Lakh" },
      { name: "VXI", price: "₹7.39 Lakh" },
      { name: "ZXI", price: "₹8.19 Lakh" },
      { name: "ZXI Plus", price: "₹9.64 Lakh" },
    ],
  },
  {
    id: "2",
    name: "Hyundai Creta 2024",
    brand: "Hyundai",
    price: "₹11.00 - 20.15 Lakh",
    exShowroomPrice: "₹11.00 Lakh",
    onRoadPrice: "₹13.50 Lakh",
    image: "https://imgs.search.brave.com/xDvrosz4OsKMMET3rkarHkF87QdgK1k7UAddrwc1_KY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWdk/LmFlcGxjZG4uY29t/LzY2NHgzNzQvbi9j/dy9lYy8xNjg2OTcv/Y3JldGEtbi1saW5l/LWV4dGVyaW9yLXJp/Z2h0LWZyb250LXRo/cmVlLXF1YXJ0ZXIt/MjUuanBlZz9pc2ln/PTAmcT04MA",
    images: [
      "https://imgs.search.brave.com/xDvrosz4OsKMMET3rkarHkF87QdgK1k7UAddrwc1_KY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWdk/LmFlcGxjZG4uY29t/LzY2NHgzNzQvbi9j/dy9lYy8xNjg2OTcv/Y3JldGEtbi1saW5l/LWV4dGVyaW9yLXJp/Z2h0LWZyb250LXRo/cmVlLXF1YXJ0ZXIt/MjUuanBlZz9pc2ln/PTAmcT04MA",
      "https://imgs.search.brave.com/QXHZKjnUJPqL3_v5aKPGKmrQM4CxD8XxVyM1ZNAXgWw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWdk/LmFlcGxjZG4uY29t/LzY0MHgzNjAvbi9j/dy9lYy8xNjg2OTcv/Y3JldGEtaW50ZXJp/b3ItZGFzaGJvYXJk/LmpwZWc_aXNpZz0w/JnE9ODA",
    ],
    rating: 4.7,
    reviews: 2340,
    launched: "Available Now",
    description: "The Hyundai Creta 2024 is a premium SUV offering cutting-edge technology, superior comfort, and powerful performance. Ideal for families seeking style and practicality.",
    specs: {
      engine: "1.5L Petrol / Diesel / Turbo",
      power: "115 - 160 bhp",
      torque: "144 - 253 Nm",
      transmission: "6-Speed Manual / IVT / DCT",
      fuelType: "Petrol / Diesel",
      mileage: "17.0 - 21.4 kmpl",
      seating: "5 Seater",
      bootSpace: "433 L",
      fuelTank: "50 L",
      length: "4300 mm",
      width: "1790 mm",
      height: "1635 mm",
    },
    features: [
      "6 Airbags",
      "Panoramic Sunroof",
      "10.25-inch Touchscreen",
      "Wireless Charging",
      "Ventilated Front Seats",
      "360-degree Camera",
      "ADAS Level 2",
      "Connected Car Tech",
    ],
    colors: ["Phantom Black", "Titan Grey", "Galaxy Blue", "Atlas White"],
    variants: [
      { name: "E", price: "₹11.00 Lakh" },
      { name: "EX", price: "₹13.50 Lakh" },
      { name: "S", price: "₹15.99 Lakh" },
      { name: "SX(O)", price: "₹20.15 Lakh" },
    ],
  },
  {
    id: "3",
    name: "Tata Nexon 2024",
    brand: "Tata",
    price: "₹8.09 - 15.50 Lakh",
    exShowroomPrice: "₹8.09 Lakh",
    onRoadPrice: "₹9.80 Lakh",
    image: "https://imgs.search.brave.com/Y46aj9hTg7EZXN6CTGXbDaR1PmYABm6tVN4xy628rZY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jb250/ZW50LmNhcmxlbG8u/Y29tL21lZGlhL21v/ZGVscy80NDQvaW50/ZXJpb3IvOTEud2Vi/cA",
    images: [
      "https://imgs.search.brave.com/Y46aj9hTg7EZXN6CTGXbDaR1PmYABm6tVN4xy628rZY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jb250/ZW50LmNhcmxlbG8u/Y29tL21lZGlhL21v/ZGVscy80NDQvaW50/ZXJpb3IvOTEud2Vi/cA",
      "https://imgs.search.brave.com/s0y_Sc0_qXa9a5YWPlB-8Zy0FJOqRKBG-VL3xU1YT6I/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWdk/LmFlcGxjZG4uY29t/LzY0MHgzNjAvbi9j/dy9lYy8xNDQyODcv/bmV4b24tZXh0ZXJp/b3ItcmlnaHQtZnJv/bnQtdGhyZWUtcXVh/cnRlci05LmpwZWc_/aXNpZz0wJnE9ODA",
    ],
    rating: 4.6,
    reviews: 1890,
    launched: "Available Now",
    description: "The Tata Nexon 2024 is a compact SUV with a 5-star safety rating, modern design, and excellent build quality. A top choice for safety-conscious buyers.",
    specs: {
      engine: "1.2L Turbo Petrol / 1.5L Diesel",
      power: "120 bhp",
      torque: "170 - 260 Nm",
      transmission: "6-Speed Manual / AMT",
      fuelType: "Petrol / Diesel",
      mileage: "17.0 - 24.0 kmpl",
      seating: "5 Seater",
      bootSpace: "350 L",
      fuelTank: "44 L",
      length: "3995 mm",
      width: "1804 mm",
      height: "1620 mm",
    },
    features: [
      "Dual Airbags",
      "5-Star Safety Rating",
      "Harman Sound System",
      "Sunroof",
      "Cruise Control",
      "Rear AC Vents",
      "Digital Instrument Cluster",
      "iRA Connected Car Tech",
    ],
    colors: ["Flame Red", "Foliage Green", "Calgary White", "Daytona Grey"],
    variants: [
      { name: "Smart", price: "₹8.09 Lakh" },
      { name: "Pure", price: "₹9.89 Lakh" },
      { name: "Creative", price: "₹12.50 Lakh" },
      { name: "Fearless", price: "₹15.50 Lakh" },
    ],
  },
  {
    id: "4",
    name: "Mahindra Scorpio-N",
    brand: "Mahindra",
    price: "₹13.60 - 24.54 Lakh",
    exShowroomPrice: "₹13.60 Lakh",
    onRoadPrice: "₹16.20 Lakh",
    image: "https://imgs.search.brave.com/8k1OXWvymkOAmhZHfh_43Tj4adI7bYPMSWcrYarsSnI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/djNjYXJzLmNvbS9t/ZWRpYS9tb2RlbC1p/bWdzLzE2NTQ2Nzk0/MTUtc2NvcnBpby1u/LmpwZw",
    images: [
      "https://imgs.search.brave.com/8k1OXWvymkOAmhZHfh_43Tj4adI7bYPMSWcrYarsSnI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/djNjYXJzLmNvbS9t/ZWRpYS9tb2RlbC1p/bWdzLzE2NTQ2Nzk0/MTUtc2NvcnBpby1u/LmpwZw",
      "https://imgs.search.brave.com/hxxCzXZ_OvuV0Q-m9VWMj6T3WFnV4fSgw4B3HBHOq9c/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWdk/LmFlcGxjZG4uY29t/LzY0MHgzNjAvbi9j/dy9lYy8xNDEyMDcv/c2NvcnBpby1uLWV4/dGVyaW9yLXJpZ2h0/LWZyb250LXRocmVl/LXF1YXJ0ZXItMi5q/cGVnP2lzaWc9MCZx/PTgw",
    ],
    rating: 4.4,
    reviews: 980,
    launched: "Available Now",
    description: "The Mahindra Scorpio-N is a rugged 7-seater SUV built for adventure. It offers powerful performance, robust build quality, and advanced off-road capabilities.",
    specs: {
      engine: "2.0L Turbo Petrol / 2.2L Diesel",
      power: "200 - 175 bhp",
      torque: "370 - 400 Nm",
      transmission: "6-Speed Manual / Automatic",
      fuelType: "Petrol / Diesel",
      mileage: "12.0 - 15.0 kmpl",
      seating: "7 Seater",
      bootSpace: "203 L",
      fuelTank: "60 L",
      length: "4662 mm",
      width: "1917 mm",
      height: "1870 mm",
    },
    features: [
      "6 Airbags",
      "Sunroof",
      "8-inch Touchscreen",
      "4x4 Drive Modes",
      "Hill Hold & Descent Control",
      "Wireless Charging",
      "Sony Premium Audio",
      "Cruise Control",
    ],
    colors: ["Dazzling Silver", "Deep Forest", "Everest White", "Napoli Black"],
    variants: [
      { name: "Z2", price: "₹13.60 Lakh" },
      { name: "Z4", price: "₹16.50 Lakh" },
      { name: "Z6", price: "₹19.99 Lakh" },
      { name: "Z8L", price: "₹24.54 Lakh" },
    ],
  },
  {
    id: "5",
    name: "Kia Seltos 2024",
    brand: "Kia",
    price: "₹10.90 - 20.35 Lakh",
    exShowroomPrice: "₹10.90 Lakh",
    onRoadPrice: "₹13.00 Lakh",
    image: "https://imgs.search.brave.com/BG_NOZs_9pvtRPeEEYYmmA7lZoKlO0qIcm8YdSzpoO4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMtY2RuLmNhcnMy/NC5jb20vcHJvZC9h/dXRvLW5ld3MyNC1j/bXMvbmV3c3Jvb20v/MjAyNS8xMi8xMC8y/NGU4NDUxYS03MmFl/LTQ0MDktOGZlYy02/MGI0ODhlNzExMDAt/a2lhLXNlbHRvcy0y/MDI2LWZyb250LXNp/ZGUtcHJvZmlsZS1r/aWEud2VicD93PTI3/NiZkcHI9MiZvcHRp/bWl6ZT1sb3cmZm9y/bWF0PWF1dG8mcXVh/bGl0eT01MA",
    images: [
      "https://imgs.search.brave.com/BG_NOZs_9pvtRPeEEYYmmA7lZoKlO0qIcm8YdSzpoO4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMtY2RuLmNhcnMy/NC5jb20vcHJvZC9h/dXRvLW5ld3MyNC1j/bXMvbmV3c3Jvb20v/MjAyNS8xMi8xMC8y/NGU4NDUxYS03MmFl/LTQ0MDktOGZlYy02/MGI0ODhlNzExMDAt/a2lhLXNlbHRvcy0y/MDI2LWZyb250LXNp/ZGUtcHJvZmlsZS1r/aWEud2VicD93PTI3/NiZkcHI9MiZvcHRp/bWl6ZT1sb3cmZm9y/bWF0PWF1dG8mcXVh/bGl0eT01MA",
      "https://imgs.search.brave.com/nHyQQh37GQU9a_h43lh2DI_V5_pPVQiPPexPjhzTiJY/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWdk/LmFlcGxjZG4uY29t/LzY0MHgzNjAvbi9j/dy9lYy8xNDQwMzEv/c2VsdG9zLWV4dGVy/aW9yLXJpZ2h0LWZy/b250LXRocmVlLXF1/YXJ0ZXItMi5qcGVn/P2lzaWc9MCZxPTgw",
    ],
    rating: 4.5,
    reviews: 1560,
    launched: "Available Now",
    description: "The Kia Seltos 2024 is a feature-rich SUV with bold styling, premium interiors, and advanced technology. A perfect blend of performance and comfort.",
    specs: {
      engine: "1.5L Petrol / Diesel / Turbo",
      power: "115 - 160 bhp",
      torque: "144 - 253 Nm",
      transmission: "6-Speed Manual / CVT / DCT",
      fuelType: "Petrol / Diesel",
      mileage: "16.0 - 20.8 kmpl",
      seating: "5 Seater",
      bootSpace: "433 L",
      fuelTank: "50 L",
      length: "4365 mm",
      width: "1800 mm",
      height: "1645 mm",
    },
    features: [
      "6 Airbags",
      "10.25-inch Touchscreen",
      "Sunroof",
      "Wireless Charging",
      "Bose Premium Audio",
      "ADAS Level 1",
      "UVO Connected Car",
      "Ventilated Seats",
    ],
    colors: ["Intelligency Blue", "Pewter Olive", "Aurora Black Pearl", "Glacier White Pearl"],
    variants: [
      { name: "HTE", price: "₹10.90 Lakh" },
      { name: "HTK", price: "₹13.20 Lakh" },
      { name: "HTX", price: "₹16.80 Lakh" },
      { name: "GTX Plus", price: "₹20.35 Lakh" },
    ],
  },
  {
    id: "6",
    name: "Honda City 2024",
    brand: "Honda",
    price: "₹11.82 - 16.35 Lakh",
    exShowroomPrice: "₹11.82 Lakh",
    onRoadPrice: "₹14.00 Lakh",
    image: "https://imgs.search.brave.com/tmfBzNE1HBAwKilVVGzTofgCNrnHXha-HkghyZ1jjiw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWdk/LmFlcGxjZG4uY29t/LzY2NHgzNzQvbi9j/dy9lYy8xMzQyODcv/Y2l0eS1leHRlcmlv/ci1yaWdodC1mcm9u/dC10aHJlZS1xdWFy/dGVyLTIucG5nP2lz/aWc9MCZxPTgw",
    images: [
      "https://imgs.search.brave.com/tmfBzNE1HBAwKilVVGzTofgCNrnHXha-HkghyZ1jjiw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWdk/LmFlcGxjZG4uY29t/LzY2NHgzNzQvbi9j/dy9lYy8xMzQyODcv/Y2l0eS1leHRlcmlv/ci1yaWdodC1mcm9u/dC10aHJlZS1xdWFy/dGVyLTIucG5nP2lz/aWc9MCZxPTgw",
      "https://imgs.search.brave.com/xNw1B9cFjX5hAJLGLfqOk7cKQfWPVD5kBQflPJkEBsg/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWdk/LmFlcGxjZG4uY29t/LzY0MHgzNjAvbi9j/dy9lYy8xMzQyODcv/Y2l0eS1pbnRlcmlv/ci1kYXNoYm9hcmQu/anBlZz9pc2lnPTAm/cT04MA",
    ],
    rating: 4.6,
    reviews: 2100,
    launched: "Available Now",
    description: "The Honda City 2024 is a premium sedan known for its refined driving experience, spacious interiors, and fuel-efficient engine. Perfect for daily commutes and long drives.",
    specs: {
      engine: "1.5L i-VTEC Petrol",
      power: "121 bhp @ 6600 rpm",
      torque: "145 Nm @ 4300 rpm",
      transmission: "6-Speed Manual / CVT",
      fuelType: "Petrol",
      mileage: "17.8 - 18.4 kmpl",
      seating: "5 Seater",
      bootSpace: "506 L",
      fuelTank: "40 L",
      length: "4549 mm",
      width: "1748 mm",
      height: "1489 mm",
    },
    features: [
      "6 Airbags",
      "8-inch Touchscreen",
      "Sunroof",
      "Cruise Control",
      "Honda Sensing (ADAS)",
      "LED Headlights",
      "Automatic Climate Control",
      "Remote Engine Start",
    ],
    colors: ["Platinum White Pearl", "Radiant Red Metallic", "Lunar Silver Metallic", "Golden Brown Metallic"],
    variants: [
      { name: "V", price: "₹11.82 Lakh" },
      { name: "VX", price: "₹13.56 Lakh" },
      { name: "ZX", price: "₹15.21 Lakh" },
      { name: "ZX (Hybrid)", price: "₹16.35 Lakh" },
    ],
  },
];

const NewCarDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const car = newCarsData.find((c) => c.id === id);

  useEffect(() => {
    if (!router.isReady) return;
    if (!car) {
      router.push("/new-cars");
    }
  }, [router.isReady, car, router]);

  if (!car) {
    return null;
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + car.images.length) % car.images.length
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push("/new-cars")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to New Cars
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative h-64 sm:h-80 md:h-96">
                <Image
                  src={car.images[currentImageIndex]}
                  alt={car.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  className="object-cover"
                />
                {car.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 sm:p-2 rounded-full shadow-lg"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 sm:p-2 rounded-full shadow-lg"
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </>
                )}
              </div>
              <div className="p-4 flex gap-2 overflow-x-auto">
                {car.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                      idx === currentImageIndex
                        ? "border-orange-600"
                        : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${car.name} ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {car.name}
                  </h1>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{car.rating}</span>
                    </div>
                    <span className="text-gray-600">({car.reviews} reviews)</span>
                  </div>
                </div>
                <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg font-semibold">
                  {car.launched}
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{car.description}</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                Specifications
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {Object.entries(car.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b">
                    <span className="text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span className="font-semibold text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                Key Features
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {car.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                Available Colors
              </h2>
              <div className="flex flex-wrap gap-3">
                {car.colors.map((color, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700"
                  >
                    {color}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                Variants & Pricing
              </h2>
              <div className="space-y-3">
                {car.variants.map((variant, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <span className="font-semibold text-gray-900">
                      {variant.name}
                    </span>
                    <span className="text-lg font-bold text-orange-600">
                      {variant.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-4 space-y-4">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Ex-Showroom Price</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{car.price}</p>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-900">Ex-Showroom</span>
                    <span className="font-semibold text-gray-900">{car.exShowroomPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">On-Road (Est.)</span>
                    <span className="font-semibold text-gray-900">{car.onRoadPrice}</span>
                  </div>
                </div>
                <Link href={`/contact?car=${encodeURIComponent(car.name)}`}>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 mb-3">
                    Get Best Price
                  </Button>
                </Link>
                <Link href={`/contact?car=${encodeURIComponent(car.name)}&inquiry=testdrive`}>
                  <Button variant="outline" className="w-full">
                    Schedule Test Drive
                  </Button>
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Need Help?
                </h3>
                <div className="space-y-3">
                  <a
                    href="tel:1800-123-4567"
                    className="flex items-center gap-3 text-gray-700 hover:text-orange-600"
                  >
                    <Phone className="w-5 h-5" />
                    <span>1800-123-4567</span>
                  </a>
                  <Link
                    href="/contact"
                    className="flex items-center gap-3 text-gray-700 hover:text-orange-600"
                  >
                    <Mail className="w-5 h-5" />
                    <span>Contact Us</span>
                  </Link>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Price Notice</p>
                    <p>
                      Prices shown are ex-showroom. On-road prices may vary by
                      location. Contact dealer for exact pricing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCarDetailPage;
