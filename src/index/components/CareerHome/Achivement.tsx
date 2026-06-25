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
      className="text-center p-1 md:p-3 bg-white rounded-xl  transition-all duration-500 hover:scale-[1.02]"
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
