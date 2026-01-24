"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const categoryCopy: Record<string, { title: string; blurb: string }> = {
  hatchback: {
    title: "Hatchbacks",
    blurb: "Compact, efficient, and perfect for city driving.",
  },
  sedan: {
    title: "Sedans",
    blurb: "Comfortable rides with great boot space for family trips.",
  },
  suv: {
    title: "SUVs",
    blurb: "Higher stance, versatile seating, and confident highway manners.",
  },
};

const CarCategoryPage = () => {
  const { query } = useRouter();
  const key = Array.isArray(query.category) ? query.category[0] : query.category;
  const info = key ? categoryCopy[key.toLowerCase()] : undefined;
  const title = info?.title || "Cars";
  const blurb = info?.blurb || "Explore cars curated for your needs.";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold text-orange-500">Browse</p>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-sm text-gray-600">{blurb}</p>

        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-700">Popular picks in this category:</p>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-gray-700">
            <li>Filter on the Buy Car page by body type to see matching inventory.</li>
            <li>Schedule a test drive to experience the ride quality.</li>
            <li>Compare EMI options using the finance calculator.</li>
          </ul>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/buy-car"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
          >
            Go to Buy Car
          </Link>
          <Link
            href="/test-drive"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100"
          >
            Book a test drive
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCategoryPage;
