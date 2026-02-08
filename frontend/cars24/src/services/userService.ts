/**
 * Frontend API Client: User Authentication Service
 * 
 * This file contains HTTP client functions that communicate with the ASP.NET Core backend API.
 * It provides methods for user signup, login, and profile management via the backend.
 * 
 * Backend Endpoint: /api/UserAuth
 * Framework: ASP.NET Core Web API
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured");
}

const BASE_URL = `${API_BASE}/api/UserAuth`;

export const signup = async (
  email: string,
  password: string,
  userData: { fullName: string; phone: string; referralCode?: string }
) => {
  const response = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, ...userData }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const message = err?.message || `signup failed with HTTP ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();
  return data?.user ? data : { user: data };
};

export const login = async (email: string, password: string) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const message = err?.message || `login failed with HTTP ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();
  return data?.user ? data : { user: data };
};

export const forgotPassword = async (email: string) => {
  const response = await fetch(`${BASE_URL}/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const message = err?.message || `forgot-password failed with HTTP ${response.status}`;
    throw new Error(message);
  }

  return response.json();
};

export const resetPassword = async (token: string, newPassword: string) => {
  const response = await fetch(`${BASE_URL}/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, newPassword }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const message = err?.message || `reset-password failed with HTTP ${response.status}`;
    throw new Error(message);
  }

  return response.json();
};

export const getUserById = async (userId: string) => {
  const response = await fetch(`${BASE_URL}/${userId}`);

  if (!response.ok) {
    throw new Error(`getUserById failed with HTTP ${response.status}`);
  }

  const data = await response.json();
  return data?.user ? data : { user: data };
};

export const getWallet = async (userId: string) => {
  const response = await fetch(`${API_BASE}/api/user/${userId}/wallet`);
  if (response.status === 404) {
    return { points: 0, message: "Wallet not found" };
  }
  if (!response.ok) {
    throw new Error(`getWallet failed with HTTP ${response.status}`);
  }
  return response.json();
};

export const redeemWallet = async (userId: string) => {
  const response = await fetch(`${API_BASE}/api/user/${userId}/redeem`, {
    method: "POST",
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ message: "Redeem failed" }));
    throw new Error(err?.message || `redeem failed with HTTP ${response.status}`);
  }
  const result = await response.json();
  
  // Fetch updated user data to sync with AuthContext
  try {
    const userData = await getUserById(userId);
    return { ...result, user: userData?.user || userData };
  } catch (err) {
    return result; // Return redemption result if user fetch fails
  }
};

export const getRedemptions = async (userId: string) => {
  const response = await fetch(`${API_BASE}/api/user/${userId}/redemptions`);
  if (response.status === 404) {
    return []; // Return empty array if endpoint not found or no history
  }
  if (!response.ok) {
    throw new Error(`getRedemptions failed with HTTP ${response.status}`);
  }
  return response.json();
};
