// hooks/useCookieConsent.tsx
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { CookiePreferences, CookieConsentHook } from "../../../components/assets/type";

// Define the initial default state (only necessary is true)
const DEFAULT_PREFERENCES: CookiePreferences = {
    necessary: true,
    analytics: false,
    marketing: false,
};

const CONSENT_COOKIE_NAME = "cookie_consent_preferences";

export const useCookieConsent = (): CookieConsentHook => {
    const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
    const [isBannerVisible, setIsBannerVisible] = useState(false);

    // --- 1. Load Preferences on Mount ---
    useEffect(() => {
        const savedConsent = Cookies.get(CONSENT_COOKIE_NAME);

        if (savedConsent) {
            try {
                const parsed: CookiePreferences = JSON.parse(savedConsent);
                setPreferences(parsed);
                setIsBannerVisible(false);
            } catch (e) {
                // Invalid cookie, reset state and show banner
                setPreferences(DEFAULT_PREFERENCES); 
                setIsBannerVisible(true);
            }
        } else {
            // First time visitor, show banner
            setPreferences(DEFAULT_PREFERENCES);
            setIsBannerVisible(true);
        }
    }, []);

    // --- 2. Save Preferences to Cookie ---
    const savePreferences = (newPreferences: CookiePreferences) => {
        const finalPreferences: CookiePreferences = {
            ...newPreferences,
            necessary: true, // Necessary cookies are non-negotiable
        };
        
        // Set the cookie to expire in 365 days
        Cookies.set(CONSENT_COOKIE_NAME, JSON.stringify(finalPreferences), { expires: 365 });
        setPreferences(finalPreferences);
        setIsBannerVisible(false);
    };

    // --- 3. Handlers for UI Buttons ---
    
    const acceptAll = () => {
        const allAccepted: CookiePreferences = {
            necessary: true,
            analytics: true,
            marketing: true,
        };
        savePreferences(allAccepted);
    };

    const rejectAll = () => {
        const allRejected: CookiePreferences = {
            necessary: true, // Keep necessary true
            analytics: false,
            marketing: false,
        };
        savePreferences(allRejected);
    };

    // --- 4. Utility for Conditional Script Loading ---
    const isAccepted = (category: keyof CookiePreferences): boolean => {
        // Return false if preferences haven't loaded yet (default to block scripts)
        if (!preferences) return false; 
        
        return preferences[category] === true;
    };
    
    const showCustomization = () => setIsBannerVisible(true);

    return {
        preferences,
        isBannerVisible,
        setIsBannerVisible,
        acceptAll,
        rejectAll,
        savePreferences,
        isAccepted,
        showCustomization,
    };
};