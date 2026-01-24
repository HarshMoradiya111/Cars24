import React from "react";

const NewsPage = () => (
  <div className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900">
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-semibold text-orange-500">News</p>
      <h1 className="text-3xl font-bold">Latest updates</h1>
      <p className="mt-2 text-sm text-gray-600">Product launches, partnerships, and market milestones.</p>

      <div className="mt-6 space-y-3">
        {["Launched doorstep test drives in 5 new cities", "Expanded inventory of certified cars with warranty", "Partnered with banks for faster loan approvals"].map((item) => (
          <div key={item} className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-800 shadow-sm">
            {item}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default NewsPage;
