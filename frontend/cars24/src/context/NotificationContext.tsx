"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

// Firebase imports - optional, will fail gracefully if not installed
let setupMessageListener: any = () => {};
let requestNotificationPermission: any = async () => null;

if (typeof window !== "undefined") {
  (async () => {
    try {
      const module = await import("@/lib/firebase") as any;
      if (module.setupMessageListener) {
        setupMessageListener = module.setupMessageListener;
      }
      if (module.requestNotificationPermission) {
        requestNotificationPermission = module.requestNotificationPermission;
      }
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

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

const DEFAULT_PREFERENCES: NotificationPreferences = {
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

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [preferences, setPreferences] = useState<NotificationPreferences>(
    DEFAULT_PREFERENCES
  );
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  // Check browser support
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isNotificationSupported =
      typeof window !== "undefined" &&
      "Notification" in window &&
      "serviceWorker" in navigator;
    setIsSupported(isNotificationSupported);

    // Load saved preferences from localStorage
    try {
      const savedPreferences = localStorage.getItem("notificationPreferences");
      if (savedPreferences) {
        setPreferences({
          ...DEFAULT_PREFERENCES,
          ...JSON.parse(savedPreferences),
        });
      }
    } catch (error) {
      console.error("Error loading notification preferences:", error);
    }

    // Load saved FCM token
    try {
      const savedToken = localStorage.getItem("fcmToken");
      if (savedToken) {
        setFcmToken(savedToken);
      }
    } catch (error) {
      console.error("Error loading FCM token:", error);
    }
  }, []);

  // Set up message listener for foreground notifications
  useEffect(() => {
    setupMessageListener((payload: any) => {
      const notifData = payload.data || {};
      const type = notifData.type as keyof NotificationPreferences | undefined;

      // Check if this notification type is enabled
      if (type && !preferences[type]) {
        return; // Skip if preference is disabled
      }

      // Show foreground notification using Notification API
      if (preferences.enabled && isSupported) {
        new Notification(
          payload.notification?.title || "CARS24 Notification",
          {
            body: payload.notification?.body || "You have a new notification",
            icon: notifData.icon || "/cars24-icon.png",
            badge: "/cars24-badge.png",
            tag: notifData.tag || "notification",
            data: notifData,
          }
        );
      }
    });
  }, [preferences, isSupported]);

  const updatePreferences = (prefs: Partial<NotificationPreferences>) => {
    const updated = { ...preferences, ...prefs };
    setPreferences(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("notificationPreferences", JSON.stringify(updated));
      } catch (error) {
        console.error("Error saving notification preferences:", error);
      }
    }
  };

  const sendNotification = (data: NotificationData) => {
    // Check if notification type is enabled
    if (data.type && !preferences[data.type]) {
      return;
    }

    if (preferences.enabled && isSupported) {
      // Show local notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(data.title, {
          body: data.body,
          icon: data.icon || "/cars24-icon.png",
          badge: "/cars24-badge.png",
          tag: data.tag || "notification",
          data: data.data,
        });
      }
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      if (!requestNotificationPermission) {
        console.error("Notification service not available");
        return false;
      }
      const token = await requestNotificationPermission();
      if (token) {
        setFcmToken(token);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("fcmToken", token);
          } catch (error) {
            console.error("Error saving FCM token:", error);
          }
        }
        updatePreferences({ enabled: true });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        preferences,
        updatePreferences,
        sendNotification,
        fcmToken,
        isSupported,
        requestPermission,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within NotificationProvider"
    );
  }
  return context;
};
