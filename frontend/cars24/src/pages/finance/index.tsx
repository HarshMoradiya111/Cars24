"use client";
import React, { useState } from "react";
import {
  Calculator,
  Check,
  CreditCard,
  FileText,
  TrendingUp,
  DollarSign,
  Percent,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/context/AuthContext";
import { loanApplicationApi } from "@/lib/loanApplicationApi";
import { toast } from "sonner";
import { useRouter } from "next/router";

const FinancePage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(9.5);
  const [tenure, setTenure] = useState(5);

  const handleApplyLoan = () => {
    if (!user?.id) {
      toast.error("Please login to apply for a loan");
      router.push("/login");
      return;
    }

    const emi = calculateEMI();
    const totalAmount = emi * tenure * 12;
    const totalInterest = totalAmount - loanAmount;

    router.push({
      pathname: "/finance/apply",
      query: {
        loanAmount,
        interestRate,
        tenure,
        emi,
        totalAmount,
        totalInterest,
      },
    });
  };

  const calculateEMI = () => {
    const principal = loanAmount;
    const rate = interestRate / 12 / 100;
    const time = tenure * 12;
    const emi =
      (principal * rate * Math.pow(1 + rate, time)) /
      (Math.pow(1 + rate, time) - 1);
    return Math.round(emi);
  };

  const emi = calculateEMI();
  const totalAmount = emi * tenure * 12;
  const totalInterest = totalAmount - loanAmount;

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Car Finance Made Easy
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Get instant car loans at competitive interest rates. Apply online
            and get approved within 24 hours.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">EMI Calculator</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Amount
                </label>
                <Input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="mb-2 placeholder:text-black text-black"
                />
                <Slider
                  value={[loanAmount]}
                  onValueChange={(value) => setLoanAmount(value[0])}
                  max={5000000}
                  min={100000}
                  step={50000}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₹1L</span>
                  <span>₹50L</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interest Rate (% per annum)
                </label>
                <Input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  step="0.1"
                  className="mb-2 placeholder:text-black text-black"
                />
                <Slider
                  value={[interestRate]}
                  onValueChange={(value) => setInterestRate(value[0])}
                  max={20}
                  min={5}
                  step={0.1}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5%</span>
                  <span>20%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Tenure (Years)
                </label>
                <Input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="mb-2 placeholder:text-black text-black"
                />
                <Slider
                  value={[tenure]}
                  onValueChange={(value) => setTenure(value[0])}
                  max={7}
                  min={1}
                  step={1}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 Year</span>
                  <span>7 Years</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Monthly EMI
              </h3>
              <div className="text-4xl font-bold text-blue-600 mb-6">
                ₹{emi.toLocaleString("en-IN")}
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Principal Amount:</span>
                  <span className="font-semibold">
                    ₹{loanAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Interest:</span>
                  <span className="font-semibold">
                    ₹{totalInterest.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-900 font-medium">
                    Total Amount:
                  </span>
                  <span className="font-bold text-gray-900">
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <Button 
                onClick={handleApplyLoan}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
              >
                Apply for Loan
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <TrendingUp className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Competitive Rates
            </h3>
            <p className="text-gray-600">
              Get the best interest rates starting from 7.5% per annum
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <FileText className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Minimal Documentation
            </h3>
            <p className="text-gray-600">
              Quick approval with minimal paperwork and hassle-free process
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <CreditCard className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Flexible Tenure
            </h3>
            <p className="text-gray-600">
              Choose a repayment tenure from 1 to 7 years as per your comfort
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: 1, title: "Choose Your Car", icon: CreditCard },
              { step: 2, title: "Apply Online", icon: FileText },
              { step: 3, title: "Get Approved", icon: Check },
              { step: 4, title: "Drive Home", icon: TrendingUp },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancePage;
