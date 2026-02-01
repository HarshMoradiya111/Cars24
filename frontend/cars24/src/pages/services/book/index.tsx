import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { createServiceBooking } from "@/lib/serviceBookingApi";
import { toast } from "sonner";
import {
  Wrench,
  Shield,
  Calendar,
  CheckCircle2,
  MapPin,
  Phone,
  Wallet,
  ArrowLeft,
} from "lucide-react";

interface Service {
  id: number;
  name: string;
  price: string;
  duration: string;
  includes: string[];
}

const services: Service[] = [
  {
    id: 1,
    name: "General Service",
    price: "₹2,499",
    duration: "2-3 hours",
    includes: [
      "Engine Oil Change",
      "Oil Filter Replacement",
      "Air Filter Check",
      "Battery Check",
      "Brake Inspection",
    ],
  },
  {
    id: 2,
    name: "Comprehensive Service",
    price: "₹4,999",
    duration: "4-5 hours",
    includes: [
      "All General Service items",
      "Brake Pad Replacement",
      "Coolant Top-up",
      "AC Service",
      "Wheel Alignment",
    ],
  },
  {
    id: 3,
    name: "AC Service",
    price: "₹1,499",
    duration: "1-2 hours",
    includes: [
      "AC Gas Refill",
      "Filter Cleaning",
      "Cooling Check",
      "Vent Cleaning",
      "Performance Test",
    ],
  },
  {
    id: 4,
    name: "Denting & Painting",
    price: "₹3,999+",
    duration: "2-3 days",
    includes: [
      "Body Dent Repair",
      "Scratch Removal",
      "Panel Painting",
      "Polish & Wax",
      "Quality Check",
    ],
  },
  {
    id: 5,
    name: "Battery Replacement",
    price: "₹4,500+",
    duration: "30 minutes",
    includes: [
      "Battery Removal",
      "New Battery Installation",
      "Terminal Cleaning",
      "Charging Test",
      "1-Year Warranty",
    ],
  },
  {
    id: 6,
    name: "Wheel Care",
    price: "₹899",
    duration: "1 hour",
    includes: [
      "Wheel Alignment",
      "Wheel Balancing",
      "Tire Rotation",
      "Pressure Check",
      "Visual Inspection",
    ],
  },
];

const ServiceBookingPage = () => {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [selectedService, setSelectedService] = useState<Service>(services[0]);
  const [walletPoints, setWalletPoints] = useState(0);
  const [useWallet, setUseWallet] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    preferredDate: "",
  });

  // Parse price from service (e.g., "₹2,499" -> 2499)
  const getServicePrice = (priceStr: string): number => {
    const digitsOnly = priceStr.replace(/[^0-9]/g, "");
    return digitsOnly ? parseInt(digitsOnly, 10) : 0;
  };

  const servicePrice = getServicePrice(selectedService.price);

  // Fetch wallet points
  useEffect(() => {
    if (user?.id) {
      const fetchWallet = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/user/${user.id}/wallet`
          );
          if (response.ok) {
            const data = await response.json();
            setWalletPoints(data.points || 0);
          }
        } catch (error) {
          console.error("Failed to fetch wallet:", error);
        }
      };
      fetchWallet();
    }
  }, [user?.id]);

  // Calculate discount based on wallet usage
  useEffect(() => {
    if (useWallet && walletPoints > 0) {
      // 1 point = 1 rupee, but max discount is 2000
      const calculatedDiscount = Math.min(walletPoints, 2000, servicePrice);
      setDiscount(calculatedDiscount);
      setFinalPrice(Math.max(0, servicePrice - calculatedDiscount));
    } else {
      setDiscount(0);
      setFinalPrice(servicePrice);
    }
  }, [useWallet, walletPoints, servicePrice]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBookService = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error("Please login to book a service");
      router.push("/login");
      return;
    }

    if (!formData.name || !formData.phone || !formData.city || !formData.preferredDate) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        serviceName: selectedService.name,
        servicePrice: servicePrice,
        discountUsed: discount,
        finalPrice: finalPrice,
        name: formData.name,
        phone: formData.phone,
        city: formData.city,
        preferredDate: formData.preferredDate,
        useWallet: useWallet,
      };

      const data = await createServiceBooking(user.id, bookingData);
      toast.success("Service booked successfully!");

      // Refresh user data if wallet was used
      if (useWallet) {
        await refreshUser();
      }

      // Reset form and redirect
      setFormData({
        name: "",
        phone: "",
        city: "",
        preferredDate: "",
      });
      setUseWallet(false);

      // Redirect to bookings page after 2 seconds
      setTimeout(() => {
        router.push("/profile/bookings");
      }, 2000);
    } catch (error: any) {
      console.error("Service booking failed:", error);
      toast.error(error.message || "Failed to book service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-4 hover:opacity-80"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-3xl font-bold">Book Car Service</h1>
          <p className="text-blue-100 mt-2">Select service and confirm booking</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Service Selection */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Services</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedService.id === service.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm opacity-75">{service.price}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              {/* Service Details */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedService.name}
                  </h2>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      {selectedService.price}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedService.duration}
                    </div>
                  </div>
                </div>

                {/* Included Services */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    What's Included
                  </h3>
                  <ul className="space-y-2">
                    {selectedService.includes.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-sm text-gray-700"
                      >
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Booking Form */}
              <form onSubmit={handleBookService} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Enter your city"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Preferred Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Date
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      placeholder="DD-MM-YYYY"
                      pattern="\d{2}-\d{2}-\d{4}"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Wallet Section */}
                {walletPoints > 0 && (
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Wallet className="w-5 h-5 text-green-600" />
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Use Wallet Points
                          </h3>
                          <p className="text-sm text-gray-600">
                            Available: {walletPoints} points
                          </p>
                        </div>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={useWallet}
                          onChange={(e) => setUseWallet(e.target.checked)}
                          className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                        />
                      </label>
                    </div>

                    {useWallet && discount > 0 && (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Service Price:</span>
                          <span className="font-medium">₹{servicePrice}</span>
                        </div>
                        <div className="flex justify-between text-green-700">
                          <span>Discount:</span>
                          <span className="font-medium">-₹{discount}</span>
                        </div>
                        <div className="border-t border-green-200 pt-2 flex justify-between font-bold text-gray-900">
                          <span>Final Price:</span>
                          <span>₹{finalPrice}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Price Summary */}
                {!useWallet && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Amount:</span>
                      <span className="text-blue-600">₹{servicePrice}</span>
                    </div>
                  </div>
                )}

                {/* Confirm Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Booking...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Confirm Booking
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceBookingPage;
