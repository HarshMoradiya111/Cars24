"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const BlogPostPage = () => {
  const { query } = useRouter();
  const slug = Array.isArray(query.slug) ? query.slug.join("/") : query.slug;
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold text-orange-500">Blog</p>
        <h1 className="text-3xl font-bold">{slug || "Blog post"}</h1>
        <p className="mt-2 text-sm text-gray-600">This story is coming soon. Check back shortly for updates.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
          >
            Back to blog
          </Link>
          <Link
            href="/buy-car"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100"
          >
            Browse cars
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
