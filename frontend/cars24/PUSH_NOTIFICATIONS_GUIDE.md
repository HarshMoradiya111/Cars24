# Push Notifications Setup Guide

This guide explains how to set up Firebase Cloud Messaging (FCM) for real-time push notifications in CARS24.

## Features Implemented

✅ **Real-time Notifications** for:
- Appointment confirmations & reminders
- Bid updates on listed cars
- New messages from buyers/sellers
- Price drop alerts
- Booking status updates
- Vehicle inspection results
- Special offers & news

✅ **User Preferences** - Customizable notification settings by event type

✅ **Browser Support** - Works on Chrome, Firefox, Edge, Safari

✅ **Foreground & Background** - Notifications display whether app is open or closed

## Setup Steps

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Enter project name "CARS24"
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Set Up Cloud Messaging

1. In Firebase Console, go to **Project Settings** > **Cloud Messaging**
2. Copy the following keys:
   - **API Key** (from Settings > General)
   - **Project ID**
   - **Sender ID** (found in Cloud Messaging tab)
   - **Server API Key** (from Cloud Messaging tab)
   - **VAPID Key** (generate a new key pair in Cloud Messaging)

### 3. Add Environment Variables

Create/update `.env.local` with:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_public_key
```

### 4. Initialize Firebase in Your App

The Firebase initialization is already configured in:
- `src/lib/firebase-config.ts` - Main Firebase setup
- `public/firebase-messaging-sw.js` - Service Worker for background notifications

### 5. Enable Users to Receive Notifications

Users can enable notifications by:

1. Going to **Profile Menu** > **Notification Settings**
2. Clicking **"Enable Notifications"**
3. Granting browser permission when prompted
4. Customizing which notification types they want

## File Structure

```
src/
├── context/
│   └── NotificationContext.tsx        # Notification context & preferences
├── lib/
│   ├── firebase-config.ts             # Firebase initialization
│   └── notificationService.ts         # Notification utility functions
├── components/
│   └── ui/
│       └── ToastContainer.tsx         # Toast notification UI
├── pages/
│   └── notification-settings/
│       └── index.tsx                  # Settings page
└── styles/
    └── globals.css                    # Toast animations
public/
└── firebase-messaging-sw.js           # Service Worker
```

## Sending Notifications (Backend)

To send notifications from your backend (Node.js/Express example):

```javascript
const admin = require('firebase-admin');

admin.initializeApp();

async function sendNotification(fcmToken, notification) {
  const message = {
    notification: {
      title: notification.title,
      body: notification.body,
    },
    data: {
      type: notification.type,
      url: notification.url,
      ...notification.data,
    },
    token: fcmToken,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Notification sent:', response);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}
```

## Using Notifications in Components

```tsx
import { useNotification } from "@/context/NotificationContext";
import { 
  createAppointmentNotification, 
  sendNotificationToUser 
} from "@/lib/notificationService";

function MyComponent() {
  const { sendNotification } = useNotification();

  const handleAppointmentConfirmed = async (appointmentData) => {
    // Show local notification
    const notification = createAppointmentNotification({
      carModel: "Honda City",
      date: "2025-01-25",
      time: "2:00 PM",
      location: "New Delhi",
      appointmentId: "apt_123",
    });

    sendNotification(notification);

    // Send to backend for FCM delivery
    await sendNotificationToUser(notification, userId);
  };

  return <button onClick={handleAppointmentConfirmed}>Confirm</button>;
}
```

## Available Notification Types

```typescript
enum NotificationType {
  APPOINTMENT_CONFIRMATION = "appointmentConfirmation",
  APPOINTMENT_REMINDER = "appointmentReminder",
  BID_UPDATE = "bidUpdates",
  MESSAGE_UPDATE = "messagingUpdates",
  PRICE_DROP = "priceDropAlerts",
  NEWS_OFFER = "newsAndOffers",
  INSPECTION_RESULT = "vehicleInspectionResults",
  BOOKING_UPDATE = "bookingUpdates",
}
```

## Testing Notifications

### 1. Foreground Notifications
Open the app and trigger actions like appointment confirmations

### 2. Background Notifications
Use Firebase Console to send test messages:
1. Go to Cloud Messaging > Send your first message
2. Enter notification title and body
3. Select your app as target
4. Click "Send test message"
5. Select a user device

### 3. Browser DevTools
- Open DevTools > Application > Service Workers
- Verify Service Worker is registered
- Check Application > Manifest for icon/badge

## Troubleshooting

### Service Worker Not Registering
- Ensure `firebase-messaging-sw.js` is in `public/` folder
- Check browser console for errors
- Verify HTTPS is enabled (FCM requires HTTPS in production)

### No Notifications Appearing
- Check notification permissions in browser settings
- Verify `NEXT_PUBLIC_FIREBASE_VAPID_KEY` is correct
- Ensure user granted permission
- Check browser notification settings are not muted

### FCM Token Not Generated
- Ensure service worker registered successfully
- Check browser supports Notification API
- Verify VAPID key is correct
- Check browser console for specific errors

## Production Deployment

### Important Checklist

1. **HTTPS Required** - Push notifications only work over HTTPS
2. **Environment Variables** - Set all Firebase keys in deployment platform
3. **Service Worker** - Ensure `firebase-messaging-sw.js` is served correctly
4. **Icon & Badge** - Add proper notification icons in `public/` folder:
   - `cars24-icon.png` - Notification icon
   - `cars24-badge.png` - Notification badge

### Deploy Service Worker

Make sure these files are served from your domain:
- `/firebase-messaging-sw.js`
- `/cars24-icon.png`
- `/cars24-badge.png`

## Security Best Practices

1. **Validate Permissions** - Always check user preferences before sending
2. **Rate Limiting** - Implement server-side rate limiting for notification sends
3. **User Control** - Allow users to easily disable all notifications
4. **Sensitive Data** - Never send sensitive info in notification body
5. **Token Refresh** - Implement periodic FCM token refresh

## API Endpoints (To Be Implemented)

```
POST /api/notifications/send
POST /api/notifications/subscribe
PUT /api/notifications/preferences/:userId
DELETE /api/notifications/unsubscribe
GET /api/notifications/tokens/:userId
```

## Support & Resources

- [Firebase Cloud Messaging Docs](https://firebase.google.com/docs/cloud-messaging)
- [Web Push Protocol](https://datatracker.ietf.org/doc/html/draft-thomson-webpush-protocol)
- [Notification API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
