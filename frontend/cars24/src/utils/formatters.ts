import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export const parseAmount = (raw: string) => {
  if (!raw) return null;

  if (/lakh/i.test(raw)) {
    const match = raw.match(/(\d+\.?\d*)\s*lakh/i);
    if (match) {
      const lakhValue = parseFloat(match[1]);
      return Math.round(lakhValue * 100000);
    }
  }

  const digits = raw.toString().replace(/[^0-9.]/g, "");
  return digits ? Math.round(parseFloat(digits)) : null;
};

export const formatCurrency = (value: string, fallback = "N/A") => {
  if (!value) return fallback;

  if (/lakh/i.test(value)) {
    const match = value.match(/(\d+\.?\d*)\s*lakh/i);
    if (match) {
      return `₹ ${match[1]} lakh`;
    }
    return value;
  }

  const amount = parseAmount(value);
  if (amount === null) return fallback;

  const lakhValue = amount / 100000;
  return `₹ ${lakhValue.toFixed(2)} lakh`;
};

export const formatCurrencyLoose = (value: string | undefined, fallback = "—") => {
  if (!value) return fallback;
  if (/lakh/i.test(value)) {
    return value.replace(/\$/g, "₹");
  }
  const amount = parseAmount(value);
  if (amount === null) return fallback;
  const lakhValue = amount / 100000;
  return `₹ ${lakhValue.toFixed(2)} lakh`;
};

export const parseKmValue = (raw: string) => {
  if (!raw) return null;
  const digits = raw.replace(/[^0-9]/g, "");
  return digits ? parseInt(digits, 10) : null;
};

export const normalizeOwnerText = (owner: string | null | undefined, fallback = "N/A") => {
  if (!owner) return fallback;
  const trimmed = owner.trim();
  if (/^1st\s*owner$/i.test(trimmed) || /^lst\s*owner$/i.test(trimmed)) {
    return "1st Owner";
  }
  return trimmed;
};
