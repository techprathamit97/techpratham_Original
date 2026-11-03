"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import HeroSearch from "./HeroSearch";
import { EBOOK_GROUPS, EbookGroup } from '@/src/common/Navbar/ebookLinks';
import { IoIosArrowUp } from 'react-icons/io';

const HERO_VIDEO = '/home/hero/herovideo.mp4';
// Poster = the video's own first frame, so the transition from still → motion
// is seamless (the image just starts moving) instead of swapping to a
// different picture.
const HERO_POSTER = '/home/hero/herovideo-poster.webp';

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

const HeroHome = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const posterRef = useRef<HTMLImageElement | null>(null);

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
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    const shouldSkipVideo = connection?.saveData ||
      (typeof connection?.effectiveType === 'string' && /(^|-)2g$/.test(connection.effectiveType));
    const video = videoRef.current;
    const poster = posterRef.current;

    if (shouldSkipVideo || !video) return;

    let cancelled = false;
    let raf1 = 0;
    let raf2 = 0;

    const loadVideo = () => {
      if (cancelled) return;
      video.src = HERO_VIDEO;
      video.load();
      video.play().catch(() => {
        // Autoplay can be blocked; the poster remains visible in that case.
      });
    };

    // Start the video as soon as the high-priority poster has painted. The
    // poster is locked in first as the LCP element; the video is exactly the
    // same size, so when its frame paints it is NOT a *larger* paint and does
    // not become a new LCP candidate — the LCP stays the poster + headline.
    // Waiting for the poster to finish first also keeps the 2.4MB video from
    // stealing bandwidth from the poster's own download (protecting LCP time),
    // while loading it far sooner than before so the still-to-motion handoff
    // is nearly instant and matches the frame already on screen.
    const schedule = () => {
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(loadVideo);
      });
    };

    if (!poster || poster.complete) {
      schedule();
    } else {
      poster.addEventListener('load', schedule, { once: true });
      poster.addEventListener('error', schedule, { once: true });
    }

    return () => {
      cancelled = true;
      poster?.removeEventListener('load', schedule);
      poster?.removeEventListener('error', schedule);
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, []);

  return (
    <section className="relative w-full -mt-[64px] md:-mt-[80px] pt-[64px] md:pt-[10px]">
      {/* The poster is the stable initial hero and the video's poster frame. */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        <div className="relative h-full w-full">
          <img
            ref={posterRef}
            src={HERO_POSTER}
            alt=""
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <video
            ref={videoRef}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ${
              isVideoPlaying ? 'opacity-100' : 'opacity-0'
            }`}
            poster={HERO_POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            disablePictureInPicture
            aria-hidden="true"
            tabIndex={-1}
            onPlaying={() => setIsVideoPlaying(true)}
          />
          <div className="absolute inset-0 bg-black/20 z-[1]" />
        </div>
      </div>

      <div className="relative min-h-[320px] md:h-[77vh] flex flex-col items-center justify-end z-10 pt-16 md:pt-24 pb-4 md:pb-6">

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