'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LogoCloud } from '@/src/index/components/ClientHome/logo-cloud-3';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';

const clientLogos = [
  { src: '/home/client-logo/techmd.png', alt: 'Accenture Logo' },
  { src: '/home/client-logo/tcsd.jpg', alt: 'AWS Logo' },
  { src: '/home/client-logo/microshofd.png', alt: 'Capgemini Logo' },
  { src: '/home/client-logo/download (1).png', alt: 'Deloitte Logo' },
  { src: '/home/client-logo/genpactd.png', alt: 'Genpact Logo' },
  { src: '/home/client-logo/deloitted.png', alt: 'HP Logo' },
  { src: '/home/client-logo/awsd.png', alt: 'Intel Logo' },
  { src: '/home/client-logo/CapgeminiD.svg', alt: 'Microsoft Logo' },
  { src: '/home/client-logo/wiprod.png', alt: 'Infosys Logo' },
  { src: '/home/client-logo/zohod.png', alt: 'Zoho Logo' },
  { src: '/home/client-logo/zelis.jpg', alt: 'Zelis Logo' },
  { src: '/home/client-logo/wns.png', alt: 'Wipro Logo' },
  { src: '/home/client-logo/saintg.png', alt: 'Saint Gobain Logo' },
  { src: '/home/client-logo/onx.png', alt: 'ONX Logo' },
  { src: '/home/client-logo/nava.png', alt: 'Nava Logo' },
  { src: '/home/client-logo/infosysd.png', alt: 'Infosys Logo' },
  { src: '/home/client-logo/downlohcl.png', alt: 'HCL Logo' },
  { src: '/home/client-logo/egonzehnderd.png', alt: 'Egon Zehnder Logo' },
  { src: '/home/client-logo/congnizantd.jpg', alt: 'Cognizant Logo' },
  { src: '/home/client-logo/bosch.png', alt: 'Bosch Logo' },
  { src: '/home/client-logo/bankofa.jpg', alt: 'Bank of America Logo' },
];

const slides = [
  {
    src: '/corporate/sentgobin.jpeg',
    caption: 'In partnership with Balmer Lawrie & Co. Ltd.',
  },
  {
    src: '/corporate/hydrabedt.jpeg',
    caption: 'In partnership with Balmer Lawrie & Co. Ltd.',
  },
   {
    src: '/corporate/corporate4.webp',
    caption: 'Upskilling enterprise teams',
  },
  
  {
    src: '/corporate/bosch.webp',
    caption: 'Upskilling enterprise teams',
  },
  {
    src: '/corporate/wnstr.jpeg',
    caption: 'Upskilling enterprise teams',
  },
  {
    src: '/corporate/bdes.webp',
    caption: 'Upskilling enterprise teams',
  },
  {
    src: '/corporate/bankofamrica.webp',
    caption: 'Upskilling enterprise teams',
  },
  {
    src: '/corporate/blcl.webp',
    caption: 'Upskilling enterprise teams',
  },
  {
    src: '/corporate/delivery.webp',
    caption: 'Upskilling enterprise teams',
  },
   {
    src: '/corporate/meeting_portrait.jpeg',
    caption: 'Upskilling enterprise teams',
  },
  {
    src: '/corporate/gravity.webp',
    caption: 'Upskilling enterprise teams',
  },
    {
    src: '/corporate/aitraning.webp',
    caption: 'Corporate training delivered on-site',
  },
  {
    src: '/corporate/harman.jpeg',
    caption: 'Upskilling enterprise teams',
  },
];

const deliverables = [
  'Trusted by enterprises and government organizations',
  'Programs delivered across Workday, SAP, ServiceNow & AI',
  'Customized to each company’s teams and workflows',
  'On-site and online delivery for teams of any size',
];

const TrainingShowcase = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [current, setCurrent] = useState(0);

  return (
    <section className="w-full flex justify-center py-3">
      <div className="w-11/12 md:w-10/12 max-w-6xl flex flex-col gap-14">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        {/* Left: text */}
        <div className="flex flex-col gap-5">
          <span className="px-4 py-1 rounded-full border border-[#FF2E41]/40 bg-[#FF2E41]/5 text-[#FF2E41] uppercase tracking-widest text-xs font-semibold w-fit">
            Where We&apos;ve Delivered
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 leading-snug">
            Corporate training we&apos;ve delivered for leading companies
          </h2>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            TechPratham has partnered with enterprises and government
            organizations to upskill their teams. From Balmer Lawrie &amp; Co.
            Ltd. to other industry leaders, here&apos;s a glimpse of the corporate
            training programs we have successfully delivered.
          </p>

          <ul className="flex flex-col gap-3 mt-1">
            {deliverables.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 w-6 h-6 rounded-full bg-[#FF2E41]/10 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-[#FF2E41]" />
                </span>
                <span className="text-gray-700 text-sm md:text-base leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <div className="pt-2">
            <Link href="#enquiry">
              <Button
                variant="default"
                className="h-11 px-7 text-base bg-[#FF2E41] hover:bg-[#E0202F] transition-all duration-200"
              >
                Plan a Program
              </Button>
            </Link>
          </div>
        </div>

        {/* Right: carousel */}
        <div className="w-full">
          <div className="relative w-full max-w-sm mx-auto">
            <Swiper
              modules={[Autoplay, Pagination]}
              loop
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              speed={700}
              pagination={{ clickable: true }}
              onSwiper={(s) => {
                swiperRef.current = s;
              }}
              onSlideChange={(s) => setCurrent(s.realIndex)}
              className="rounded-2xl overflow-hidden shadow-xl border border-border bg-gray-50 [&_.swiper-pagination]:!bottom-3 [&_.swiper-pagination-bullet]:!bg-white/70 [&_.swiper-pagination-bullet]:!opacity-100 [&_.swiper-pagination-bullet-active]:!bg-[#FF2E41] [&_.swiper-pagination-bullet-active]:!w-5 [&_.swiper-pagination-bullet-active]:!rounded-full"
            >
              {slides.map((slide, index) => (
                <SwiperSlide key={slide.src}>
                  <div className="relative w-full aspect-[4/5]">
                    <Image
                      src={slide.src}
                      alt={slide.caption}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 384px"
                      priority={index === 0}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Arrows */}
            <button
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#FF2E41] flex items-center justify-center shadow-md transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#FF2E41] flex items-center justify-center shadow-md transition-all duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Caption */}
          <p className="text-center text-gray-700 font-medium text-sm md:text-base mt-4">
            {slides[current]?.caption}
          </p>
        </div>
        </div>

        {/* Companies where we've delivered corporate training */}
        <div className="flex flex-col gap-6 pt-4 border-t border-border">
          <p className="text-center text-sm font-medium text-gray-500 uppercase tracking-widest">
            Companies where we&apos;ve already delivered corporate training
          </p>
          <LogoCloud logos={clientLogos} />
        </div>
      </div>
    </section>
  );
};

export default TrainingShowcase;
