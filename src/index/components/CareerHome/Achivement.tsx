// 'use client';

// import { useEffect, useRef, useState } from 'react';

// /* ===============================
//    ODOMETER DIGIT
// ================================ */
// const getDigitHeight = () => {
//   if (typeof window === "undefined") return 56;
//   if (window.innerWidth < 640) return 36;   
//   if (window.innerWidth < 1024) return 48;  
//   return 56;                                
// };

// function RollingDigit({
//   digit,
//   index,
//   start,
// }: {
//   digit: number;
//   index: number;
//   start: boolean;
// }) {
  
//   const [pos, setPos] = useState(0);
//   const [HEIGHT, setHEIGHT] = useState(56);

// useEffect(() => {
//   const updateHeight = () => setHEIGHT(getDigitHeight());
//   updateHeight();
//   window.addEventListener("resize", updateHeight);
//   return () => window.removeEventListener("resize", updateHeight);
// }, []);


//   useEffect(() => {
//     if (!start) return;

//     // Higher place value → slower + longer roll
//     const cycles = index * 10;
//     const target = cycles + digit;

//     const t = setTimeout(() => {
//       setPos(target);
//     }, index * 150);

//     return () => clearTimeout(t);
//   }, [digit, index, start]);

//   return (
//     <div className="overflow-hidden" style={{ height: HEIGHT, }}>
//       <div
//         style={{
//           transform: `translateY(-${pos * HEIGHT}px)`,
//           transition: `transform ${1.2 + index * 0.35}s cubic-bezier(0.25,0.8,0.25,1)`,
//         }}
//       >
//         {Array.from({ length: index * 10 + 10 }).map((_, i) => (
//           <div
//             key={i}
//             style={{ height: HEIGHT }}
//             className="flex items-center justify-center text-2xl font-fjalla md:text-5xl font-extrabold text-white"
//           >
//             {i % 10}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// /* ===============================
//    ODOMETER NUMBER
// ================================ */

// function Odometer({
//   value,
//   suffix,
//   start,
// }: {
//   value: number;
//   suffix: string;
//   start: boolean;
// }) {
//   const digits = value.toString().split('');

//   return (
//     <div className="flex justify-center items-end">
//       {digits.map((d, i) => (
//         <RollingDigit
//           key={i}
//           digit={Number(d)}
//           index={digits.length - i}
//           start={start}
//         />
//       ))}
//       <span className="text-2xl md:text-5xl  font-extrabold text-white ml-1">
//         {suffix}
//       </span>
//     </div>
//   );
// }

// /* ===============================
//    STAT COUNTER
// ================================ */

// interface StatProps {
//   end: number;
//   text: string;
//   suffix: string;

// }

// const StatCounter: React.FC<StatProps> = ({
//   end,
//   text,

//   suffix,

// }) => {
//   const ref = useRef<HTMLDivElement>(null);
//   const [start, setStart] = useState(false);

//   useEffect(() => {
//     if (!window.IntersectionObserver) return;

//     const obs = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setStart(true);
//           obs.disconnect();
//         }
//       },
//       { threshold: 0.4 }
//     );

//     if (ref.current) obs.observe(ref.current);
//     return () => obs.disconnect();
//   }, []);

//   return (
//    <div
//   ref={ref}
//   className="relative overflow-hidden rounded-xl bg-cover bg-center bg-no-repeat transition-all duration-500 hover:scale-[1.02]"
 
// >

//   <div className="relative z-10 p-1 md:p-3 text-center">
//     <Odometer value={end} suffix={suffix} start={start} />

//     <p className="md:text-sm text-xs uppercase font-bold text-white md:mb-2">
//       {text}
//     </p>
//   </div>
// </div>
//   );
// };

// /* ===============================
//    SECTION
// ================================ */

// export default function TrainingRecruitmentStats() {
//   return (
//     <div
//   className="relative w-full overflow-hidden bg-[#fdfbfb] px-2 py-10 md:px-4"
//   style={{
//     backgroundImage: "url('/home/hero/mainoffice3.webp')",
//     backgroundAttachment: "fixed",
//   }}
// >
//   {/* Overlay */}
//   <div className="absolute inset-0 bg-black/70"></div>

//   {/* Content */}
//   <div className="relative z-10 mx-auto grid w-full grid-cols-3 gap-1 text-white md:gap-8">
//     <StatCounter
//       end={94567}
//       text="Happy Learners"
//       suffix="+"
//     />

//     <StatCounter
//       end={329}
//       text="Courses"
//       suffix="+"
//     />

//     <StatCounter
//       end={150}
//       text="Corporate Partners"
//       suffix="+"
//     />
//   </div>
// </div>
//   );
// }

'use client';

import { useEffect, useRef, useState } from 'react';

