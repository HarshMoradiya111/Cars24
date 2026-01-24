import React from "react";
import Link from "next/link";

const ForgotPasswordPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
      <p className="text-sm font-semibold text-orange-500">Account recovery</p>
      <h1 className="mt-2 text-2xl font-bold text-gray-900">Reset your password</h1>
      <p className="mt-2 text-sm text-gray-600">
        Enter the email you used to sign up. We will send a reset link if the account exists.
      </p>
      <form className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none"
            placeholder="you@example.com"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
        >
          Send reset link
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

export default ForgotPasswordPage;
