// components/GoogleAnalytics.tsx
import Script from 'next/script';
import { FC } from 'react';
import { useCookieConsent } from './useCookieConsent';

const GoogleAnalytics: FC<{ trackingId: string }> = ({ trackingId }) => {
    const { isAccepted } = useCookieConsent();

    // Check consent status. If not accepted, the component renders nothing.
    if (!isAccepted('analytics')) {
        return null;
    }

    // If accepted, load the Google Analytics scripts
    return (
        <>
            <Script 
                strategy="afterInteractive" 
                src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`} 
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${trackingId}');
                `}
            </Script>
        </>
    );
};

export default GoogleAnalytics;