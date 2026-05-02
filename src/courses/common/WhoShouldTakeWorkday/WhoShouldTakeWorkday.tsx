"use client";

import { motion, Variants } from "framer-motion";
import { useState } from "react";

const cardAnim: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.45,
      ease: "easeOut",
    },
  }),
};

const data = [
  { text: "IT Professionals", color: "red" },
  { text: "Non-IT Career Switchers", color: "purple" },
  { text: "Fresh Graduates", color: "blue" },
  { text: "Working Professionals", color: "purple" },
  { text: "Ops/Administrators/HR", color: "blue" },
  { text: "Developers", color: "purple" },
  { text: "BA/QA Engineers", color: "blue" },
  { text: "Cloud / Infra", color: "purple" },
];

const MOBILE_LIMIT = 3;

const WhoShouldTakeWorkday = ({ course }: any) => {
  const [showAll, setShowAll] = useState(false);

  return (
    <section className="w-full bg-white py-5">
      <div className="m-2 p-2 py-5 border-2">
        {/* Heading */}
        <div className="text-center mb-5">
         

         <div className="text-center mb-12">
        <h2 className="text-[#7f1d1d] md:text-3xl text-2xl font-bold">
          {course?.whoShouldTakeTitle || `Who Should Take ${course?.title || 'This Course'}`}
        </h2>

        <svg
          className="mx-auto"
          width="340"
          height="6"
          viewBox="0 0 340 6"
          preserveAspectRatio="none"
        >
          <path
            d="M0 3 Q170 0 340 3 Q170 6 0 3 Z"
            fill="#7f1d1d"
          />
        </svg>
      </div>
          {/* <div className="w-[280px] h-[6px] bg-gradient-to-tl from-[#C6151D] to-[#600A0E] rounded-full mx-auto" /> */}
        </div>

        {/* ===== DESKTOP / TABLET (ALL ITEMS) ===== */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
          {data.map((item, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardAnim}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className={`bg-white h-[50px] flex items-center justify-center rounded-xl border border-gray-200 shadow-sm transition-all
                ${
                  item.color === "blue"
                    ? "border-l-[6px] border-l-red-800"
                    : "border-l-[6px] border-l-yellow-700"
                }
              `}
            >
              <p className="text-[17px] font-medium text-gray-800 text-center px-2">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ===== MOBILE (PAGINATED) ===== */}
        <div className="sm:hidden grid grid-cols-1 gap-y-4">
          {(showAll ? data : data.slice(0, MOBILE_LIMIT)).map((item, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardAnim}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className={`bg-white h-[50px] flex items-center justify-center rounded-xl border border-gray-200 shadow-sm transition-all
                ${
                  item.color === "blue"
                    ? "border-l-[6px] border-l-red-800"
                    : "border-l-[6px] border-l-yellow-700"
                }
              `}
            >
              <p className="text-[17px] font-medium text-gray-800 text-center px-2">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Show More / Less — MOBILE ONLY */}
        <div className="sm:hidden mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-semibold text-red-700 hover:underline"
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhoShouldTakeWorkday;
