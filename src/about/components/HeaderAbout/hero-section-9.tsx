

import { motion,Variants } from 'framer-motion';
import { Button, type ButtonProps } from '@/components/ui/button'; // Assuming Button is in your components folder
import { cn } from '@/lib/utils'; // Your utility for class names
import React from 'react';
import Image from 'next/image';
// import { motion, Variants } from "framer-motion";
// Define the props for reusability
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
  return (
<section className={cn("relative w-full overflow-hidden", className)}>

  {/* ✅ Background Image */}
  <div
    className="absolute inset-0 z-0
               bg-[url('/about/teambg-2.jpeg')]
               bg-cover bg-center"
  />

  {/* ✅ Overlay (optional but recommended) */}
  <div className="absolute inset-0 bg-red-900/80 z-5" />

  {/* ✅ Main Content */}
  <div className="relative  container mx-auto grid grid-cols-1 items-center lg:grid-cols-2 lg:gap-2 z-10">

        {/* Left Column: Text Content */}
        <motion.div
          className="flex flex-col items-left  lg:items-left lg:text-left "
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-3xl pl-5 md:mt-52 bottom-0  font-bold bg-gray-300 bg-clip-text text-transparent sm:text-5xl"
            variants={itemVariants}
          >
            {title}
          </motion.h1>
          <motion.p className="mt-2  pl-5 max-w-md   text-lg text-yellow-500 dark:text-gray-300" variants={itemVariants}>
            {subtitle}
          </motion.p>
          {/* <motion.div className="mt-4 flex flex-wrap justify-center gap-4 lg:justify-start" variants={itemVariants}>
            {actions.map((action, index) => (
              <Button key={index} onClick={action.onClick} variant={action.variant} size="lg" className={action.className}>
                {action.text}
              </Button>
            ))}
          </motion.div>
          <motion.div className="mt-4 flex flex-wrap justify-center gap-8 lg:justify-start" variants={itemVariants}>
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">{stat.icon}</div>
                <div>
                  <p className="text-xl text-gray-200 font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-gray-400 ">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div> */}
        </motion.div>

        {/* Right Column: Image Collage */}
        <motion.div
          className="relative h-[330px] w-full sm:h-[390px]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Decorative Shapes */}
          <motion.div
            className="absolute top-32 left-2/4 h-16 w-16 rounded-full bg-blue-200/20 dark:bg-blue-800/20 z-6"
            variants={floatingVariants}
            animate="animate"
          /> 
            <motion.div
            className="absolute top-32 left-1/3 h-10 w-10 rounded-full bg-blue-200/50 dark:bg-blue-800/30 z-6"
            variants={floatingVariants}
            animate="animate"
          />
            <motion.div
            className="absolute bottom-20 right-0 h-8 w-8 rounded-full bg-blue-200/50 dark:bg-blue-800/30 z-6"
            variants={floatingVariants}
            animate="animate"
          />
          <motion.div
            className="absolute top-10 right-5 h-16 w-16 rounded-full bg-blue-200/50 dark:bg-blue-800/30 z-6"
            variants={floatingVariants}
            animate="animate"
          />
            <motion.div
            className="absolute -top-0 left-1/4 h-16 w-16 rounded-full bg-yellow-200/50 dark:bg-yellow-800/30 z-10"
            variants={floatingVariants}
            animate="animate"
          />
           <motion.div
            className="absolute bottom-0 left-1/4  h-16 w-16 rounded-full bg-blue-200/50 dark:bg-blue-800/30 z-2"
            variants={floatingVariants}
            animate="animate"
          />
        

          {/* Images */}
          <motion.div
            className="absolute right-0 bottom-0 h-80 w-80  rounded-2xl mr-5  sm:h-[340px] sm:w-[400px]"
            style={{ transformOrigin: 'bottom center' }}
            variants={imageVariants}
          >
            <Image src={images[0]} alt="Student learning" className="h-full w-full  rounded-xl object-contain object-bottom" />
          </motion.div>
          {/* <motion.div
            className="absolute right-0  bottom-1 h-40 w-40 rounded-2xl bg-muted p-2 shadow-lg sm:h-56 sm:w-56"
            style={{ transformOrigin: 'left center' }}
            variants={imageVariants}
          >
            <img src={images[1]} alt="Tutor assisting" className="h-full w-full rounded-xl object-cover" />
          </motion.div> */}
          {/* <motion.div
            className="absolute bottom-0 left-0 h-32 w-32 rounded-2xl   shadow-lg  sm:h-72 sm:w-72"
            style={{ transformOrigin: 'top right' }}
            variants={imageVariants}
          >
            <img src={images[2]} alt="Collaborative discussion" className="h-full w-full rounded-[160px]  object-cover" />
          </motion.div> */}
        </motion.div>
      </div>
      
    </section>
  );
};

export default HeroSection;
