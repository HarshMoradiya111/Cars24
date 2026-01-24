import React from "react";

const ContactPage = () => (
  <div className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900">
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-semibold text-orange-500">Contact</p>
      <h1 className="text-3xl font-bold">Get in touch</h1>
      <p className="mt-2 text-sm text-gray-600">Questions about buying, selling, or services? We are here to help.</p>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm text-sm text-gray-800">
        <p>Email: support@cars24.example</p>
        <p className="mt-1">Phone: +91-90000-00000</p>
        <p className="mt-1">Support hours: 9 AM - 9 PM IST</p>
      </div>
    </div>
  </div>
);

export default ContactPage;
