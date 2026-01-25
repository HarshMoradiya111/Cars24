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
  userData: { fullName: string; phone: string }
) => {
  const response = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, ...userData }),
  });

  if (!response.ok) {
    throw new Error(`signup failed with HTTP ${response.status}`);
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
    throw new Error(`login failed with HTTP ${response.status}`);
  }

  const data = await response.json();
  return data?.user ? data : { user: data };
};

export const getUserById = async (userId: string) => {
  const response = await fetch(`${BASE_URL}/${userId}`);

  if (!response.ok) {
    throw new Error(`getUserById failed with HTTP ${response.status}`);
  }

  const data = await response.json();
  return data?.user ? data : { user: data };
};
