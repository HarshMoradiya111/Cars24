import React from "react";
import Link from "next/link";

const RcTransferPage = () => (
  <div className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900">
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-semibold text-orange-500">RC transfer</p>
      <h1 className="text-3xl font-bold">Track registration transfer</h1>
      <p className="mt-2 text-sm text-gray-600">We handle paperwork and keep you posted at every step.</p>

      <ol className="mt-6 space-y-3">
        {["Document pickup and verification", "RTO submission and verification", "Hypothecation and address updates", "New RC dispatch and delivery"].map((step, idx) => (
          <li key={step} className="flex gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              {idx + 1}
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">{step}</p>
              <p className="text-sm text-gray-600">Typical timeline: 3-5 business days per stage (may vary by RTO).</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
        Need an update? Share your order ID on our support chat. We will reply with the latest status.
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/orders"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
        >
          View my orders
        </Link>
        <Link
          href="/faq"
          className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100"
        >
          Go to FAQ
        </Link>
      </div>
    </div>
  </div>
);

export default RcTransferPage;
