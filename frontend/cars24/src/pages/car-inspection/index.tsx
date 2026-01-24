import React from "react";
import Link from "next/link";

const CarInspectionPage = () => (
  <div className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900">
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-semibold text-orange-500">Inspection</p>
      <h1 className="text-3xl font-bold">Get your car inspected</h1>
      <p className="mt-2 text-sm text-gray-600">Doorstep or hub inspections with a 140-point checklist.</p>

      <ol className="mt-6 space-y-3">
        {["Share your car details and location", "Pick a slot for inspection", "Receive a condition report and next steps"].map((step, idx) => (
          <li key={step} className="flex gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              {idx + 1}
            </div>
            <p className="text-sm text-gray-800">{step}</p>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/sell-car"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
        >
          Start selling
        </Link>
        <Link
          href="/services"
          className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100"
        >
          View services
        </Link>
      </div>
    </div>
  </div>
);

export default CarInspectionPage;
