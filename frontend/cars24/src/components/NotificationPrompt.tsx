"use client";
import React, { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { useRouter } from "next/router";

export const NotificationPrompt = () => {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    // Check if we should show the prompt
    const checkPrompt = () => {
      console.log('[NotificationPrompt] Checking if should show...');
      
      const debug: any = {};

      if (dismissed) {
        console.log('[NotificationPrompt] ❌ Already dismissed in this session');
        debug.dismissed = true;
        return false;
      }
      if (typeof window === "undefined") {
        console.log('[NotificationPrompt] ❌ Not in browser');
        debug.browser = false;
        return false;
      }
      
      debug.browser = true;
      
      if (!("Notification" in window)) {
        console.log('[NotificationPrompt] ❌ Notification API not supported');
        debug.notificationAPI = false;
        setDebugInfo(debug);
        return false;
      }
      
      debug.notificationAPI = true;
      
      if (Notification.permission === "granted") {
        console.log('[NotificationPrompt] ❌ Permission already granted');
        debug.permission = Notification.permission;
        return false;
      }
      
      debug.permission = Notification.permission;
      
      // Check router readiness
      if (!router.isReady) {
        console.log('[NotificationPrompt] ⏳ Router not ready yet');
        return false;
      }
      
      if (router.pathname === "/notification-settings") {
        console.log('[NotificationPrompt] ❌ On notification-settings page');
        return false;
      }
      
      // Check if dismissed in last 24 hours
      const lastDismissed = localStorage.getItem("notificationPromptDismissed");
      if (lastDismissed) {
        const dismissTime = parseInt(lastDismissed);
        const hoursSinceDismiss = (Date.now() - dismissTime) / (1000 * 60 * 60);
        if (hoursSinceDismiss < 24) {
          console.log(`[NotificationPrompt] ❌ Dismissed ${Math.round(hoursSinceDismish)} hours ago (< 24h)`);
          return false;
        }
      }
      
      console.log('[NotificationPrompt] ✅ All checks passed, will show prompt');
      setDebugInfo(debug);
      return true;
    };

    // Show after 3 seconds delay
    const timer = setTimeout(() => {
      if (checkPrompt()) {
        console.log('[NotificationPrompt] 🔔 Showing notification prompt');
        setShow(true);
      } else {
        console.log('[NotificationPrompt] Debug Info:', debugInfo);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [dismissed, router.pathname, router.isReady]);

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem("notificationPromptDismissed", Date.now().toString());
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
              Stay Updated!
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Enable notifications to get instant alerts about appointments, price drops, and booking updates.
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
