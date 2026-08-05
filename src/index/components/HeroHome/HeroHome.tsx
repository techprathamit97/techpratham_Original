"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import HeroSearch from "./HeroSearch";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

// Background images for carousel
const fallbackImages = [
  '/home/hero/mainoffice3.webp',
  '/home/hero/mainoffice2.webp',
  '/home/hero/mainoffice1.webp',
];

// ✅ Optimized Client Component with LCP hero image
const HeroHome = () => {
  const [showCarousel, setShowCarousel] = useState(false);

  // ✅ Start carousel after initial render to prevent blocking LCP
  useEffect(() => {
    // Small delay to ensure LCP image renders first
    const timer = setTimeout(() => {
      setShowCarousel(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full">
      {/* ✅ LCP Hero Image Background */}
      <div className="absolute inset-0 z-0">
        {!showCarousel ? (
          // ✅ Static LCP image - renders immediately  
          <div className="relative h-full w-full">
            <Image
              src="/home/hero/mainoffice3.webp"
              alt="TechPratham IT Training Institute"
              fill
              priority
              fetchPriority="high"
              loading="eager"
              className="object-cover object-center"
              sizes="100vw"
              quality={90}
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ) : (
          // ✅ Carousel - loads after LCP
          <div className="relative h-full w-full">
            <Swiper
              modules={[EffectCoverflow, Autoplay]}
              effect="coverflow"
              grabCursor
              centeredSlides
              slidesPerView={1}
              loop
              autoplay={{ 
                delay: 3000, 
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              coverflowEffect={{ 
                rotate: 0, 
                stretch: 0, 
                depth: 200, 
                modifier: 2.5, 
                slideShadows: false 
              }}
              className="h-full w-full"
            >
              {fallbackImages.map((img, index) => (
                <SwiperSlide key={`${img}-${index}`} className="h-full w-full">
                  <div className="relative h-full w-full">
                    <Image
                      src={img}
                      alt={`Hero background ${index + 1}`}
                      fill
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                      className="object-cover object-center"
                      sizes="100vw"
                      quality={index === 0 ? 90 : 75}
                    />
                    <div className="absolute inset-0 bg-black/30" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>

      {/* ✅ Main Content */}
      <div className="relative min-h-[260px] md:min-h-[70vh] container mx-auto flex items-end justify-center z-10 pb-8 md:pb-14">
        <div className="flex flex-col items-center justify-center text-center w-full">
          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Build Better <span className="text-yellow-400">Skills</span>
          </h1>

          {/* Search Bar */}
          <HeroSearch />

          {/* Trust Badge */}
          <div className="hidden md:flex items-center justify-center gap-2 text-sm text-white mt-3">
            <span>🎓</span>
            <span>Techpratham has a strong community of 1.5 lakh+ students and alumni.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroHome;