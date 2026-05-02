// import React from 'react';
// import Image from 'next/image';
// import { Badge } from '@/components/ui/badge';
// import { LightningBoltIcon } from '@radix-ui/react-icons';

// import './speciality.css';

// const SpecialityHome = () => {
//   return (
//     <div className='w-full h-auto flex flex-col items-center justify-center py-24 gap-12 bg-black text-white overflow-hidden'>

//       <div className='md:w-10/12 w-11/12 h-auto flex flex-col text-center'>
//         <div className="md:text-5xl text-2xl md:font-semibold font-semibold">Why Choose <span className='bg-gradient-to-tr from-[#FC7A35] to-[#f8da52] text-transparent bg-clip-text'>Tech Pratham?</span></div>
//       </div>

//       <div className='lg:w-6/12 md:w-9/12 w-11/12 h-auto flex flex-col gap-6'>
//         <div className='flex flex-row gap-4'>
//           <div className='w-16 h-auto flex flex-col items-center justify-start'>
//             <div className='w-16 h-16 rounded bg-blue-500 flex items-center justify-center'>
//               <Image src='/home/speciality/training.png' alt='' className='w-10 h-10 rounded-sm' width={40} height={40} />
//             </div>
//             <Image src='/home/speciality/arrow.svg' alt='' width={10} height={10} className='w-auto h-auto' />
//           </div>
//           <div className='w-11/12 bg-black text-white md:p-6 p-4 rounded-xl border-4 border-red-600 object-cover boxShadow'>
//             <div className='font-semibold md:text-2xl text-xl'>Training Mode</div>
//             <div className='text-gray-200 md:text-base text-sm md:font-medium font-light'>Choose from two versatile training modes designed to match your learning preferences:</div>
//             <div className='md:w-10/12 w-full bg-[#121212] md:rounded-lg rounded-none p-3 flex md:flex-row flex-col md:gap-4 gap-3 items-center justify-between mt-4'>
//               <div className='flex flex-row gap-3 font-light'>
//                 <Image src='/home/speciality/camera.png' alt='' className='w-14 h-14 rounded-sm' width={40} height={40} />
//                 <span>100% Live Online Classes</span>
//               </div>
//               <div className='flex flex-row gap-3 font-light'>
//                 <Image src='/home/speciality/hybrid.png' alt='' className='w-14 h-14 rounded-sm' width={40} height={40} />
//                 <span>Hybrid Mode Classes</span>
//               </div>
//             </div>
//             <div className='text-gray-200 text-sm font-normal mt-4'><span className='text-orange-600'>*Important Note:</span> Hybrid learning combines the best of both worlds—virtual flexibility and face-to-face collaboration.</div>
//           </div>
//         </div>

//         <div className='flex flex-row gap-4'>
//           <div className='w-16 h-auto flex flex-col items-center justify-start'>
//             <div className='w-16 h-16 rounded bg-violet-500 flex items-center justify-center'>
//               <Image src='/home/speciality/practical.png' alt='' className='w-10 h-10 rounded-sm' width={40} height={40} />
//             </div>
//             <Image src='/home/speciality/arrow.svg' alt='' width={10} height={10} className='w-auto h-auto' />
//           </div>
//           <div className='w-11/12 bg-black text-white md:p-6 p-4 rounded-xl border-4 border-red-600 object-cover boxShadow'>
//             <div className='font-semibold md:text-2xl text-xl'>Hands-On Practical Training</div>
//             <div className='text-gray-200 md:text-base text-sm md:font-medium font-light'>Dive deep into real-world scenarios across industries like BFSI, Retail, Healthcare, and more. Our Training ensures practical relevence tailored to sectors such as:</div>
//             <div className='flex flex-row flex-wrap gap-2 mt-4'>
//               <Badge className='px-3 md:py-1 py-0 text-base font-light cursor-pointer bg-[#121212] flex flex-row gap-2 items-center justify-center'>
//                 <Image src='/home/speciality/icons/manufacture.png' alt='' width={22} height={22} />
//                 <div>Manufacturing</div>
//               </Badge>
//               <Badge className='px-3 md:py-1 py-0 text-base font-light cursor-pointer bg-[#121212] flex flex-row gap-2 items-center justify-center'>
//                 <Image src='/home/speciality/icons/technology.png' alt='' width={22} height={22} />
//                 <div>Technology</div>
//               </Badge>
//               <Badge className='px-3 md:py-1 py-0 text-base font-light cursor-pointer bg-[#121212] flex flex-row gap-2 items-center justify-center'>
//                 <Image src='/home/speciality/icons/consulting.png' alt='' width={22} height={22} />
//                 <div>Consulting</div>
//               </Badge>
//               <Badge className='px-3 md:py-1 py-0 text-base font-light cursor-pointer bg-[#121212] flex flex-row gap-2 items-center justify-center'>
//                 <Image src='/home/speciality/icons/healthcare.png' alt='' width={22} height={22} />
//                 <div>Healthcare</div>
//               </Badge>
//               <Badge className='px-3 md:py-1 py-0 text-base font-light cursor-pointer bg-[#121212] flex flex-row gap-2 items-center justify-center'>
//                 <Image src='/home/speciality/icons/bfsi.png' alt='' width={22} height={22} />
//                 <div>BFSI</div>
//               </Badge>
//               <Badge className='px-3 md:py-1 py-0 text-base font-light cursor-pointer bg-[#121212] flex flex-row gap-2 items-center justify-center'>
//                 <Image src='/home/speciality/icons/retail.png' alt='' width={22} height={22} />
//                 <div>Retail</div>
//               </Badge>
//             </div>
//           </div>
//         </div>

