"use client";
import React, { useState } from "react";
import {
  calculateMaintenanceCost,
  MaintenanceCondition,
  getConditionFromString,
} from "@/utils/maintenanceCalculator";
import { AlertCircle, TrendingUp, Wrench, Calendar } from "lucide-react";

interface CalculatorState {
  carAge: number;
  kmDriven: number;
  brand: string;
  condition: string;
}

const MaintenanceCalculator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState<CalculatorState>({
    carAge: 5,
    kmDriven: 60000,
    brand: "",
    condition: "",
  });

  const conditionEnum = getConditionFromString(input.condition);
  const estimate = calculateMaintenanceCost(
    input.carAge,
    input.kmDriven,
    input.brand,
    conditionEnum
  );

  const carBrands = [
    "Maruti",
    "Hyundai",
    "Honda",
    "Tata",
    "Mahindra",
    "Kia",
    "Skoda",
    "Volkswagen",
    "Toyota",
  ];

  const conditions = [
    { label: "Excellent (Well Maintained)", value: "excellent" },
    { label: "Good", value: "good" },
    { label: "Average", value: "average" },
    { label: "Poor (Neglected)", value: "poor" },
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full text-left p-4 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          <span className="font-medium">Maintenance Cost Calculator</span>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Wrench className="h-6 w-6" />
            Maintenance Cost Calculator
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-2xl hover:opacity-70"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Car Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Car Age (years)
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={input.carAge}
                onChange={(e) =>
                  setInput({ ...input, carAge: parseInt(e.target.value) || 0 })
                }
                placeholder="Enter car age"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-600 text-gray-900"
              />
              <input
                type="range"
                min="0"
                max="30"
                value={input.carAge}
                onChange={(e) =>
                  setInput({ ...input, carAge: parseInt(e.target.value) })
                }
                className="w-full mt-2"
              />
            </div>

            {/* KM Driven */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kilometers Driven
              </label>
              <input
                type="number"
                min="0"
                step="5000"
                value={input.kmDriven}
                onChange={(e) =>
                  setInput({ ...input, kmDriven: parseInt(e.target.value) || 0 })
                }
                placeholder="Enter kilometers"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-600 text-gray-900"
              />
              <input
                type="range"
                min="0"
                max="200000"
                step="5000"
                value={input.kmDriven}
                onChange={(e) =>
                  setInput({ ...input, kmDriven: parseInt(e.target.value) })
                }
                className="w-full mt-2"
              />
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Car Brand
              </label>
              <select
                value={input.brand}
                onChange={(e) => setInput({ ...input, brand: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700 placeholder-gray-600"
              >
                <option value="" disabled className="text-gray-600">
                  Select a brand
                </option>
                {carBrands.map((brand) => (
                  <option key={brand} value={brand.toLowerCase()}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maintenance Condition
              </label>
              <select
                value={input.condition}
                onChange={(e) =>
                  setInput({ ...input, condition: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700 placeholder-gray-600"
              >
                <option value="" disabled className="text-gray-600">
                  Select condition
                </option>
                {conditions.map((cond) => (
                  <option key={cond.value} value={cond.value}>
                    {cond.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`p-4 rounded-lg ${estimate.statusColor}`}>
            <p className="font-semibold text-lg">{estimate.status}</p>
          </div>

          {/* Results */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {/* Monthly Estimate */}
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm text-gray-600">Monthly Maintenance Cost</p>
              <p className="text-2xl font-bold text-blue-600">
                ₹ {estimate.monthlyEstimate.toLocaleString("en-IN")}
              </p>
            </div>

            {/* Annual Estimate */}
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <p className="text-sm text-gray-600">Annual Maintenance Cost</p>
              <p className="text-2xl font-bold text-green-600">
                ₹ {estimate.estimatedAnnualCost.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* Next Services */}
          {estimate.nextServices.length > 0 && (
            <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
              <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Maintenance
              </h3>
              <ul className="space-y-2">
                {estimate.nextServices.map((service, idx) => (
                  <li key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-amber-900">{service.service}</span>
                    {service.kmRemaining > 0 && (
                      <span className="text-amber-700 font-medium">
                        {service.kmRemaining.toLocaleString()} km remaining
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Insights */}
          {estimate.insights.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Insights & Recommendations
              </h3>
              <ul className="space-y-2">
                {estimate.insights.map((insight, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Info Note */}
          <div className="bg-blue-50 p-4 rounded-lg flex gap-3 border-l-4 border-blue-500">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              These estimates are based on average service costs for Indian markets
              and may vary based on service center and specific car condition. Always
              consult your car's manual and authorized service center for accurate
              maintenance schedules.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceCalculator;
