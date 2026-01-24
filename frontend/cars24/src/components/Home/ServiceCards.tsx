import Link from "next/link";
import { ChevronRight, Calendar, Percent, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    id: 1,
    title: "Drive home your dream car",
    description: "Choose from our wide range of certified used cars",
    icon: Calendar,
    color: "bg-blue-600",
    link: "/buy-car",
    linkText: "View all cars",
    features: [
      "7-day money back guarantee",
      "6-month warranty",
      "No paperwork hassle"
    ]
  },
  {
    id: 2,
    title: "Make your dreams real with a personal loan",
    description: "Quick approvals with flexible repayment options",
    icon: Percent,
    color: "bg-indigo-600",
    link: "/finance",
    linkText: "Apply now",
    features: [
      "Competitive interest rates",
      "No hidden charges",
      "Instant approvals"
    ]
  },
  {
    id: 3,
    title: "All your credit card options in one place",
    description: "Compare and apply for the best credit cards",
    icon: CreditCard,
    color: "bg-gray-800",
    link: "/credit-cards",
    linkText: "Apply now",
    features: [
      "Multiple card options",
      "Exclusive rewards",
      "Instant approval"
    ]
  }
];

export default function ServiceCards() {
  return (
    <div className="py-8 sm:py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {services.map((service) => (
          <div 
            key={service.id}
            className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100"
          >
            <div className={`${service.color} px-4 sm:px-6 py-6 sm:py-8 text-white relative min-h-32 sm:h-40 flex flex-col justify-start`}>
              <service.icon className="h-6 w-6 sm:h-8 sm:w-8 mb-2 sm:mb-3" />
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1">{service.title}</h3>
              <p className="text-xs sm:text-sm opacity-90 line-clamp-2">{service.description}</p>
            </div>
            <div className="p-4 sm:p-6 bg-white">
              <ul className="mb-3 sm:mb-4 space-y-1.5">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-black">
                    <span className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-green-500 mt-1"></span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href={service.link}>
                <Button variant="outline" className="w-full justify-between text-blue-500 text-xs sm:text-sm">
                  {service.linkText}
                  <ChevronRight className="h-4 w-4 ml-2 flex-shrink-0" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}