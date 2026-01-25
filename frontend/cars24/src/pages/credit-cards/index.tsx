import React from "react";
import { CreditCard, Shield, Star, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CreditCardsPage = () => {
  const perks = [
    { icon: Shield, title: "Secure payments", desc: "Bank-grade protection for every transaction." },
    { icon: Star, title: "Rewards & cashback", desc: "Pick the card that maximizes your monthly spend." },
    { icon: Clock, title: "Fast approvals", desc: "Online application with quick decisioning." },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-4">
                <CreditCard className="h-4 w-4" />
                Credit Cards
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Compare & apply for the right credit card
              </h1>
              <p className="text-gray-600 mb-6">
                Explore curated card options with rewards, travel benefits, and low annual fees. Submit once, review offers, and complete your application online.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/finance">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Check eligibility
                  </Button>
                </Link>
                <Link href="/buy-car">
                  <Button variant="outline" className="text-blue-600 border-blue-200 hover:border-blue-400">
                    Browse cars
                  </Button>
                </Link>
              </div>
            </div>
            <div className="space-y-4 bg-gray-50 border border-gray-100 rounded-xl p-6">
              {perks.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCardsPage;
