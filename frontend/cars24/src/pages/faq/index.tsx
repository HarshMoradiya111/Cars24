import React from "react";

const faqs = [
  {
    q: "How do I book a test drive?",
    a: "Select a car on the Buy Car page, click Book Appointment, and choose your preferred slot.",
  },
  {
    q: "Do you help with financing?",
    a: "Yes. Use the finance page to explore EMI options and we will connect you to our partners.",
  },
  {
    q: "What documents are needed for RC transfer?",
    a: "Basic KYC, address proof, insurance, PUC, and the signed Form 29/30. We guide you through each step.",
  },
  {
    q: "Can I sell my car online?",
    a: "Yes. Start with the Sell Car flow, schedule an inspection, and receive an offer after evaluation.",
  },
  {
    q: "How is the Recommended Price calculated?",
    a: "We apply small multipliers to the base price based on real-world conditions. SUVs and off-road vehicles often see increased demand during monsoon or in hilly regions, while hatchbacks can soften in metro areas during fuel price spikes. Your selected location (or IP-detected region) and current season help determine these adjustments, and we show market trend notes alongside the recommended price.",
  },
];

const FaqPage = () => (
  <div className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900">
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-semibold text-orange-500">FAQ</p>
      <h1 className="text-3xl font-bold">Frequently asked questions</h1>
      <p className="mt-2 text-sm text-gray-600">Quick answers to popular queries about buying, selling, and services.</p>

      <div className="mt-6 space-y-4">
        {faqs.map((item) => (
          <div key={item.q} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-base font-semibold text-gray-900">{item.q}</p>
            <p className="mt-2 text-sm text-gray-700">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default FaqPage;
