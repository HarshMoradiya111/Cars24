# Mobile Push Notification Testing Guide

## 🔧 Testing Locally on Mobile Device

### Step 1: Find Your Computer's IP Address

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter (e.g., `192.168.1.100`)

**Mac/Linux:**
```bash
ifconfig | grep "inet "
```

### Step 2: Access from Mobile

1. Make sure your mobile device is on the **same WiFi network** as your computer
2. Open browser on mobile (Chrome for Android, Safari for iOS)
3. Navigate to: `http://YOUR_IP_ADDRESS:3000`
   - Example: `http://192.168.1.100:3000`

### Step 3: Test Notifications

1. After 3 seconds, you should see a notification prompt banner at the bottom
2. Click "Enable Now" to go to notification settings
3. Click "Enable Notifications" button
4. Browser will ask for notification permission - click "Allow"

---

## 🌐 Testing on Production (Vercel)

### Step 1: Add Environment Variables to Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these variables:
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyABuZLpFoR_d5xzxiEmmlVf64b0XPeqou0
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cars-416f3.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cars-416f3
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cars-416f3.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=913098329352
NEXT_PUBLIC_FIREBASE_APP_ID=1:913098329352:web:eb7482cb01dc34c31b30bd
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BBneKWYoFsXYuhwbT5MfhUxtMwUCUZUcw4cNrYXte8UkVn4Wy5b4zNY9upYJ6YT07E0GOC8camJA7mqBvm4S4J0
```

### Step 2: Redeploy

After adding variables, trigger a new deployment:
- Go to Deployments tab
- Click "Redeploy" on the latest deployment

### Step 3: Test

Visit your production URL: `https://cars24-teal.vercel.app`

---

## 📱 Device Compatibility

| Device | Browser | Support |
|--------|---------|---------|
| **Android 5.0+** | Chrome | ✅ Full Support |
| **Android 5.0+** | Firefox | ✅ Full Support |
| **iOS 16.4+** | Safari | ✅ Supported |
| **iOS < 16.4** | Any | ❌ Not Supported |
| **Desktop** | Chrome/Firefox/Edge | ✅ Full Support |

---

## 🐛 Troubleshooting

### Issue: Banner doesn't appear

**Check 1: Browser Console**
- Open mobile browser dev tools (Chrome Remote Debugging for Android)
- Look for console messages starting with `[NotificationPrompt]`

**Check 2: Already Dismissed?**
- Clear browser localStorage
- Or wait 24 hours after dismissing

**Check 3: Already Granted Permission?**
- Banner won't show if notifications already enabled
- Go directly to `/notification-settings` page

**Check 4: Notification API Available?**
Open browser console and check:
```javascript
console.log('Notification' in window); // Should be true
console.log(Notification.permission); // Should be 'default', 'granted', or 'denied'
```

### Issue: Permission denied

If you accidentally denied notification permission:

**Chrome (Android):**
1. Go to site Settings → Notifications
2. Change to "Allow"

**Safari (iOS):**
1. Settings → Safari → Website Settings
2. Find your site and enable notifications

### Issue: No FCM token

Check browser console for errors:
- Service worker registration failed
- VAPID key invalid
- Firebase initialization error

---

## 🧪 Debug Mode

Add this to your browser console to see detailed logs:
```javascript
localStorage.setItem('notificationDebug', 'true');
location.reload();
```

Remove localStorage item to test prompt again:
```javascript
localStorage.removeItem('notificationPromptDismissed');
location.reload();
```

---

## ✅ Expected Behavior

1. **First Visit:**
   - Wait 3 seconds → Banner appears at bottom
   - Click "Enable Now" → Redirects to `/notification-settings`
   - Click "Enable Notifications" → Browser asks for permission
   - Grant permission → Success message appears

2. **After Enabling:**
   - Banner won't appear again (permission granted)
   - Can test individual notification types

3. **After Dismissing:**
   - Banner won't appear for 24 hours
   - To reset: clear localStorage or wait 24 hours

---

## 📞 Support

If notifications still don't work:
1. Check device compatibility (iOS 16.4+ required)
2. Verify environment variables are set correctly
3. Check browser console for errors
4. Test on different device/browser
