// 'use client';
// import { useEffect, useState, useRef } from 'react';
// import { FileText, Briefcase, Users } from 'lucide-react';

// // --- Interface for Statistics Data ---
// interface StatProps {
//     end: number;
//     text: string;
//     description: string;
//     suffix: string;
//     icon: React.ReactNode;
// }

// // --- Dynamic Counter Component ---
// const StatCounter: React.FC<StatProps> = ({ end, text, description, suffix, icon }) => {
//     const [count, setCount] = useState(0);
//     const ref = useRef(null);
//     const duration = 3000; // milliseconds

//     useEffect(() => {
//         // Only proceed if the environment supports IntersectionObserver (client side)
//         if (typeof window === 'undefined' || !window.IntersectionObserver) return;

//         const observer = new IntersectionObserver(
//             ([entry]) => {
//                 if (entry.isIntersecting) {
//                     let start = 0;
//                     const increment = end / (duration / 50); 

//                     const timer = setInterval(() => {
//                         start += increment;
//                         if (start >= end) {
//                             setCount(end);
//                             clearInterval(timer);
//                             observer.unobserve(entry.target);
//                         } else {
//                             setCount(Math.ceil(start));
//                         }
//                     }, 50);
//                     return () => clearInterval(timer);
//                 }
//             },
//             { threshold: 0.5 }
//         );

//         if (ref.current) {
//             observer.observe(ref.current);
//         }

//         return () => {
//             if (ref.current) {
//                 observer.unobserve(ref.current);
//             }
//         };
//     }, [end, duration]);

//     const displayValue = `${count}${suffix}`;

//     return (
//         // Added styling to the counter item itself for better visual separation
//         <div ref={ref} className="text-center p-1 md:p-3 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl transition-all duration-500 hover:scale-[1.02]">
//             <div className="flex justify-center md:mb-3">
//                 {icon}
//             </div>
//             <h3 className="md:text-2xl text-sm font-extrabold text-yellow-700 md:mb-2">{displayValue}</h3>
//             <p className="md:text-sm text-xs font-bold text-gray-800 md:mb-2">{text}</p>
//             <p className="hidden md:block text-xs text-gray-600 leading-snug">{description}</p>
//         </div>
//     );
// };

// // --- Updated Statistics Section Component with Background Image and Overlay ---
// export default function TrainingRecruitmentStats() {
//     return (
//         <div 
//             className="py-10 md:px-4 px-2 w-full relative overflow-hidden"
//             style={{
//                 // 1. Base image (subtle pattern)
//                 backgroundImage: 'url(/about/numberc.jpeg)',
//                 backgroundSize: 'cover',
//                 // backgroundRepeat: 'no-repeat',
//                 backgroundPosition: 'center',
//                 // 2. Overlay via CSS linear-gradient (dark blue wash)
//                 // background: 'linear-gradient(rgba(0, 0, 128, 0.8), rgba(0, 0, 128, 0.8)), url(/path/to/subtle-pattern.jpg)',
//                 // backgroundSize: 'cover',
//                 // backgroundPosition: 'center',
//             }}
//         >
//             {/* Inner container to ensure text/icons remain white/bright over the dark overlay */}
//             <div className="max-w-5xl mx-auto grid grid-cols-3 md:grid-cols-3 md:gap-8 gap-3 relative z-10 text-white">
//                 <StatCounter 
//                     end={84567} 
//                     text="Happy Learners" 
//                     description="Join a thriving community of learners and grow your skills every day."
//                     suffix="+"
//                     icon={<img
//                             src="/home/hero/logo/happlyI.png"
//                             alt="Custom Icon"
//                             className="w-16 h-16"
//                         />} 
//                 />
//                 <StatCounter 
//                     end={300} 
//                     text="Courses" 
//                     description="Wide range of courses designed to build in-demand skills for your career."
//                     suffix="+"
//                     icon={<img
//                             src="/home/hero/logo/courses.svg"
//                             alt="Custom Icon"
//                             className="w-24 h-20"
//                         />} // Adjusted icon color for contrast
//                 />
//                 <StatCounter 
//                     end={150} 
//                     text="Corporate Partners" 
//                     description="Wide range of courses designed to build in-demand skills for your career."
//                     suffix="+"
//                     icon={ <img
//                             src="/home/hero/logo/ptrnr.png"
//                             alt="Custom Icon"
//                             className="w-12 h-12"
//                         />} // Adjusted icon color for contrast
//                 />
//             </div>
//         </div>
//     );
// }


