import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { createBooking } from "@/lib/Bookingapi";
import { getcarByid } from "@/lib/Carapi";
import { calculateRecommendedPrice, detectCarType, Region } from "@/lib/pricingEngine";
import { LoadingSpinner } from "@/components/ui/SkeletonLoaders";
import {
  AlertCircle,
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  Phone,
  User,
  Info,
} from "lucide-react";
import { Heart } from "lucide-react";
import { useRouter } from "next/router";
import SafeImage from "@/components/ui/SafeImage";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useWishlist } from "@/context/WishlistContext";
import { detectLocationFromIP } from "@/lib/utils";
const fallbackCarDetails = {
  id: "fronx-2023",
  title: "2023 Maruti FRONX DELTA PLUS 1.2L AGS",
  images: [
    "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
    "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg",
    "https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg",
  ],
  price: "₹7.80 lakh",
  emi: "₹15,245/month",
  location: "Metro Walk, Rohini, New Delhi",
  specs: {
    year: 2023,
    km: "10,048",
    fuel: "Petrol",
    transmission: "Automatic",
    owner: "1st owner",
    insurance: "Valid till 2024",
  },
  features: [
    "Power Steering",
    "Power Windows",
    "Air Conditioning",
    "Driver Airbag",
    "Passenger Airbag",
    "Alloy Wheels",
  ],
  highlights: [
    "Single owner vehicle",
    "All original documents",
    "Non-accidental",
    "Fully maintained",
  ],
};
const parseAmount = (raw: string) => {
  if (!raw) return null;
  
  // If price is in lakh format (e.g., "₹ 6.80 lakh")
  if (/lakh/i.test(raw)) {
    const match = raw.match(/(\d+\.?\d*)\s*lakh/i);
    if (match) {
      const lakhValue = parseFloat(match[1]);
      return Math.round(lakhValue * 100000); // Convert lakh to rupees
    }
  }
  
  // Otherwise, extract all digits
  const digits = raw.toString().replace(/[^0-9.]/g, "");
  return digits ? Math.round(parseFloat(digits)) : null;
};

