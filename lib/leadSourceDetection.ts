/**
 * Lead Source Detection Utility
 * 
 * This utility helps identify the source of website visitors based on URL parameters
 * to track leads from different advertising platforms.
 */

export type LeadSource = 'google_ads' | 'facebook_ads' | 'instagram_ads' | 'website_form';

/**
 * Comprehensive function to detect lead source based on URL parameters
 * 
 * @returns LeadSource - The detected source of the visitor
 */
export const getLeadSource = (): LeadSource => {
    if (typeof window === 'undefined') return 'website_form';
    
    const searchParams = new URLSearchParams(window.location.search);
    
    // Check for Facebook/Meta Ads
    // fbclid is automatically added by Facebook/Meta for all ads (Facebook & Instagram)
    if (searchParams.has('fbclid') || 
        searchParams.get('utm_source') === 'facebook' || 
        searchParams.get('utm_source') === 'meta') {
        return 'facebook_ads';
    }
    
    // Check for Instagram Ads specifically
    // Instagram ads can use utm_source=instagram or fbclid with instagram in utm_medium
    if (searchParams.get('utm_source') === 'instagram' || 
        (searchParams.has('fbclid') && searchParams.get('utm_medium')?.includes('instagram'))) {
        return 'instagram_ads';
    }
    
    // Check for Google Ads
    // gclid is automatically added by Google Ads, utm_source=google is manual UTM
    if (searchParams.has('gclid') || searchParams.get('utm_source') === 'google') {
        return 'google_ads';
    }
    
    // Default to website form for organic/direct traffic
    return 'website_form';
};

/**
 * Check if visitor came from Google Ads specifically
 * @returns boolean
 */
export const isGoogleAdsVisitor = (): boolean => {
    return getLeadSource() === 'google_ads';
};

/**
 * Check if visitor came from Facebook Ads specifically
 * @returns boolean
 */
export const isFacebookAdsVisitor = (): boolean => {
    return getLeadSource() === 'facebook_ads';
};

/**
 * Check if visitor came from Instagram Ads specifically
 * @returns boolean
 */
export const isInstagramAdsVisitor = (): boolean => {
    return getLeadSource() === 'instagram_ads';
};

/**
 * Check if visitor came from any paid advertising platform
 * @returns boolean
 */
export const isPaidTrafficVisitor = (): boolean => {
    const source = getLeadSource();
    return source !== 'website_form';
};

/**
 * Get a human-readable label for the lead source
 * @param source - The lead source
 * @returns string - Human-readable label
 */
export const getLeadSourceLabel = (source: LeadSource): string => {
    const labels: Record<LeadSource, string> = {
        'google_ads': 'Google Ads',
        'facebook_ads': 'Facebook Ads', 
        'instagram_ads': 'Instagram Ads',
        'website_form': 'Website Form'
    };
    
    return labels[source] || source;
};