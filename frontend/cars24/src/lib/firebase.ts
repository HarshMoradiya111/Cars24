import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const isBrowser = typeof window !== "undefined";
export const firebaseApp = isBrowser ? initializeApp(firebaseConfig) : null;

export let messaging: ReturnType<typeof getMessaging> | null = null;

const getMessagingIfSupported = async () => {
  if (!isBrowser || !firebaseApp) return null;

  const supported = await isSupported().catch(() => false);
  if (!supported) {
    console.warn("Push notifications not supported on this browser");
    return null;
  }

  if (!messaging) {
    try {
      messaging = getMessaging(firebaseApp);
    } catch (e) {
      console.warn("Firebase messaging unavailable:", e);
      return null;
    }
  }

  return messaging;
};

export const setupMessageListener = async (callback: (payload: any) => void) => {
  if (typeof window === "undefined") return;

  const msg = await getMessagingIfSupported();
  if (!msg) return;

  onMessage(msg, (payload) => {
    callback(payload);

    if ("Notification" in window && Notification.permission === "granted") {
      const data = payload.data || {};
      new Notification(payload.notification?.title || "CARS24", {
        body: payload.notification?.body || "New notification",
        icon: "/icon.png",
        tag: data.tag || "notification",
        data,
      });
    }
  });
};

export const requestNotificationPermission = async (): Promise<string | null> => {
  if (typeof window === "undefined") return null;

  const msg = await getMessagingIfSupported();
  if (!msg) return null;

  if ("serviceWorker" in navigator) {
    await navigator.serviceWorker.register("/firebase-messaging-sw.js");
  }

  if (!("Notification" in window)) return null;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  try {
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.error("VAPID key is missing. Set NEXT_PUBLIC_FIREBASE_VAPID_KEY.");
      alert("Push notifications are not configured. VAPID key is missing.");
      return null;
    }

    const token = await getToken(msg, {
      vapidKey,
    });
    return token || null;
  } catch (e: any) {
    const code = e?.code || "";
    const errorName = e?.name || "";

    if (code === "messaging/token-subscribe-failed") {
      console.warn(
        "FCM token subscribe failed. Check API key allowed domains for this HTTPS origin."
      );
      return "notification-enabled";
    }

    if (errorName === "AbortError" || code === "messaging/registration-failed") {
      console.warn("FCM registration not available. Push notifications will be limited.");
      return null;
    }

    console.warn("FCM token unavailable:", e?.message || e);
    return null;
  }
};
