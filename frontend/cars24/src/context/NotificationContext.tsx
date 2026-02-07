"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { isSupported as firebaseIsSupported } from "firebase/messaging";

let setupListener: any = () => {};
let requestPerm: any = async () => null;

if (typeof window !== "undefined") {
  (async () => {
    try {
      const mod = await import("@/lib/firebase") as any;
      if (mod.setupMessageListener) setupListener = mod.setupMessageListener;
      if (mod.requestNotificationPermission) requestPerm = mod.requestNotificationPermission;
    } catch (error) {
      console.log("Firebase not available");
    }
  })();
}

export interface NotificationPreferences {
  appointmentConfirmation: boolean;
  appointmentReminder: boolean;
  bidUpdates: boolean;
  messagingUpdates: boolean;
  priceDropAlerts: boolean;
  newsAndOffers: boolean;
  vehicleInspectionResults: boolean;
  bookingUpdates: boolean;
  enabled: boolean;
}

export interface NotificationData {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  url?: string;
  type?: keyof NotificationPreferences;
  data?: Record<string, any>;
}

interface NotificationContextType {
  preferences: NotificationPreferences;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => void;
  sendNotification: (data: NotificationData) => void;
  fcmToken: string | null;
  isSupported: boolean;
  requestPermission: () => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const DEFAULT_PREFS: NotificationPreferences = {
  appointmentConfirmation: true,
  appointmentReminder: true,
  bidUpdates: true,
  messagingUpdates: true,
  priceDropAlerts: true,
  newsAndOffers: false,
  vehicleInspectionResults: true,
  bookingUpdates: true,
  enabled: false,
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_PREFS);
  const [token, setToken] = useState<string | null>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setSupported("Notification" in window && "serviceWorker" in navigator);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/firebase-messaging-sw.js").catch((e) => {
        console.error("Service worker registration failed:", e);
      });
    }

    try {
      const saved = localStorage.getItem("notificationPreferences");
      if (saved) setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(saved) });
    } catch (e) {
      console.error("Error loading notification prefs:", e);
    }

    try {
      const savedToken = localStorage.getItem("fcmToken");
      if (savedToken) setToken(savedToken);
    } catch (e) {
      console.error("Error loading FCM token:", e);
    }
  }, []);

  useEffect(() => {
    setupListener((payload: any) => {
      const data = payload.data || {};
      const type = data.type as keyof NotificationPreferences | undefined;

      if (type && !prefs[type]) return;

      if (prefs.enabled && supported) {
        new Notification(payload.notification?.title || "CARS24", {
          body: payload.notification?.body || "New notification",
          icon: "/icon.png",
          tag: data.tag || "notification",
          data,
        });
      }
    });
  }, [prefs, supported]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!supported) return;

    const maybeRequestPermission = async () => {
      const firebaseSupported = await firebaseIsSupported();
      if (!firebaseSupported) return;

      if (Notification.permission === "default") {
        askPermission();
      } else if (Notification.permission === "granted" && !token) {
        askPermission();
      }
    };

    maybeRequestPermission();
  }, [supported, token]);

  const updatePrefs = (newPrefs: Partial<NotificationPreferences>) => {
    const updated = { ...prefs, ...newPrefs };
    setPrefs(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("notificationPreferences", JSON.stringify(updated));
      } catch (e) {
        console.error("Error saving prefs:", e);
      }
    }
  };

  const send = (data: NotificationData) => {
    if (data.type && !prefs[data.type]) return;

    if (prefs.enabled && supported && "Notification" in window && Notification.permission === "granted") {
      new Notification(data.title, {
        body: data.body,
        icon: data.icon || "/icon.png",
        tag: data.tag || "notification",
        data: data.data,
      });
    }
  };

  const askPermission = async (): Promise<boolean> => {
    try {
      const firebaseSupported = await firebaseIsSupported();
      if (!firebaseSupported) {
        alert(
          "Push notifications are not supported on this browser. Please use Chrome on Android or Desktop."
        );
        return false;
      }
      if (!supported) return false;
      if (!requestPerm) {
        console.error("Notification service not available");
        return false;
      }
      const tok = await requestPerm();
      if (tok) {
        setToken(tok);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("fcmToken", tok);
          } catch (e) {
            console.error("Error saving token:", e);
          }
        }
        updatePrefs({ enabled: true });
        return true;
      }
      return false;
    } catch (e) {
      console.error("Error requesting permission:", e);
      return false;
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        preferences: prefs,
        updatePreferences: updatePrefs,
        sendNotification: send,
        fcmToken: token,
        isSupported: supported,
        requestPermission: askPermission,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification must be used within NotificationProvider");
  return ctx;
};
