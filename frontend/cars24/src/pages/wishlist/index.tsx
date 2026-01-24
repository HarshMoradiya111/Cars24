"use client";

import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { Heart, Trash2 } from "lucide-react";

const parseAmount = (raw: string) => {
  const digits = (raw || "").toString().replace(/[^0-9]/g, "");
  return digits ? parseInt(digits, 10) : null;
};

const formatCurrency = (value: string | undefined, fallback = "—") => {
  if (!value) return fallback;
  if (/lakh/i.test(value)) {
    return value.replace(/\$/g, "₹");
  }
  const amount = parseAmount(value);
  if (amount === null) return fallback;
  const lakhValue = amount / 100000;
  return `₹ ${lakhValue.toFixed(2)} lakh`;
};

const WishlistPage = () => {
  const { items, toggle, clear } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md text-center bg-white shadow rounded-lg p-8">
          <p className="text-sm font-semibold text-orange-500">Wishlist</p>
          <h1 className="text-2xl font-bold mt-2">No saved cars yet</h1>
          <p className="text-gray-600 mt-2">Tap the heart on any car to save it for later.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/buy-car"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
            >
              Browse cars
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-semibold text-orange-500">Wishlist</p>
            <h1 className="text-3xl font-bold">Saved cars ({items.length})</h1>
          </div>
          <button
            onClick={clear}
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            <Trash2 className="h-4 w-4" /> Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((car) => (
            <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img src={car.image} alt={car.title} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => toggle(car)}
                  className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full hover:bg-white"
                >
                  <Heart className="h-4 w-4 text-red-500" fill="currentColor" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{car.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{car.location}</p>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-gray-500">Price</p>
                    <p className="font-semibold">{formatCurrency(car.price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500">EMI from</p>
                    <p className="font-semibold">
                      {(() => {
                        const emiAmount = parseAmount(car.emi || "");
                        return emiAmount !== null
                          ? `₹ ${emiAmount.toLocaleString("en-IN")}/month`
                          : car.emi?.replace(/\$/g, "₹") || "—";
                      })()}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <Link
                    href={`/buy-car/${car.id}`}
                    className="flex-1 inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    View details
                  </Link>
                  <button
                    onClick={() => toggle(car)}
                    className="rounded-md border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
