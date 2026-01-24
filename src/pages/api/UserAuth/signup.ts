import type { NextApiRequest, NextApiResponse } from "next";
import { ensureUser } from "@/lib/mockDb";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { email, password, fullName, phone } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "email and password required" });
  const user = ensureUser(String(email), String(fullName || "User"), String(phone || ""));
  return res.status(200).json({ user });
}
