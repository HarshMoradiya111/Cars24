// notifications.ts - Permission and token handling
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

export async function enableNotifications(): Promise<string | null> {
  if (typeof window === "undefined" || !messaging) {
    console.error("Firebase Messaging not available");
    return null;
  }

  if (!("serviceWorker" in navigator)) {
    console.error("Service Worker not supported");
    return null;
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.log("Notification permission denied");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
      { scope: "/" }
    );
    await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
      serviceWorkerRegistration: registration,
    });

    console.log("✅ FCM Token:", token);
    return token;
  } catch (error) {
    console.error("❌ Failed to get FCM token:", error);
    return null;
  }
}

export function setupMessageListener(callback: (payload: any) => void) {
  if (!messaging) return;
  
  onMessage(messaging, (payload: any) => {
    console.log("Foreground message received:", payload);
    callback(payload);
  });
}
