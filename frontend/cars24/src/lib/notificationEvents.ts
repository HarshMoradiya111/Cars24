// notificationEvents.ts - Event-based notification triggers
import { getPreferences } from "./notificationPreferences";

/**
 * NOTIFICATION EVENTS & DEMO TRIGGERS
 * 
 * This module handles event-based notification creation and simulated real-time triggers.
 * Aligned with Task 2 requirements for real-time push notifications on key events:
 * - Appointment confirmations
 * - Price drops
 * - Bid updates
 * - New messages
 * - Inspection results
 * - Booking confirmations
 * - Special offers
 * 
 * Contains demo/test functions for evaluating notification preferences and system behavior.
 */

export type NotificationEventType =
  | "appointment"
  | "priceDrop"
  | "bidUpdate"
  | "message"
  | "inspection"
  | "booking"
  | "newsOffers";

export interface NotificationEvent {
  type: NotificationEventType;
  title: string;
  message: string;
  url?: string;
  iconUrl?: string;
}

export function notifyEvent(event: NotificationEvent): void {
  const prefs = getPreferences();
  
  // Log current enabled notification types
  const enabledTypes = Object.entries(prefs)
    .filter(([_, enabled]) => enabled)
    .map(([type]) => type);
  console.log("📋 Enabled notification types:", enabledTypes);
  
  // Check if this notification type is enabled
  if (!prefs[event.type]) {
    console.warn(`🚫 Notification blocked: "${event.type}" is disabled by user preferences`);
    console.log(`💡 Enable "${event.type}" in notification settings to receive these alerts`);
    return;
  }

  // Check if browser supports notifications
  if (typeof window === "undefined" || !("Notification" in window)) {
    console.warn("⚠️ Notifications not supported in this browser");
    return;
  }

  // Check permission
  if (Notification.permission !== "granted") {
    console.warn("⚠️ Notification permission not granted. Please enable notifications first.");
    return;
  }

  // Show notification (icon must be a URL, not emoji)
  console.log(`✅ Showing notification: ${event.type} - ${event.title}`);
  const notification = new Notification(event.title, {
    body: event.message,
    icon: event.iconUrl || "/favicon.ico",
    badge: "/favicon.ico",
    tag: event.type,
  });

  // Handle notification click
  if (event.url) {
    notification.onclick = () => {
      window.focus();
      window.location.href = event.url!;
      notification.close();
    };
  }
}

// Demo/Test function for triggering price drop notification (always enabled by default)
export function testPriceDropNotification(): void {
  console.log("🧪 Testing price drop notification...");
  NotificationFactories.priceDropped("Honda City 2020", "₹8.5 lakh", "₹8.2 lakh");
}

// Demo/Test function for appointment confirmation
export function testAppointmentNotification(): void {
  console.log("🧪 Testing appointment notification...");
  NotificationFactories.appointmentConfirmed("Tomorrow", "10:00 AM");
}

// Predefined notification factories for common events
export const NotificationFactories = {
  appointmentConfirmed: (date: string, time: string) =>
    notifyEvent({
      type: "appointment",
      title: "Appointment Confirmed",
      message: `Your appointment is confirmed for ${date} at ${time}`,
      url: "/appointments",
      iconUrl: "/favicon.ico",
    }),

  priceDropped: (carName: string, oldPrice: string, newPrice: string) =>
    notifyEvent({
      type: "priceDrop",
      title: "Price Drop Alert!",
      message: `${carName} dropped from ${oldPrice} to ${newPrice}`,
      url: "/buy-car",
      iconUrl: "/favicon.ico",
    }),

  newBid: (carName: string, amount: string) =>
    notifyEvent({
      type: "bidUpdate",
      title: "New Bid Received",
      message: `New bid of ${amount} received on ${carName}`,
      url: "/sell-car",
      iconUrl: "/favicon.ico",
    }),

  newMessage: (from: string, preview: string) =>
    notifyEvent({
      type: "message",
      title: `New message from ${from}`,
      message: preview,
      url: "/messages",
      iconUrl: "/favicon.ico",
    }),

  inspectionComplete: (carName: string, score: string) =>
    notifyEvent({
      type: "inspection",
      title: "Inspection Report Ready",
      message: `${carName} inspection complete. Score: ${score}/100`,
      url: "/profile",
      iconUrl: "/favicon.ico",
    }),

  bookingConfirmed: (carName: string, bookingId: string) =>
    notifyEvent({
      type: "booking",
      title: "Booking Confirmed",
      message: `Your booking for ${carName} is confirmed. ID: ${bookingId}`,
      url: "/bookings",
      iconUrl: "/favicon.ico",
    }),

  specialOffer: (title: string, discount: string) =>
    notifyEvent({
      type: "newsOffers",
      title: title,
      message: `Save up to ${discount} on selected vehicles`,
      url: "/buy-car",
      iconUrl: "/favicon.ico",
    }),
};

// Simulate real-time events (for testing/demo purposes)
// Only includes notification types that are typically enabled by default
export function simulateNotificationEvents() {
  const simulations = [
    () => NotificationFactories.appointmentConfirmed("Tomorrow", "10:00 AM"),
    () => NotificationFactories.priceDropped("Honda City 2020", "₹8.5 lakh", "₹8.2 lakh"),
    () => NotificationFactories.newBid("Maruti Swift 2019", "₹5.2 lakh"),
    () => NotificationFactories.newMessage("Car Dealer", "Your car is ready for inspection"),
    () => NotificationFactories.inspectionComplete("Honda City 2020", "87"),
    () => NotificationFactories.bookingConfirmed("Hyundai Creta 2021", "BK123456"),
    // Note: specialOffer (newsOffers) excluded from demo as it's disabled by default
  ];

  // Trigger random notifications every 10-30 seconds
  const randomDelay = () => Math.random() * 20000 + 10000;

  const scheduleNext = () => {
    const simulation = simulations[Math.floor(Math.random() * simulations.length)];
    setTimeout(() => {
      simulation();
      scheduleNext();
    }, randomDelay());
  };

  scheduleNext();
  console.log("🔔 Notification simulation started");
}
