/**
 * LEGACY NOTIFICATION SERVICE
 * 
 * ⚠️ This file is DEPRECATED for new code.
 * 
 * The active notification logic has been refactored into:
 * - notificationEvents.ts     → Event triggers and demo functions
 * - notificationPreferences.ts → User preference management
 * - notifications.ts          → Firebase token & permission handling
 * 
 * This file is kept for backward compatibility only.
 * New notification features should use the files above.
 */

// notificationService.ts
export enum NotificationType {
  APPOINTMENT_CONFIRMATION = "appointmentConfirmation",
  APPOINTMENT_REMINDER = "appointmentReminder",
  BID_UPDATE = "bidUpdates",
  MESSAGE_UPDATE = "messagingUpdates",
  PRICE_DROP = "priceDropAlerts",
  NEWS_OFFER = "newsAndOffers",
  INSPECTION_RESULT = "vehicleInspectionResults",
  BOOKING_UPDATE = "bookingUpdates",
}

export interface NotificationPayload {
  type: NotificationType;
  title: string;
  body: string;
  icon?: string;
  url?: string;
  data?: Record<string, any>;
  tag?: string;
}

/**
 * Create appointment confirmation notification
 */
export const createAppointmentNotification = (
  appointmentDetails: {
    carModel: string;
    date: string;
    time: string;
    location: string;
    appointmentId: string;
  }
): NotificationPayload => ({
  type: NotificationType.APPOINTMENT_CONFIRMATION,
  title: "Appointment Confirmed",
  body: `Your appointment for ${appointmentDetails.carModel} on ${appointmentDetails.date} at ${appointmentDetails.time} is confirmed.`,
  icon: "/icons/appointment.png",
  url: `/appointments/${appointmentDetails.appointmentId}`,
  tag: `appointment-${appointmentDetails.appointmentId}`,
  data: appointmentDetails,
});

/**
 * Create appointment reminder notification
 */
export const createAppointmentReminderNotification = (
  appointmentDetails: {
    carModel: string;
    date: string;
    time: string;
    hoursRemaining: number;
    appointmentId: string;
  }
): NotificationPayload => ({
  type: NotificationType.APPOINTMENT_REMINDER,
  title: "Appointment Reminder",
  body: `Reminder: Your appointment for ${appointmentDetails.carModel} is in ${appointmentDetails.hoursRemaining} hours on ${appointmentDetails.date} at ${appointmentDetails.time}.`,
  icon: "/icons/reminder.png",
  url: `/appointments/${appointmentDetails.appointmentId}`,
  tag: `reminder-${appointmentDetails.appointmentId}`,
  data: appointmentDetails,
});

/**
 * Create bid update notification
 */
export const createBidUpdateNotification = (
  bidDetails: {
    carModel: string;
    bidAmount: string;
    bidderName: string;
    carId: string;
  }
): NotificationPayload => ({
  type: NotificationType.BID_UPDATE,
  title: "New Bid Received",
  body: `You received a new bid of ${bidDetails.bidAmount} for ${bidDetails.carModel} from ${bidDetails.bidderName}.`,
  icon: "/icons/bid.png",
  url: `/sell-car/${bidDetails.carId}`,
  tag: `bid-${bidDetails.carId}`,
  data: bidDetails,
});

/**
 * Create price drop notification
 */
export const createPriceDropNotification = (
  priceDetails: {
    carModel: string;
    oldPrice: string;
    newPrice: string;
    savingsAmount: string;
    carId: string;
  }
): NotificationPayload => ({
  type: NotificationType.PRICE_DROP,
  title: "Price Drop Alert",
  body: `${priceDetails.carModel} price dropped! Save ${priceDetails.savingsAmount} - was ${priceDetails.oldPrice}, now ${priceDetails.newPrice}.`,
  icon: "/icons/price-drop.png",
  url: `/buy-car/${priceDetails.carId}`,
  tag: `price-${priceDetails.carId}`,
  data: priceDetails,
});

/**
 * Create new message notification
 */
export const createMessageNotification = (
  messageDetails: {
    senderName: string;
    message: string;
    chatId: string;
    senderAvatar?: string;
  }
): NotificationPayload => ({
  type: NotificationType.MESSAGE_UPDATE,
  title: `Message from ${messageDetails.senderName}`,
  body: messageDetails.message.substring(0, 100),
  icon: messageDetails.senderAvatar || "/icons/message.png",
  url: `/messages/${messageDetails.chatId}`,
  tag: `message-${messageDetails.chatId}`,
  data: messageDetails,
});

/**
 * Create booking update notification
 */
export const createBookingUpdateNotification = (
  bookingDetails: {
    carModel: string;
    status: string;
    amount: string;
    bookingId: string;
  }
): NotificationPayload => ({
  type: NotificationType.BOOKING_UPDATE,
  title: "Booking Status Update",
  body: `Your booking for ${bookingDetails.carModel} is now ${bookingDetails.status}.`,
  icon: "/icons/booking.png",
  url: `/bookings/${bookingDetails.bookingId}`,
  tag: `booking-${bookingDetails.bookingId}`,
  data: bookingDetails,
});

/**
 * Create inspection result notification
 */
export const createInspectionResultNotification = (
  inspectionDetails: {
    carModel: string;
    status: string;
    score: string;
    reportId: string;
  }
): NotificationPayload => ({
  type: NotificationType.INSPECTION_RESULT,
  title: "Inspection Report Ready",
  body: `${inspectionDetails.carModel} inspection complete. Overall score: ${inspectionDetails.score}.`,
  icon: "/icons/inspection.png",
  url: `/inspection-report/${inspectionDetails.reportId}`,
  tag: `inspection-${inspectionDetails.reportId}`,
  data: inspectionDetails,
});

/**
 * Create news/offer notification
 */
export const createNewsOfferNotification = (
  offerDetails: {
    title: string;
    description: string;
    discount?: string;
    offerId: string;
  }
): NotificationPayload => ({
  type: NotificationType.NEWS_OFFER,
  title: offerDetails.title,
  body: offerDetails.description,
  icon: "/icons/offer.png",
  url: `/offers/${offerDetails.offerId}`,
  tag: `offer-${offerDetails.offerId}`,
  data: offerDetails,
});

/**
 * Send notification to user (in production, this would call backend API)
 */
export const sendNotificationToUser = async (
  payload: NotificationPayload,
  userId?: string
): Promise<boolean> => {
  try {
    // In production, send to your backend API which will handle FCM token management
    // const response = await fetch("/api/notifications/send", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     userId,
    //     ...payload,
    //   }),
    // });
    // return response.ok;

    console.log("Notification prepared:", payload);
    return true;
  } catch (error) {
    console.error("Error sending notification:", error);
    return false;
  }
};

/**
 * Schedule notification for later
 */
export const scheduleNotification = (
  payload: NotificationPayload,
  delayMs: number
): void => {
  setTimeout(() => {
    sendNotificationToUser(payload);
  }, delayMs);
};
