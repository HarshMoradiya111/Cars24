import { fetchWithRetry } from '../utils/fetchWithRetry';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured");
}

const BASE_URL = `${API_BASE}/api/Booking`;

export const createBooking = async (userid: string, Booking: any) => {
  const response = await fetchWithRetry(`${BASE_URL}?userId=${userid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Booking),
    timeout: 8000,
    retries: 1,
    logLabel: "BookingAPI.create",
  });

  return response.json();
};

export const getBookingbyid = async (id: string) => {
  const response = await fetchWithRetry(`${BASE_URL}/${id}`, {
    timeout: 8000,
    retries: 1,
    logLabel: "BookingAPI.getById",
  });

  return response.json();
};
export const getBookingbyuser = async (userId: string) => {
  const response = await fetchWithRetry(`${BASE_URL}/user/${userId}/bookings`, {
    timeout: 15000,
    retries: 1,
    logLabel: "BookingAPI.getByUser",
  });

  return response.json();
};
