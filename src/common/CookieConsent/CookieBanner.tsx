import React, { useState, FC } from 'react';
import { useCookieConsent } from './useCookieConsent';
import { CookiePreferences } from '../../../components/assets/type';

// --- Customization Modal Component (Internal) ---
const CustomizeModal: FC<{ 
    preferences: CookiePreferences; 
    onSave: (prefs: CookiePreferences) => void; 
    onClose: () => void; 
}> = ({ preferences, onSave, onClose }) => {
    const [currentPrefs, setCurrentPrefs] = useState<CookiePreferences>(preferences);

    const handleToggle = (category: keyof Omit<CookiePreferences, 'necessary'>, checked: boolean) => {
        setCurrentPrefs(prev => ({ ...prev, [category]: checked }));
    };

    const handleSave = () => {
        onSave(currentPrefs);
        onClose();
    };

    return (
        // Full screen dark overlay for the modal
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl transform transition-all duration-300 scale-100">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Customize Your Cookie Preferences</h2>
                <p className="text-sm text-gray-600 mb-6">
                    You can manage your acceptance for different types of cookies below. Necessary cookies are essential for core site functionality and cannot be disabled.
                </p>
                
                {/* Necessary Cookies */}
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                    <label className="text-lg font-semibold text-gray-800">Necessary Cookies</label>
                    <span className="text-sm text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full">Always Active</span>
                </div>

                {/* Analytics Cookies */}
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                    <label className="text-md text-gray-800">
                        Analytics Cookies (Traffic, Usage)
                        <p className="text-xs text-gray-500 mt-1">
                            Used to track visitor trends and measure site performance.
                        </p>
                    </label>
                    <input 
                        type="checkbox"
                        checked={currentPrefs.analytics}
                        onChange={(e) => handleToggle('analytics', e.target.checked)}
                        className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                </div>

                {/* Marketing Cookies */}
                <div className="flex justify-between items-center mb-6">
                    <label className="text-md text-gray-800">
                        Marketing Cookies (Personalized Ads)
                        <p className="text-xs text-gray-500 mt-1">
                            Used to show relevant ads based on your browsing habits.
                        </p>
                    </label>
                    <input 
                        type="checkbox"
                        checked={currentPrefs.marketing}
                        onChange={(e) => handleToggle('marketing', e.target.checked)}
                        className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-150"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-150 font-semibold"
                    >
                        Save Preferences
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main Cookie Banner Component ---
const CookieBanner: FC = () => {
    const { 
        preferences, 
        isBannerVisible, 
        acceptAll, 
        rejectAll, 
        savePreferences,
    } = useCookieConsent();

    const [showCustomizeModal, setShowCustomizeModal] = useState(false);

    // Don't render the banner if preferences haven't loaded OR if it's explicitly hidden
    if (!preferences || !isBannerVisible) return null;

    return (
        <>
            {/* Full-screen overlay for the main consent banner */}
            <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
                
                {/* Inner Content Box (80% screen coverage) */}
             <div 
  className="
    fixed bottom-12 left-2
    bg-white text-gray-900 rounded-xl shadow-2xl 
    w-full max-w-[70vw] md:max-h-[50vh] max-h-[90vh]
     p-3 
    transform transition-all duration-300 scale-100
    z-50
  "
>
                    <h2 className="text-xl font-bold border-b">We respect your privacy</h2>
                    <div className="flex flex-col md:flex-row items-start justify-between space-y-4 md:space-y-0 md:space-x-6">
                        
                        {/* Policy Description */}
                        <div className="flex-grow">
                            <p className="text-xs text-gray-700 leading-relaxed">
                              Cookies save your preferences and login details, enabling personalized features, faster loading, and a seamless experience on every visit.
                            </p>
                            <p className="text-sm text-indigo-600 mt-2 font-semibold">
                                Please make a selection to proceed.
                            </p>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col space-y-1 w-full md:w-auto md:flex-shrink-0">
                            <button 
                                onClick={acceptAll}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 text-xs rounded-lg transition font-bold shadow-md"
                            >
                                Accept All Cookies
                            </button>
                            <button 
                                onClick={() => setShowCustomizeModal(true)}
                                className="bg-gray-700 hover:bg-gray-800 text-white px-2 py-1 text-xs rounded-lg transition shadow-md"
                            >
                                Customize Preferences
                            </button>
                            <button 
                                onClick={rejectAll}
                                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs rounded-lg transition shadow-md"
                            >
                                Reject All Non-Essential
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Show Modal if customization is active */}
            {showCustomizeModal && preferences && (
                <CustomizeModal 
                    preferences={preferences}
                    onSave={savePreferences}
                    onClose={() => setShowCustomizeModal(false)}
                />
            )}
        </>
    );
};

export default CookieBanner;