import React from "react";
import Link from "next/link";

const roles = [
  { title: "Product Manager", location: "Bengaluru", type: "Full-time" },
  { title: "Frontend Engineer", location: "Remote", type: "Full-time" },
  { title: "City Operations Lead", location: "Delhi NCR", type: "Full-time" },
];

const CareersPage = () => (
  <div className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900">
    <div className="mx-auto max-w-5xl">
      <p className="text-sm font-semibold text-orange-500">Careers</p>
      <h1 className="text-3xl font-bold">Build the future of car ownership</h1>
      <p className="mt-2 text-sm text-gray-600">Join a team that blends technology with on-ground excellence.</p>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-3 gap-4 text-xs font-semibold uppercase tracking-wide text-gray-600">
          <span>Role</span>
          <span>Location</span>
          <span>Type</span>
        </div>
        {roles.map((role) => (
          <div key={role.title} className="grid grid-cols-3 gap-4 border-t border-gray-100 px-1 py-3 text-sm text-gray-800">
            <span className="font-semibold text-gray-900">{role.title}</span>
            <span>{role.location}</span>
            <span>{role.type}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 text-sm text-gray-700">
        Email your resume to careers@cars24.example with the role in the subject line.
      </div>

      <div className="mt-4">
        <Link href="/" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
          Back to home
        </Link>
      </div>
    </div>
  </div>
);

export default CareersPage;
