/**
 * Frontend API Client: Appointment Service
 * 
 * This file contains HTTP client functions that communicate with the ASP.NET Core backend API.
 * It provides methods to schedule and manage car appointments via the backend.
 * 
 * Backend Endpoint: /api/Appointment
 * Framework: ASP.NET Core Web API
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured");
}

const BASE_URL = `${API_BASE}/api/Appointment`;

export const createAppointment = async (userid: string, appointment: any) => {
  const response = await fetch(`${BASE_URL}?userId=${userid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(appointment),
  });

  if (!response.ok) {
    throw new Error(`createAppointment failed with HTTP ${response.status}`);
  }

  return response.json();
};

export const getAppointmentbyid = async (id: string) => {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error(`getAppointmentbyid failed with HTTP ${response.status}`);
  }

  return response.json();
};
export const getappointmentbyuser = async (userId:string) => {
  const response = await fetch(`${BASE_URL}/user/${userId}/appointments`);
  if (!response.ok) {
    throw new Error(`getappointmentbyuser failed with HTTP ${response.status}`);
  }

  return response.json();
};
export const cancelAppointment = async (appointmentId: string) => {
  const response = await fetch(\/\, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(cancelAppointment failed with HTTP \);
  }

  return response.json();
};
