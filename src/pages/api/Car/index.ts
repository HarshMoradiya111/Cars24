import type { NextApiRequest, NextApiResponse } from "next";
import { createCar } from "@/lib/mockDb";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const body = req.body || {};
  try {
    const created = createCar({
      title: body.title || "Untitled",
      images: Array.isArray(body.images) ? body.images : [body.images].filter(Boolean),
      price: body.price || "₹0",
      emi: body.emi || "₹0/month",
      location: body.location || "",
      specs: body.specs || {
        year: new Date().getFullYear(),
        km: "0",
        fuel: "Petrol",
        transmission: "Manual",
        owner: "First",
        insurance: "",
      },
      features: body.features || [],
      highlights: body.highlights || [],
    });
    return res.status(200).json(created);
  } catch (e) {
    return res.status(500).json({ error: "Failed to create car" });
  }
}
