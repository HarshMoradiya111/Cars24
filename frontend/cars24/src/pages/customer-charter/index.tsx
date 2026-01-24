import React from "react";

const CustomerCharterPage = () => (
  <div className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900">
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-semibold text-orange-500">Customer charter</p>
      <h1 className="text-3xl font-bold">Our promise to customers</h1>
      <p className="mt-2 text-sm text-gray-600">Transparency, timely updates, and secure transactions.</p>

      <div className="mt-6 space-y-3">
        {["Clear pricing with no hidden charges", "Regular status updates for orders and RC transfer", "Verified cars with inspection reports", "Support channels for quick resolution"].map((item) => (
          <div key={item} className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-800 shadow-sm">
            {item}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default CustomerCharterPage;
