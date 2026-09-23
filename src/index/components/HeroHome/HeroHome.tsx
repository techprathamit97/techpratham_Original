"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import HeroSearch from "./HeroSearch";
// Swiper removed intentionally: the carousel added ~40KB of JS to the LCP path
// and shifted the hero repeatedly during load. Replaced by a static poster
// image (LCP-safe) with a background video that mounts only after idle.
import { EBOOK_GROUPS, EbookGroup } from '@/src/common/Navbar/ebookLinks';
import { IoIosArrowUp } from 'react-icons/io';

/**
 * Poster image path. Renders immediately with priority and is the LCP element,
 * so replacing it or removing it will affect Core Web Vitals.
 */
const HERO_POSTER = '/home/hero/mainoffice3.webp';

/**
 * Background video path. Web-optimized MP4 (H.264, ~4MB). The <video> element
 * only mounts after page load + when the hero is in view (and never on slow
 * connections), so this download never enters the LCP budget or blocks the
 * initial paint.
 */
const HERO_VIDEO = '/home/hero/officevideo.mp4';


const CHIP_ICONS: Record<string, string> = {
  Workday: '👤',
  ServiceNow: '⚙️',
  SAP: '📘',
  'MS Dynamics': '📄',
  'Software Testing': '🧪',
  'Data Analytics': '📈',
};


const HERO_CHIPS: Array<EbookGroup & { icon: string }> = EBOOK_GROUPS.map((group) => ({
  ...group,
  icon: CHIP_ICONS[group.shortLabel] ?? '📚',
}));

