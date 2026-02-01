import React, { useState } from "react";
import Link from "next/link";
import { Search, Car, DollarSign, ClipboardCheck, CheckCircle, History, Wrench } from "lucide-react";
import dynamic from "next/dynamic";

const MaintenanceCalculator = dynamic(
  () => import("./MaintenanceCalculator"),
  { ssr: false }
);

const actions = [
  { name: "Find car", icon: Search, href: "/buy-car", color: "bg-blue-50 text-blue-600" },
  { name: "Sell car", icon: Car, href: "/sell-car", color: "bg-green-50 text-green-600" },
  { name: "Car loan", icon: DollarSign, href: "/finance", color: "bg-purple-50 text-purple-600" },
  { name: "Test drive", icon: ClipboardCheck, href: "/test-drive", color: "bg-yellow-50 text-yellow-600" },
  { name: "Get checked", icon: CheckCircle, href: "/car-inspection", color: "bg-red-50 text-red-600" },
  { name: "Vehicle history", icon: History, href: "/vehicle-history", color: "bg-indigo-50 text-indigo-600" },
];

export default function QuickActions() {
  const [showMaintenance, setShowMaintenance] = useState(false);

  const actionItem = ({ name, icon: Icon, href, color }: typeof actions[0]) => (
    <Link href={href} className="flex-1 min-w-[calc(50%-0.375rem)] sm:min-w-[calc(33.333%-0.375rem)] lg:flex-none lg:w-[calc(16.666%-0.625rem)] p-2 sm:p-3 text-center hover:scale-105">
      <div className="flex flex-col items-center gap-1.5 sm:gap-2">
        <div className={`${color} p-2.5 sm:p-3 rounded-full`}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <span className="text-xs sm:text-sm font-medium text-gray-700 line-clamp-2">
          {name}
        </span>
      </div>
    </Link>
  );

  return (
    <>
      <div className="py-6 sm:py-8 px-0 relative z-20 -mt-10 sm:-mt-12">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 bg-white rounded-lg shadow-md p-3 sm:p-4 mx-auto max-w-6xl">
          {actions.map((action) => (
            <div key={action.name}>
              {actionItem(action)}
            </div>
          ))}
          <button
            onClick={() => setShowMaintenance(true)}
            className="flex-1 min-w-[calc(50%-0.375rem)] sm:min-w-[calc(33.333%-0.375rem)] lg:flex-none lg:w-[calc(16.666%-0.625rem)] p-2 sm:p-3 text-center hover:scale-105"
          >
            <div className="flex flex-col items-center gap-1.5 sm:gap-2">
              <div className="bg-orange-50 text-orange-600 p-2.5 sm:p-3 rounded-full">
                <Wrench className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 line-clamp-2">
                Maintenance
              </span>
            </div>
          </button>
        </div>
      </div>

      {showMaintenance && <MaintenanceCalculator />}
    </>
  );
}
