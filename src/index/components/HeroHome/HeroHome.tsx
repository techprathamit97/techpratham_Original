"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import LeadForm from "@/components/common/LeadForm/LeadForm";
import { motion, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

interface SearchResult {
  title: string;
  link: string;
}

// Background images for carousel
const fallbackImages = [
  '/home/hero/mainoffice3.webp',
  '/home/hero/mainoffice2.webp',
  '/home/hero/mainoffice1.webp',
  // '/home/hero/mainoffice3.webp',
  // '/home/hero/mainoffice4.webp',
  // '/home/hero/mainoffice5.webp',
  
];

// Animation variants for Framer Motion
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const searchVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: 0.4,
    },
  },
};

const HeroHome = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Prepare carousel images
  const baseImages = [...fallbackImages];
  const carouselImages = [...baseImages];
  while (carouselImages.length < 15) {
    carouselImages.push(...baseImages);
  }
  const displayImages = carouselImages.slice(0, 15);

  // Ensure component is mounted (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Truncate title to 5 words
  const truncateTitle = (title: string): string => {
    const words = title.split(" ");
    if (words.length <= 5) return title;
    return words.slice(0, 5).join(" ") + "...";
  };

  // Search courses with debouncing
  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        setShowDropdown(true);
        try {
          const response = await fetch(`/api/search/courses?q=${encodeURIComponent(searchQuery)}`);
          if (response.ok) {
            const data = await response.json();
            setSearchResults(data);
          }
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCourseClick = () => {
    setShowDropdown(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSearchButtonClick = () => {
    if (searchQuery.trim().length >= 2 && searchResults.length > 0) {
      setShowDropdown(true);
    }
  };

  return (
    <section className="relative w-full ">
      {/* ✅ Background Carousel */}
      <div className="absolute inset-0 z-0">
        <Swiper
          modules={[EffectCoverflow, Autoplay]}
          effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView={1}
          loop
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          coverflowEffect={{ 
            rotate: 0, 
            stretch: 0, 
            depth: 200, 
            modifier: 2.5, 
            slideShadows: false 
          }}
          className="h-full w-full"
        >
          {displayImages.map((img, index) => (
            <SwiperSlide key={`${img}-${index}`} className="h-full w-full">
              <div className="relative h-full w-full">
                <Image
                  src={img}
                  alt={`Hero background ${index + 1}`}
                  fill
                  priority={index === 0}
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ✅ Main Content */}
      <div className="relative min-h-[260px] md:min-h-[70vh] container mx-auto flex items-end justify-center z-10 pb-8 md:pb-14">
        {/* Content: Text & Search */}
        <motion.div
          className="flex flex-col items-center justify-center text-center w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Title */}
          <motion.h1
            className="text-3xl md:text-5xl font-bold text-white mb-4"
            variants={itemVariants}
          >
            Build Better <span className="text-yellow-400">Skills</span>
          </motion.h1>

          {/* Search Bar with Dropdown */}
          <motion.div 
            ref={searchContainerRef} 
            className="relative w-[240px] md:w-[65vh] md:max-w-xl mx-auto "
            variants={searchVariants}
          >
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full md:px-6 px-3 md:py-2 py-1 pr-16 rounded-full text-black text-base outline-none shadow-lg"
              />
              <button
                onClick={handleSearchButtonClick}
                className="absolute right-0 top-0 bottom-0 bg-gradient-to-tl from-[#C6151D] to-[#600A0E] px-6 rounded-r-full transition-colors flex items-center justify-center"
                aria-label="Search"
              >
                <Search className='w-6 h-6 text-white' />
              </button>
            </div>

            {/* Search Results Dropdown */}
            {isMounted && showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border-2 border-gray-200 max-h-80 overflow-y-auto z-[9999] animate-slideDown">
                {isSearching ? (
                  <div className="p-4 text-center text-gray-500 flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-3 text-center text-gray-500">
                    No courses found
                  </div>
                ) : (
                  <div className="py-2">
                    {searchResults.map((course, index) => (
                      <Link
                        key={index}
                        href={`/courses/${course.link}`}
                        onClick={handleCourseClick}
                        className="block px-4 py-3 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <p className="text-left text-black font-medium text-sm">
                          {truncateTitle(course.title)}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Trust Badge */}
          <motion.div 
            className="hidden md:flex items-center justify-center gap-2 text-sm text-white mt-3"
            variants={itemVariants}
          >
            <span>🎓</span>
            <span>Techpratham has a strong community of 1.5 lakh+ students and alumni.</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Lead Form Popup */}
      {showLeadForm && (
        <LeadForm
          course={{ title: "General Inquiry" }}
          onClose={() => setShowLeadForm(false)}
          onSuccess={() => setShowLeadForm(false)}
        />
      )}

      {/* Animation CSS */}
      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </section>
  );
};

export default HeroHome;