import type { NextApiRequest, NextApiResponse } from "next";
import { getBookingsByUser } from "@/lib/mockDb";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const { userId } = req.query;
  if (!userId || typeof userId !== "string") return res.status(400).json({ error: "userId required" });
  const list = getBookingsByUser(userId);
  return res.status(200).json(list);
}
