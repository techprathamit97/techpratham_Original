
// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import FireworksPopup from "@/components/common/FireworksPopup";
// const HeroHome = () => {
//   const introText = "Welcome to Techpratham..";
//   const words = [
//     'Workday "',
//     'ServiceNow "',
//     'Guidewire "',
//     'Microsoft Dynamics "',
//     'Power Platform "',
//     'Odoo "',
//     'Oracle "',
//   ];

//   // Step 2️⃣: State management
//   const [typedText, setTypedText] = useState("");
//   const [charIndex, setCharIndex] = useState(0);
//   const [wordIndex, setWordIndex] = useState(0);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [showCourses, setShowCourses] = useState(false); // switch to next phase

//   // Step 3️⃣: First typing effect (Welcome message)
//   useEffect(() => {
//     if (showCourses) return; // skip once done

//     if (charIndex < introText.length) {
//       const timeout = setTimeout(() => {
//         setTypedText((prev) => prev + introText[charIndex]);
//         setCharIndex(charIndex + 1);
//       }, 100);
//       return () => clearTimeout(timeout);
//     } else {
//       // Pause before showing next animation
//       const nextPhase = setTimeout(() => {
//         setShowCourses(true);
//         setTypedText("");
//         setCharIndex(0);
//       }, 1000);
//       return () => clearTimeout(nextPhase);
//     }
//   }, [charIndex, showCourses, introText]);

//   // Step 4️⃣: Typing effect for the course words
//   useEffect(() => {
//     if (!showCourses) return;

//     const currentWord = words[wordIndex];
//     const typingSpeed = isDeleting ? 50 : 100;

//     const timeout = setTimeout(() => {
//       if (!isDeleting && charIndex < currentWord.length) {
//         setTypedText((prev) => prev + currentWord.charAt(charIndex));
//         setCharIndex(charIndex + 1);
//       } else if (isDeleting && charIndex > 0) {
//         setTypedText(currentWord.substring(0, charIndex - 1));
//         setCharIndex(charIndex - 1);
//       } else if (!isDeleting && charIndex === currentWord.length) {
//         setTimeout(() => setIsDeleting(true), 1500);
//       } else if (isDeleting && charIndex === 0) {
//         setIsDeleting(false);
//         setWordIndex((prev) => (prev + 1) % words.length);
//       }
//     }, typingSpeed);

//     return () => clearTimeout(timeout);
//   }, [charIndex, isDeleting, wordIndex, showCourses, words]);

//   return (
//     <div className="relative w-full h-[200px] md:h-[390px] flex items-center justify-center overflow-hidden text-white">
//       {/* Background Video */}
//       {/* <FireworksPopup /> */}
//       <video
//   src="/home/hero/ofinceV.mp4"
//   autoPlay
//   loop
//   muted
//   playsInline
//   className="absolute inset-0 w-full h-full object-cover"
// />
//     <div className="absolute left-4 md:left-16 top-1/2 -translate-y-1/2 z-10 text-left
//                 animate-[slideUp_1s_ease-out_forwards]">
//   <h1 className="text-xl md:text-4xl font-bold leading-tight">
//     EDUCATION IS NOT LUXURY
//     <br />
//     <span className="text-yellow-400">IT'S NECESSITY</span>
//   </h1>
// </div>


//       <div className="absolute top-0 right-0 w-full h-full bg-[#0d0e1848] blur-xl"></div>

//       {/* Logos */}
//       <div className="absolute top-0 right-0 flex md:p-2 p-1 gap-4">
//         <Image
//           src="/home/hero/logo/microsoft.svg"
//           alt="Microsoft"
//           width={60}
//           height={20}
//           className="h-4 md:h-6 w-auto"
//         />
//         <Image
//           src="/home/hero/logo/ibm.svg"
//           alt="IBM"
//           width={60}
//           height={20}
//           className="h-4 md:h-6 w-auto"
//         />
//       </div>

//       {/* Text Section */}

//     </div>
//   );
// };

// export default HeroHome;







"use client";

import Hero from "./hero2";


const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};

const handlePrimaryClick = () => {
  scrollToSection("contact");
};

const handleSecondaryClick = () => {
  scrollToSection("courses");
};

// Demo Component showing how to use the Hero
const HeroDemo: React.FC = () => {



  return (
    // <div className="w-full">
    //   <Hero
    //     trustBadge={{
    //       text: "The choice of professionals who value progress.",
    //       icons: ["✨"]
    //     }}
    //     headline={{
    //       line1: "Power Your",
    //       line2: "Next Career Move"
    //     }}
    //     subtitle="Build practical skills through guided learning designed for real-world challenges and long-term career success."
    //     buttons={{
    //       primary: {
    //         text: "Get Started Today",
    //         onClick: handlePrimaryClick
    //       },
    //       secondary: {
    //         text: "Explore Features",
    //         onClick: handleSecondaryClick
    //       }
    //     }}
    //   />


    // </div>
    <div className='w-full h-[65vh] flex flex-col items-center justify-center py-16 bg-gradient-to-br from-red-500 via-red-950 to-yellow-500 text-white relative overflow-hidden'>
      <div className='absolute inset-0 bg-[url("/patterns/grid.svg")] opacity-5'></div>

      <div className='md:w-10/12 w-11/12 h-auto flex flex-col items-center text-center gap-3 relative z-10'>
        <div className='inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/20'>
          ⭐ The choice of professionals who value progress.
        </div>

        <h1 className="font-bold">

          <div className="inline-flex items-center gap-2   ">

            <span className="text-xs md:text-2xl px-2 py-1 bg-white rounded-md text-black font-semibold">
              Get Train With Us & Get Official Workday Pro Certification workday
            </span>

            <img
              src="/home/hero/logo/prologo.webp"
              alt="Workday Pro"
              className="w-20 h-20"
            />

          </div>

          <br />

          <span className="bg-gradient-to-r from-[#C6151D] to-[#ff6b6b] bg-clip-text text-4xl md:text-7xl text-transparent">
            Next Career Move
          </span>

        </h1>

        <p className='text-gray-300 text-lg md:text-xl max-w-3xl leading-relaxed'>
          Build practical skills through guided learning designed for real-world challenges and long-term career success.
        </p>
      </div>

      <div className='absolute top-10 right-10 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-10 animate-pulse'></div>
      <div className='absolute bottom-10 left-10 w-64 h-64 bg-yellow-400 rounded-full blur-3xl opacity-10 animate-pulse' style={{ animationDelay: '1s' }}></div>
    </div>
  );
};

export default HeroDemo;
