import React, { useEffect, useState } from "react";
import { Bell, CheckCircle, XCircle, Info } from "lucide-react";

export default function NotificationTestPage() {
  const [checks, setChecks] = useState<any>({});
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const addLog = (msg: string) => {
      setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    // Run all checks
    const runChecks = () => {
      const results: any = {};

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
          addLog(`Dismissed: ${Math.round(hours)} hours ago`);
        } else {
          addLog(`Dismissed: Never`);
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
        addLog(`Platform: iOS ${version || "unknown"}`);
        if (version && version < 16) {
          addLog(`⚠️ WARNING: iOS ${version} detected. Requires iOS 16.4+`);
        }
      } else if (/android/.test(ua)) {
        results.platform = "Android";
        addLog(`Platform: Android`);
      } else {
        results.platform = "Desktop";
        addLog(`Platform: Desktop`);
      }

      setChecks(results);
    };

    runChecks();
  }, []);

  const resetDismissed = () => {
    localStorage.removeItem("notificationPromptDismissed");
    setLogs((prev) => [...prev, "[Manual] ✅ Cleared dismissed flag"]);
    setTimeout(() => window.location.reload(), 500);
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
            <Bell className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold">Notification Debug Panel</h1>
          </div>
          <p className="text-gray-600">
            Use this page to diagnose notification issues on mobile devices.
          </p>
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

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="flex flex-col gap-3">
            <button
              onClick={resetDismissed}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Reset Dismissed Flag & Reload
            </button>
            <button
              onClick={testNotification}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Test Notification Permission
            </button>
            <a
              href="/notification-settings"
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-center"
            >
              Go to Notification Settings
            </a>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            {logs.map((log, idx) => (
              <div key={idx}>{log}</div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                Testing Instructions
              </h3>
              <ol className="text-sm text-blue-800 space-y-2 list-decimal ml-5">
                <li>Check all system checks are passing (green checkmarks)</li>
                <li>If "Permission Status" is "granted", banner won't show</li>
                <li>
                  If dismissed recently, click "Reset Dismissed Flag & Reload"
                </li>
                <li>Go to homepage - banner should appear after 3 seconds</li>
                <li>Check browser console for detailed logs</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckItem({ label, status }: { label: string; status: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span className="font-medium">{label}</span>
      {status ? (
        <CheckCircle className="w-5 h-5 text-green-600" />
      ) : (
        <XCircle className="w-5 h-5 text-red-600" />
      )}
    </div>
  );
}
