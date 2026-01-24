import React from "react";
import Link from "next/link";

const ValuationPage = () => (
  <div className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900">
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-semibold text-orange-500">Valuation</p>
      <h1 className="text-3xl font-bold">Instant car valuation</h1>
      <p className="mt-2 text-sm text-gray-600">Get a price range based on model, year, and condition.</p>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
          <li>Share your car make, model, and year</li>
          <li>Add mileage and basic condition</li>
          <li>Schedule an inspection for a final offer</li>
        </ul>
      </div>

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

export default ValuationPage;
