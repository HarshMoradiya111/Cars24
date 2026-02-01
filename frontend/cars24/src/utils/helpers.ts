import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Try to detect an approximate city/region from IP without requiring keys.
// Uses a public endpoint; failures are silently ignored.
export async function detectLocationFromIP(): Promise<string | null> {
  try {
    const resp = await fetch("https://ipapi.co/json/");
    if (!resp.ok) return null;
    const data = await resp.json();
    const city = data?.city;
    const region = data?.region;
    const country = data?.country_name;
    const parts = [city, region, country].filter(Boolean);
    return parts.length ? parts.join(", ") : null;
  } catch {
    return null;
  }
}
