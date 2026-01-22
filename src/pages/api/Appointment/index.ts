import type { NextApiRequest, NextApiResponse } from "next";
import { addAppointment } from "@/lib/mockDb";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { userId } = req.query;
  const body = req.body || {};
  if (!userId || typeof userId !== "string") return res.status(400).json({ error: "userId required" });
  const carId = String(body.carId || body.CarId || "1");
  const appointment = addAppointment(userId, carId, {
    scheduledDate: body.scheduledDate || new Date().toISOString().split("T")[0],
    scheduledTime: body.scheduledTime || "10:00 AM",
    location: body.location || "",
    appointmentType: body.appointmentType || "branch_visit",
    notes: body.notes || "",
    status: "upcoming",
  });
  return res.status(200).json({ id: appointment.id });
}
