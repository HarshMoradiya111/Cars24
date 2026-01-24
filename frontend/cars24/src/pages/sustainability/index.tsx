import React from "react";

const SustainabilityPage = () => (
  <div className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900">
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-semibold text-orange-500">Sustainability</p>
      <h1 className="text-3xl font-bold">Sustainable operations</h1>
      <p className="mt-2 text-sm text-gray-600">Reducing waste, optimizing logistics, and encouraging responsible ownership.</p>

      <div className="mt-6 space-y-3">
        {["Digital inspections to cut redundant travel", "Battery and tyre recycling partners", "Paperless documentation and e-RC", "Carbon-conscious transport routes"].map((item) => (
          <div key={item} className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-800 shadow-sm">
            {item}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SustainabilityPage;
