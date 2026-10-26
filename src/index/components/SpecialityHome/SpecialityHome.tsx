
"use client";

import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa'; // Icon for points

interface Step {
  id: number;
  title: string;
  label: string; // short label shown on the collapsed (slim) panel
  icon: string;
  image: string; // background photo for this panel
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
    label: "Live Classes",
    icon: "/home/speciality/icons/1.svg",
    image: "/course/assessment.jpg",
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
    label: "Assignments",
    icon: "/home/speciality/icons/2.svg",
    image: "/course/assignment.avif",
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
    label: "Project & Deployment",
    icon: "/home/speciality/icons/4.svg",
    image: "/course/projbg.webp",
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
    label: "Interview Prep",
    icon: "/home/speciality/icons/5.svg",
    image: "/course/INTERVIEW.webp",
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
    label: "Resume",
    icon: "/home/speciality/icons/6.svg",
    image: "/course/resume.jpeg",
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
    label: "Placement",
    icon: "/home/speciality/icons/3.svg",
    image: "/course/hired.webp",
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

// Helper component for the individual step.
// `isActive` controls whether it is expanded (full content) or collapsed (slim label).
const ChevronStep: React.FC<{
  step: Step;
  stepNumber: number;
  isActive: boolean;
  onActivate: () => void;
}> = ({ step, stepNumber, isActive, onActivate }) => {
  return (
    <div
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      tabIndex={0}
      role="button"
      aria-expanded={isActive}
      className={`relative h-[390px] cursor-pointer outline-none transition-[flex-grow,flex-basis] duration-500 ease-out ${
        isActive ? 'flex-[6] min-w-[280px]' : 'flex-[1] min-w-[70px]'
      }`}
    >
      <div
        className={`absolute inset-0  overflow-hidden bg-cover bg-center transition-all duration-500 ease-out ${
          isActive ? '-translate-y-2 scale-[1.02]' : 'hover:-translate-y-1'
        }`}
        style={{
          backgroundImage: `url('${step.image}')`,
          clipPath: "polygon(0% 0%, 100% 6%, 100% 94%, 0% 100%)",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 10px 20px -5px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Readability overlay over the photo */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            isActive
              ? 'bg-black/40'
              : 'bg-black/50'
          }`}
        />

        {/* ===== Expanded content ===== */}
        <div
          className={`absolute inset-0 flex flex-col justify-center gap-3 pl-8 pr-6 transition-opacity duration-300 ${
            isActive ? 'opacity-100 delay-150' : 'opacity-0 pointer-events-none'
          }`}
        >
         
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/70">
            Step {stepNumber}
          </span>
          <h3 className="text-xl font-bold leading-snug text-white drop-shadow">
            {step.title}
          </h3>
          <ul className="text-sm space-y-2 mt-1">
            {step.points.map((p, i) => (
              <li key={i} className="flex items-center gap-2">
                <FaCheckCircle className="shrink-0 text-white/90" />
                <span className="text-white/95">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ===== Collapsed content (slim label) ===== */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-6 px-1 transition-opacity duration-300 ${
            isActive ? 'opacity-0 pointer-events-none' : 'opacity-100 delay-150'
          }`}
        >

          <span className="[writing-mode:vertical-rl] rotate-180 font-bold text-sm whitespace-nowrap tracking-wide text-white drop-shadow">
            {step.label}
          </span>
        </div>
      </div>
    </div>
  );
};

// Mobile variant: full-width rows stacked vertically that grow in height when tapped.
const MobileStep: React.FC<{
  step: Step;
  stepNumber: number;
  isActive: boolean;
  onActivate: () => void;
}> = ({ step, stepNumber, isActive, onActivate }) => {
  return (
    <div
      onClick={onActivate}
      role="button"
      aria-expanded={isActive}
      className={`relative w-full rounded-2xl overflow-hidden bg-cover bg-center cursor-pointer transition-[max-height] duration-500 ease-out ${
        isActive ? 'max-h-[460px]' : 'max-h-[84px]'
      }`}
      style={{
        backgroundImage: `url('${step.image}')`,
        boxShadow: "0 10px 25px -8px rgba(0, 0, 0, 0.6)",
      }}
    >
      {/* Readability overlay over the photo */}
      <div
        className={`absolute inset-0 bg-gradient-to-t ${
          isActive ? 'from-black/80 via-black/40 to-black/60' : 'from-black/70 via-black/30 to-black/55'
        }`}
      />

      {/* Header row (icon + label) — always visible; label hides when expanded */}
      <div className="relative flex items-center gap-3 h-[84px] px-5">
       
        {!isActive && (
          <span className="font-bold text-lg text-white drop-shadow">{step.label}</span>
        )}
      </div>

      {/* Expanded content */}
      <div
        className={`relative px-5 pb-5 transition-opacity duration-300 ${
          isActive ? 'opacity-100 delay-150' : 'opacity-0 pointer-events-none'
        }`}
      >
        <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/70">
          Step {stepNumber}
        </span>
        <h3 className="text-lg font-bold leading-snug text-white drop-shadow mt-1">
          {step.title}
        </h3>
        <ul className="text-sm space-y-2 mt-3">
          {step.points.map((p, i) => (
            <li key={i} className="flex items-center gap-2">
              <FaCheckCircle className="shrink-0 text-white/90" />
              <span className="text-white/95">{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const StaticChevronSteps = () => {
  // Which panel is expanded. Defaults to the second step.
  const [activeIndex, setActiveIndex] = useState(1);

  // --- DESKTOP VIEW ---
  const DesktopView = (
    <div className="hidden sm:flex items-center justify-center gap-2 w-full max-w-6xl mx-auto p-8">
      {stepData.map((step, index) => (
        <ChevronStep
          key={step.id}
          step={step}
          stepNumber={index + 1}
          isActive={index === activeIndex}
          onActivate={() => setActiveIndex(index)}
        />
      ))}
    </div>
  );

  // --- MOBILE VIEW (vertical expanding accordion) ---
  const MobileView = (
    <div className="sm:hidden w-full flex flex-col gap-3 py-6">
      {stepData.map((step, index) => (
        <MobileStep
          key={step.id}
          step={step}
          stepNumber={index + 1}
          isActive={index === activeIndex}
          onActivate={() => setActiveIndex(index)}
        />
      ))}
    </div>
  );

  return (
    <>
    <div className='w-full flex justify-center'>
    <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
    <div className="pt-5 text-center flex flex-col items-center">
  <h2 className="text-2xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#CD4647] to-[#7F3B40] text-center drop-shadow-md">
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