'use client';

import { useEffect, useRef, useState } from 'react';

/* ===============================
   ODOMETER DIGIT
================================ */
const getDigitHeight = () => {
  if (typeof window === "undefined") return 56;
  if (window.innerWidth < 640) return 36;   // mobile
  if (window.innerWidth < 1024) return 48;  // tablet
  return 56;                                // desktop
};

function RollingDigit({
  digit,
  index,
  start,
}: {
  digit: number;
  index: number;
  start: boolean;
}) {
  
  const [pos, setPos] = useState(0);
  const [HEIGHT, setHEIGHT] = useState(56);

useEffect(() => {
  const updateHeight = () => setHEIGHT(getDigitHeight());
  updateHeight();
  window.addEventListener("resize", updateHeight);
  return () => window.removeEventListener("resize", updateHeight);
}, []);


  useEffect(() => {
    if (!start) return;

    // Higher place value → slower + longer roll
    const cycles = index * 10;
    const target = cycles + digit;

    const t = setTimeout(() => {
      setPos(target);
    }, index * 150);

    return () => clearTimeout(t);
  }, [digit, index, start]);

  return (
    <div className="overflow-hidden" style={{ height: HEIGHT, width: 25 }}>
      <div
        style={{
          transform: `translateY(-${pos * HEIGHT}px)`,
          transition: `transform ${1.2 + index * 0.35}s cubic-bezier(0.25,0.8,0.25,1)`,
        }}
      >
        {Array.from({ length: index * 10 + 10 }).map((_, i) => (
          <div
            key={i}
            style={{ height: HEIGHT }}
            className="flex items-center justify-center text-3xl font-fjalla md:text-5xl font-extrabold text-red-700"
          >
            {i % 10}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===============================
   ODOMETER NUMBER
================================ */

function Odometer({
  value,
  suffix,
  start,
}: {
  value: number;
  suffix: string;
  start: boolean;
}) {
  const digits = value.toString().split('');

  return (
    <div className="flex justify-center items-end">
      {digits.map((d, i) => (
        <RollingDigit
          key={i}
          digit={Number(d)}
          index={digits.length - i}
          start={start}
        />
      ))}
      <span className="text-2xl md:text-5xl  font-extrabold text-red-700 ml-1">
        {suffix}
      </span>
    </div>
  );
}

/* ===============================
   STAT COUNTER
================================ */

interface StatProps {
  end: number;
  text: string;
  suffix: string;

}

const StatCounter: React.FC<StatProps> = ({
  end,
  text,

  suffix,

}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!window.IntersectionObserver) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="text-center p-1 md:p-3 bg-white/80 rounded-xl  transition-all duration-500 hover:scale-[1.02]"
    >
      {/* <div className="flex justify-center md:mb-3">{icon}</div> */}

      <Odometer value={end} suffix={suffix} start={start} />
      <p className="md:text-sm text-xs uppercase font-bold text-gray-800 md:mb-2">
        {text}
      </p>

    </div>
  );
};

/* ===============================
   SECTION
================================ */

export default function TrainingRecruitmentStats() {
  return (
    <div
      className="py-10 md:px-4 bg-gradient-to-tl from-yellow-600 to-[#600A0E] px-2 w-full relative overflow-hidden"
      
    >
      <div className="max-w-5xl mx-auto grid grid-cols-3 md:grid-cols-3 md:gap-8 gap-1 relative z-10 text-white">
        <StatCounter
          end={94567}
          text="Happy Learners"
          suffix="+"

        />

        <StatCounter
          end={329}
          text="Courses"
          suffix="+"

        />

        <StatCounter
          end={150}
          text="Corporate Partners"
          suffix="+"

        />
      </div>
    </div>
  );
}
