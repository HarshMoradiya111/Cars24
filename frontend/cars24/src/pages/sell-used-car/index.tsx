import React from "react";
import Link from "next/link";

const SellUsedCarPage = () => (
  <div className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900">
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-semibold text-orange-500">Sell used car</p>
      <h1 className="text-3xl font-bold">Sell with confidence</h1>
      <p className="mt-2 text-sm text-gray-600">Free valuation, inspection, and RC assistance to close faster.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/sell-car"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
        >
          Start selling
        </Link>
        <Link
          href="/car-inspection"
          className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100"
        >
          Book inspection
        </Link>
      </div>
    </div>
  </div>
);

export default SellUsedCarPage;
