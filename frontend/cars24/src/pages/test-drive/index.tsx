import React from "react";
import Link from "next/link";

const TestDrivePage = () => (
  <div className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900">
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-semibold text-orange-500">Test drive</p>
      <h1 className="text-3xl font-bold">Book a test drive</h1>
      <p className="mt-2 text-sm text-gray-600">Pick a car, choose a slot, and we will confirm availability.</p>

      <div className="mt-6 space-y-3">
        {["Select a car you like", "Share your preferred date and time", "We confirm and arrange the drive at your location or our hub"].map((item) => (
          <div key={item} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-800">{item}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/buy-car"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
        >
          Choose a car
        </Link>
        <Link
          href="/appointments"
          className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100"
        >
          View my appointments
        </Link>
      </div>
    </div>
  </div>
);

export default TestDrivePage;
