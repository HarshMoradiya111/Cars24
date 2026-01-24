import React from "react";

const AboutPage = () => (
  <div className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900">
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-semibold text-orange-500">About</p>
      <h1 className="text-3xl font-bold">Driven to make car ownership simple</h1>
      <p className="mt-2 text-sm text-gray-600">We help people buy and sell cars with transparency, financing options, and trusted inspections.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {["Pan-India presence with growing hubs", "Certified inspections and RC assistance", "Financing partnerships for faster approvals", "Digital-first journeys with human support"].map((point) => (
          <div key={point} className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-800 shadow-sm">
            {point}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AboutPage;
