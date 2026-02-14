import React, { useEffect, useState } from "react";
import { Bell, CheckCircle, XCircle, Info, Smartphone } from "lucide-react";

export default function NotificationDebugPage() {
  const [checks, setChecks] = useState<any>({});
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const addLog = (msg: string) => {
      console.log(msg); 
      setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    // Run all checks
    const runChecks = () => {
      const results: any = {};

      addLog("🔍 Starting system checks...");

      // Check 1: Browser environment
      results.browserCheck = typeof window !== "undefined";
      addLog(`Browser check: ${results.browserCheck ? "✅ PASS" : "❌ FAIL"}`);

      // Check 2: Notification API
      results.notificationApi = "Notification" in window;
      addLog(`Notification API: ${results.notificationApi ? "✅ PASS" : "❌ FAIL"}`);

      // Check 3: Permission status
      if (results.notificationApi) {
        results.permission = Notification.permission;
        addLog(`Permission status: ${Notification.permission}`);
      }

      // Check 4: Service Worker support
      results.serviceWorker = "serviceWorker" in navigator;
      addLog(`Service Worker support: ${results.serviceWorker ? "✅ PASS" : "❌ FAIL"}`);

      // Check 5: Firebase env vars
      results.firebaseApiKey = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      results.firebaseVapid = !!process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
      addLog(`Firebase API Key: ${results.firebaseApiKey ? "✅ FOUND" : "❌ MISSING"}`);
      addLog(`Firebase VAPID Key: ${results.firebaseVapid ? "✅ FOUND" : "❌ MISSING"}`);

      // Check 6: LocalStorage
      try {
        const dismissed = localStorage.getItem("notificationPromptDismissed");
        results.dismissedTime = dismissed;
        if (dismissed) {
          const hours = (Date.now() - parseInt(dismissed)) / (1000 * 60 * 60);
          addLog(`⚠️ Dismissed: ${Math.round(hours)} hours ago - Banner won't show for 24h`);
        } else {
          addLog(`✅ Dismissed: Never - Banner should show after 3 seconds`);
        }
      } catch (e) {
        results.localStorageError = true;
        addLog(`LocalStorage: ❌ ERROR - ${e}`);
      }

      // Check 7: User Agent
      results.userAgent = navigator.userAgent;
      addLog(`User Agent: ${navigator.userAgent}`);

      // Detect mobile platform
      const ua = navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(ua)) {
        results.platform = "iOS";
        const match = navigator.userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
        const version = match ? parseInt(match[1], 10) : null;
        results.iosVersion = version;
        addLog(`📱 Platform: iOS ${version || "unknown"}`);
        if (version && version < 16) {
          addLog(`⚠️ WARNING: iOS ${version} detected. Requires iOS 16.4+`);
        } else {
          addLog(`✅ iOS version supported`);
        }
      } else if (/android/.test(ua)) {
        results.platform = "Android";
        addLog(`📱 Platform: Android - Full notification support`);
      } else {
        results.platform = "Desktop";
        addLog(`🖥️ Platform: Desktop - Full notification support`);
      }

      // Check 8: React Router
      try {
        const router = require("next/router").useRouter();
        addLog(`✅ Next.js Router available`);
      } catch (e) {
        addLog(`⚠️ Router check: ${e}`);
      }

      addLog("✅ All checks completed!");
      setChecks(results);
    };

    runChecks();
  }, []);

  const resetDismissed = () => {
    localStorage.removeItem("notificationPromptDismissed");
    setLogs((prev) => [...prev, "[Manual] ✅ Cleared dismissed flag - Reload to see banner"]);
    setTimeout(() => window.location.reload(), 1000);
  };

  const testNotification = async () => {
    if (!("Notification" in window)) {
      alert("Notifications not supported!");
      return;
    }

    const permission = await Notification.requestPermission();
    setLogs((prev) => [...prev, `[Test] Permission result: ${permission}`]);

    if (permission === "granted") {
      new Notification("Test Notification", {
        body: "This is a test notification from CARS24!",
        icon: "/favicon.ico",
      });
      setLogs((prev) => [...prev, "[Test] ✅ Test notification sent"]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <Smartphone className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold">Notification Debug Panel</h1>
              <p className="text-sm text-gray-500">Check why notifications aren't showing</p>
            </div>
          </div>
        </div>

        {/* System Checks */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">System Checks</h2>
          <div className="space-y-3">
            <CheckItem
              label="Browser Environment"
              status={checks.browserCheck}
            />
            <CheckItem
              label="Notification API Available"
              status={checks.notificationApi}
            />
            <CheckItem
              label="Service Worker Support"
              status={checks.serviceWorker}
            />
            <CheckItem
              label="Firebase API Key"
              status={checks.firebaseApiKey}
            />
            <CheckItem
              label="Firebase VAPID Key"
              status={checks.firebaseVapid}
            />
            {checks.permission && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Permission Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    checks.permission === "granted"
                      ? "bg-green-100 text-green-800"
                      : checks.permission === "denied"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {checks.permission}
                </span>
              </div>
            )}
            {checks.platform && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Platform</span>
                <span className="text-gray-700">
                  {checks.platform}
                  {checks.iosVersion && ` (iOS ${checks.iosVersion})`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Common Issues */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6">
          <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
            <Info className="w-5 h-5" />
            Why Banner Might Not Show
          </h3>
          <ul className="space-y-2 text-sm text-amber-800 list-disc ml-5">
            <li>
              <strong>Permission already granted?</strong> Banner won't show if you already enabled notifications. Check Permission Status above.
            </li>
            <li>
              <strong>Dismissed recently?</strong> Banner won't show for 24 hours after dismissing. Click "Reset Dismissed Flag" to test.
            </li>
            <li>
              <strong>On notification-settings page?</strong> Banner only shows on other pages.
            </li>
            <li>
              <strong>iOS before 16.4?</strong> Web Push Notifications not supported on older iOS versions.
            </li>
            <li>
              <strong>Permission denied before?</strong> Clear browser data and reset permissions to test again.
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Actions</h2>
          <div className="flex flex-col gap-3">
            <button
              onClick={resetDismissed}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              🔄 Reset Dismissed Flag & Reload
            </button>
            <button
              onClick={testNotification}
              className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              🔔 Test Notification Permission
            </button>
            <a
              href="/"
              className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-center font-medium"
            >
              🏠 Go to Homepage (banner should appear)
            </a>
            <a
              href="/notification-settings"
              className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-center font-medium"
            >
              ⚙️ Go to Notification Settings
            </a>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs max-h-96 overflow-y-auto space-y-1">
            {logs.length === 0 ? (
              <div className="text-gray-500">Loading logs...</div>
            ) : (
              logs.map((log, idx) => <div key={idx}>{log}</div>)
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Bell className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                How to Test on Mobile
              </h3>
              <ol className="text-sm text-blue-800 space-y-2 list-decimal ml-5">
                <li>Check all System Checks above (should be green)</li>
                <li>If "Dismissed" shows time, click "Reset Dismissed Flag"</li>
                <li>Click "Go to Homepage"</li>
                <li>
                  <strong>Wait 3 seconds</strong> - banner should slide up from bottom
                </li>
                <li>Check browser console (F12) for detailed logs</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckItem({ label, status }: { label: string; status: boolean | undefined }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span className="font-medium">{label}</span>
      {status === undefined ? (
        <div className="w-5 h-5 rounded-full border-2 border-gray-300 animate-spin" />
      ) : status ? (
        <CheckCircle className="w-5 h-5 text-green-600" />
      ) : (
        <XCircle className="w-5 h-5 text-red-600" />
      )}
    </div>
  );
}
