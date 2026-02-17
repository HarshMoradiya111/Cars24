import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Mail, Phone, MapPin } from "lucide-react";

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
  { name: "Privacy Policy", href: "/privacy" },
];

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com/cars24", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com/cars24", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com/cars24", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com/cars24", label: "Youtube" },
  { icon: Linkedin, href: "https://linkedin.com/company/cars24", label: "LinkedIn" },
];

const countries = [
  { name: "India", flag: "https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg" },
  { name: "UAE", flag: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_United_Arab_Emirates.svg" },
  { name: "Australia", flag: "https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Australia_%28converted%29.svg" },
  { name: "Thailand", flag: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Flag_of_Thailand.svg" },
];

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Top Section: Logo and Description */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-4">
            <div className="flex items-center mb-3">
              <span className="bg-blue-600 text-white font-bold py-2 px-3 rounded-md text-xl">
                CARS
              </span>
              <span className="text-orange-500 font-bold text-xl">24</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">better drives, better lives</p>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Your trusted partner for buying and selling quality used cars. We ensure transparency, 
              reliability, and the best deals in the automotive market.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Customer Support</p>
                  <a href="tel:1800-123-4567" className="text-sm text-blue-600 hover:underline">1800-123-4567</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email Us</p>
                  <a href="mailto:support@cars24.com" className="text-sm text-blue-600 hover:underline">support@cars24.com</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Headquarters</p>
                  <p className="text-sm text-gray-600">Gurugram, Haryana, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b-2 border-blue-600 inline-block">
                Company
              </h3>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b-2 border-blue-600 inline-block">
                Discover
              </h3>
              <ul className="space-y-3">
                {discoverLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b-2 border-blue-600 inline-block">
                Support
              </h3>
              <ul className="space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Global Presence */}
        <div className="py-8 border-b border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 text-center uppercase tracking-wider mb-6">
            Global Presence
          </h3>
          <div className="flex flex-wrap justify-center gap-6">
            {countries.map((country) => (
              <div key={country.name} className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <img
                  src={country.flag}
                  alt={country.name}
                  className="h-5 w-8 rounded object-cover"
                />
                <span className="text-sm font-medium text-gray-700">{country.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section: Copyright and Social */}
        <div className="pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-center sm:text-left">
              <p className="text-sm text-gray-600">
                © 2026 Cars24. All rights reserved.
              </p>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy</Link>
                <span className="text-gray-400">•</span>
                <Link href="/terms" className="hover:text-blue-600 transition-colors">Terms</Link>
                <span className="text-gray-400">•</span>
                <Link href="/sitemap" className="hover:text-blue-600 transition-colors">Sitemap</Link>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-sm font-medium text-gray-700">Follow Us:</span>
              <div className="flex gap-4">
                {socialLinks.map((link, idx) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={idx}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="bg-white border border-gray-200 p-2 rounded-full text-gray-600 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