//         <div className='flex flex-row gap-4'>
//           <div className='w-16 h-auto flex flex-col items-center justify-start'>
//             <div className='w-16 h-16 rounded bg-green-500 flex items-center justify-center'>
//               <Image src='/home/speciality/project.png' alt='' className='w-10 h-10 rounded-sm' width={40} height={40} />
//             </div>
//             <Image src='/home/speciality/arrow.svg' alt='' width={10} height={10} className='w-auto h-auto' />
//           </div>
//           <div className='w-11/12 bg-black text-white md:p-6 p-4 rounded-xl border-4 border-red-600 object-cover boxShadow'>
//             <div className='font-semibold md:text-2xl text-xl'>Real Projects, Real Outcomes</div>
//             <div className='text-gray-200 md:text-base text-sm md:font-medium font-light'>Through our Trending courses get hands-on experience with real-world challenges. Work on 100+ industry-specific projects under the guidance of professionals:</div>
//             <div className='md:w-9/12 w-full bg-[#121212] md:rounded-lg rounded-none p-3 flex flex-row items-center justify-between gap-3 mt-4'>
//               <Image src='/home/speciality/isi_mark.svg' alt='' className='w-16 h-full rounded-sm' width={40} height={40} />
//               <div className='w-auto'>Earn Certification for every project you complete:</div>
//             </div>
//           </div>
//         </div>

//         <div className='flex flex-row gap-4'>
//           <div className='w-16 h-auto flex flex-col items-center justify-start'>
//             <div className='w-16 h-16 rounded bg-orange-500 flex items-center justify-center'>
//               <Image src='/home/speciality/career.png' alt='' className='w-10 h-10 rounded-sm' width={40} height={40} />
//             </div>
//             <Image src='/home/speciality/arrow.svg' alt='' width={10} height={10} className='w-auto h-auto' />
//           </div>
//           <div className='w-11/12 bg-black text-white md:p-6 p-4 rounded-xl border-4 border-red-600 object-cover boxShadow'>
//             <div className='font-semibold md:text-2xl text-xl'>Achieve Your Career Aspirations</div>
//             <div className='text-gray-200 md:text-base text-sm md:font-medium font-light'>Leverage our placement support to secure your dream job. Our career services include:</div>
//             <div className='flex flex-col gap-2 mt-4'>
//               <div className='font-light md:text-base text-sm'>Placement Assistance: Connect with top recruiters.</div>
//               <div className='font-light md:text-base text-sm'>Mock Interview Sessions: Sharpen your interview skills.</div>
//               <div className='font-light md:text-base text-sm'>Resume Optimizations: Craft a professional resume that stands out.</div>
//               <div className='font-light md:text-base text-sm'>Exclusive Interview Opportunities: Access high-value job openings in leading companies.</div>
//             </div>
//           </div>
//         </div>
//       </div>

//     </div>
//   )
// }

// export default SpecialityHome

// import React from "react";
// import Image from "next/image";
// import { Badge } from "@/components/ui/badge";
// import "./speciality.css";

// const SpecialityHome = () => {
//   return (
//     <div className="w-full h-auto flex flex-col items-center justify-center py-24 gap-16 text-white parallax-bg">

//       {/* Heading */}
//       <div className="md:w-10/12 w-11/12 text-center">
//         <h2 className="md:text-5xl text-black text-3xl font-semibold">
//           Why Choose{" "}
//           <span className="bg-gradient-to-tr from-[#FC7A35] to-[#f8da52] text-transparent bg-clip-text">
//             Tech Pratham?
//           </span>
//         </h2>
//       </div>

//       {/* GRID: 2 Rows × 2 Columns */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:w-10/12 w-11/12">

