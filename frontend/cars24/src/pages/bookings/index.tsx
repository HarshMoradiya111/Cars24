import React, { useEffect, useState } from "react";

import {
  Calendar,
  Clock,
  MapPin,
  Car,
  FileText,
  PenTool as Tool,
  Shield,
  AlertCircle,
  Check,
  User,
  Settings,
  Fuel,
  Gauge,
  Mail,
  Phone,
  Landmark,
  CreditCard,
  DollarSign,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getBookingbyuser } from "@/services/bookingService";
import { getServiceBookingsByUserId } from "@/lib/serviceBookingApi";
import { getappointmentbyuser } from "@/services/appointmentService";
import { BookingListSkeleton, EmptyState, LoadingSpinner } from "@/components/ui/SkeletonLoaders";
import { Button } from "@/components/ui/button";
import LoadingState from "@/components/ui/LoadingState";
import EmptyStateComponent from "@/components/ui/EmptyState";

const PurchasedCarsPage = () => {
  const fallbackPurchasedCars = [
    {
      booking: {
        id: "bk-1",
        preferredDate: "2024-03-20",
        preferredTime: "11:00 AM",
        name: "John Doe",
        phone: "+1234567890",
        email: "john@example.com",
        address: "Mumbai, Maharashtra",
        paymentMethod: "Card",
        loanStatus: "Approved",
        downPayment: "50000",
      },
      car: {
        id: "car1",
        title: "Honda City 2020 ZX MT PETROL",
        images: [
          "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        ],
        location: "Mumbai, Maharashtra",
        price: "850000",
        emi: "12999",
        specs: {
          year: 2020,
          km: "45000",
          fuel: "Petrol",
          transmission: "Manual",
          owner: "First",
          insurance: "Comprehensive",
        },
        highlights: ["Zero Dep Insurance", "Low KM"],
        features: ["ABS", "Airbags"],
      },
    },
    {
      booking: {
        id: "bk-2",
        preferredDate: "2024-02-01",
        preferredTime: "2:00 PM",
        name: "Jane Smith",
        phone: "+1987654321",
        email: "jane@example.com",
        address: "Delhi, India",
        paymentMethod: "UPI",
        loanStatus: "In Process",
        downPayment: "30000",
      },
      car: {
        id: "car2",
        title: "Hyundai i20 2019 Asta",
        images: [
          "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        ],
        location: "New Delhi",
        price: "675000",
        emi: "9999",
        specs: {
          year: 2019,
          km: "38000",
          fuel: "Petrol",
          transmission: "Manual",
          owner: "Second",
          insurance: "Valid",
        },
        highlights: ["Top Variant"],
        features: ["Cruise Control"],
      },
    },
  ];
  

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "in_transit":
        return "bg-yellow-100 text-yellow-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLoanStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-500";
      case "In Process":
        return "bg-yellow-500";
      case "Not Started":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [purchasedCars, setpurchasedCars] = useState<any[]>([]);
  const [serviceBookings, setServiceBookings] = useState<any[]>([]);
  const [appointmentBookings, setAppointmentBookings] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<"car" | "service" | "appointment">("car");
  
  const fetchBookings = async (isRetry = false) => {
    try {
      if (isRetry) {
        setIsRetrying(true);
      } else {
        setLoading(true);
      }
      setError(null);

      if (!user) {
        console.log('[bookings] No user, using fallback data');
        setpurchasedCars(fallbackPurchasedCars);
        setServiceBookings([]);
        setAppointmentBookings([]);
        return;
      }

      const response = await getBookingbyuser(user.id);

      console.log('[bookings] API Response:', response, 'Type:', typeof response, 'IsArray:', Array.isArray(response));

      if (!response) {
        console.warn('[bookings] API returned null/undefined, using fallback');
        setpurchasedCars(fallbackPurchasedCars);
        return;
      }

      let bookingsArray: any[] = [];
      if (Array.isArray(response)) {
        bookingsArray = response;
      } else if (response && typeof response === 'object') {
        if (Array.isArray(response.data)) {
          bookingsArray = response.data;
        } else if (Array.isArray(response.bookings)) {
          bookingsArray = response.bookings;
        }
      }

      console.log('[bookings] Extracted array length:', bookingsArray.length);

      if (bookingsArray.length === 0) {
        console.log('[bookings] No bookings found for user');
        setpurchasedCars([]);
      } else {
        const safeBookings = bookingsArray.map((item: any) => ({
          booking: {
            id: item?.booking?.id || item?.id || `booking-${Date.now()}`,
            preferredDate: item?.booking?.preferredDate || "N/A",
            preferredTime: item?.booking?.preferredTime || "N/A",
            name: item?.booking?.name || "N/A",
            phone: item?.booking?.phone || "N/A",
            email: item?.booking?.email || "N/A",
            address: item?.booking?.address || "N/A",
            paymentMethod: item?.booking?.paymentMethod || "N/A",
            loanStatus: item?.booking?.loanStatus || "N/A",
            downPayment: item?.booking?.downPayment || "0",
          },
          car: {
            id: item?.car?.id || "unknown",
            title: item?.car?.title || "Unknown Car",
            images: Array.isArray(item?.car?.images) && item.car.images.length > 0 
              ? item.car.images 
              : ["https://via.placeholder.com/400x300?text=No+Image"],
            location: item?.car?.location || "N/A",
            price: item?.car?.price || "N/A",
            emi: item?.car?.emi || "N/A",
            specs: item?.car?.specs || {},
            highlights: Array.isArray(item?.car?.highlights) ? item.car.highlights : [],
            features: Array.isArray(item?.car?.features) ? item.car.features : [],
          },
        }));
        console.log(`[bookings] ✓ Loaded ${safeBookings.length} bookings`);
        setpurchasedCars(safeBookings);
      }

      try {
        const serviceResponse = await getServiceBookingsByUserId(user.id);
        console.log('[service-bookings] API Response:', serviceResponse);
        
        if (serviceResponse && Array.isArray(serviceResponse)) {
          console.log(`[service-bookings] ✓ Loaded ${serviceResponse.length} service bookings`);
          setServiceBookings(serviceResponse);
        } else {
          setServiceBookings([]);
        }
      } catch (serviceErr) {
        console.warn('[service-bookings] Failed to load service bookings:', serviceErr);
        setServiceBookings([]);
      }

      try {
        const appointmentResponse = await getappointmentbyuser(user.id);
        console.log('[appointments] API Response:', appointmentResponse);

        if (appointmentResponse && Array.isArray(appointmentResponse)) {
          console.log(`[appointments] ✓ Loaded ${appointmentResponse.length} appointments`);
          setAppointmentBookings(appointmentResponse);
        } else {
          setAppointmentBookings([]);
        }
      } catch (aptErr) {
        console.warn('[appointments] Failed to load appointments:', aptErr);
        setAppointmentBookings([]);
      }

      setError(null);
    } catch (err: any) {
      const errorMsg = err?.message || "Failed to load bookings";
      console.error('[bookings] ✗ Error:', errorMsg, err);
      setError(errorMsg);
      setpurchasedCars(fallbackPurchasedCars);
      setServiceBookings([]);
      setAppointmentBookings([]);
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  };
  
  useEffect(() => {
    fetchBookings();
  }, [user]);

  useEffect(() => {
    if (loading || isRetrying) return;

    const hasCar = purchasedCars.length > 0;
    const hasService = serviceBookings.length > 0;
    const hasAppointment = appointmentBookings.length > 0;

    if (activeCategory === "car" && hasCar) return;
    if (activeCategory === "service" && hasService) return;
    if (activeCategory === "appointment" && hasAppointment) return;

    if (hasCar) setActiveCategory("car");
    else if (hasService) setActiveCategory("service");
    else if (hasAppointment) setActiveCategory("appointment");
  }, [activeCategory, appointmentBookings.length, isRetrying, loading, purchasedCars.length, serviceBookings.length]);
  
  const handleRetry = () => {
    fetchBookings(true);
  };
  
  if (loading || isRetrying) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800">Your Bookings</h1>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
              <p className="text-sm font-medium text-blue-800">
                {isRetrying ? "Retrying..." : "Loading your bookings..."}
              </p>
            </div>
            <p className="text-xs text-blue-600">
              First load may take 30-50 seconds due to server cold start
            </p>
          </div>
          <BookingListSkeleton count={2} />
        </div>
      </div>
    );
  }
  
  if (error && !loading && !isRetrying) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <EmptyStateComponent
            type="error"
            title="Failed to load bookings"
            message={error}
            onActionClick={handleRetry}
            actionText="Try Again"
          />
        </div>
      </div>
    );
  }
  
  if (purchasedCars.length === 0 && serviceBookings.length === 0 && appointmentBookings.length === 0 && !loading && !isRetrying) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <EmptyStateComponent
            type="no-results"
            title="No bookings found"
            message="You haven't made any bookings yet. Start browsing our collection or book a service!"
            actionText="Browse Cars"
            actionHref="/buy-car"
          />
        </div>
      </div>
    );
  }
  const parseAmount = (raw: string) => {
    if (!raw) return null;
    const lakhMatch = raw.match(/([0-9]+(?:\.[0-9]+)?)\s*lakh/i);
    if (lakhMatch) {
      const lakhValue = parseFloat(lakhMatch[1]);
      return Math.round(lakhValue * 100000);
    }
    const digits = raw.toString().replace(/[^0-9]/g, "");
    return digits ? parseInt(digits, 10) : null;
  };

  const formatCurrency = (value: string, fallback = "N/A") => {
    const amount = parseAmount(value);
    if (amount === null) return fallback;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 print:py-0 print:px-0 text-black">
      <div className="max-w-5xl mx-auto mb-6 print:hidden">
        <h1 className="text-3xl font-bold text-gray-800 text-center">Your Bookings</h1>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Button
            variant={activeCategory === "car" ? "default" : "outline"}
            size="sm"
            className={
              activeCategory === "car"
                ? undefined
                : "hover:bg-primary hover:text-primary-foreground"
            }
            onClick={() => setActiveCategory("car")}
          >
            Car Booking
          </Button>
          <Button
            variant={activeCategory === "service" ? "default" : "outline"}
            size="sm"
            className={
              activeCategory === "service"
                ? undefined
                : "hover:bg-primary hover:text-primary-foreground"
            }
            onClick={() => setActiveCategory("service")}
          >
            Service Booking
          </Button>
          <Button
            variant={activeCategory === "appointment" ? "default" : "outline"}
            size="sm"
            className={
              activeCategory === "appointment"
                ? undefined
                : "hover:bg-primary hover:text-primary-foreground"
            }
            onClick={() => setActiveCategory("appointment")}
          >
            Appointment
          </Button>
        </div>
      </div>

      {activeCategory === "car" && purchasedCars.length === 0 && (
        <div className="max-w-5xl mx-auto">
          <EmptyStateComponent
            type="no-results"
            title="No car bookings"
            message="You don't have any car bookings yet."
            actionText="Browse Cars"
            actionHref="/buy-car"
          />
        </div>
      )}

      {activeCategory === "car" && purchasedCars.length > 0 && (
        <div className="mb-8 text-center print:hidden">
          <h2 className="text-2xl font-bold text-gray-800">Car Booking Confirmation</h2>
          <p className="text-gray-600">Thank you for your purchase!</p>
        </div>
      )}

      {activeCategory === "car" && purchasedCars.map((data: any) => (
        <div key={data.booking.id} className="max-w-5xl mx-auto bg-gray-50 rounded-lg overflow-hidden shadow-xl mb-8">
          <div className="bg-blue-900 text-white p-6 rounded-t-lg">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center mb-2">
                  <Check className="w-6 h-6 mr-2 text-green-400" />
                  <h1 className="text-2xl font-bold">Booking Confirmed</h1>
                </div>
                <p className="text-blue-200 mb-4">
                  Booking ID: {data.booking.id.slice(-8).toUpperCase()}
                </p>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-300" />
                    <span>{data.booking.preferredDate}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-300" />
                    <span>{data.booking.preferredTime}</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex items-center">
                <Car className="w-12 h-12 text-blue-300" />
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 transition-all duration-300 hover:shadow-lg">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Car Image */}
                <div className="md:w-2/5 h-64 overflow-hidden rounded-lg">
                  <img
                    src={data.car.images[0]}
                    alt={data.car.title}
                    className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
                  />
                </div>

                {/* Car Details */}
                <div className="md:w-3/5">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {data.car.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{data.car.location}</p>

                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-700">Price</p>
                      <p className="text-xl font-bold text-blue-900">
                        {formatCurrency(data.car.price, data.car.price || "N/A")}
                      </p>
                    </div>
                    {data.car.emi && (
                      <div className="bg-amber-50 p-3 rounded-lg">
                        <p className="text-sm text-amber-700">EMI from</p>
                        <p className="text-xl font-bold text-amber-900">
                          {(() => {
                            const emiAmount = parseAmount(data.car.emi);
                            return emiAmount !== null
                              ? `₹ ${emiAmount.toLocaleString("en-IN")}/month`
                              : data.car.emi?.replace(/\$/g, "₹") || "N/A";
                          })()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Car Specifications */}
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Specifications
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="text-gray-700">
                        {data.car.specs.year}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Gauge className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="text-gray-700">
                        {data.car.specs.km} km
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Fuel className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="text-gray-700">
                        {data.car.specs.fuel}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Settings className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="text-gray-700">
                        {data.car.specs.transmission}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="text-gray-700">
                        {data.car.specs.owner}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="text-gray-700">
                        {data.car.specs.insurance}
                      </span>
                    </div>
                  </div>

                  {/* Highlights and Features */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {data.car.highlights.map((highlight: any, index: any) => (
                      <span
                        key={`highlight-${index}`}
                        className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                      >
                        {highlight}
                      </span>
                    ))}
                    {data.car.features.map((feature: any, index: any) => (
                      <span
                        key={`feature-${index}`}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Customer Details
                </h2>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-8 flex-shrink-0 text-gray-500">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="text-gray-800 font-medium">
                        {data.booking.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 flex-shrink-0 text-gray-500">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-gray-800 font-medium">
                        {data.booking.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 flex-shrink-0 text-gray-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-800 font-medium">
                        {data.booking.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 flex-shrink-0 text-gray-500">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-gray-800 font-medium">
                        {data.booking.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                  Payment Details
                </h2>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600">Car Price</span>
                    <span className="font-semibold">
                      {formatCurrency(data.car.price, data.car.price || "N/A")}
                    </span>
                  </div>

                  {data.booking.downPayment && (
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-600">Down Payment</span>
                      <span className="font-semibold">
                        {formatCurrency(
                          data.booking.downPayment,
                          data.booking.downPayment || "N/A"
                        )}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 font-medium">
                        Total Amount
                      </span>
                      <span className="text-xl font-bold text-blue-900">
                        {formatCurrency(data.car.price, data.car.price || "N/A")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                    <CreditCard className="w-5 h-5 mr-3 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <p className="text-gray-800 font-medium">
                        {data.booking.paymentMethod}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                    <Landmark className="w-5 h-5 mr-3 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Financing</p>
                      <p className="text-gray-800 font-medium">{data.booking.loanStatus}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 p-4 text-center text-gray-500 text-sm">
            <p>
              Thank you for your purchase! For any queries, please contact our
              customer support.
            </p>
          </div>
        </div>
      ))}

      {activeCategory === "service" && serviceBookings.length === 0 && (
        <div className="max-w-5xl mx-auto">
          <EmptyStateComponent
            type="no-results"
            title="No service bookings"
            message="You don't have any service bookings yet."
            actionText="Book a Service"
            actionHref="/services"
          />
        </div>
      )}

      {activeCategory === "service" && serviceBookings.length > 0 && (
        <>
          <div className="mb-8 text-center mt-12">
            <h1 className="text-3xl font-bold text-gray-800">
              Service Bookings
            </h1>
            <p className="text-gray-600">Your scheduled services</p>
          </div>
          
          {serviceBookings.map((booking: any) => (
            <div key={booking.id} className="max-w-5xl mx-auto bg-gray-50 rounded-lg overflow-hidden shadow-xl mb-8">
              <div className="bg-gradient-to-r from-orange-600 to-orange-800 text-white p-6 rounded-t-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-2">
                      <Check className="w-6 h-6 mr-2 text-green-400" />
                      <h2 className="text-2xl font-bold">Service Booking Confirmed</h2>
                    </div>
                    <p className="text-orange-200 mb-4">
                      Booking ID: {booking.id?.slice(-8).toUpperCase() || 'N/A'}
                    </p>

                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-orange-300" />
                        <span>{booking.preferredDate || 'N/A'}</span>
                      </div>
                      <div className="flex items-center">
                        <Tool className="w-5 h-5 mr-2 text-orange-300" />
                        <span className="capitalize">{booking.status || 'Confirmed'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center">
                    <Tool className="w-12 h-12 text-orange-300" />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <Tool className="w-5 h-5 mr-2 text-orange-600" />
                      Service Details
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Service Name</p>
                        <p className="text-lg font-bold text-gray-800">
                          {booking.serviceName || 'N/A'}
                        </p>
                      </div>

                      <div className="border-t pt-3">
                        <p className="text-sm text-gray-500">Service Price</p>
                        <p className="text-gray-800 font-medium">
                          ₹ {booking.servicePrice?.toLocaleString('en-IN') || '0'}
                        </p>
                      </div>

                      {booking.discountUsed > 0 && (
                        <div>
                          <p className="text-sm text-gray-500">Discount Applied</p>
                          <p className="text-green-600 font-medium">
                            - ₹ {booking.discountUsed?.toLocaleString('en-IN') || '0'}
                          </p>
                        </div>
                      )}

                      <div className="bg-orange-50 p-3 rounded-lg border-t-2 border-orange-600">
                        <p className="text-sm text-gray-500">Final Price</p>
                        <p className="text-2xl font-bold text-orange-900">
                          ₹ {booking.finalPrice?.toLocaleString('en-IN') || '0'}
                        </p>
                      </div>

                      {booking.useWallet && (
                        <div className="flex items-center text-sm text-amber-600 bg-amber-50 p-2 rounded">
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          <span>Wallet points used</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-orange-600" />
                      Customer Details
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="w-8 flex-shrink-0 text-gray-500">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="text-gray-800 font-medium">
                            {booking.name || 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-8 flex-shrink-0 text-gray-500">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="text-gray-800 font-medium">
                            {booking.phone || 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-8 flex-shrink-0 text-gray-500">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">City</p>
                          <p className="text-gray-800 font-medium">
                            {booking.city || 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-8 flex-shrink-0 text-gray-500">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Preferred Date</p>
                          <p className="text-gray-800 font-medium">
                            {booking.preferredDate || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 p-4 text-center text-gray-500 text-sm mt-6 rounded">
                  <p>
                    Thank you for booking our service! We'll contact you soon to confirm the appointment.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {activeCategory === "appointment" && appointmentBookings.length === 0 && (
        <div className="max-w-5xl mx-auto">
          <EmptyStateComponent
            type="no-results"
            title="No appointments"
            message="You don't have any appointments scheduled yet."
            actionText="Browse Cars"
            actionHref="/buy-car"
          />
        </div>
      )}

      {activeCategory === "appointment" && appointmentBookings.length > 0 && (
        <>
          <div className="mb-8 text-center mt-12">
            <h2 className="text-3xl font-bold text-gray-800">Appointments</h2>
            <p className="text-gray-600">Your scheduled inspections</p>
          </div>

          <div className="max-w-5xl mx-auto space-y-4">
            {appointmentBookings.map((item: any) => {
              const apt = item?.appointment;
              const car = item?.car;
              const status = (apt?.status || "upcoming").toString();
              const dateValue = apt?.scheduledDate ? new Date(apt.scheduledDate) : null;
              const date = dateValue && !isNaN(dateValue.getTime())
                ? dateValue.toISOString().split("T")[0]
                : "N/A";
              const typeLabel = apt?.appointmentType === "home_inspection" ? "Home Inspection" : "Branch Visit";

              const statusClass =
                status === "completed"
                  ? "bg-green-500 text-white"
                  : status === "cancelled"
                  ? "bg-red-500 text-white"
                  : "bg-blue-500 text-white";

              return (
                <div key={apt?.id || Math.random()} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className={`px-4 py-2 ${statusClass}`}>
                    <span className="text-white text-sm font-medium capitalize">
                      {status}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
                      <Car className="w-5 h-5 mr-2 text-gray-500" />
                      {car?.title || "Car"}
                    </h3>

                    <div className="space-y-2">
                      <p className="text-gray-600 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Date: {date}
                      </p>
                      <p className="text-gray-600 flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Time: {apt?.scheduledTime || "N/A"}
                      </p>
                      <p className="text-gray-600 flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        Location: {apt?.location || "N/A"}
                      </p>
                      <p className="text-gray-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Type: {typeLabel}
                      </p>
                    </div>

                    {apt?.notes ? (
                      <div className="mt-4 bg-gray-50 p-4 rounded-md">
                        <p className="text-sm text-gray-700">{apt.notes}</p>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="mt-8 text-center text-gray-500 text-sm print:hidden">
        <p>© 2025 Premium Auto Sales. All rights reserved.</p>
      </div>
    </div>
  );
};

export default PurchasedCarsPage;
