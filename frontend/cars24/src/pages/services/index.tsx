"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Wrench,
  Shield,
  Calendar,
  CheckCircle2,
  Star,
  Clock,
  MapPin,
  Phone,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const services = [
  {
    id: 1,
    name: "General Service",
    description:
      "Complete car checkup including oil change, filter replacement, and basic inspection",
    price: "₹2,499",
    duration: "2-3 hours",
    icon: Wrench,
    includes: [
      "Engine Oil Change",
      "Oil Filter Replacement",
      "Air Filter Check",
      "Battery Check",
      "Brake Inspection",
    ],
  },
  {
    id: 2,
    name: "Comprehensive Service",
    description:
      "Detailed inspection and servicing of all major car components",
    price: "₹4,999",
    duration: "4-5 hours",
    icon: Shield,
    includes: [
      "All General Service items",
      "Brake Pad Replacement",
      "Coolant Top-up",
      "AC Service",
      "Wheel Alignment",
    ],
  },
  {
    id: 3,
    name: "AC Service",
    description: "Complete AC system service for optimal cooling performance",
    price: "₹1,499",
    duration: "1-2 hours",
    icon: Wrench,
    includes: [
      "AC Gas Refill",
      "Filter Cleaning",
      "Cooling Check",
      "Vent Cleaning",
      "Performance Test",
    ],
  },
  {
    id: 4,
    name: "Denting & Painting",
    description: "Professional denting and painting services for your car",
    price: "₹3,999+",
    duration: "2-3 days",
    icon: Wrench,
    includes: [
      "Body Dent Repair",
      "Scratch Removal",
      "Panel Painting",
      "Polish & Wax",
      "Quality Check",
    ],
  },
  {
    id: 5,
    name: "Battery Replacement",
    description: "High-quality battery replacement with warranty",
    price: "₹4,500+",
    duration: "30 minutes",
    icon: Shield,
    includes: [
      "Battery Removal",
      "New Battery Installation",
      "Terminal Cleaning",
      "Charging Test",
      "1-Year Warranty",
    ],
  },
  {
    id: 6,
    name: "Wheel Care",
    description: "Complete wheel alignment, balancing, and tire services",
    price: "₹899",
    duration: "1 hour",
    icon: Wrench,
    includes: [
      "Wheel Alignment",
      "Wheel Balancing",
      "Tire Pressure Check",
      "Rotation Service",
      "Visual Inspection",
    ],
  },
];

const benefits = [
  {
    icon: Shield,
    title: "Certified Technicians",
    description: "Expert mechanics with years of experience",
  },
  {
    icon: CheckCircle2,
    title: "Genuine Parts",
    description: "Only authentic spare parts used",
  },
  {
    icon: Calendar,
    title: "Free Pickup & Drop",
    description: "Hassle-free doorstep service",
  },
  {
    icon: Star,
    title: "Quality Guarantee",
    description: "100% satisfaction guaranteed",
  },
];

const ServicesPage = () => {
  const handleBookService = (service: typeof services[0]) => {
    alert(`Service Booking Details:\n\nService: ${service.name}\nPrice: ${service.price}\nDuration: ${service.duration}\n\nWhat's Included:\n${service.includes.map((item, i) => `${i + 1}. ${item}`).join('\n')}\n\nThank you for choosing our service! Our team will contact you shortly to confirm your appointment.`);
  };

  const handleCallUs = () => {
    alert('Calling Customer Service: 1800-123-4567\n\nOur service advisors are available 24/7 to help you!');
  };

  const handleFindServiceCenter = () => {
    alert('Service Centers Near You:\n\n1. Cars24 Service Center - Sector 18, Noida\n2. Cars24 Service Center - Connaught Place, Delhi\n3. Cars24 Service Center - MG Road, Gurgaon\n\nWould you like directions to the nearest center?');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Car Services & Repairs
          </h1>
          <p className="text-xl text-green-100 max-w-2xl">
            Professional car servicing at your doorstep with transparent pricing
            and quality assurance
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Benefits Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm text-center">
              <benefit.icon className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Services Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Our Services
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <service.icon className="w-10 h-10 text-green-600" />
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {service.price}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center justify-end gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {service.duration}
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {service.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {service.description}
                </p>

                <div className="border-t pt-4 mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    What's Included:
                  </p>
                  <ul className="space-y-1">
                    {service.includes.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  onClick={() => handleBookService(service)}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Book Service
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: 1,
                title: "Book Online",
                description: "Choose service and book appointment",
              },
              {
                step: 2,
                title: "Free Pickup",
                description: "We pick up your car from doorstep",
              },
              {
                step: 3,
                title: "Expert Service",
                description: "Certified mechanics service your car",
              },
              {
                step: 4,
                title: "Delivery",
                description: "Car delivered back to you",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg p-8 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Need Help Choosing a Service?
              </h2>
              <p className="text-green-100 mb-6">
                Our service advisors are available 24/7 to help you select the
                right service for your car
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleCallUs}
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Us Now
                </Button>
                <Button
                  onClick={handleFindServiceCenter}
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-green-700"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Find Service Center
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                <h3 className="font-semibold mb-4">Why Choose Us?</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Transparent Pricing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>90-Day Service Warranty</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Real-time Service Updates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Genuine Spare Parts</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
