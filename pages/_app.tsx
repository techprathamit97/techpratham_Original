


import type { AppProps } from 'next/app';
import '../app/globals.css';
import { SessionProvider } from 'next-auth/react';
import { UserProvider } from '@/context/userContext';
import Script from "next/script";
import { Maitree, Montserrat } from "next/font/google";
import { useEffect, useState } from "react";


// display: "optional" instead of "swap" eliminates font-swap layout shift:
// with "optional" the browser uses the size-adjusted fallback if the web font
// is not ready by first paint and does NOT swap it in mid-view, so text metrics
// never change after render (this removes the ~0.17 CLS Lighthouse attributed
// to the hero chips reflowing when the font loaded). On repeat/cached visits
// the custom font is available immediately, so the visual is unchanged.
const maitree = Maitree({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-maitree",
  display: "optional",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-montserrat",
  display: "optional",
});

function MyApp({ Component, pageProps }: AppProps) {
  /**
   * Defer all third-party analytics (Clarity, Facebook Pixel, GTM) until the
   * user first interacts with the page, with a safety timeout fallback.
   *
   * Why: these scripts previously loaded with strategy="afterInteractive",
   * which downloads + executes them immediately after hydration — directly on
   * the main thread during the window Total Blocking Time measures. None of
   * them are needed for first paint or first interaction, so loading them on
   * the first scroll/click/key/touch (or after 6s if the user never interacts)
   * moves their cost out of the critical path without losing any tracking. A
   * PageView still fires as soon as they load.
   */
  const [loadAnalytics, setLoadAnalytics] = useState(false);

  useEffect(() => {
    if (loadAnalytics) return;

    const trigger = () => setLoadAnalytics(true);
    const events: Array<keyof WindowEventMap> = [
      'scroll',
      'pointerdown',
      'keydown',
      'touchstart',
      'mousemove',
    ];

    events.forEach((evt) =>
      window.addEventListener(evt, trigger, { once: true, passive: true })
    );
    // Fallback: load even if the user never interacts (e.g. bounce), so
    // analytics still capture the visit.
    const timer = setTimeout(trigger, 6000);

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, trigger));
      clearTimeout(timer);
    };
  }, [loadAnalytics]);

  return (
   <div className={`${maitree.variable} ${montserrat.variable}`}>
      {/* Microsoft Clarity — loaded on first interaction (see loadAnalytics). */}
      {loadAnalytics && (
      <Script
        id="microsoft-clarity"
        strategy="afterInteractive"
      >
        {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "u2rxsd55s3");
      `}
      </Script>
      )}
      {/* Facebook Pixel — loaded on first interaction (see loadAnalytics). */}
      {loadAnalytics && (
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
      >
        {`
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;
    n.push=n;
    n.loaded=!0;
    n.version='2.0';
    n.queue=[];
    t=b.createElement(e);
    t.async=!0;
    t.src=v;
    s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s);
    }(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', '4625299514420327');
    fbq('track', 'PageView');
  `}
      </Script>
      )}
      {/* GTM HEAD SCRIPT — loaded on first interaction (see loadAnalytics).
          Previously afterInteractive, which executed the tag manager right
          after hydration and inflated Total Blocking Time. GTM is not needed
          for first paint/interaction, so it now loads lazily on the first
          user interaction (or the 6s fallback). */}
      {loadAnalytics && (
      <Script id="gtm-head" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-KXS7C3FM');
        `}
      </Script>
      )}

      <SessionProvider session={pageProps.session}>
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </SessionProvider>

      {/* GTM BODY NOSCRIPT */}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-KXS7C3FM"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        ></iframe>
      </noscript>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=4625299514420327&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
  </div>
  );
}

export default MyApp;
