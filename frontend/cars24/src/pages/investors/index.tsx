import React from "react";

const InvestorsPage = () => (
  <div className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900">
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-semibold text-orange-500">Investors</p>
      <h1 className="text-3xl font-bold">Investor relations</h1>
      <p className="mt-2 text-sm text-gray-600">Key metrics, growth updates, and governance information.</p>
      <div className="mt-6 space-y-3">
        {["Quarterly business highlights", "Network expansion and user growth", "Unit economics and operational efficiency", "Sustainability commitments"].map((item) => (
          <div key={item} className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-800 shadow-sm">
            {item}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default InvestorsPage;
