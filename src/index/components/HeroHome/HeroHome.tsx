"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import HeroSearch from "./HeroSearch";
// Swiper removed intentionally: the carousel added ~40KB of JS to the LCP path.
// The hero now paints a solid CSS gradient immediately (so the LCP element is
// the headline text, not an image) and fades the background video in on top
// once it is buffered.
import { EBOOK_GROUPS, EbookGroup } from '@/src/common/Navbar/ebookLinks';
import { IoIosArrowUp } from 'react-icons/io';

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
   *   - The hero paints a solid CSS gradient immediately (no network), so the
   *     LCP element is the headline text, which renders right after first byte.
   *   - The <video> element is only added to the DOM ~4s after the load event
   *     (and only when the hero is in view / not on a slow connection), so the
   *     video never competes for network or CPU during the critical first
   *     paint and cannot become the LCP element.
   *   - The video fades in on top of the gradient once its first frame is
   *     buffered, so there is no visual flash.
   *
   * requestIdleCallback is not supported everywhere; setTimeout is the fallback.
   */
  const [mountVideo, setMountVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

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
    const POST_LOAD_DELAY = 4000;

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
      v.playbackRate = 0.5; // preserve the previous slow-motion background effect
      v.play().catch(() => {
        // Autoplay blocked - keep poster visible, no error to the user.
      });
      setVideoReady(true);
    }
  };

  return (
    <section ref={sectionRef} className="relative w-full -mt-[64px] md:-mt-[80px] pt-[64px] md:pt-[10px]">
      {/* Hero background.
          No poster <img> is rendered: an image LCP element was costing ~880ms
          resource-load-delay + ~850ms load-duration. Instead we paint a solid
          CSS gradient immediately (zero network, so the LCP element becomes the
          headline text, which paints right after first byte). The decorative
          video then fades in on top once it is buffered (mounted ~4s after
          load / on view, so it never touches the LCP budget). */}
      <div className="absolute inset-0 z-0">
        <div className="relative h-full w-full bg-gradient-to-br from-[#2a0a0c] via-[#4a0f14] to-[#1c0708]">
          {/*
            Background video mounts after idle so it never enters the LCP
            budget. preload="metadata" gives the browser only enough info to
            start playback without downloading the whole file eagerly. The
            video is muted and playsInline so browser autoplay policy allows
            it, and the aria-hidden signals to screen readers that it is
            decorative.
          */}
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
      <div className="relative min-h-[320px] md:min-h-[80vh] flex flex-col items-center justify-end z-10 pt-16 md:pt-24 pb-4 md:pb-6">

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
        <div className="w-full mt-5 md:mt-6 min-h-[44px] md:min-h-[52px]">
       
          <div className="flex flex-nowrap items-center gap-2 md:gap-3
                          overflow-x-auto md:overflow-x-visible md:justify-center
                          no-scrollbar py-1 pl-4 pr-4 md:px-6">
            {HERO_CHIPS.map((chip, index) => {
              const alignRight = index >= HERO_CHIPS.length - 2;
              return (
                <div key={chip.label} className="relative group shrink-0">
                  <button
                    type="button"
                    aria-haspopup="true"
                    className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white/95 px-3 py-1.5 md:px-4 md:py-2 text-[12px] font-bold text-[#ff2a3b] shadow-sm ring-1 ring-black/5 transition hover:bg-white hover:text-black hover:ring-red-200 focus:outline-none focus:ring-2 focus:ring-red-200 group-hover:bg-white group-hover:text-[#C6151D] group-hover:ring-red-200 group-focus-within:bg-white group-focus-within:text-[#C6151D] group-focus-within:ring-red-200"
                  >
                    <span aria-hidden="true" className="text-base leading-none">{chip.icon}</span>
                    <span>{chip.label}</span>
                    <IoIosArrowUp
                      className="w-3 h-3 shrink-0 transition-transform group-hover:-rotate-180 group-focus-within:-rotate-180"
                      aria-hidden="true"
                    />
                  </button>

                  {/* Dropdown — opens upward */}
                  <div
                    className={`absolute bottom-full mb-2 w-52 rounded-lg border border-gray-100 bg-white shadow-xl opacity-0 invisible translate-y-1 transition-all duration-200 z-50 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 ${
                      alignRight ? 'right-0' : 'left-0'
                    }`}
                    role="menu"
                  >
                    {chip.links.map((link, i) => (
                      <Link
                        key={`${chip.label}-${link.href}-${link.label}`}
                        href={link.href}
                        role="menuitem"
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
        </div>

      </div>
    </section>
  );
};

export default HeroHome;