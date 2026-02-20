import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { loanApplicationApi } from "@/lib/loanApplicationApi";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const ApplyLoanPage = () => {
  const { user, authReady } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const loanAmount = Number(router.query.loanAmount) || 0;
  const interestRate = Number(router.query.interestRate) || 0;
  const tenure = Number(router.query.tenure) || 0;
  const emi = Number(router.query.emi) || 0;
  const totalAmount = Number(router.query.totalAmount) || 0;
  const totalInterest = Number(router.query.totalInterest) || 0;

  useEffect(() => {
    if (!authReady) return;
    if (!user?.id) {
      toast.error("Please login to apply for a loan");
      router.push("/login");
    }
  }, [authReady, user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors = { name: "", phone: "", email: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = "Name should contain only letters";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const applicationData = {
        userId: user?.id,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        loanAmount: loanAmount,
        interestRate: interestRate,
        tenure: tenure,
        monthlyEMI: emi,
        totalAmount: totalAmount,
        totalInterest: totalInterest,
      };

      await loanApplicationApi.createLoanApplication(applicationData);

      toast.success(
        "Loan application submitted successfully! Our team will contact you shortly."
      );

      // Redirect back to finance page
      setTimeout(() => {
        router.push("/finance");
      }, 2000);
    } catch (error: any) {
      console.error("Error submitting loan application:", error);
      toast.error(error.message || "Failed to submit loan application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.push("/finance")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Finance
        </button>

        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Loan Application Form
          </h1>
          <p className="text-gray-600 mb-8">
            Fill in your details and our team will contact you regarding your loan application.
          </p>

          <form onSubmit={handleSubmitApplication} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full text-gray-900 placeholder:text-gray-500"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="10-digit mobile number"
                className="w-full text-gray-900 placeholder:text-gray-500"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                className="w-full text-gray-900 placeholder:text-gray-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="bg-blue-50 rounded-lg p-6 space-y-3">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Loan Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Loan Amount</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ₹{loanAmount.toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Interest Rate</p>
                  <p className="text-lg font-semibold text-gray-900">{interestRate}% p.a.</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tenure</p>
                  <p className="text-lg font-semibold text-gray-900">{tenure} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monthly EMI</p>
                  <p className="text-lg font-bold text-blue-600">
                    ₹{emi.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Interest:</span>
                  <span className="font-semibold text-gray-900">
                    ₹{totalInterest.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-900 font-medium">Total Amount Payable:</span>
                  <span className="font-bold text-gray-900">
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/finance")}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyLoanPage;
