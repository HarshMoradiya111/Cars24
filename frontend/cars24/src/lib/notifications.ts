// notifications.ts - Permission and token handling
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

// Detect mobile platform
function getMobilePlatform(): "ios" | "android" | "desktop" {
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/android/.test(ua)) return "android";
  return "desktop";
}

// Check iOS version
function getIOSVersion(): number | null {
  const match = navigator.userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
  return match ? parseInt(match[1], 10) : null;
}

export async function enableNotifications(): Promise<string | null> {
  if (typeof window === "undefined" || !messaging) {
    console.error("Firebase Messaging not available");
    return null;
  }

  // Check mobile compatibility
  const platform = getMobilePlatform();
  if (platform === "ios") {
    const version = getIOSVersion();
    if (version && version < 16) {
      console.warn("⚠️ iOS Web Push requires iOS 16.4 or later");
      alert("Push notifications require iOS 16.4 or later. Please update your device.");
      return null;
    }
  }

  if (!("serviceWorker" in navigator)) {
    console.error("Service Worker not supported");
    return null;
  }

  if (!("Notification" in window)) {
    console.error("Notifications not supported on this device");
    alert("Push notifications are not supported on this browser.");
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

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.error("❌ VAPID key not configured");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });

    console.log("✅ FCM Token obtained:", token.substring(0, 20) + "...");
    console.log(`📱 Platform: ${platform}`);
    return token;
  } catch (error) {
    console.error("❌ Failed to get FCM token:", error);
    
    // Provide user-friendly error messages
    if (platform === "ios") {
      alert("Push notifications may have limited support on iOS. Try using Safari or update to iOS 16.4+");
    } else {
      alert("Failed to enable notifications. Please check your browser settings.");
    }
    
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
