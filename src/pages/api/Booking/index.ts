import type { NextApiRequest, NextApiResponse } from "next";
import { addBooking } from "@/lib/mockDb";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { userId } = req.query;
  const body = req.body || {};
  if (!userId || typeof userId !== "string") return res.status(400).json({ error: "userId required" });
  const carId = String(body.CarId || body.carId || body.id || "1");
  const booking = addBooking(userId, carId, {
    preferredDate: body.preferredDate || new Date().toISOString().split("T")[0],
    preferredTime: body.preferredTime || "10:00 AM",
    name: body.name || "User",
    phone: body.phone || "",
    email: body.email || "user@example.com",
    address: body.address || "",
    paymentMethod: body.paymentMethod || "full",
    loanRequired: body.loanRequired || "no",
    downPayment: body.downPayment || "0",
  });
  return res.status(200).json({ id: booking.id });
}
