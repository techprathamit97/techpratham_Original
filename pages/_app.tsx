


import type { AppProps } from 'next/app';
import '../app/globals.css';
import { SessionProvider } from 'next-auth/react';
import { UserProvider } from '@/context/userContext';
import Script from "next/script";
import { useRouter } from "next/router";
import { Maitree, Montserrat } from "next/font/google";
import { useEffect, useState } from "react";


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

  const router = useRouter();
  // Hide the chat launcher on the account/accountant/admin pages only.
  // Everything else (analytics, Crisp scripts, etc.) stays unchanged.
  const hideChat = ["/account", "/accountant", "/admin"].some(
    (p) => router.pathname === p || router.pathname.startsWith(p + "/")
  );

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

  // Open Crisp chat from our own brand-red launcher. Loading Crisp lazily
  // keeps it off the critical path; the command queue (window.$crisp) accepts
  // these pushes even before l.js finishes loading.
  const openChat = () => {
    setLoadAnalytics(true);
    const w = window as any;
    w.$crisp = w.$crisp || [];
    w.$crisp.push(["do", "chat:show"]);
    w.$crisp.push(["do", "chat:open"]);
  };

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
      {/* Crisp live chat — loaded on first interaction (see loadAnalytics),
          so it stays off the critical path and does not affect LCP/CLS/TBT. */}
      {loadAnalytics && (
      <Script id="crisp-chat" strategy="afterInteractive">
        {`
          window.$crisp = window.$crisp || [];
          window.CRISP_WEBSITE_ID="0693cbed-c94f-4e0b-ac9c-0e5fee9034dc";
          /* Hide Crisp's default launcher — we open chat from our own button.
             Re-hide whenever the user closes the chat window. */
          window.$crisp.push(["do", "chat:hide"]);
          window.$crisp.push(["on", "chat:closed", function(){
            window.$crisp.push(["do", "chat:hide"]);
          }]);
          (function(){
            var d=document,s=d.createElement("script");
            s.src="https://client.crisp.chat/l.js";
            s.async=1;
            d.getElementsByTagName("head")[0].appendChild(s);
          })();
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

      {/* Custom "Live Chat" launcher (opens Crisp): "Bhavesh is live" pill +
          a Pulse-Ripple bubble whose red rings ripple outward every second.
          Hidden on the account/accountant/admin pages. */}
      {!hideChat && (
      <div className="fixed md:bottom-[220px] bottom-[60px] right-5 z-[9999] flex items-center gap-3">
        {/* "Bhavesh is live" pill — blinks every 1 second */}
        <button
          type="button"
          onClick={openChat}
          aria-label="Chat with Bhavesh"
          className="tp-live-blink flex items-center gap-2 rounded-full bg-[#22c55e] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_6px_18px_rgba(34,197,94,0.45)] transition-transform duration-300 hover:scale-105 active:scale-95"
        >
          <span className="relative flex h-2 w-2 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-80" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          Bhavesh is live
        </button>

        {/* Pulse-Ripple chat bubble */}
        <button
          type="button"
          onClick={openChat}
          aria-label="Live Chat"
          className="group relative transition-all duration-300 hover:scale-105 active:scale-95"
        >
          {/* ripple rings — expand out from behind the bubble, one per second */}
          <span className="tp-ripple" />
          <span className="tp-ripple tp-ripple-2" />

          <span className="relative z-10 flex h-[68px] w-[68px] flex-col items-center justify-center rounded-full bg-[#ff2a3b] shadow-[0_8px_22px_rgba(255,42,59,0.45)]">
            {/* speech-bubble tail */}
            <span className="absolute -bottom-1 right-3 h-4 w-4 rotate-45 rounded-[3px] bg-[#ff2a3b]" />
            {/* top row: live dot + Live */}
            <span className="relative z-10 flex items-center gap-1 leading-none">
              <span className="tp-breathe relative flex h-2 w-2 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-300 opacity-80" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </span>
              <span className="text-[12px] font-semibold text-[#1B1445]">Live</span>
            </span>
            {/* bottom row: Chat */}
            <span className="relative z-10 mt-0.5 text-[16px] font-extrabold leading-none text-[#1B1445]">
              Chat
            </span>
          </span>
        </button>

        {/* Animations for the Pulse-Ripple launcher only */}
        <style jsx>{`
          .tp-ripple {
            position: absolute;
            inset: 0;
            margin: auto;
            height: 68px;
            width: 68px;
            border-radius: 9999px;
            background: #ff2a3b;
            z-index: 0;
            opacity: 0;
            animation: tp-ripple 2s ease-out infinite;
          }
          .tp-ripple-2 {
            animation-delay: 1s;
          }
          @keyframes tp-ripple {
            0% {
              transform: scale(1);
              opacity: 0.55;
            }
            100% {
              transform: scale(2.3);
              opacity: 0;
            }
          }
          .tp-breathe {
            animation: tp-breathe 1.5s ease-in-out infinite;
          }
          @keyframes tp-breathe {
            0%,
            100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.4);
            }
          }
          .tp-live-blink {
            animation: tp-live-blink 1s ease-in-out infinite;
          }
          @keyframes tp-live-blink {
            0%,
            100% {
              opacity: 1;
            }
            50% {
              opacity: 0.25;
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .tp-ripple,
            .tp-breathe,
            .tp-live-blink {
              animation: none;
            }
            .tp-ripple {
              opacity: 0;
            }
            .tp-live-blink {
              opacity: 1;
            }
          }
        `}</style>
      </div>
      )}

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