const formatCurrency = (value: string, fallback = "N/A") => {
  if (!value) return fallback;
  
  // If value already has lakh format like "₹6.80 lakh", just ensure rupee symbol
  if (/lakh/i.test(value)) {
    // Extract the numeric part with decimal
    const match = value.match(/(\d+\.?\d*)\s*lakh/i);
    if (match) {
      return `₹ ${match[1]} lakh`;
    }
    return value; // Return as-is if we can't parse
  }
  
  // Otherwise parse as number and convert to lakh
  const amount = parseAmount(value);
  if (amount === null) return fallback;
  
  const lakhValue = amount / 100000;
  return `₹ ${lakhValue.toFixed(2)} lakh`;
};
const index = () => {
  const { toggle, isSaved } = useWishlist();
  const { user } = useAuth();
  const [formData, setformData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    preferredDate: "",
    preferredTime: "",
    paymentMethod: "",
    loanRequired: "no",
    downPayment: "",
  });
  const router = useRouter();
  const { id } = router.query;
  const [carDetails, setcarDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setstep] = useState(1);
  const [userLocation, setUserLocation] = useState<string>("New Delhi");
  const [selectedRegion, setSelectedRegion] = useState<Region>("Metro");
  const [recommendedPrice, setRecommendedPrice] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock cars data (same as buy-car page)
  const mockCars: any[] = [
    {
      id: "1",
      title: "2023 Maruti Suzuki Swift VXI",
      km: "15,000",
      fuel: "Petrol",
      transmission: "Manual",
      owner: "1st owner",
      emi: "₹8,245/m",
      price: "₹6.80 lakh",
      location: "Rohini, New Delhi",
      image: "https://images.unsplash.com/photo-1605270396307-d00ba5cda1d0?q=80&w=1073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      images: [
        "https://images.unsplash.com/photo-1605270396307-d00ba5cda1d0?q=80&w=1073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg",
      ],
      specs: {
        year: 2023,
        km: "15,000",
        fuel: "Petrol",
        transmission: "Manual",
        owner: "1st owner",
        insurance: "Comprehensive",
      },
      features: ["Power Steering", "Air Conditioning", "ABS", "Power Windows"],
      highlights: ["Well maintained", "Single owner"],
    },
    {
      id: "2",
      title: "2021 Hyundai Creta SX",
      km: "25,000",
      fuel: "Diesel",
      transmission: "Auto",
      owner: "1st owner",
      emi: "₹18,999/m",
      price: "₹14.50 lakh",
      location: "Gurgaon, Haryana",
      image: "https://images.unsplash.com/photo-1748214547184-d994bfe53322?q=80&w=1188&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      images: [
        "https://images.unsplash.com/photo-1748214547184-d994bfe53322?q=80&w=1188&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
      ],
      specs: {
        year: 2021,
        km: "25,000",
        fuel: "Diesel",
        transmission: "Auto",
        owner: "1st owner",
        insurance: "Comprehensive",
      },
      features: ["Power Steering", "ABS", "Airbags", "Alloy Wheels"],
      highlights: ["Well maintained", "Regular service"],
    },
    {
      id: "3",
      title: "2022 Tata Nexon XZ Plus",
      km: "12,000",
      fuel: "Petrol",
      transmission: "Auto",
      owner: "1st owner",
      emi: "₹12,500/m",
      price: "₹9.75 lakh",
      location: "Noida, UP",
      image: "https://images.unsplash.com/photo-1685019718640-6e562edc365e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      images: [
        "https://images.unsplash.com/photo-1685019718640-6e562edc365e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
      ],
      specs: {
        year: 2022,
        km: "12,000",
        fuel: "Petrol",
        transmission: "Auto",
        owner: "1st owner",
        insurance: "Comprehensive",
      },
      features: ["Touchscreen", "ABS", "Airbags", "Power Windows"],
      highlights: ["Excellent condition", "Low mileage"],
    },
    {
      id: "4",
      title: "2020 Honda City VX",
      km: "35,000",
      fuel: "Petrol",
      transmission: "Manual",
      owner: "1st owner",
      emi: "₹10,500/m",
      price: "₹10.20 lakh",
      location: "Dwarka, New Delhi",
      image: "https://images.pexels.com/photos/6794815/pexels-photo-6794815.jpeg",
      images: [
        "https://images.pexels.com/photos/6794815/pexels-photo-6794815.jpeg",
        "https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg",
      ],
      specs: {
        year: 2020,
        km: "35,000",
        fuel: "Petrol",
        transmission: "Manual",
        owner: "1st owner",
        insurance: "Comprehensive",
      },
      features: ["Power Steering", "Air Conditioning", "Rear Parking Sensor"],
      highlights: ["Single owner", "Well serviced"],
    },
    {
      id: "5",
      title: "2023 Maruti Baleno Delta",
      km: "8,000",
      fuel: "Petrol",
      transmission: "Auto",
      owner: "1st owner",
      emi: "₹9,200/m",
      price: "₹7.80 lakh",
      location: "Faridabad, Haryana",
      image: "https://images.unsplash.com/photo-1630171011805-11ebc32f7229?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      images: [
        "https://images.unsplash.com/photo-1630171011805-11ebc32f7229?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg",
      ],
      specs: {
        year: 2023,
        km: "8,000",
        fuel: "Petrol",
        transmission: "Auto",
        owner: "1st owner",
        insurance: "Comprehensive",
      },
      features: ["Power Steering", "Air Conditioning", "ABS", "Alloy Wheels"],
      highlights: ["Brand new", "Warranty valid"],
    },
    {
      id: "6",
      title: "2021 Hyundai Venue SX",
      km: "22,000",
      fuel: "Petrol",
      transmission: "Manual",
      owner: "1st owner",
      emi: "₹11,800/m",
      price: "₹9.50 lakh",
      location: "Ghaziabad, UP",
      image: "https://images.unsplash.com/photo-1672820415487-c534a8ee22ff?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      images: [
        "https://images.unsplash.com/photo-1672820415487-c534a8ee22ff?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg",
      ],
      specs: {
        year: 2021,
        km: "22,000",
        fuel: "Petrol",
        transmission: "Manual",
        owner: "1st owner",
        insurance: "Comprehensive",
      },
      features: ["Power Steering", "Air Conditioning", "ABS"],
      highlights: ["Good condition", "Regular maintenance"],
    },
  ];

  useEffect(() => {
    if (!id) return;
    async function fetchCar() {
      try {
        // Reset image index when loading new car
        setCurrentImageIndex(0);
        
        // First check localStorage for user-sold cars or edited mock cars (priority for edits)
        const userSoldCars = localStorage.getItem('userSoldCars');
        if (userSoldCars) {
          try {
            const soldCars = JSON.parse(userSoldCars);
            const userCar = soldCars.find((c: any) => c.id === id);
            if (userCar) {
              console.log('Loaded car from localStorage:', userCar.title, 'Images:', userCar.images?.length);
              setcarDetails(userCar);
              return;
            }
          } catch (parseError) {
            console.error('Error parsing localStorage userSoldCars:', parseError);
          }
        }

        // Then try to find in mock cars
        const mockCar = mockCars.find((c) => c.id === id);
        if (mockCar) {
          console.log('Loaded mock car:', mockCar.title);
          setcarDetails(mockCar);
          return;
        }

        // Then try backend API
        const data = await getcarByid(id as string, { userLocation });
        if (!data) {
          setcarDetails(fallbackCarDetails);
        } else {
          setcarDetails(data);
        }
      } catch (error) {
        console.error("Failed to fetch car by id, using fallback data", error);
        setcarDetails(fallbackCarDetails);
      } finally {
        setLoading(false);
      }
    }
    // Attempt IP-based location detection if not set
    if (!userLocation) {
      detectLocationFromIP().then((loc) => {
        if (loc) setUserLocation(loc);
      });
    }
    fetchCar();
  }, [id, userLocation]);

  // Calculate recommended price when car details or region changes
  useEffect(() => {
    if (carDetails) {
      const basePrice = parseAmount(carDetails.price);
      if (basePrice) {
        const carType = detectCarType(carDetails.title);
        const pricing = calculateRecommendedPrice(basePrice, carType, selectedRegion);
        setRecommendedPrice(pricing);
      }
    }
  }, [carDetails, selectedRegion]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner message="Loading car details..." />
      </div>
    );
  }
  if (!carDetails) {
    return (
      <div className="text-center mt-10 text-red-500">
        Car details not found.
      </div>
    );
  }
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setformData((Prev) => ({
      ...Prev,
      [name]: value,
    }));
  };
  const handlesubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to continue");
      return;
    }
    try {
      const booking = {
        CarId: id,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        paymentMethod: formData.paymentMethod,
        loanRequired: formData.loanRequired,
        downPayment: formData.downPayment,
      };
      const response = await createBooking(user.id, booking);
      if (response.id) {
        toast.success("Bookings listed Successfully");
        router.push(`/bookings`);
      }
    } catch (error) {}
  };

  const validatestep = () => {
    if (step === 1) {
      return formData.name && formData.phone && formData.email;
    }
    if (step === 2) {
      return formData.preferredDate && formData.preferredTime;
    }
    return true;
  };
  const availableTimes = [
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Car Details Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Car Image */}
              <div className="relative aspect-video h-64 sm:h-72 md:h-80 mb-4 rounded-lg overflow-hidden bg-gray-100 group">
                <img
                  key={`car-image-${currentImageIndex}`}
                  src={carDetails.images?.[currentImageIndex] || carDetails.images?.[0]}
                  alt={carDetails.title}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=Image+Not+Available";
                  }}
                />
              
              {/* Image Slider Controls - Only show if more than 1 image */}
              {carDetails.images && carDetails.images.length > 1 && (
                <>
                  {/* Previous Button */}
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === 0 ? carDetails.images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all z-10"
                    aria-label="Previous image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === carDetails.images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all z-10"
                    aria-label="Next image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full z-10">
                    {currentImageIndex + 1} / {carDetails.images.length}
                  </div>

                  {/* Dots Indicator */}
                  <div className="absolute bottom-3 right-3 flex gap-1 z-10">
                    {carDetails.images.map((_: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentImageIndex ? "bg-white w-6" : "bg-white/50"
                        }`}
                        aria-label={`Go to image ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Thumbnail Strip */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2 flex gap-2 overflow-x-auto">
                    {carDetails.images.map((img: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden transition-all ${
                          idx === currentImageIndex
                            ? "border-white scale-110"
                            : "border-white/30 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/48";
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{carDetails.title}</h2>
                  <p className="text-sm text-gray-400 mb-4">ID: {carDetails.id}</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    toggle({
                      id: carDetails.id,
                      title: carDetails.title,
                      image: carDetails.images?.[0] || "",
                      price: carDetails.price,
                      emi: carDetails.emi,
                      location: carDetails.location,
                    })
                  }
                  className="p-2 rounded-full border border-gray-200 hover:border-red-400 hover:bg-red-50 transition-colors flex-shrink-0 ml-2"
                  aria-label="Toggle wishlist"
                >
                  <Heart
                    className={`h-6 w-6 ${isSaved(carDetails.id) ? "text-red-500" : "text-gray-500"}`}
                    fill={isSaved(carDetails.id) ? "currentColor" : "none"}
                  />
                </button>
              </div>

              <div className="flex justify-between items-center mb-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Base Price</p>
                  <p className="text-3xl font-bold text-blue-600 mb-4">
                    {formatCurrency(carDetails.price, carDetails.price)}
                  </p>
                  
                  {recommendedPrice && (
                    <div className="bg-green-50 p-3 rounded-lg mb-4">
                      <p className="text-sm text-gray-600 mb-1">Recommended Price</p>
                      <p className="text-2xl font-bold text-green-600 mb-2">
                        {formatCurrency(String(recommendedPrice.recommendedPrice), "")}
                      </p>
                      <p className="text-xs text-gray-700 italic">
                        {recommendedPrice.explanation}
                      </p>
                    </div>
                  )}

                  <p className="text-gray-600">
                    EMI from
                    {(() => {
                      const emiAmount = parseAmount(carDetails.emi);
                      return emiAmount !== null
                        ? ` ₹ ${emiAmount.toLocaleString("en-IN")}/month`
                        : ` ${carDetails.emi?.replace(/\$/g, "₹")}`;
                    })()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">{carDetails.location}</p>
                  <p className="text-sm text-gray-500 mb-3">
                    {carDetails.specs.km} driven
                  </p>
                  <div className="mb-3">
                    <label className="text-xs font-medium text-gray-700 block mb-1">
                      Region (for pricing)
                    </label>
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value as Region)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Metro">Metro</option>
                      <option value="Hilly">Hilly</option>
                      <option value="Rural">Rural</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="text"
                      value={userLocation}
                      onChange={(e) => setUserLocation(e.target.value)}
                      placeholder="Your location"
                    />
                  </div>
                </div>
              </div>
              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-600">Year</p>
                  <p className="font-medium">{carDetails.specs.year}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-600">Fuel Type</p>
                  <p className="font-medium">{carDetails.specs.fuel}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-600">Transmission</p>
                  <p className="font-medium">{carDetails.specs.transmission}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-600">Owner</p>
                  <p className="font-medium">{carDetails.specs.owner}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-600">Insurance</p>
                  <p className="font-medium">{carDetails.specs.insurance}</p>
                </div>
              </div>
              {Array.isArray(carDetails.pricingNotes) && carDetails.pricingNotes.length > 0 && (
                <div className="mt-4 bg-green-50 p-3 rounded">
                  <h4 className="text-sm font-semibold text-green-800">Market trend insights</h4>
                  <ul className="mt-1 text-sm text-green-700 list-disc list-inside">
                    {carDetails.pricingNotes.map((n: string, i: number) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Highlights */}
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold text-blue-800 mb-2">
                  Car Highlights
                </h3>
                <ul className="space-y-1">
                  {carDetails.highlights.map((highlight: any, index: any) => (
                    <li key={index} className="text-blue-700 flex items-center">
                      <div className="w-2 h-2 bg-blue-700 rounded-full mr-2"></div>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Features */}
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Features</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {carDetails.features.map((feature: any, index: any) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
            {/* booking form  */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">
                Complete Your Purchase
              </h2>

              <div className="mb-6">
                <div className="flex items-center space-x-4">
                  {[1, 2, 3].map((stepNumber) => (
                    <div key={stepNumber} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step === stepNumber
                            ? "bg-blue-600 text-white"
                            : step > stepNumber
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {step > stepNumber ? "✓" : stepNumber}
                      </div>
                      {stepNumber < 3 && (
                        <div
                          className={`w-12 h-1 ${
                            step > stepNumber ? "bg-green-500" : "bg-gray-200"
                          }`}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <form onSubmit={handlesubmit} className="space-y-6">
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <User className="w-4 h-4 inline mr-1" /> Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Phone className="w-4 h-4 inline mr-1" /> Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Calendar className="w-4 h-4 inline mr-1" /> Preferred
                        Visit Date
                      </label>
                      <Input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Clock className="w-4 h-4 inline mr-1" /> Preferred Time
                      </label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select a time</option>
                        {availableTimes.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <MapPin className="w-4 h-4 inline mr-1" /> Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <CreditCard className="w-4 h-4 inline mr-1" /> Payment
                        Method
                      </label>
                      <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select payment method</option>
                        <option value="full">Full Payment</option>
                        <option value="loan">Car Loan</option>
                      </select>
                    </div>
                    {formData.paymentMethod === "loan" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Down Payment Amount
                        </label>
                        <input
                          type="text"
                          name="downPayment"
                          value={formData.downPayment}
                          onChange={handleInputChange}
                          placeholder="Enter amount"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}

                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" />
                        <div>
                          <h4 className="text-sm font-medium text-yellow-800">
                            Required Documents
                          </h4>
                          <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                            <li>Valid ID Proof</li>
                            <li>Address Proof</li>
                            <li>Income Proof (for loan)</li>
                            <li>Bank Statements (for loan)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex justify-between pt-6">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setstep(step - 1)}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Back
                    </button>
                  )}

                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={() => validatestep() && setstep(step + 1)}
                      className={`px-6 py-2 rounded-md text-white ${
                        validatestep()
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!validatestep()}
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Complete Purchase
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default index;
