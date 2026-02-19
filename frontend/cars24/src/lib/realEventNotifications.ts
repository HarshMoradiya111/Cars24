import { notifyEvent } from "./notificationEvents";

export function notifyAppointmentConfirmed(): void {
  notifyEvent({
    type: "appointment",
    title: "Appointment Confirmed",
    message: "Your car inspection has been scheduled successfully",
    url: "/appointments",
    iconUrl: "/favicon.ico",
  });
}

export function notifyPurchaseCompleted(carName: string): void {
  notifyEvent({
    type: "booking",
    title: "Purchase Completed",
    message: `Your purchase for ${carName || "this car"} has been completed successfully`,
    url: "/bookings",
    iconUrl: "/favicon.ico",
  });
}

export function notifyBidUpdated(): void {
  notifyEvent({
    type: "bidUpdate",
    title: "New Bid Update",
    message: "Your car has received a new bid",
    url: "/sell-car",
    iconUrl: "/favicon.ico",
  });
}

function safeNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function storageKey(prefix: string, id: string): string {
  return `cars24:${prefix}:${encodeURIComponent(id)}`;
}

/**
 * Triggers a price-drop browser notification only when the newly calculated
 * recommended price is lower than the previously stored one.
 *
 * De-dupe strategy:
 * - `lastSeen` tracks most recent recommended price we observed.
 * - `lastNotified` tracks the last recommended price we already notified for.
 */
export function notifyPriceDropIfNeeded(params: {
  carId: string;
  carName: string;
  newRecommendedPrice: number;
  url?: string;
}): void {
  if (typeof window === "undefined") return;

  const { carId, carName, newRecommendedPrice, url } = params;
  const nextPrice = safeNumber(newRecommendedPrice);
  if (nextPrice === null) return;

  try {
    const lastSeenKey = storageKey("recommendedPrice:lastSeen", carId);
    const lastNotifiedKey = storageKey("recommendedPrice:lastNotified", carId);

    const prevSeen = safeNumber(window.localStorage.getItem(lastSeenKey));
    const lastNotified = safeNumber(window.localStorage.getItem(lastNotifiedKey));

    // Always update last-seen so future comparisons are meaningful.
    window.localStorage.setItem(lastSeenKey, String(nextPrice));

    const isDrop = prevSeen !== null && nextPrice < prevSeen;
    const alreadyNotifiedForThisPrice = lastNotified !== null && nextPrice === lastNotified;

    if (!isDrop || alreadyNotifiedForThisPrice) return;

    notifyEvent({
      type: "priceDrop",
      title: "Price Drop Alert",
      message: `Price for ${carName || "this car"} has dropped`,
      url: url || `/buy-car/${carId}`,
      iconUrl: "/favicon.ico",
    });

    window.localStorage.setItem(lastNotifiedKey, String(nextPrice));
  } catch {
    // If storage is blocked (private mode / strict settings), skip de-dupe.
  }
}