//         {/* 1️⃣ Training Mode */}
//         <div className="flex gap-4 items-start">
//           <div className="flex flex-col items-center">
//             <div className="w-16 h-16 bg-blue-500 rounded flex items-center justify-center">
//               <Image src="/home/speciality/training.png" width={40} height={40} alt="" />
//             </div>
//             <Image src="/home/speciality/arrow.svg" width={12} height={12} alt="" />
//           </div>

//           <div className="w-full bg-black/80 p-6 rounded-xl border-4 border-red-600 boxShadow">
//             <h3 className="text-2xl font-semibold">Training Mode</h3>
//             <p className="text-gray-200 text-sm mt-2">
//               Choose from our flexible learning formats:
//             </p>

//             <div className=" p-3 rounded-lg mt-4 space-y-3">
//               <div className="flex items-center gap-3 font-light">
//                 <Image src="/home/speciality/camera.png" width={40} height={40} alt="" />
//                 100% Live Online Classes
//               </div>

//               <div className="flex items-center gap-3 font-light">
//                 <Image src="/home/speciality/hybrid.png" width={40} height={40} alt="" />
//                 Hybrid Mode Classes
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* 2️⃣ Practical Training */}
//         <div className="flex gap-4 items-start">
//           <div className="flex flex-col items-center">
//             <div className="w-16 h-16 bg-violet-500 rounded flex items-center justify-center">
//               <Image src="/home/speciality/practical.png" width={40} height={40} alt="" />
//             </div>
//             <Image src="/home/speciality/arrow.svg" width={12} height={12} alt="" />
//           </div>

//           <div className="w-full bg-black/80 p-6 rounded-xl border-4 border-red-600 boxShadow">
//             <h3 className="text-2xl font-semibold">Hands-On Practical Training</h3>
//             <p className="text-gray-200 text-sm mt-2">
//               Practical skills across multiple industries including:
//             </p>

//             <div className="flex flex-wrap gap-2 mt-4">
//               {["manufacture", "Technology", "Consulting", "Healthcare", "BFSI", "Retail"].map(
//                 (item, idx) => (
//                   <Badge
//                     key={idx}
//                     className="px-3 py-1 flex items-center gap-2 text-base font-light"
//                   >
//                     <Image
//                       src={`/home/speciality/icons/${item.toLowerCase()}.png`}
//                       width={22}
//                       height={22}
//                       alt=""
//                     />
//                     {item}
//                   </Badge>
//                 )
//               )}
//             </div>
//           </div>
//         </div>

//         {/* 3️⃣ Real Projects */}
//         <div className="flex gap-4 items-start">
//           <div className="flex flex-col items-center">
//             <div className="w-16 h-16 bg-green-500 rounded flex items-center justify-center">
//               <Image src="/home/speciality/project.png" width={40} height={40} alt="" />
//             </div>
//             <Image src="/home/speciality/arrow.svg" width={12} height={12} alt="" />
//           </div>

//           <div className="w-full bg-black/80 p-6 rounded-xl border-4 border-red-600 boxShadow">
//             <h3 className="text-2xl font-semibold">Real Projects, Real Outcomes</h3>
//             <p className="text-gray-200 text-sm mt-2">
//               Work on 100+ live industry projects and boost your career.
//             </p>

//             <div className="flex items-center gap-4  p-3 rounded-lg mt-4">
//               <Image
//                 src="/home/speciality/isi_mark.svg"
//                 width={40}
//                 height={40}
//                 alt=""
//               />
//               <span>Earn Certification for every completed project</span>
//             </div>
//           </div>
//         </div>

//         {/* 4️⃣ Career Support */}
//         <div className="flex gap-4 items-start">
//           <div className="flex flex-col items-center">
//             <div className="w-16 h-16 bg-orange-500 rounded flex items-center justify-center">
//               <Image src="/home/speciality/career.png" width={40} height={40} alt="" />
//             </div>
//             <Image src="/home/speciality/arrow.svg" width={12} height={12} alt="" />
//           </div>

//           <div className="w-full bg-black/80 p-6 rounded-xl border-4 border-red-600 boxShadow">
//             <h3 className="text-2xl font-semibold">Achieve Your Career Aspirations</h3>

//             <div className="flex flex-col gap-2 text-gray-200 text-sm mt-4">
//               <p>✔ Placement Assistance with top companies</p>
//               <p>✔ Mock Interview Sessions</p>
//               <p>✔ Resume Optimization</p>
//               <p>✔ Exclusive Interview Opportunities</p>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };


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
  <h1 className="hidden md:block text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#CD4647] to-[#7F3B40] text-center drop-shadow-md">
    Placement Process
  </h1>

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