import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import * as api from "@/services/userService";

const ResetPasswordPage = () => {
  const router = useRouter();
  const token = useMemo(() => {
    const raw = router.query.token;
    return Array.isArray(raw) ? raw[0] : raw || "";
  }, [router.query.token]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setError(null);
    if (!token) {
      setError("Missing reset token");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await api.resetPassword(token, password);
      setStatus(res?.message || "Password reset successful");
      setPassword("");
      setConfirm("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to reset password";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
        <p className="text-sm font-semibold text-orange-500">Account recovery</p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Choose a new password</h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter your new password below. If your reset link expired, request a new one.
        </p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              New password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="confirm">
              Confirm password
            </label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              required
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none"
              placeholder="Confirm new password"
            />
          </div>
          {status ? (
            <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{status}</p>
          ) : null}
          {error ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Reset password"}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          Back to <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
