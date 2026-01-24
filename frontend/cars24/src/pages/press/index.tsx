import React from "react";

const PressPage = () => (
  <div className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900">
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-semibold text-orange-500">Press</p>
      <h1 className="text-3xl font-bold">Press kit</h1>
      <p className="mt-2 text-sm text-gray-600">Logos, brand assets, and media contacts for coverage.</p>
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-800 shadow-sm">
        <ul className="list-disc space-y-2 pl-5">
          <li>Download logo pack (PNG/SVG)</li>
          <li>Brand guidelines: color, spacing, and usage</li>
          <li>Company boilerplate and leadership bios</li>
          <li>For media queries: media@cars24.example</li>
        </ul>
      </div>
    </div>
  </div>
);

export default PressPage;
