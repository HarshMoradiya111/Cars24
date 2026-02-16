"use client";
import React, { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { useRouter } from "next/router";

export const NotificationPrompt = () => {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAndShow = () => {
      const forceShow =
        typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).has("forceNotificationPrompt");
      if (forceShow) {
        setStatusMessage(null);
        return true;
      }

      if (dismissed || typeof window === "undefined") {
        return false;
      }

      if (!("Notification" in window)) {
        setStatusMessage(
          "Notifications aren't supported on this browser. On iOS, you need Safari 16.4+ and HTTPS."
        );
        return true;
      }

      if (Notification.permission === "granted") {
        return false;
      }

      if (Notification.permission === "denied") {
        setStatusMessage(
          "Notifications are blocked. Enable them in your browser settings to proceed."
        );
        return true;
      }

      if (!router.isReady || router.pathname === "/notification-settings") {
        return false;
      }

      try {
        const lastDismissed = localStorage.getItem("notificationPromptDismissed");
        if (lastDismissed) {
          const hours = (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60);
          if (hours < 24) {
            return false;
          }
        }
      } catch (error) {
        setStatusMessage("We couldn't read your browser storage. Tap Enable to continue.");
      }

      setStatusMessage(null);
      return true;
    };

    const timer = setTimeout(() => {
      if (checkAndShow()) {
        setShow(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [dismissed, router.pathname, router.isReady]);

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    try {
      localStorage.setItem("notificationPromptDismissed", Date.now().toString());
    } catch (error) {
    }
  };

  const handleEnable = () => {
    router.push("/notification-settings");
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-end justify-center p-4 sm:p-6">
      <div className="pointer-events-auto w-full max-w-sm bg-white border-2 border-blue-500 rounded-lg shadow-2xl p-4 animate-slide-up">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Bell className="h-5 w-5 text-blue-600" />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              {statusMessage ? "Notifications Unavailable" : "Stay Updated!"}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {statusMessage ??
                "Enable notifications to get instant alerts about appointments, price drops, and booking updates."}
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleEnable}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors active:bg-blue-800"
              >
                Enable Now
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
              >
                Later
              </button>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
