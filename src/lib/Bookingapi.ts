const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "https://cars-24-clone-net-nextjs.onrender.com/api"}/Booking`;

export const createBooking = async (userid: string, Booking: any) => {
  try {
    const response = await fetch(`${BASE_URL}?userId=${userid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Booking),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (err) {
    console.warn("createBooking failed:", err);
    return { id: "fallback", status: "pending" } as any;
  }
};

export const getBookingbyid = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (err) {
    console.warn("getBookingbyid failed:", err);
    return null as any;
  }
};
export const getBookingbyuser = async (userId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/user/${userId}/bookings`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (err) {
    console.warn("getBookingbyuser failed:", err);
    return [] as any[];
  }
};