/* ===============================
   ODOMETER DIGIT
================================ */
const getDigitHeight = () => {
  if (typeof window === "undefined") return 56;
  if (window.innerWidth < 640) return 22;  // small enough to fit 1/3 column
  if (window.innerWidth < 1024) return 38;
  return 52;
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

    const cycles = index * 10;
    const target = cycles + digit;

    const t = setTimeout(() => {
      setPos(target);
    }, index * 150);

    return () => clearTimeout(t);
  }, [digit, index, start]);

  return (
    <div
      className="relative overflow-hidden rounded-md border border-[#3d475a] bg-gradient-to-b from-[#2b3240] via-[#171b24] to-[#0d0f14] shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-3px_6px_rgba(0,0,0,0.8),0_4px_8px_rgba(0,0,0,0.4)]"
      style={{
        height: HEIGHT,
        width: HEIGHT * 0.75,
      }}
    >
      {/* Horizontal slot divider line */}
      <div className="pointer-events-none absolute left-0 top-1/2 z-20 h-[1px] w-full bg-black/50 shadow-[0_1px_0_rgba(255,255,255,0.08)]" />

      {/* Rolling digits reel */}
      <div
        className="relative z-10"
        style={{
          transform: `translateY(-${pos * HEIGHT}px)`,
          transition: `transform ${1.2 + index * 0.35}s cubic-bezier(0.25,0.8,0.25,1)`,
        }}
      >
        {Array.from({ length: index * 10 + 10 }).map((_, i) => (
          <div
            key={i}
            style={{ height: HEIGHT }}
            className="flex items-center justify-center font-fjalla text-base font-extrabold text-white sm:text-2xl md:text-4xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
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
  const [HEIGHT, setHEIGHT] = useState(56);

  useEffect(() => {
    const updateHeight = () => setHEIGHT(getDigitHeight());
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div className="flex items-center justify-center gap-0.5 sm:gap-1 md:gap-2">
      {/* Individual digit boxes */}
      {digits.map((d, i) => (
        <RollingDigit
          key={i}
          digit={Number(d)}
          index={digits.length - i}
          start={start}
        />
      ))}

      {/* Suffix character inside its own matching Odometer box */}
      {suffix && (
        <div
          className="relative flex items-center justify-center rounded-md border border-[#4a566e] bg-gradient-to-b from-[#3a4558] to-[#222936] font-fjalla text-base font-extrabold text-[#00d2ff] shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-3px_6px_rgba(0,0,0,0.8),0_4px_8px_rgba(0,0,0,0.4)] sm:text-2xl md:text-4xl"
          style={{
            height: HEIGHT,
            width: HEIGHT * 0.75,
          }}
        >
          <div className="pointer-events-none absolute left-0 top-1/2 z-20 h-[1px] w-full  shadow-[0_1px_0_rgba(255,255,255,0.08)]" />
          <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {suffix}
          </span>
        </div>
      )}
    </div>
  );
}

/* ===============================
   STAT COUNTER — redesigned to match reference:
   [icon circle] [counter pill]
       LABEL
     subtitle
================================ */

interface StatProps {
  end: number;
  text: string;
  suffix: string;
  subtitle?: string;
  iconBg: string;       // tailwind bg class for the icon circle
  counterBg: string;    // tailwind bg class for the counter pill
  icon: React.ReactNode;
}

const StatCounter: React.FC<StatProps> = ({ end, text, suffix, subtitle, iconBg, counterBg, icon }) => {
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
      className="flex flex-col items-center gap-2 overflow-hidden w-full"
    >
      {/* Counter pill — centered, constrained to column width */}
      <div className="flex justify-center w-full overflow-hidden">
        <div className={`${counterBg} rounded-xl px-1 sm:px-3 py-1 sm:py-2 flex items-center shadow-lg max-w-full`}>
          <Odometer value={end} suffix={suffix} start={start} />
        </div>
      </div>

      {/* Label — centered on all devices */}
      <div className="text-center w-full px-1">
        <p className="text-[8px] sm:text-xs md:text-sm font-black uppercase tracking-widest text-gray-800 text-center break-words">
          {text}
        </p>
        {subtitle && (
          <p className="text-[7px] sm:text-[10px] md:text-xs text-gray-500 mt-0.5 text-center">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

/* ===============================
   SECTION
================================ */

export default function TrainingRecruitmentStats() {
  return (
    <div className="relative w-full overflow-hidden bg-[#fdfbfb] px-3 py-10 md:px-6">

      {/* Content Grid */}
      <div className="mx-auto grid max-w-6xl w-full grid-cols-3 gap-3 sm:gap-6 md:gap-10 items-start overflow-hidden">
        <StatCounter
          end={94567}
          text="Happy Learners"
          subtitle="Growing together, building better futures"
          suffix="+"
          iconBg="bg-blue-600"
          counterBg=""
          icon="👥"
        />

        <StatCounter
          end={329}
          text="Courses"
          subtitle="Learn today, lead tomorrow"
          suffix="+"
          iconBg="bg-purple-600"
          counterBg=""
          icon="🎓"
        />

        <StatCounter
          end={150}
          text="Corporate Partners"
          subtitle="Trusted by leading organizations"
          suffix="+"
          iconBg="bg-teal-600"
          counterBg=""
          icon="🤝"
        />
      </div>
    </div>
  );
}
