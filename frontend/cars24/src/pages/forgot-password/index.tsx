import React, { useState } from "react";
import Link from "next/link";
import * as api from "@/services/userService";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setError(null);
    setResetUrl(null);
    setLoading(true);
    try {
      const res = await api.requestPasswordReset(email.trim(), window.location.origin);
      setStatus(res?.message || "If the account exists, a reset link has been sent.");
      if (res?.resetUrl) {
        setResetUrl(res.resetUrl);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to request password reset";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
        <p className="text-sm font-semibold text-orange-500">Account recovery</p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Reset your password</h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter the email you used to sign up. We will send a reset link if the account exists.
        </p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>
          {status ? (
            <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{status}</p>
          ) : null}
          {error ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}
          {resetUrl ? (
            <div className="rounded-md bg-blue-50 px-4 py-3 border border-blue-200">
              <p className="text-sm font-medium text-blue-900 mb-2">Dev Reset Link:</p>
              <a className="block text-blue-600 hover:text-blue-800 break-all underline text-sm" href={resetUrl}>{resetUrl}</a>
            </div>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-60"
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
