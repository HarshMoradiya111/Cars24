import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Clock, ArrowLeft } from "lucide-react";

const ContactPage = () => {
  const router = useRouter();
  const { car, inquiry } = router.query;
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    car: "",
    message: "",
    preferredDate: "",
    preferredTime: "",
  });

  useEffect(() => {
    if (car) {
      setFormData((prev) => ({ ...prev, car: car as string }));
    }
    if (inquiry === "testdrive") {
      setFormData((prev) => ({
        ...prev,
        message: "I would like to schedule a test drive for this vehicle.",
      }));
    }
  }, [car, inquiry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Simulate form submission
    toast.success("Thank you! Our team will contact you soon to schedule your test drive.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      car: car as string || "",
      message: "",
      preferredDate: "",
      preferredTime: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900">
      <div className="mx-auto max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="mb-8">
          <p className="text-sm font-semibold text-orange-500">Contact</p>
          <h1 className="text-3xl font-bold">Get in touch</h1>
          <p className="mt-2 text-sm text-gray-600">
            {inquiry === "testdrive" 
              ? "Schedule a test drive with our team. We'll contact you to confirm the date and time."
              : "Questions about buying, selling, or services? We are here to help."}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">
                {inquiry === "testdrive" ? "Schedule Test Drive" : "Send us a message"}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Your phone number"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                {car && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interested Car
                    </label>
                    <Input
                      type="text"
                      name="car"
                      value={formData.car}
                      onChange={handleChange}
                      placeholder="Car model"
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                )}

                {inquiry === "testdrive" && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Date
                      </label>
                      <Input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Time
                      </label>
                      <Input
                        type="time"
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Tell us more about your requirements..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  {inquiry === "testdrive" ? "Schedule Test Drive" : "Send Message"}
                </Button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <a href="tel:+919000000000" className="text-sm text-gray-600 hover:text-orange-600">
                      +91-90000-00000
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <a href="mailto:support@cars24.example" className="text-sm text-gray-600 hover:text-orange-600">
                      support@cars24.example
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Address</p>
                    <p className="text-sm text-gray-600">
                      Metro Walk Mall, Rohini<br />
                      New Delhi, India
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Hours</p>
                    <p className="text-sm text-gray-600">
                      Mon - Sat: 9 AM - 9 PM<br />
                      Sunday: 10 AM - 6 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {inquiry === "testdrive" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Test drives are subject to availability. 
                  Our team will confirm your preferred date and time within 24 hours.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
