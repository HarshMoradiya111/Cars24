import React from "react";
import Link from "next/link";

const ScrapCarPage = () => (
  <div className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900">
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-semibold text-orange-500">Scrap</p>
      <h1 className="text-3xl font-bold">Scrap your car responsibly</h1>
      <p className="mt-2 text-sm text-gray-600">We connect you with authorized scrapping partners and handle paperwork.</p>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
          <li>Doorstep pickup and de-registration support</li>
          <li>Environmentally compliant scrapping</li>
          <li>Certificate of destruction for records</li>
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
        >
          Talk to us
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

export default ScrapCarPage;
