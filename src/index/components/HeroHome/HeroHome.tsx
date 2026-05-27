
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







// "use client";

// import Hero from "./hero2";


// const scrollToSection = (id: string) => {
//   const el = document.getElementById(id);
//   if (el) {
//     el.scrollIntoView({
//       behavior: "smooth",
//       block: "start",
//     });
//   }
// };

// const handlePrimaryClick = () => {
//   scrollToSection("contact");
// };

// const handleSecondaryClick = () => {
//   scrollToSection("courses");
// };

// // Demo Component showing how to use the Hero
// const HeroDemo: React.FC = () => {



//   return (
//     // <div className="w-full">
//     //   <Hero
//     //     trustBadge={{
//     //       text: "The choice of professionals who value progress.",
//     //       icons: ["✨"]
//     //     }}
//     //     headline={{
//     //       line1: "Power Your",
//     //       line2: "Next Career Move"
//     //     }}
//     //     subtitle="Build practical skills through guided learning designed for real-world challenges and long-term career success."
//     //     buttons={{
//     //       primary: {
//     //         text: "Get Started Today",
//     //         onClick: handlePrimaryClick
//     //       },
//     //       secondary: {
//     //         text: "Explore Features",
//     //         onClick: handleSecondaryClick
//     //       }
//     //     }}
//     //   />


//     // </div>
//     <div className='w-full h-[65vh] flex flex-col items-center justify-center py-16 bg-gradient-to-br from-red-500 via-red-950 to-yellow-500 text-white relative overflow-hidden'>
//       <div className='absolute inset-0 bg-[url("/patterns/grid.svg")] opacity-5'></div>

//       <div className='md:w-10/12 w-11/12 h-auto flex flex-col items-center text-center gap-3 relative z-10'>
//         <div className='inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/20'>
//           ⭐ The choice of professionals who value progress.
//         </div>

//         <h1 className="font-bold">

//           <div className="inline-flex items-center gap-2   ">

//             <span className="text-xs md:text-2xl px-2 py-1 bg-white rounded-md text-black font-semibold">
//               Get Train With Us & Get Official Workday Pro Certification.
//             </span>

//             <img
//               src="/home/hero/logo/prologo.webp"
//               alt="Workday Pro"
//               className="w-20 h-20"
//             />

//           </div>

//           <br />

//           <span className="bg-gradient-to-r from-[#C6151D] to-[#ff6b6b] bg-clip-text text-4xl md:text-7xl text-transparent">
//             Next Career Move
//           </span>

//         </h1>

//         <p className='text-gray-300 text-lg md:text-xl max-w-3xl leading-relaxed'>
//           Build practical skills through guided learning designed for real-world challenges and long-term career success.
//         </p>
//       </div>

//       <div className='absolute top-10 right-10 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-10 animate-pulse'></div>
//       <div className='absolute bottom-10 left-10 w-64 h-64 bg-yellow-400 rounded-full blur-3xl opacity-10 animate-pulse' style={{ animationDelay: '1s' }}></div>
//     </div>
//   );
// };

// export default HeroDemo;


"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import LeadForm from "@/components/common/LeadForm/LeadForm";

interface SearchResult {
  title: string;
  link: string;
}

const HeroHome = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Ensure component is mounted (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const icons = [
    { img: "about/icons/Workday.png", link: "/courses/domain/Workday" },
    { img: "about/icons/odoo.png", link: "/courses/domain/Odoo" },
    { img: "about/icons/da.webp", link: "/courses/domain/Data%20Analytics%20And%20Bi%20Training" },
    { img: "about/icons/SAP.png", link: "/courses/domain/SAP" },
    { img: "about/icons/servicenow.webp", link: "/courses/domain/ServiceNow" },
    { img: "about/icons/guidewire.webp", link: "/courses/domain/Guidewire" },
    { img: "about/icons/Pega.png", link: "/courses/domain/Pega" },
    { img: "about/icons/mc.webp", link: "/courses/domain/Azure" },
    { img: "about/icons/microd.png", link: "/courses/domain/Microsoft%20Dynamics" },
    { img: "about/icons/generativeai.webp", link: "/courses/domain/Learn%20Ai" },
  ];

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
        setShowDropdown(true); // Show dropdown immediately with loading state
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
    }, 200); // Reduced from 300ms to 200ms

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
    // If there's a query and results exist, show the dropdown
    if (searchQuery.trim().length >= 2 && searchResults.length > 0) {
      setShowDropdown(true);
    }
  };

  return (
    <div className="relative w-full h-[250px] md:h-[65vh] flex items-center justify-center overflow-hidden text-white">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/home/hero/heroStudent.webp"
          alt="Hero Background"
          fill
          className="md:object-cover object-cover "
          priority
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Floating Icons - Hidden on Mobile */}
      <div className="absolute inset-0 pointer-events-none hidden md:block z-30">
        {icons.map((icon, index) => {
          const positions = [
            { top: "10%", left: "5%" },
            { top: "15%", right: "8%" },
            { top: "25%", left: "15%" },
            { top: "30%", right: "20%" },
            { top: "50%", left: "8%" },
            { top: "55%", right: "12%" },
            { top: "70%", left: "12%" },
            { top: "80%", right: "5%" },
            { top: "85%", left: "20%" },
            { top: "65%", right: "25%" },
          ];

          return (
            <Link
              key={index}
              href={icon.link}
              className="absolute pointer-events-auto icon-bounce"
              style={{
                ...positions[index],
                animationDelay: `${index * 0.5}s`,
              }}
            >
              <div className="bg-white p-1.5 md:p-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <Image
                  src={`/${icon.img}`}
                  alt={`Icon ${index + 1}`}
                  width={40}
                  height={40}
                  className="w-12 h-6 md:w-12 md:h-8 object-contain"
                />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Content */}
      <div className="absolute  left-0 w-full z-10 px-4 text-center">
        <h1 className="text-xl md:text-5xl font-bold mb-4">
          Build<span className="text-yellow-400">Skills</span>
        </h1>

        {/* Search Bar with Dropdown */}
        <div ref={searchContainerRef} className="relative w-[250px] md:w-[450px] md:max-w-xl mx-auto mb-6">
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full md:px-6 px-3 md:py-3 py-1 pr-16 rounded-full text-black text-base outline-none shadow-lg"
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
                <div className="p-4 text-center text-gray-500">
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
        </div>

        {/* Enroll Button */}
        <button
          onClick={() => setShowLeadForm(true)}
          className="hidden md:inline-block bg-gradient-to-tl from-[#C6151D] to-[#600A0E] px-8 md:py-3 py-2 rounded-full font-semibold text-lg transition shadow-lg hover:shadow-xl"
        >
          Enroll Now!
        </button>

        {/* Trust Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-sm">
          <span>🎓</span>
          <span>Techpratham has a strong community of 1.5 lakh+ students and alumni.</span>
        </div>
      </div>

      {/* Lead Form Popup */}
      {showLeadForm && (
        <LeadForm
          course={{ title: "General Inquiry" }}
          onClose={() => setShowLeadForm(false)}
          onSuccess={() => setShowLeadForm(false)}
        />
      )}

      {/* Bubble Bounce Animation CSS */}
      <style jsx global>{`
        @keyframes iconBounce {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }
        .icon-bounce {
          animation: iconBounce 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HeroHome;
