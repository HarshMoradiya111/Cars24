"use client";
import React, { useState, useEffect } from "react";
import { Bell, CheckCircle, AlertCircle, Zap, TestTube } from "lucide-react";
import { enableNotifications } from "@/lib/notifications";
import {
  getPreferences,
  savePreferences,
  updatePreference,
  type NotificationPrefs,
} from "@/lib/notificationPreferences";
import { simulateNotificationEvents, testPriceDropNotification, testAppointmentNotification } from "@/lib/notificationEvents";

const NotificationSettings = () => {
  const [preferences, setPreferences] = useState<NotificationPrefs>({
    appointment: true,
    priceDrop: true,
    bidUpdate: true,
    message: true,
    inspection: true,
    booking: true,
    newsOffers: false,
  });
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [simulationActive, setSimulationActive] = useState(false);
  const [notificationSupported, setNotificationSupported] = useState(true);
  const [isSupportedBrowser, setIsSupportedBrowser] = useState(true);

  useEffect(() => {
    const prefs = getPreferences();
    setPreferences(prefs);

    if (typeof window !== "undefined" && "Notification" in window) {
      setPermissionGranted(Notification.permission === "granted");
      setNotificationSupported(true);
      setIsSupportedBrowser(true);
    } else {
      setNotificationSupported(false);
      setIsSupportedBrowser(false);
    }
  }, []);

  const handleEnableNotifications = async () => {
    if (!isSupportedBrowser) {
      alert(
        "Push notifications are not supported on this browser. Please use Chrome on Android or Desktop."
      );
      return;
    }
    setLoading(true);
    try {
      const token = await enableNotifications();
      if (token) {
        setFcmToken(token);
        setPermissionGranted(true);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error enabling notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePreference = (key: keyof NotificationPrefs) => {
    const newValue = !preferences[key];
    setPreferences((prev) => ({ ...prev, [key]: newValue }));
    updatePreference(key, newValue);
  };

  const handleStartSimulation = () => {
    if (!simulationActive) {
      simulateNotificationEvents();
      setSimulationActive(true);
    }
  };

  const notificationOptions = [
    {
      key: "appointment" as keyof NotificationPrefs,
      label: "Appointment Confirmations",
      description: "Get notified when your appointment is confirmed",
      icon: "📅",
    },
    {
      key: "priceDrop" as keyof NotificationPrefs,
      label: "Price Drop Alerts",
      description: "Know immediately when cars you like drop in price",
      icon: "📉",
    },
    {
      key: "bidUpdate" as keyof NotificationPrefs,
      label: "Bid Updates",
      description: "Be notified when you receive new bids on your listed cars",
      icon: "💰",
    },
    {
      key: "message" as keyof NotificationPrefs,
      label: "New Messages",
      description: "Get alerts for new messages from buyers/sellers",
      icon: "💬",
    },
    {
      key: "inspection" as keyof NotificationPrefs,
      label: "Inspection Results",
      description: "Get notified when vehicle inspection reports are ready",
      icon: "🔍",
    },
    {
      key: "booking" as keyof NotificationPrefs,
      label: "Booking Updates",
      description: "Updates on your car bookings and payments",
      icon: "✅",
    },
    {
      key: "newsOffers" as keyof NotificationPrefs,
      label: "News & Special Offers",
      description: "Stay updated with latest offers and news from CARS24",
      icon: "🎁",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Notification Settings
          </h1>
        </div>
        <p className="text-gray-600">
          Customize how and when you receive notifications from CARS24
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="text-green-600 h-5 w-5" />
          <div>
            <p className="text-green-800 font-medium">
              Notifications enabled successfully!
            </p>
            {fcmToken && !fcmToken.includes("notification-enabled") && (
              <p className="text-sm text-green-700">
                You'll now receive real-time alerts on your device.
              </p>
            )}
            {fcmToken && fcmToken.includes("notification-enabled") && (
              <p className="text-sm text-green-700">
                Basic notifications enabled. For full push notification support, 
                we're working on improving our Firebase configuration.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Browser Not Supported Warning */}
      {!notificationSupported && (
        <div className="mb-8 p-6 bg-red-50 border-2 border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xl font-semibold text-red-900 mb-2">
                Notifications Not Supported
              </h2>
              <p className="text-red-800 mb-2">
                Your browser or device doesn't support push notifications.
              </p>
              <ul className="text-sm text-red-700 list-disc ml-5 space-y-1">
                <li>iOS users: Requires iOS 16.4 or later with Safari</li>
                <li>Android users: Use Chrome or Firefox browser</li>
                <li>Desktop users: Try Chrome, Firefox, or Edge</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Enable Notifications Section */}
      {!permissionGranted && (
        <div className="mb-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-900 mb-2">
            Enable Push Notifications
          </h2>
          <p className="text-blue-800 mb-4">
            Allow CARS24 to send you real-time notifications about appointments,
            bids, messages, and more.
          </p>
          <button
            onClick={handleEnableNotifications}
            disabled={loading}
            className={`bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors ${
              !isSupportedBrowser ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Enabling..." : "Enable Notifications"}
          </button>
          <p className="mt-3 text-sm text-blue-800">
            Notifications available on Chrome Desktop & Android only
          </p>
        </div>
      )}

      {/* Test Simulation Button */}
      {permissionGranted && (
        <div className="mb-8 space-y-4">
          {/* Individual Test Buttons */}
          <div className="p-6 bg-purple-50 border-2 border-purple-200 rounded-lg">
            <h2 className="text-xl font-semibold text-purple-900 mb-2 flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Test Notifications
            </h2>
            <p className="text-purple-800 mb-4">
              Click these buttons to instantly test specific notification types
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={testPriceDropNotification}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700"
              >
                Test Price Drop
              </button>
              <button
                onClick={testAppointmentNotification}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700"
              >
                Test Appointment
              </button>
            </div>
          </div>

          {/* Continuous Simulation */}
          <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-green-900 mb-2 flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Continuous Simulation
                </h2>
                <p className="text-green-800">
                  Start simulating real-time events every 10-30 seconds
                </p>
              </div>
              <button
                onClick={handleStartSimulation}
                disabled={simulationActive}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {simulationActive ? "Simulation Active" : "Start Simulation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Preferences */}
      {permissionGranted && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Notification Preferences
          </h2>

          <div className="space-y-4">
            {notificationOptions.map((option) => (
              <div
                key={option.key}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-2xl">{option.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {option.label}
                    </h3>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    id={`pref-${option.key}`}
                    name={`pref-${option.key}`}
                    type="checkbox"
                    checked={preferences[option.key]}
                    onChange={() => handleTogglePreference(option.key)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FCM Token Info (Dev Only) */}
      {process.env.NODE_ENV === "development" && fcmToken && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600 mb-2 font-mono break-all">
            <strong>FCM Token:</strong> {fcmToken}
          </p>
        </div>
      )}

      {/* Information Section */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">How Notifications Work</h3>
        <ul className="space-y-2 text-gray-700 text-sm">
          <li>✓ Notifications work even when you close CARS24</li>
          <li>✓ You'll receive alerts on all your devices</li>
          <li>✓ Disable specific types of notifications anytime</li>
          <li>
            ✓ You can manage browser notification permissions in your browser
            settings
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NotificationSettings;
