const API_BASE = process.env.NEXT_PUBLIC_API_URL;
if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured");
}

const BASE_URL = `${API_BASE}/api/Pricing`;

export type PricingRequest = {
  title: string;
  basePrice: string; // accepts either rupees or formats like "₹7.8 lakh"
  carLocation?: string;
  userLocation?: string;
  fuelIndex?: number;
  date?: string; // ISO string
};

export type PricingResponse = {
  recommendedPrice: number;
  pricingNotes: string[];
};

export async function getRecommendation(req: PricingRequest): Promise<PricingResponse | null> {
  try {
    const resp = await fetch(`${BASE_URL}/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    return {
      recommendedPrice: data?.recommendedPrice ?? data?.RecommendedPrice,
      pricingNotes: data?.pricingNotes ?? data?.PricingNotes ?? [],
    };
  } catch (e) {
    console.warn("getRecommendation failed:", e);
    return null;
  }
}
