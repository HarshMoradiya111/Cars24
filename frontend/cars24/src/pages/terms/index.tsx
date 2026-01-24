import React from "react";

const TermsPage = () => (
  <div className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900">
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-semibold text-orange-500">Terms</p>
      <h1 className="text-3xl font-bold">Terms and conditions</h1>
      <p className="mt-2 text-sm text-gray-600">Key points on using our platform.</p>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm text-sm text-gray-800">
        <ul className="list-disc space-y-2 pl-5">
          <li>Use the platform responsibly and follow applicable laws.</li>
          <li>Listings, prices, and offers may change based on inspection results.</li>
          <li>Payments and refunds follow the policies communicated during booking.</li>
        </ul>
      </div>
    </div>
  </div>
);

export default TermsPage;
