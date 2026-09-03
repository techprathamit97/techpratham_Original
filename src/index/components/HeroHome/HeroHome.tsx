"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
 * Background video path. The <video> element only mounts after the browser is
 * idle post-load, so this file's ~7MB download never enters the LCP budget or
 * blocks initial paint.
 */
const HERO_VIDEO = '/home/hero/officevideo.mov';


const CHIP_ICONS: Record<string, string> = {
  Workday: '👤',
  ServiceNow: '⚙️',
  SAP: '📘',
  'MS Dynamics': '📄',
  'Software Testing': '🧪',
  'Data Analytics': '📈',
};

/**
 * Each chip carries its full EBOOK_GROUPS entry so it can render a hover
 * dropdown of sub-links (Learning e-Book, Interview Questions, etc.), matching
 * the behaviour of the original Navbard strip.
 */
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

  useEffect(() => {
    const win = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
    let idleHandle: number | undefined;
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

    const trigger = () => setMountVideo(true);

    if (typeof win.requestIdleCallback === 'function') {
      idleHandle = win.requestIdleCallback(trigger, { timeout: 2500 });
    } else {
      // Safari, older browsers.
      timeoutHandle = setTimeout(trigger, 1500);
    }

    return () => {
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
    <section className="relative w-full -mt-[64px] md:-mt-[80px] pt-[64px] md:pt-[10px]">
      {/* Hero background: static poster is the LCP element and is always
          present. Video overlays it (opacity fade) once it has buffered. */}
      <div className="absolute inset-0 z-0">
        {/* Static LCP image, unchanged from the previous implementation. */}
        <div className="relative h-full w-full">
          <Image
            src={HERO_POSTER}
            alt="TechPratham IT Training Institute"
            fill
            priority
            fetchPriority="high"
            loading="eager"
            className="object-cover object-center"
            sizes="100vw"
            quality={90}
          />
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
          <div className="absolute inset-0 bg-black/30 z-[1]" />
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


        <div className="w-full mt-5 md:mt-6">
       
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
                    className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white/95 px-3 py-1.5 md:px-4 md:py-2 text-[12px] font-medium text-gray-800 shadow-sm ring-1 ring-black/5 transition hover:bg-white hover:text-[#C6151D] hover:ring-red-200 focus:outline-none focus:ring-2 focus:ring-red-200 group-hover:bg-white group-hover:text-[#C6151D] group-hover:ring-red-200 group-focus-within:bg-white group-focus-within:text-[#C6151D] group-focus-within:ring-red-200"
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