import React, { useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle, Mail } from "lucide-react";
import { forgotPassword } from "@/services/userService";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await forgotPassword(email);
      setSuccess("If an account exists, a reset link has been sent to your email.");
    } catch (err: any) {
      setError(err?.message || "Failed to request password reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 text-black">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
        <p className="text-sm font-semibold text-orange-500">Account recovery</p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Reset your password</h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter the email you used to sign up. We will send a reset link if the account exists.
        </p>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4 flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-4 flex gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email address
            </label>
            <div className="mt-2 relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 pl-10 text-sm text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          Remembered your password?{" "}
          <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
