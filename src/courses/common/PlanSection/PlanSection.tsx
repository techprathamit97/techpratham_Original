
// import React from "react";
// import Image from "next/image";
// import { training_data } from "../../assets/training_data";

// interface SectionProps {
//   id?: string;
// }

// const gradients = [
//   "from-[#C6151D] to-[#600A0E]",
//   "from-[#CA8A04] to-[#9aa0a6]",
//   "from-[#C6151D] to-[#600A0E]",
//   "from-[#CA8A04] to-[#9aa0a6]",
// ];

// const numberColors = [
//   "text-orange-500",
//   "text-gray-400",
//   "text-slate-400",
//   "text-amber-700",
// ];

// const PlanSection = ({ id }: SectionProps) => {
//   const Item = ({ item, index }: any) => (
//     <div className="relative w-full  bg-white h-[140px]">
//       {/* Card body */}
//       <div
//         className={`absolute inset-0 bg-gradient-to-r ${
//           gradients[index % gradients.length]
//         } rounded-br-[180px] rounded-tl-[130px] shadow-lg`}
//       >
//         <div className="flex items-center h-full px-4 gap-4">
//           {/* Icon */}
//           <div className="w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center shadow-md shrink-0">
//             <Image
//               src={item.icons}
//               alt=""
//               width={60}
//               height={60}
//               className="object-contain"
//             />
//           </div>

//           {/* Text */}
//           <div className="text-white">
//             <h4
//               className="text-xs font-bold tracking-wide uppercase mb-1"
//               dangerouslySetInnerHTML={{ __html: item.que }}
//             />
//             <p
//               className="text-[10px] leading-tight pr-5 opacity-90"
//               dangerouslySetInnerHTML={{ __html: item.ans }}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Number */}
//       <div className="absolute bottom-0 right-0 w-[60px] h-[40px]  rounded-tl-[26px] flex items-end justify-end pr-2 pb-1 shadow-sm">
//         <span
//           className={`text-xl font-bold ${
//             numberColors[index % numberColors.length]
//           }`}
//         >
//           {String(index + 1).padStart(2, "0")}
//         </span>
//       </div>
//     </div>
//   );

//   return (
//     <section
//       id={id}
//       className="w-full py-10 bg-gray-200 flex justify-center"
//     >
//       <div className="w-11/12 max-w-7xl">
//         <h2 className="text-3xl font-semibold text-gray-800 mb-8">
//           Training Plan
//         </h2>

//         {/* 2 rows × 4 columns */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 place-items-center">
//           {training_data.map((item, index) => (
//             <Item key={index} item={item} index={index} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default PlanSection;


"use client";


/* ================= DATA ================= */

export const training_data = [
  { que: "About trainer", icons: "/course/icons/1.webp", ans: "Working professional who is carrying more then 10 years of industry experience.", videoId: "DdT4zvcSVGg" },
  { que: "Decks & Updated Content", icons: "/course/icons/2.webp", ans: "Access to updated presentation decks shared during live training sessions.", videoId: "DdT4zvcSVGg" },
  { que: "e-Book ", icons: "/course/icons/3.webp", ans: "E-book provided by TechPratham. All rights reserved.", link: "/contents/workday-hcm" },
  { que: "Assignments & MCQs ", icons: "/course/icons/4.webp", ans: "Module-wise assignments and MCQs provided for practice.", link: "/contents/workday-hcm" },
  { que: "Video Recording", icons: "/course/icons/6.webp", ans: "Daily Session would be recorded and shared to the candidate.", videoId: "DdT4zvcSVGg" },
  { que: "Projects", icons: "/course/icons/5.webp", ans: "Live projects will be provided for hands-on practice.", scrollId: "projects" },  
  { que: "Resume Building", icons: "/course/icons/7.webp", ans: "Expert-guided resume building with industry-focused content support.", videoId: "UqK02jVAWCc" },
  { que: "Interview Preparation", icons: "/course/icons/8.webp", ans: "Comprehensive interview preparation with real-time scenario practice.", videoId: "bh5Xvp5TAso" }
];

/* ================= CARD ================= */

const InfoCard = ({ number, title, desc, icon, color, videoId, link, onVideoClick, onLinkClick,scrollId, }: any) => {
 const handleClick = () => {
  if (videoId) {
    onVideoClick(videoId);
  } 
  else if (scrollId) {
    const section = document.getElementById(scrollId);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }
  else if (link) {
    onLinkClick(link);
  }
};

  return (
     <div
  onClick={handleClick}
  className="relative w-[280px] bg-white rounded-[28px] 
  shadow-[0_18px_35px_rgba(0,0,0,0.12)] 
  pt-5 pb-8 px-6 flex items-center gap-3
  cursor-pointer
  transition-all duration-300 ease-in-out
  hover:-translate-y-3 hover:scale-105
  hover:shadow-[0_25px_45px_rgba(0,0,0,0.18)]"
>
      {/* BADGE */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2">
        <div
          className="relative text-white text-xl font-bold px-5 py-3 rounded-t-2xl"
          style={{ backgroundColor: color }}
        >
          {number}

          <div
            className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
            style={{
              borderLeft: "14px solid transparent",
              borderRight: "14px solid transparent",
              borderTop: `14px solid ${color}`,
            }}
          />
        </div>
      </div>

      {/* ICON */}
      <div className="flex items-center justify-center w-14 h-14 shrink-0">
        <img src={icon} className="w-10 h-10 object-contain" />
      </div>

      {/* DIVIDER */}
      <div className="w-[2px] h-14 bg-red-200 shrink-0" />

      {/* TEXT */}
      <div className="flex flex-col gap-1 flex-1">
        <h3 className="font-bold pt-5 text-sm text-gray-800 tracking-wide">
          {title}
        </h3>
        <p className="text-xs text-gray-500 leading-snug">
          {desc}
        </p>
      </div>
    </div>
  );
};


/* ================= MAIN ================= */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { link } from "fs";
const InfoGraphicSection = () => {
const [activeVideo, setActiveVideo] = useState<string | null>(null);
const router = useRouter();
  const colors = [
    "#2BA6CB","#1FA77A","#E43C3C","#F59E0B",
    "#6366F1","#10B981","#EF4444","#8B5CF6"
  ];

  return (
    <div className="p-5 bg-gray-50">

      {/* ===== HEADING ===== */}
      <div className="text-center mb-12">
        <h2 className="text-[#7f1d1d] md:text-3xl text-2xl font-bold">
          Training Plan
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

      {/* ===== CARD GRID ===== */}
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 justify-items-center">
       {training_data.map((item, i) => (
  <InfoCard
    key={i}
    number={(i + 1).toString().padStart(2,"0")}
    title={item.que}
    desc={item.ans}
    icon={item.icons}
    color={colors[i]}
    videoId={item.videoId}
    link={item.link}
    scrollId={item.scrollId}
    onVideoClick={(id:any) => setActiveVideo(id)}
    onLinkClick={(url:any) => router.push(url)}
  />
))}

      </div>
{activeVideo && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="relative w-[90%] md:w-[700px] bg-white rounded-xl p-4">
      
      <button
        onClick={() => setActiveVideo(null)}
        className="absolute top-0 right-0 text-red-600 text-4xl"
      >
        ✕
      </button>

      <iframe
        width="100%"
        height="400"
        src={`https://www.youtube.com/embed/${activeVideo}`}
        title="YouTube video"
        allowFullScreen
        className="rounded-lg"
      />
    </div>
  </div>
)}

    </div>
  );
};

export default InfoGraphicSection;
