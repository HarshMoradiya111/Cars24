import React from "react";
import Link from "next/link";

const BlogPage = () => (
  <div className="min-h-screen bg-gray-50 text-gray-900">
    <div className="max-w-5xl mx-auto px-4 py-12">
      <p className="text-sm font-semibold text-orange-500">Blog</p>
      <h1 className="mt-2 text-3xl font-bold">Insights and updates</h1>
      <p className="mt-3 text-gray-600">
        We are curating stories, buying guides, and maintenance tips for you. Stay tuned while we
        prepare fresh content.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {["Buying smarter", "Selling faster", "Ownership hacks", "Financing 101"].map((topic) => (
          <div key={topic} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Coming soon</p>
            <h3 className="mt-1 text-lg font-semibold text-gray-900">{topic}</h3>
            <p className="mt-2 text-sm text-gray-600">
              Practical checklists, expert tips, and local insights tailored for Indian car buyers.
            </p>
            <div className="mt-3 inline-flex items-center gap-2 text-sm text-blue-600">
              <span>Estimated read: 4 min</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/buy-car"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
        >
          Browse used cars
        </Link>
        <Link
          href="/sell-car"
          className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100"
        >
          Sell your car
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Back to home
        </Link>
      </div>
    </div>
  </div>
);

export default BlogPage;
