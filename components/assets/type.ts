
export interface CookiePreferences {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
}

// Defines the shape of the custom hook's return value
export interface CookieConsentHook {
    preferences: CookiePreferences | null;
    isBannerVisible: boolean;
    setIsBannerVisible: (visible: boolean) => void;
    acceptAll: () => void;
    rejectAll: () => void;
    savePreferences: (newPreferences: CookiePreferences) => void;
    isAccepted: (category: keyof CookiePreferences) => boolean;
    showCustomization: () => void;
}