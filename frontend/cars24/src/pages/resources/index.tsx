import React from "react";
import Link from "next/link";

const ResourcesPage = () => (
  <div className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900">
    <div className="mx-auto max-w-6xl">
      <p className="text-sm font-semibold text-orange-500">Resources</p>
      <h1 className="text-3xl font-bold">Guides, tools, and support</h1>
      <p className="mt-2 text-sm text-gray-600">Everything you need to buy, sell, and maintain your car confidently.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[{
          title: "Buyer checklist",
          body: "Pre-purchase checks, paperwork, and delivery steps for a smooth experience.",
          cta: "View checklist",
          link: "/faq",
        }, {
          title: "Seller guide",
          body: "How to price, prepare, and list your car to attract serious buyers.",
          cta: "Sell smarter",
          link: "/sell-car",
        }, {
          title: "Financing tips",
          body: "Compare EMI options and documents needed for faster approvals.",
          cta: "Explore finance",
          link: "/finance",
        }, {
          title: "Service schedule",
          body: "Keep your car healthy with interval-based maintenance reminders.",
          cta: "Book a service",
          link: "/services",
        }, {
          title: "RC transfer",
          body: "Understand timelines, documents, and how we help with transfer status.",
          cta: "Check RC transfer",
          link: "/rc-transfer",
        }, {
          title: "Help center",
          body: "Find answers to common questions or reach our support team.",
          cta: "Go to FAQ",
          link: "/faq",
        }].map((item) => (
          <div key={item.title} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{item.body}</p>
            <Link
              href={item.link}
              className="mt-3 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              {item.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ResourcesPage;
