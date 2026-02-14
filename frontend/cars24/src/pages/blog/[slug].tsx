"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const articles: Record<
  string,
  {
    title: string;
    subtitle: string;
    author: string;
    date: string;
    readTime: string;
    image: string;
    sections: { heading: string; content: string }[];
  }
> = {
  "1": {
    title: "Best compact SUVs in 2026: real-world mileage tested",
    subtitle: "Five top-selling compact SUVs, tested in city traffic and highway conditions for real mileage and comfort.",
    author: "Harsh Moradiya",
    date: "2 days ago",
    readTime: "6 min read",
    image: "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg",
    sections: [
      {
        heading: "Why compact SUVs dominate",
        content:
          "Compact SUVs balance space, mileage, and road presence. We evaluated cabin comfort, boot practicality, and service intervals for daily commuters.",
      },
      {
        heading: "Mileage results",
        content:
          "Our best performer returned 17–18 kmpl in mixed driving. Turbo models dipped to 13–14 kmpl when driven aggressively.",
      },
      {
        heading: "Maintenance outlook",
        content:
          "Average annual maintenance across the segment sits between ₹8,000–₹12,000 excluding tires and batteries.",
      },
    ],
  },
  "2": {
    title: "Top 7 pre-owned sedans under ₹8 lakh",
    subtitle: "Affordable sedans with low upkeep, strong safety scores, and reliable resale value.",
    author: "Harsh Moradiya",
    date: "4 days ago",
    readTime: "5 min read",
    image: "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg",
    sections: [
      {
        heading: "What to prioritize",
        content:
          "Focus on service history, genuine parts availability, and accident-free records. These factors decide long-term ownership cost.",
      },
      {
        heading: "Best value picks",
        content:
          "The best choices in this budget offer balanced ride quality and easy parts availability, keeping maintenance predictable.",
      },
    ],
  },
  "3": {
    title: "How to check a used car before buying",
    subtitle: "A 12‑point inspection list to avoid hidden repairs and ensure fair pricing.",
    author: "Harsh Moradiya",
    date: "1 week ago",
    readTime: "7 min read",
    image: "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg",
    sections: [
      {
        heading: "Exterior & body",
        content:
          "Look for uneven panel gaps, mismatched paint, and rust near wheel arches. These can indicate previous accidents.",
      },
      {
        heading: "Engine & fluids",
        content:
          "Check oil color, coolant levels, and unusual leaks. A short test drive can reveal hesitation or unusual noises.",
      },
      {
        heading: "Service records",
        content:
          "Verify periodic services and ensure odometer readings align with maintenance bills.",
      },
    ],
  },
  "4": {
    title: "EV charging in India: what buyers must know",
    subtitle: "Charging costs, home setup, and city-wise availability explained simply.",
    author: "Harsh Moradiya",
    date: "6 days ago",
    readTime: "6 min read",
    image: "https://images.pexels.com/photos/1104768/pexels-photo-1104768.jpeg",
    sections: [
      {
        heading: "Charging types",
        content:
          "Home AC charging is cheapest; DC fast charging is faster but costs more. Most users charge overnight at home.",
      },
      {
        heading: "Running cost",
        content:
          "Typical EV running cost ranges from ₹1.0–₹1.5 per km depending on state tariffs and charging access.",
      },
    ],
  },
  "5": {
    title: "Maintenance costs: hatchback vs SUV over 5 years",
    subtitle: "A clear comparison of service, tires, and insurance across common ownership cycles.",
    author: "Harsh Moradiya",
    date: "3 days ago",
    readTime: "6 min read",
    image: "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg",
    sections: [
      {
        heading: "Service intervals",
        content:
          "Hatchbacks typically need less expensive routine services, while SUVs carry higher tire and suspension costs.",
      },
      {
        heading: "Total ownership cost",
        content:
          "Over five years, SUVs can cost ₹60,000–₹90,000 more depending on fuel type and driving conditions.",
      },
    ],
  },
};

const BlogPostPage = () => {
  const { query } = useRouter();
  const slug = Array.isArray(query.slug) ? query.slug.join("/") : query.slug;
  const article = slug ? articles[slug] : undefined;
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold text-orange-500">Blog</p>
        <h1 className="text-3xl font-bold">{article?.title || slug || "Blog post"}</h1>
        {article ? (
          <>
            <p className="mt-2 text-base text-gray-700">{article.subtitle}</p>
            <div className="mt-3 text-sm text-gray-500 flex flex-wrap gap-2">
              <span>{article.author}</span>
              <span>•</span>
              <span>{article.date}</span>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>
            <div className="mt-6 overflow-hidden rounded-xl border bg-white shadow-sm">
              <img
                src={article.image}
                alt={article.title}
                className="w-full max-h-[420px] object-contain bg-gray-50"
              />
            </div>
            <div className="mt-6 space-y-6">
              {article.sections.map((section, index) => (
                <div key={index}>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{section.heading}</h2>
                  <p className="text-gray-700 leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="mt-2 text-sm text-gray-600">
            This story is coming soon. Check back shortly for updates.
          </p>
        )}
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
