const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "https://cars-24-clone-net-nextjs.onrender.com/api"}/Pricing`;

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
    // normalize casing from backend anonymous object
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
