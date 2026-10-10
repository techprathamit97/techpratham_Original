/**
 * Utility function to redirect users to the Thank You page with proper tracking
 * after successful form submission
 */

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
  }
}

export interface ThankYouRedirectOptions {
  formType: string;
  course?: string;
  source?: string;
  additionalData?: Record<string, any>;
}

/**
 * Redirects to Thank You page and fires conversion tracking events
 * Only call this function AFTER successful form submission
 */
export const redirectToThankYou = (options: ThankYouRedirectOptions) => {
  const { formType, course, source, additionalData } = options;
  
  // Construct Thank You page URL with parameters
  const params = new URLSearchParams();
  params.set('type', formType);
  
  if (course) {
    params.set('course', course);
  }
  
  if (source) {
    params.set('source', source);
  }
  
  const thankYouUrl = `/thank-you?${params.toString()}`;
  
  // Fire conversion tracking events before redirect
  fireConversionEvents(options);
  
  // Redirect to Thank You page
  if (typeof window !== 'undefined') {
    // Use window.location.href for proper tracking
    window.location.href = thankYouUrl;
  }
};

/**
 * Fire conversion tracking events
 * This function can be called independently if you want to track conversions
 * without redirecting (e.g., for AJAX forms that show success messages)
 */
export const fireConversionEvents = (options: ThankYouRedirectOptions) => {
  const { formType, course, source, additionalData } = options;
  
  if (typeof window === 'undefined') return;
  
  // 1. Google Tag Manager / Google Analytics event
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'course_enquiry_success',
    form_type: formType,
    course_name: course || '',
    traffic_source: source || 'direct',
    page_title: document.title,
    page_location: window.location.href,
    ...additionalData
  });
  
  // 2. Google Ads conversion tracking (gtag method)
  if (window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: 'AW-17462500412/K_E4CNSPy-0bELy44oZB',
      value: 1.0,
      currency: 'INR',
      custom_parameters: {
        form_type: formType,
        course_name: course || 'Unknown',
        source: source || 'direct'
      }
    });
  }
  
  // 3. Facebook Pixel event (if Facebook Pixel is loaded)
  if (window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: course || 'Course Enquiry',
      content_category: 'Education',
      value: 1,
      currency: 'INR',
      custom_data: {
        form_type: formType,
        source: source || 'direct'
      }
    });
  }
  
  // 4. Enhanced Ecommerce tracking (if needed)
  window.dataLayer.push({
    event: 'generate_lead',
    ecommerce: {
      currency: 'INR',
      value: 1,
      items: [{
        item_id: formType,
        item_name: course || 'Course Enquiry',
        item_category: 'Education',
        item_category2: formType,
        quantity: 1,
        price: 1
      }]
    }
  });
};

/**
 * Helper function to determine if conversion tracking should be enabled
 * based on traffic source and other factors
 */
export const shouldTrackConversion = (source?: string): boolean => {
  // Always track conversions for proper attribution
  // Let Google Ads and Facebook determine attribution on their end
  return true;
};

/**
 * Form type mappings for consistent naming
 */
export const FORM_TYPES = {
  COURSE_CALLBACK: 'course-callback',
  COURSE_HEADER_ENQUIRY: 'course-header-enquiry',
  CONTACT_FORM: 'contact-form',
  TRAINING_CERTIFICATE: 'training-certificate',
  REACH_OUT: 'reach-out-form',
  COMMUNITY_JOIN: 'community-join',
  REVIEW_SUBMISSION: 'review-submission',
  FAQ_FORM: 'faq-form',
  CERTIFICATE_REQUEST: 'certificate-request',
  ADMISSION_FORM: 'admission-form',
  HOME_CONTACT_FORM: 'home-contact-form'
} as const;

export type FormType = typeof FORM_TYPES[keyof typeof FORM_TYPES];