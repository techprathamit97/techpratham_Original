

import { motion, Variants } from 'framer-motion';
import { Button, type ButtonProps } from '@/components/ui/button'; // Assuming Button is in your components folder
import { cn } from '@/lib/utils'; // Your utility for class names
import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
// import { motion, Variants } from "framer-motion";
// Define the props for reusability
const fallbackImages = [
  // '/about/teams/office0.jpeg',
  '/about/teams/office3.webp',
  '/about/teams/office1.webp',
  '/about/teams/office2.webp',
  '/about/teams/office4.webp',
  '/about/teams/office5.webp',
];

interface StatProps {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface ActionProps {
  text: string;
  onClick: () => void;
  variant?: ButtonProps['variant'];
  className?: string;
}

interface HeroSectionProps {
  title: React.ReactNode;
  subtitle: string;
  actions: ActionProps[];
  stats: StatProps[];
  images: string[];
  className?: string;
}

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const imageVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};


const floatingVariants: Variants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};


const HeroSection = ({ title, subtitle, actions, stats, images, className }: HeroSectionProps) => {
  const baseImages = [...fallbackImages];
  const carouselImages = [...baseImages];

  while (carouselImages.length < 15) {
    carouselImages.push(...baseImages);
  }

  const displayImages = carouselImages.slice(0, 15);

  return (
    <section className={cn("relative w-full overflow-hidden", className)}>

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
          coverflowEffect={{ rotate: 0, stretch: 0, depth: 200, modifier: 2.5, slideShadows: false }}
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
                <div className="absolute inset-0 bg-black/35" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ✅ Overlay (optional but recommended) */}
      {/* <div className="absolute inset-0 bg-red-900/80 z-5" /> */}

      {/* ✅ Main Content */}
      <div className="relative md:h-[500px] h-[250px]  container mx-auto grid grid-cols-1 items-center lg:grid-cols-2 lg:gap-2 z-10">

        {/* Left Column: Text Content */}
        <motion.div
          className="flex flex-col items-left  lg:items-left lg:text-left "
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-3xl pl-5 md:mt-80 mt-24 bottom-0  font-bold bg-gray-300 bg-clip-text text-transparent sm:text-5xl"
            variants={itemVariants}
          >
            {title}
          </motion.h1>
          <motion.p className="mt-2  pl-5 max-w-md   text-lg text-yellow-500 dark:text-gray-300" variants={itemVariants}>
            {subtitle}
          </motion.p>
         
        </motion.div>

    
      </div>

    </section>
  );
};

export default HeroSection;
