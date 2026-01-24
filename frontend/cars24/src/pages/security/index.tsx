import React from "react";

const SecurityPage = () => (
  <div className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900">
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-semibold text-orange-500">Security</p>
      <h1 className="text-3xl font-bold">Security practices</h1>
      <p className="mt-2 text-sm text-gray-600">We protect your data with encryption, access controls, and monitoring.</p>

      <div className="mt-6 space-y-3">
        {["HTTPS everywhere and data encryption", "Role-based access and audit logs", "Regular vulnerability scans and updates", "Responsible disclosure for security researchers"].map((item) => (
          <div key={item} className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-800 shadow-sm">
            {item}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SecurityPage;
