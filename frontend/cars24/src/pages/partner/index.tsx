import React from "react";
import Link from "next/link";

const PartnerPage = () => (
  <div className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900">
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-semibold text-orange-500">Partnerships</p>
      <h1 className="text-3xl font-bold">Become our partner</h1>
      <p className="mt-2 text-sm text-gray-600">Join our network for inspections, financing, logistics, and local storefronts.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[{
          title: "Inspection partners",
          body: "Offer vehicle inspections and earn per booking in your city.",
        }, {
          title: "Finance partners",
          body: "Collaborate on loan offers and faster approvals for buyers.",
        }, {
          title: "Logistics partners",
          body: "Support test drives, vehicle movement, and doorstep delivery.",
        }, {
          title: "Storefronts",
          body: "Host a Cars24 experience zone and grow local footfall.",
        }].map((card) => (
          <div key={card.title} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{card.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
        Tell us about your business, cities you operate in, and the services you can offer.
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="mailto:partnerships@cars24.example"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
        >
          Email partnership team
        </Link>
        <Link
          href="/services"
          className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100"
        >
          Explore services
        </Link>
      </div>
    </div>
  </div>
);

export default PartnerPage;