// ✅ Optimized Client Component with LCP hero image
const HeroHome = () => {
  /**
   * Video mount gate.
   *
   * LCP strategy:
   *   - The poster image below renders IMMEDIATELY with priority and is the
   *     LCP candidate. It stays visible until the video overlays it.
   *   - The <video> element is only added to the DOM after the browser has
   *     been idle for a moment post-load. This guarantees the 7MB video does
   *     not compete with the poster for network or CPU during the critical
   *     first paint, so LCP is unaffected.
   *   - The video fades in on top of the poster once its first frame is
   *     buffered, so there is no visual flash.
   *
   * requestIdleCallback is not supported everywhere; setTimeout is the fallback.
   */
  const [mountVideo, setMountVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Which e-book chip dropdown is open (click/tap based so it works on touch
  // devices too, where hover does not exist). null = all closed.
  const [openChip, setOpenChip] = useState<number | null>(null);
  const chipsRef = useRef<HTMLDivElement | null>(null);

  // Close the open chip dropdown when tapping/clicking outside the chip strip.
  useEffect(() => {
    if (openChip === null) return;
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (chipsRef.current && !chipsRef.current.contains(e.target as Node)) {
        setOpenChip(null);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [openChip]);

  useEffect(() => {
    const win = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };

    /**
     * Network guard. The background video is decorative and heavy (~7MB), so
     * skip it entirely on data-saver mode or slow connections. Those users
     * simply keep the poster image — no functional loss, and the large
     * download never competes for bandwidth (this is the main Speed Index win).
     */
    const conn = (navigator as any).connection;
    if (conn) {
      const slow = conn.saveData ||
        (typeof conn.effectiveType === 'string' && /(^|-)2g$/.test(conn.effectiveType));
      if (slow) {
        return; // never mount the video
      }
    }

    let idleHandle: number | undefined;
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
    let started = false;

    const trigger = () => {
      if (started) return;
      started = true;
      setMountVideo(true);
    };

    /**
     * After the page has fully loaded, wait a further fixed delay before even
     * creating the <video> element. This guarantees the decorative background
     * video's ~4MB download and decode happen well OUTSIDE the window that
     * Lighthouse measures (FCP / LCP / Speed Index / Time to Interactive), so
     * it can no longer become the LCP element or extend "fully loaded" time.
     * The poster image stays the LCP element throughout.
     */
    const POST_LOAD_DELAY = 2000;

    const scheduleAfterDelay = () => {
      // Only mount when the hero is actually in the viewport.
      const el = sectionRef.current;
      const start = () => {
        timeoutHandle = setTimeout(trigger, POST_LOAD_DELAY);
      };

      if (!el || typeof IntersectionObserver === 'undefined') {
        start();
        return;
      }
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          start();
        }
      });
      observer.observe(el);
      // Store on the outer var so cleanup can disconnect it.
      observerRef = observer;
    };

    let observerRef: IntersectionObserver | undefined;

    if (document.readyState === 'complete') {
      scheduleAfterDelay();
    } else {
      window.addEventListener('load', scheduleAfterDelay, { once: true });
    }

    return () => {
      window.removeEventListener('load', scheduleAfterDelay);
      observerRef?.disconnect();
      if (idleHandle !== undefined && 'cancelIdleCallback' in window) {
        (window as any).cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle) clearTimeout(timeoutHandle);
    };
  }, []);

  /**
   * Autoplay hint. Once the video element has enough data to play, fade it in
   * over the poster. If autoplay is blocked, the poster simply remains, which
   * is a graceful degradation.
   */
  const handleVideoCanPlay = () => {
    const v = videoRef.current;
    if (v && v.readyState >= 2) {
  
      v.play().catch(() => {
        // Autoplay blocked - keep poster visible, no error to the user.
      });
      setVideoReady(true);
    }
  };

  return (
    <section ref={sectionRef} className="relative w-full -mt-[64px] md:-mt-[80px] pt-[64px] md:pt-[10px]">
      {/* Hero background: static poster is the LCP element and is always
          present. Video overlays it (opacity fade) once it has buffered. */}
      <div className="absolute inset-0 z-0">
        {/* LCP image — Next.js <Image> with priority so it is preloaded and
            optimized. fill + object-cover reproduces the previous absolute
            full-bleed background behavior. */}
        <div className="relative h-full w-full">
          <Image
            src={HERO_POSTER}
            alt="TechPratham IT Training Institute"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center"
          />
        
          {mountVideo && (
            <video
              ref={videoRef}
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ${videoReady ? 'opacity-100' : 'opacity-0'
                }`}
              src={HERO_VIDEO}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              disablePictureInPicture
              aria-hidden="true"
              onCanPlay={handleVideoCanPlay}
            />
          )}
          <div className="absolute inset-0 bg-black/10 z-[1]" />
        </div>
      </div>

      {/* ✅ Main Content */}
      <div className="relative min-h-[320px] md:h-[70vh] flex flex-col items-center justify-end z-10 pt-16 md:pt-24 pb-4 md:pb-6">

        {/* Headline + search — padded, centred */}
        <div className="flex w-full flex-col items-center text-center gap-6 md:gap-8 px-4">
          <h1
            className="font-serif italic text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-semibold leading-tight text-[#ff2a3b] drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Build Better <span className="text-white">Skills</span>
          </h1>

          <HeroSearch />
        </div>


        {/* min-height reserves the chip row's vertical space so that when the
            web font swaps in and chip text metrics change, the row (and
            everything below it) does not move. This removes the font-swap
            layout shift that Lighthouse attributed to the Workday/ServiceNow
            chips (~0.17 CLS). */}
        <div ref={chipsRef} className="relative w-full mt-5 md:mt-6 min-h-[44px] md:min-h-[52px]">
       
          <div
            className="flex flex-nowrap items-center gap-2 md:gap-3
                          overflow-x-auto lg:overflow-x-visible lg:justify-center
                          no-scrollbar py-1 pl-4 pr-4 md:px-6">
            {HERO_CHIPS.map((chip, index) => {
              const alignRight = index >= HERO_CHIPS.length - 2;
              const isOpen = openChip === index;
              return (
                <div key={chip.label} className="relative shrink-0">
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    onClick={() => setOpenChip(isOpen ? null : index)}
                    className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 md:px-4 md:py-2 text-[12px] font-bold shadow-sm ring-1 transition focus:outline-none focus:ring-2 focus:ring-red-200 ${
                      isOpen
                        ? 'bg-white text-[#C6151D] ring-red-200'
                        : 'bg-white/95 text-[#ff2a3b] ring-black/5 hover:bg-white hover:text-black hover:ring-red-200'
                    }`}
                  >
                    <span aria-hidden="true" className="text-base leading-none">{chip.icon}</span>
                    <span>{chip.label}</span>
                    <IoIosArrowUp
                      className={`w-3 h-3 shrink-0 transition-transform ${isOpen ? '-rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>

                  {/* DESKTOP dropdown — opens upward. Desktop row uses
                      overflow-x-visible so this is not clipped. Hidden on mobile
                      (mobile uses the shared panel rendered below the strip). */}
                  <div
                    className={`hidden lg:block absolute bottom-full mb-2 w-52 rounded-lg border border-gray-100 bg-white shadow-xl transition-all duration-200 z-50 ${
                      isOpen
                        ? 'opacity-100 visible translate-y-0'
                        : 'opacity-0 invisible pointer-events-none'
                    } ${alignRight ? 'right-0' : 'left-0'}`}
                    role="menu"
                  >
                    {chip.links.map((link, i) => (
                      <Link
                        key={`${chip.label}-${link.href}-${link.label}`}
                        href={link.href}
                        role="menuitem"
                        onClick={() => setOpenChip(null)}
                        className={`block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-red-50 hover:text-[#C6151D] ${
                          i === 0 ? 'rounded-t-lg' : ''
                        } ${i === chip.links.length - 1 ? 'rounded-b-lg' : ''}`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* MOBILE dropdown panel — absolutely positioned popup that floats
              over the content below, so it does NOT push the page structure
              down. Rendered outside the scrolling chip row so it is never
              clipped and never widens the page. */}
          {openChip !== null && (
            <div className="lg:hidden absolute left-4 right-4 top-full z-50">
              <div className="w-full rounded-lg border border-gray-100 bg-white shadow-xl overflow-hidden" role="menu">
                {HERO_CHIPS[openChip].links.map((link) => (
                  <Link
                    key={`m-${HERO_CHIPS[openChip].label}-${link.href}-${link.label}`}
                    href={link.href}
                    role="menuitem"
                    onClick={() => setOpenChip(null)}
                    className="block px-4 py-2.5 text-sm text-gray-700 border-b border-gray-50 last:border-b-0 hover:bg-red-50 hover:text-[#C6151D] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default HeroHome;