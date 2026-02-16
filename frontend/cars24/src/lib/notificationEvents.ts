import { getPreferences } from "./notificationPreferences";

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

  const enabledTypes = Object.entries(prefs)
    .filter(([_, enabled]) => enabled)
    .map(([type]) => type);
  console.log("📋 Enabled notification types:", enabledTypes);

  if (!prefs[event.type]) {
    console.warn(`🚫 Notification blocked: "${event.type}" is disabled by user preferences`);
    console.log(`💡 Enable "${event.type}" in notification settings to receive these alerts`);
    return;
  }

  if (typeof window === "undefined" || !("Notification" in window)) {
    console.warn("⚠️ Notifications not supported in this browser");
    return;
  }

  if (Notification.permission !== "granted") {
    console.warn("⚠️ Notification permission not granted. Please enable notifications first.");
    return;
  }

  const showViaServiceWorker = async () => {
    if (!("serviceWorker" in navigator)) return false;
    try {
      const reg = await navigator.serviceWorker.ready;
      if (!reg?.showNotification) return false;
      await reg.showNotification(event.title, {
        body: event.message,
        icon: event.iconUrl || "/favicon.ico",
        badge: "/favicon.ico",
        tag: event.type,
        data: { url: event.url || "/" },
      });
      return true;
    } catch (e) {
      console.warn("⚠️ Service worker notification failed:", e);
      return false;
    }
  };

  console.log(`✅ Showing notification: ${event.type} - ${event.title}`);
  try {
    const notification = new Notification(event.title, {
      body: event.message,
      icon: event.iconUrl || "/favicon.ico",
      badge: "/favicon.ico",
      tag: event.type,
    });

    if (event.url) {
      notification.onclick = () => {
        window.focus();
        window.location.href = event.url!;
        notification.close();
      };
    }
  } catch (e) {
    console.warn("⚠️ Notification constructor not available. Using service worker.");
    void showViaServiceWorker();
  }
}

export function testPriceDropNotification(): void {
  console.log("🧪 Testing price drop notification...");
  NotificationFactories.priceDropped("Honda City 2020", "₹8.5 lakh", "₹8.2 lakh");
}

export function testAppointmentNotification(): void {
  console.log("🧪 Testing appointment notification...");
  NotificationFactories.appointmentConfirmed("Tomorrow", "10:00 AM");
}

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

export function simulateNotificationEvents() {
  const simulations = [
    () => NotificationFactories.appointmentConfirmed("Tomorrow", "10:00 AM"),
    () => NotificationFactories.priceDropped("Honda City 2020", "₹8.5 lakh", "₹8.2 lakh"),
    () => NotificationFactories.newBid("Maruti Swift 2019", "₹5.2 lakh"),
    () => NotificationFactories.newMessage("Car Dealer", "Your car is ready for inspection"),
    () => NotificationFactories.inspectionComplete("Honda City 2020", "87"),
    () => NotificationFactories.bookingConfirmed("Hyundai Creta 2021", "BK123456"),
  ];

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
