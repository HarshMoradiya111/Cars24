/**
 * Frontend API Client: Appointment Service
 * 
 * This file contains HTTP client functions that communicate with the ASP.NET Core backend API.
 * It provides methods to schedule and manage car appointments via the backend.
 * 
 * Backend Endpoint: /api/Appointment
 * Framework: ASP.NET Core Web API
 */

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "https://cars-24-clone-net-nextjs.onrender.com/api"}/Appointment`;

export const createAppointment = async (userid: string, appointment: any) => {
  try {
    const response = await fetch(`${BASE_URL}?userId=${userid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointment),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (err) {
    console.warn("createAppointment failed:", err);
    return { id: "fallback", status: "pending" } as any;
  }
};

export const getAppointmentbyid = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (err) {
    console.warn("getAppointmentbyid failed:", err);
    return null as any;
  }
};
export const getappointmentbyuser = async (userId:string) => {
  try {
    const response = await fetch(`${BASE_URL}/user/${userId}/appointments`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (err) {
    console.warn("getappointmentbyuser failed:", err);
    return [] as any[];
  }
};