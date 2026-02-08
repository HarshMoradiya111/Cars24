import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle, Lock } from "lucide-react";
import { useRouter } from "next/router";
import { resetPassword } from "@/services/userService";

const ResetPasswordPage = () => {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const queryToken = router.query?.token;
    if (typeof queryToken === "string") {
      setToken(queryToken);
    }
  }, [router.query?.token]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Reset token is missing.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess("Your password has been reset successfully.");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 text-black">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
        <p className="text-sm font-semibold text-orange-500">Account recovery</p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Set a new password</h1>
        <p className="mt-2 text-sm text-gray-600">
          Choose a strong password to secure your account.
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
            <div className="text-sm text-green-700">
              <p>{success}</p>
              <p className="mt-1">
                <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                  Go to login
                </Link>
              </p>
            </div>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              New password
            </label>
            <div className="mt-2 relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 pl-10 text-sm text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none"
                placeholder="Min 8 characters"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">
              Confirm password
            </label>
            <div className="mt-2 relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 pl-10 text-sm text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Reset password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
