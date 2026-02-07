// firebase-messaging-sw.js
// This service worker handles background notifications from Firebase Cloud Messaging

// Use compat builds (matching installed firebase version 12.x)
importScripts("https://www.gstatic.com/firebasejs/12.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.8.0/firebase-messaging-compat.js");

// Initialize Firebase in Service Worker
const firebaseConfig = {
  apiKey: "AIzaSyABuZLpFoR_d5xzxiEmmlVf64b0XPeqou0",
  authDomain: "cars-416f3.firebaseapp.com",
  projectId: "cars-416f3",
  // Storage bucket from Firebase console is typically <project-id>.appspot.com
  storageBucket: "cars-416f3.appspot.com",
  messagingSenderId: "913098329352",
  appId: "1:913098329352:web:eb7482cb01dc34c31b30bd",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

const showNotification = (payload) => {
  const notificationTitle = payload?.notification?.title || "CARS24 Notification";
  const notificationOptions = {
    body: payload?.notification?.body || "You have a new notification",
    icon: "/icon.png",
    tag: payload?.data?.tag || "notification",
    data: {
      ...(payload?.data || {}),
      url: payload?.data?.url || payload?.notification?.click_action || "/",
    },
    vibrate: [200, 100, 200],
    actions: [
      {
        action: "open",
        title: "Open",
      },
      {
        action: "close",
        title: "Close",
      },
    ],
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
};

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);
  showNotification(payload);
});

// Native push fallback for some mobile browsers
self.addEventListener("push", (event) => {
  if (!event.data) return;
  let payload = {};
  try {
    payload = event.data.json();
  } catch (e) {
    payload = { notification: { title: "CARS24 Notification", body: event.data.text() } };
  }

  event.waitUntil(Promise.resolve(showNotification(payload)));
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((windowClients) => {
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
