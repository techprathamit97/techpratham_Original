
"use client";

import React from 'react';
import { FaCheckCircle } from 'react-icons/fa'; // Icon for points
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from 'next/image';

interface Step {
  id: number;
  title: string;
  icon: string;
  points: string[];
  color: string;
  baseColor: string;
  gradient: string;
}
// The data remains the same
const stepData: Step[] = [
  { 
    id: 1, 
    title: "Live Class with Industry Use Cases",
    icon: "/home/speciality/icons/1.svg",
    points: [
      "Interactive learning",
      "Real-world examples",
      "Expert guidance",
      "Doubt resolution",
      
    ],
    color: 'yellow', 
    baseColor: 'bg-[#F9C966]', 
    gradient: 'from-[#F9C966] to-[#F5B83C]',
  },
  { 
    id: 2, 
    title: "Daily Assignment & Weekly Assessments",
    icon: "/home/speciality/icons/2.svg",
    points: [
      "Hands-on practice",
      "Concept reinforcement",
      "Weekly evaluation",
      "Timely feedback"
    ],
    color: 'red', 
    baseColor: 'bg-[#DA1E28]', 
    gradient: 'from-[#DA1E28] to-[#1C0A0A]',
  },
  { 
    id: 3, 
    title: "Project Testing & Deployment",
    icon: "/home/speciality/icons/4.svg",
    points: [
      "Project development",
      "Testing practice",
      "Deployment exposure",
      "Portfolio creation"
    ],
    color: 'yellow', 
    baseColor: 'bg-[#F9C966]', 
    gradient: 'from-[#F9C966] to-[#F5B83C]',
  },
  { 
    id: 4, 
    title: "Interview Preparation (Mock, PD, Alumni Session)",
    icon: "/home/speciality/icons/5.svg",
    points: [
      "Mock interviews",
      "Personal development",
      "Alumni guidance",
      "Confidence building"
    ],
    color: 'red', 
    baseColor: 'bg-[#DA1E28]', 
    gradient: 'from-[#DA1E28] to-[#1C0A0A]',
  },
  { 
    id: 5, 
    title: "Resume Building",
    icon: "/home/speciality/icons/6.svg",
    points: [
      "Resume crafting",
      "Industry-focused format",
      "Skills highlighting",
      "Professional presentation"
    ],
    color: 'yellow', 
    baseColor: 'bg-[#F9C966]', 
    gradient: 'from-[#F9C966] to-[#F5B83C]',
  },
  { 
    id: 6,
    title: "Placement",
    icon: "/home/speciality/icons/3.svg",
    points: [
      "Job assistance",
      "Interview support",
      "Career guidance",
      "Opportunity access"
    ],
    color: 'red', 
    baseColor: 'bg-[#DA1E28]', 
    gradient: 'from-[#DA1E28] to-[#1C0A0A]',
  },
];

// Helper component for the individual step
const ChevronStep: React.FC<{ step: Step }> = ({ step }) => {
  const CLIP_PATH_STYLE_COMPLEX = "polygon(0% 0%, 100% 22%, 100% 78%, 0% 100%)";

  return (
    <div className="relative w-[80%] md:w-[200px] h-[390px] ml-2">
      <div 
        className={`absolute inset-0 border-2 ${step.baseColor} bg-gradient-to-b ${step.gradient} transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-3 shadow-2xl hover:shadow-3xl`}
        style={{
          clipPath: CLIP_PATH_STYLE_COMPLEX,
          overflow: "visible", 
          filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.8)) drop-shadow(0 10px 20px rgba(0,0,0,0.5))",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 10px 20px -5px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center pl-3 pr-2 text-center gap-3">
         <div className="flex flex-col items-center text-center gap-1">
  <img 
    src={step.icon} 
    alt={step.title} 
    className="w-12 h-12 mx-auto"
  />
  <h3
    className={`text-sm font-bold text-left ${
      step.color === 'yellow' ? 'text-black' : 'text-white'
    }`}
  >
    {step.title}
  </h3>
</div>

          <ul className="text-xs text-left space-y-1">
            {step.points.map((p, i) => (
              <li key={i} className="flex items-center gap-2">
                <FaCheckCircle className={`${step.color === 'yellow' ? '' : 'text-white/90'}`} />
                <span className={`${step.color === 'yellow' ? 'text-black' : 'text-white/90'}`}>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const StaticChevronSteps = () => {
  // Slick settings for mobile carousel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: true,
    centerMode: true,
    centerPadding: "10px",
  };

  // --- DESKTOP VIEW ---
  const DesktopView = (
    <div 
      className="hidden sm:flex items-center justify-center w-full max-w-6xl mx-auto p-8"
      style={{ perspective: "1200px" }}
    >
      {stepData.map((step) => (
        <ChevronStep key={step.id} step={step} />
      ))}
    </div>
  );

  // --- MOBILE VIEW using react-slick ---
  const MobileView = (
    <div className="sm:hidden w-full">
    <Image
      src="/home/banner/finalplacement.webp"   // your image path in public/
      alt="Mobile Banner"
      width={400}
      height={300}
      className="w-full h-auto"
      priority
    />
  </div>
  );

  return (
    <>
    <div className='w-full flex justify-center'>
    <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
    <div className="pt-5 text-center flex flex-col items-center">
  <h2 className="hidden md:block text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#CD4647] to-[#7F3B40] text-center drop-shadow-md">
    Placement Process
  </h2>

  <svg
    className="hidden md:block mt-2"
    width="260"
    height="6"
    viewBox="0 0 340 6"
    preserveAspectRatio="none"
  >
    <path
      d="M0 3 Q170 0 340 3 Q170 6 0 3 Z"
      fill="#CD4647"
    />
  </svg>
</div>

      {DesktopView}
      {MobileView}
      </div>
      </div>
    </>
  );
};

export default StaticChevronSteps;

// "use client";

// import React from "react";
// import Image from "next/image";

// const StaticChevronSteps = () => {
//   return (
//     <div className="relative max-w-7xl mx-auto w-full h-[40vh] md:h-[90vh]">
//       <Image
//         src="/home/banner/placementprocess.png"
//         alt="Placement Process"
//         fill
//         className="object-fill"
//         priority
//       />
//     </div>
//   );
// };

// export default StaticChevronSteps;