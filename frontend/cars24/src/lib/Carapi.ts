/**
 * Frontend API Client: Car Service
 * 
 * This file contains HTTP client functions that communicate with the ASP.NET Core backend API.
 * It provides methods to fetch and manage car-related data from the backend.
 * 
 * Backend Endpoint: /api/Car
 * Framework: ASP.NET Core Web API
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured");
}

const BASE_URL = `${API_BASE}/api/Car`;

type CarDetails = {
  title: string;
  images: string[];
  price: string;
  emi: string;
  location: string;
  specs: {
    year: number;
    km: string;
    fuel: string;
    transmission: string;
    owner: string;
    insurance: string;
  };
  features: string[];
  highlights: string[];
};
export const createCar = async (carDetails: CarDetails) => {
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(carDetails),
  });

  if (!response.ok) {
    throw new Error(`createCar failed with HTTP ${response.status}`);
  }

  return response.json();
};
export const getcarByid = async (id: string, opts?: { userLocation?: string; fuelIndex?: number }) => {
  const params = new URLSearchParams();
  if (opts?.userLocation) params.set("userLocation", opts.userLocation);
  if (typeof opts?.fuelIndex === "number") params.set("fuelIndex", String(opts.fuelIndex));
  const qs = params.toString();

  const response = await fetch(`${BASE_URL}/${id}${qs ? `?${qs}` : ""}`);
  if (!response.ok) {
    throw new Error(`getcarByid failed with HTTP ${response.status}`);
  }

  return response.json();
};
export const getcarSummaries = async (opts?: { userLocation?: string; fuelIndex?: number }) => {
  const params = new URLSearchParams();
  if (opts?.userLocation) params.set("userLocation", opts.userLocation);
  if (typeof opts?.fuelIndex === "number") params.set("fuelIndex", String(opts.fuelIndex));
  const qs = params.toString();

  const response = await fetch(`${BASE_URL}/summaries${qs ? `?${qs}` : ""}`);
  if (!response.ok) {
    throw new Error(`getcarSummaries failed with HTTP ${response.status}`);
  }

  return response.json();
};

export const deleteCar = async (id: string) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`deleteCar failed with HTTP ${response.status}`);
  }

  return response.json();
};

export const removeDuplicates = async () => {
  const response = await fetch(`${BASE_URL}/remove-duplicates`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`removeDuplicates failed with HTTP ${response.status}`);
  }

  return response.json();
};
