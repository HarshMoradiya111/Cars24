import React from "react";
import Link from "next/link";
import { 
  Search, 
  Car, 
  DollarSign, 
  ClipboardCheck, 
  History, 
  CheckCircle,
  Wrench
} from "lucide-react";
import dynamic from "next/dynamic";

const MaintenanceCalculator = dynamic(
  () => import("./MaintenanceCalculator"),
  { ssr: false }
);

const actions = [
  {
    name: "Find car",
    icon: Search,
    href: "/buy-car",
    color: "bg-blue-50 text-blue-600",
  },
  {
    name: "Sell car",
    icon: Car,
    href: "/sell-car",
    color: "bg-green-50 text-green-600",
  },
  {
    name: "Car loan",
    icon: DollarSign,
    href: "/finance",
    color: "bg-purple-50 text-purple-600",
  },
  {
    name: "Test drive",
    icon: ClipboardCheck,
    href: "/test-drive",
    color: "bg-yellow-50 text-yellow-600",
  },
  {
    name: "Get car checked",
    icon: CheckCircle,
    href: "/car-inspection",
    color: "bg-red-50 text-red-600",
  },
  {
    name: "Vehicle history",
    icon: History,
    href: "/vehicle-history",
    color: "bg-indigo-50 text-indigo-600",
  },
];

export default function QuickActions() {
  const [showMaintenance, setShowMaintenance] = React.useState(false);

  return (
    <>
      <div className="py-8 px-4 sm:px-0 relative z-20 -mt-12">
        <div className="flex flex-wrap justify-center bg-white rounded-lg shadow-md p-4 mx-auto max-w-6xl">
          {actions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="w-1/2 sm:w-1/3 lg:w-1/6 p-3 text-center transition-transform hover:scale-105"
            >
              <div className="flex flex-col items-center">
                <div className={`${action.color} p-3 rounded-full mb-2`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {action.name}
                </span>
              </div>
            </Link>
          ))}
          <button
            onClick={() => setShowMaintenance(true)}
            className="w-1/2 sm:w-1/3 lg:w-1/6 p-3 text-center transition-transform hover:scale-105"
          >
            <div className="flex flex-col items-center">
              <div className="bg-orange-50 text-orange-600 p-3 rounded-full mb-2">
                <Wrench className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Maintenance
              </span>
            </div>
          </button>
        </div>
      </div>

      {showMaintenance && (
        <MaintenanceCalculator />
      )}
    </>
  );
}
