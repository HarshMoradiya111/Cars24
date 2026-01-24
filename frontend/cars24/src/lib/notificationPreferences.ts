// notificationPreferences.ts - User notification preferences management
export type NotificationPrefs = {
  appointment: boolean;
  priceDrop: boolean;
  bidUpdate: boolean;
  message: boolean;
  inspection: boolean;
  booking: boolean;
  newsOffers: boolean;
};

const DEFAULT_PREFS: NotificationPrefs = {
  appointment: true,  // Enabled by default
  priceDrop: true,    // Enabled by default
  bidUpdate: true,    // Enabled by default
  message: true,      // Enabled by default
  inspection: true,   // Enabled by default
  booking: true,      // Enabled by default
  newsOffers: false,  // Disabled by default (less critical)
};

const STORAGE_KEY = "notificationPrefs";

export function savePreferences(prefs: NotificationPrefs): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

export function getPreferences(): NotificationPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return DEFAULT_PREFS;
  
  try {
    return { ...DEFAULT_PREFS, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function updatePreference(
  key: keyof NotificationPrefs,
  value: boolean
): void {
  const prefs = getPreferences();
  prefs[key] = value;
  savePreferences(prefs);
}
