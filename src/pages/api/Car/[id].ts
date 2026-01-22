import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/mockDb";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const { id } = req.query;
  const car = db.carDetails[String(id)] || null;
  if (!car) return res.status(404).json({ error: "Not found" });
  return res.status(200).json(car);
}
