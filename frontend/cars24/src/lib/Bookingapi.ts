/**
 * Frontend API Client: Booking Service
 * 
 * This file contains HTTP client functions that communicate with the ASP.NET Core backend API.
 * It provides methods to create and manage car bookings via the backend.
 * 
 * Backend Endpoint: /api/Booking
 * Framework: ASP.NET Core Web API
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured");
}

const BASE_URL = `${API_BASE}/api/Booking`;

export const createBooking = async (userid: string, Booking: any) => {
  const response = await fetch(`${BASE_URL}?userId=${userid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Booking),
  });

  if (!response.ok) {
    throw new Error(`createBooking failed with HTTP ${response.status}`);
  }

  return response.json();
};

export const getBookingbyid = async (id: string) => {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error(`getBookingbyid failed with HTTP ${response.status}`);
  }

  return response.json();
};
export const getBookingbyuser = async (userId: string) => {
  const response = await fetch(`${BASE_URL}/user/${userId}/bookings`);
  if (!response.ok) {
    throw new Error(`getBookingbyuser failed with HTTP ${response.status}`);
  }

  return response.json();
};
