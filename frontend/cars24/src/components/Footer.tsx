import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";

const companyLinks = [
  { name: "About Us", href: "/about" },
  { name: "Investors", href: "/investors" },
  { name: "Press Kit", href: "/press" },
  { name: "Careers", href: "/careers" },
  { name: "News", href: "/news" },
  { name: "Sustainability", href: "/sustainability" },
];

const discoverLinks = [
  { name: "Buy used car", href: "/buy-used-car" },
  { name: "Sell used car", href: "/sell-used-car" },
  { name: "Used car valuation", href: "/valuation" },
  { name: "Service centers", href: "/service-centers" },
  { name: "Check vehicle details", href: "/vehicle-details" },
  { name: "Scrap your car", href: "/scrap-car" },
];

const supportLinks = [
  { name: "FAQs", href: "/faqs" },
  { name: "Security", href: "/security" },
  { name: "Contact us", href: "/contact" },
  { name: "Customer charter", href: "/customer-charter" },
  { name: "Terms & conditions", href: "/terms" },
];

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com" },
  { icon: Twitter, href: "https://twitter.com" },
  { icon: Instagram, href: "https://instagram.com" },
  { icon: Youtube, href: "https://youtube.com" },
  { icon: Linkedin, href: "https://linkedin.com" },
];

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col items-center mb-8 sm:mb-12">
          <div className="flex items-center mb-2">
            <span className="bg-blue-600 text-white font-bold py-1 px-1.5 sm:px-2 rounded-md text-sm sm:text-lg">
              CARS
            </span>
            <span className="text-orange-500 font-bold text-sm sm:text-lg">24</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600">better drives, better lives</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12">
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase mb-3 sm:mb-4">
              Company
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-xs sm:text-sm text-gray-600 hover:text-blue-600">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase mb-3 sm:mb-4">
              Discover
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {discoverLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-xs sm:text-sm text-gray-600 hover:text-blue-600">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase mb-3 sm:mb-4">
              Support
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-xs sm:text-sm text-gray-600 hover:text-blue-600">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center border-t border-gray-200 pt-6 sm:pt-8 gap-4 sm:gap-0">
          <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
            © 2026 Cars24. All rights reserved.
          </p>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 sm:items-center w-full sm:w-auto">
            <span className="text-xs sm:text-sm text-gray-500 text-center sm:text-right sm:mr-4">Follow Us</span>
            <div className="flex justify-center space-x-4">
              {socialLinks.map((link, idx) => {
                const Icon = link.icon;
                return (
                  <Link key={idx} href={link.href} className="text-gray-400 hover:text-gray-500">
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 border-t border-gray-200 pt-6 sm:pt-8">
          <p className="text-xs sm:text-sm text-gray-500 text-center font-medium uppercase">Global presence</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-3 sm:mt-4">
            <div className="flex items-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg"
                alt="India"
                className="h-4 w-6 rounded mr-2"
              />
              <span className="text-xs text-gray-500">India</span>
            </div>
            <div className="flex items-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_United_Arab_Emirates.svg"
                alt="UAE"
                className="h-4 w-6 rounded mr-2"
              />
              <span className="text-xs text-gray-500">UAE</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
