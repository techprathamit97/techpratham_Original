'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FaLinkedin } from 'react-icons/fa';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { teams } from '../../../../components/assets/teams';

const DESC_LIMIT = 120;

const EducatorHome = () => {
  const [startIdx, setStartIdx] = useState(0);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [cardWidth, setCardWidth] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [gapPx, setGapPx] = useState(32);
  const viewportRef = useRef<HTMLDivElement>(null);

  const total = teams.length;
  const MAX_START = Math.max(0, total - cardsPerView);
  const canGoBack    = startIdx > 0;
  const canGoForward = startIdx < MAX_START;

  // Responsive: 1 card on mobile, 2 on tablet, 3 on desktop.
  // Recalculates card pixel width whenever viewport or breakpoint changes.
  useEffect(() => {
    const calc = () => {
      if (!viewportRef.current) return;
      const vpWidth = viewportRef.current.offsetWidth;

      // Derive responsive values from viewport width only.
      const cpv = vpWidth < 640 ? 1 : vpWidth < 1024 ? 2 : 3;
      const gap = vpWidth < 640 ? 16 : 24;

      setCardsPerView(cpv);
      setGapPx(gap);
      setCardWidth((vpWidth - gap * (cpv - 1)) / cpv);

      // Clamp startIdx so it doesn't exceed new MAX_START.
      setStartIdx((prev) => Math.min(prev, Math.max(0, total - cpv)));
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [total]);

  // Translate = startIdx × (cardWidth + gap)
  const translateX = startIdx * (cardWidth + gapPx);

  const goForward = () => setStartIdx((i) => Math.min(i + 1, MAX_START));
  const goBack    = () => setStartIdx((i) => Math.max(0, i - 1));

  const toggleExpand = (i: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });

  return (
    <div className="w-full bg-[#fdfbfb] py-3 px-4 md:px-5">
      {/* Heading */}
      <div className="flex flex-col items-center text-center mb-3">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Meet Our Team</h2>
        <svg className="mt-2" width="260" height="6" viewBox="0 0 340 6" preserveAspectRatio="none">
          <path d="M0 3 Q170 0 340 3 Q170 6 0 3 Z" fill="#7f1d1d" />
        </svg>
        <p className="mt-1 text-gray-500 text-sm md:text-base">
          Get to know the dedicated faculty and experts behind TechPratham.
        </p>
      </div>

      {/* Carousel */}
      <div className="relative max-w-6xl mx-auto">

        {/* Left arrow — hidden at position 0 */}
        {canGoBack && (
          <button
            onClick={goBack}
            aria-label="Previous"
            className="absolute left-1 sm:-left-5 md:-left-8 top-1/2 -translate-y-1/2 z-20
                       w-10 h-10 flex items-center justify-center
                       rounded-full bg-white border border-gray-200 shadow-md
                       hover:bg-gray-50 transition"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
        )}

        {/* Viewport — clips the track */}
        <div ref={viewportRef} className="overflow-hidden w-full">
          {/* Sliding track */}
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              gap: `${gapPx}px`,
              transform: cardWidth ? `translateX(-${translateX}px)` : 'none',
            }}
          >
            {teams.map((item: any, index) => {
              const isExpanded = expanded.has(index);
              const desc: string = item.about || '';
              const truncated =
                desc.length > DESC_LIMIT && !isExpanded
                  ? desc.slice(0, DESC_LIMIT).trimEnd() + '...'
                  : desc;

              return (
                <div
                  key={index}
                  className="flex-shrink-0"
                  style={{ width: cardWidth ? `${cardWidth}px` : `calc((100% - ${gapPx * (cardsPerView - 1)}px) / ${cardsPerView})` }}
                >
                  <div className="flex flex-col border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-white h-full">
                    {/* Photo */}
                    <div className="relative w-full h-60 bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 70vw, 33vw"
                        className="object-cover object-top"
                      />
                    </div>

                    {/* Body */}
                    <div className="py-2 px-3 flex flex-col gap-1">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.position}</p>
                      </div>

                      {item.workingAt && (
                        <div className="flex items-center gap-2">
                         
                          {item.workingAt.logo && (
                            <Image
                              src={item.workingAt.logo}
                              alt={item.workingAt.name}
                              width={80}
                              height={24}
                              className="h-6 w-auto object-contain"
                            />
                          )}
                        </div>
                      )}

                      {desc && (
                        <div className="text-xs text-gray-600 leading-relaxed">
                          {/* Text clamped to 2 lines when collapsed */}
                          <div className={isExpanded ? '' : 'line-clamp-2'}>
                            {desc}
                          </div>
                          {/* Button on its own line below the text */}
                          <button
                            onClick={() => toggleExpand(index)}
                            className="mt-1 block text-xs font-semibold text-gray-900 underline hover:text-[#C6151D] transition-colors"
                          >
                            {isExpanded ? 'Read Less' : 'Read More'}
                          </button>
                        </div>
                      )}

                      {item.linkedin && (
                        <a
                          href={item.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 font-semibold text-sm hover:underline w-fit"
                        >
                          <span>LinkedIn Profile</span>
                          <FaLinkedin className="w-5 h-5 text-blue-600" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right arrow — hidden at last position */}
        {canGoForward && (
          <button
            onClick={goForward}
            aria-label="Next"
            className="absolute right-1 sm:-right-5 md:-right-8 top-1/2 -translate-y-1/2 z-20
                       w-10 h-10 flex items-center justify-center
                       rounded-full bg-white border border-gray-200 shadow-md
                       hover:bg-gray-50 transition"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        )}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-2">
        {Array.from({ length: MAX_START + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setStartIdx(i)}
            aria-label={`Go to position ${i + 1}`}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              startIdx === i ? 'bg-[#C6151D]' : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default EducatorHome;
