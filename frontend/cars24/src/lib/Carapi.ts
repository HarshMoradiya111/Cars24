/**
 * Frontend API Client: Car Service
 * 
 * This file contains HTTP client functions that communicate with the ASP.NET Core backend API.
 * It provides methods to fetch and manage car-related data from the backend.
 * 
 * Backend Endpoint: /api/Car
 * Framework: ASP.NET Core Web API
 */

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "https://cars-24-clone-net-nextjs.onrender.com/api"}/Car`;

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
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(carDetails),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (err) {
    console.warn("createCar failed:", err);
    return null as any;
  }
};
export const getcarByid = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (err) {
    console.warn("getcarByid failed:", err);
    return null as any;
  }
};
export const getcarSummaries = async () => {
  try {
    const response = await fetch(`${BASE_URL}/summaries`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (err) {
    console.warn("getcarSummaries failed:", err);
    return [] as any[];
  }
};
