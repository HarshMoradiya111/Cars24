const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured");
}

const BASE_URL = `${API_BASE}/api/servicebookings`;

export const createServiceBooking = async (userId: string, bookingData: any) => {
  const response = await fetch(`${BASE_URL}?userId=${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Failed to create service booking (${response.status})`);
  }

  return response.json();
};

export const getServiceBookingById = async (bookingId: string) => {
  const response = await fetch(`${BASE_URL}/${bookingId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch service booking: ${response.statusText}`);
  }

  return response.json();
};

export const getServiceBookingsByUserId = async (userId: string) => {
  const response = await fetch(`${BASE_URL}/user/${userId}/bookings`);

  if (!response.ok) {
    throw new Error(`Failed to fetch user service bookings: ${response.statusText}`);
  }

  return response.json();
};

export const getAllServiceBookings = async () => {
  const response = await fetch(BASE_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch service bookings: ${response.statusText}`);
  }

  return response.json();
};
