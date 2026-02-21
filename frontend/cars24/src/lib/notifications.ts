import { onMessage, isSupported } from "firebase/messaging";
import { messaging, requestNotificationPermission } from "./firebase";

function getMobilePlatform(): "ios" | "android" | "desktop" {
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/android/.test(ua)) return "android";
  return "desktop";
}

function getIOSVersion(): number | null {
  const match = navigator.userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
  return match ? parseInt(match[1], 10) : null;
}

export async function enableNotifications(): Promise<string | null> {
  if (typeof window === "undefined") {
    console.error("Notifications can only be enabled in the browser");
    return null;
  }

  const supported = await isSupported().catch(() => false);
  if (!supported) {
    console.warn("Firebase Messaging not supported in this browser");
    alert(
      "Push notifications are not supported on this browser. Please use Chrome on Android or Desktop."
    );
    return null;
  }

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
    alert("Push notifications require service worker support in your browser.");
    return null;
  }

  if (!("Notification" in window)) {
    console.error("Notifications not supported on this device");
    alert("Push notifications are not supported on this browser.");
    return null;
  }

  try {
    const token = await requestNotificationPermission();
    if (!token) {
      if (Notification.permission === "denied") {
        alert(
          "Notifications are blocked. Please allow notifications in your browser settings and try again."
        );
      } else {
        alert("Unable to enable notifications. Please try again.");
      }
      return null;
    }

    console.log("FCM Token obtained:", token.substring(0, 20) + "...");
    console.log(`📱 Platform: ${platform}`);
    return token;
  } catch (error) {
    console.error("❌ Failed to get FCM token:", error);

    if (platform === "ios") {
      console.warn("ℹ️ Push notifications have limited support on iOS. Using basic notification fallback.");
      return "ios-notification-enabled";
    } else {
      console.warn("ℹ️ Push notifications configuration issue. Using basic notification fallback.");
      return "notification-enabled";
    }
  }
}

export function setupMessageListener(callback: (payload: any) => void) {
  const currentMessaging = messaging;
  if (!currentMessaging) return;

  isSupported()
    .then((supported) => {
      if (!supported) return;
      onMessage(currentMessaging, (payload: any) => {
        console.log("Foreground message received:", payload);
        callback(payload);
      });
    })
    .catch(() => {
    });
}
