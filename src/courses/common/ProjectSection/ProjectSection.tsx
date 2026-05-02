// import React from 'react';
// // import Image from 'next/image';

// const ProjectSection = ({ course }: any) => {
//     return (
//         <div className='w-full h-auto flex flex-col items-center justify-center gap-6 bg-[#f7f7f7] text-black'>
//             <div className='md:w-10/12 w-11/12 h-auto flex flex-col py-16 gap-6'>
//                 <div className='w-full h-auto flex md:flex-row flex-col-reverse items-center justify-between'>
//                     <div className="md:text-3xl text-2xl md:font-semibold font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#CD4647] to-[#7F3B40] capitalize">Key Projects</div>
//                     <div className="md:text-3xl text-2xl md:font-semibold font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#CD4647] to-[#7F3B40] capitalize"><span dangerouslySetInnerHTML={{ __html: course.title }} /></div>
//                 </div>

//                 <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 z-10'>
//                     {course?.project_data?.map((item: any, index: any) => (
//                         <div key={index} className='w-full h-full flex flex-col items-center justify-center p-4 rounded-md bg-gradient-to-tl from-[#4e1919] to-[#ab050e] text-white min-h-[200px]'>
//                             <div className='w-full text-black bg-white  p-4 text-center'><span dangerouslySetInnerHTML={{ __html: item.title }} /></div>
//                             <div className='w-full p-4 text-center'><span dangerouslySetInnerHTML={{ __html: item.objective }} /></div>
//                         </div>
//                     ))}
//                 </div>

//             </div>
//         </div>
//     )
// }

// export default ProjectSection





// "use client";

// import React, { useState } from "react";
// import { Building } from "lucide-react";
// import Image from "next/image";
// /* ================= HOVER REVEAL COMPONENT ================= */

// const RevealTextPopup = ({ title, active, onClick }: any) => {
//   return (
//     <div
//       onClick={onClick}
//       className={`group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition
//       ${active
//           ? "bg-[#cba012] text-white"
//           : "bg-gradient-to-tl from-[#C6151D] to-[#600A0E] text-white hover:bg-[#C6151D]"
//         }`}
//     >
//       <div className="w-[40px] h-full flex text-green-300 items-center justify-center flex-shrink-0">
//         <Image          src="/course/icons/project_icons.png"
//           alt="project-icon"
//           width={40}
//           height={40}
//           className="object-contain"
//           />
//       </div>
//       <h4 className="text-sm font-semibold">
//         <span dangerouslySetInnerHTML={{ __html: title }} />
//       </h4>

//       {/* HOVER TITLE POPUP */}


//     </div>
//   );
// };

// /* ================= MAIN COMPONENT ================= */

// const ProjectSection = ({ id, course }: any) => {
//   const [activeIndex, setActiveIndex] = useState(0);

//   const activeItem = course?.project_data?.[activeIndex];

//   return (
//     <section id={id} className="w-full bg-[#f7f7f7] py-16">
//       <div className="w-11/12 md:w-10/12 mx-auto flex flex-col gap-10">

//         {/* Heading */}
//         <div className="flex w-full flex-col md:flex-row md:justify-between md:items-center gap-3">

//           <h2 className="text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#CD4647] to-[#7F3B40]">
//             Key Projects
//           </h2>

//           <h2 className="text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#CD4647] to-[#7F3B40] md:text-right">
//             <span dangerouslySetInnerHTML={{ __html: course.title }} />
//           </h2>

//         </div>


//         {/* MAIN LAYOUT */}
//         <div className="grid md:grid-cols-[260px_1fr] gap-10">

//           {/* LEFT SIDEBAR */}
//           <div className="space-y-4">
//             {course?.project_data?.map((item: any, index: number) => (
//               <RevealTextPopup
//                 key={index}
//                 title={item.title}
//                 active={activeIndex === index}
//                 onClick={() => setActiveIndex(index)}
//               />
//             ))}
//           </div>

//           {/* RIGHT DETAIL PANEL */}
//           <div className="p-6 bg-gray-100 border-2 border-red-700 rounded-xl min-h-[260px]">
//             <h3 className="text-xl font-bold mb-4">
//               <span
//                 dangerouslySetInnerHTML={{
//                   __html: activeItem?.title || "",
//                 }}
//               />
//             </h3>

//             <p className="text-sm text-gray-700 leading-relaxed">
//               <span
//                 dangerouslySetInnerHTML={{
//                   __html: activeItem?.objective || "",
//                 }}
//               />
//             </p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ProjectSection;

// "use client";

// import React from "react";
// import Image from "next/image";

// const staticLogos = [
//   "/home/client-logo/accenturedb.png",
//   "/home/hero/logo/ibm.svg",
//   "/home/hero/logo/microsoft.svg",
//   "/home/client-logo/accenturedb.png",
//   // "/home/client-logo/cognizant.png",
// ];

// const ProjectSection = ({ id, course }: any) => {
//   return (
//     <section id={id} className="w-full bg-[#f7f7f7] py-10">
//       <div className="w-11/12 md:w-10/12 mx-auto flex flex-col gap-12">

//         {/* ===== HEADING ===== */}
//         <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
//           <h2 className="text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#CD4647] to-[#7F3B40]">
//             Key Projects
//           </h2>

//           <h2 className="text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#CD4647] to-[#7F3B40] md:text-right">
//             <span dangerouslySetInnerHTML={{ __html: course?.title }} />
//           </h2>
//         </div>

//         {/* ===== PROJECT GRID ===== */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

//           {course?.project_data?.map((item: any, index: number) => (
//             <div className="relative w-full  bg-gradient-to-tl from-[#C6151D] to-[#600A0E] h-[340px]">
//               {/* Card body */}
//               <div
//                 className={`absolute inset-0 `}
//               >

//                 {/* ===== LOGO AREA ===== */}
//                 <div className="bg-white p-3 m-5 rounded-xl flex  min-h-[70px]">
//                   <Image
//                     src={
//                       staticLogos[index % staticLogos.length]
//                     }
//                     alt="company-logo"
//                     width={100}
//                     height={40}
//                     className="object-contain "
//                   />
//                 </div>

//                 {/* ===== CONTENT AREA ===== */}
//                 <div className="p-2 space-y-2">

//                   {/* TITLE */}

//                   <div className="text-center font-bold text-xs min-h-[24px] text-white">
//                     Acentrre:<span
//                       dangerouslySetInnerHTML={{
//                         __html: item?.title || "",
//                       }}
//                     />

//                     <svg
//                       className="mx-auto"
//                       width="210"
//                       height="6"
//                       viewBox="0 0 340 6"
//                       preserveAspectRatio="none"
//                     >
//                       <path
//                         d="M0 3 Q170 0 340 3 Q170 6 0 3 Z"
//                         fill="#FFFFFF"
//                       />
//                     </svg>
//                   </div>

//                   {/* OBJECTIVE */}
//                   <p className="text-xs text-gray-200 leading-relaxed line-clamp-6 ">
//                     <span
//                       dangerouslySetInnerHTML={{
//                         __html: item?.objective || "",
//                       }}
//                     />
//                   </p>

//                 </div>

//               </div>
//             </div>
//           ))}

//         </div>
//       </div>

//     </section>
//   );
// };

// export default ProjectSection;


// "use client";

// import React from "react";
// import Image from "next/image";

// const projects = [
//   {
//     company: "Cognizant",
//     logo: "/home/client-logo/accenturedb.png",
//     title: "Workday Financials Implementation",
//     scenario:
//       "Setting up finance processes for internal business units.",
//     liveWork: [
//       "Ledger accounting setup",
//       "Spend categories & supplier onboarding",
//       "Customer billing automation",
//       "Reporting configuration",
//     ],
//     outcome: "Accurate monthly financial close.",
//   },
//   {
//     company: "IBM",
//     logo: "/home/hero/logo/ibm.svg",
//     title: "Global Attendance & Leave Management",
//     scenario:
//       "Handling attendance and leave policies across multiple countries with varying regulations.",
//     liveWork: [
//       "Country-specific leave accrual rules",
//       "Shift- and calendar-based time tracking",
//       "Automated compliance notifications",
//       "Real-time reporting and dashboards",
//     ],
//     outcome: "Optimized global employee attendance & leave.",
//   },
//   {
//     company: "Samsung",
//     logo: "/home/hero/logo/microsoft.svg",
//     title: "Global Attendance & Shift Tracking",
//     scenario:
//       "Managing attendance and shifts across multiple regions.",
//     liveWork: [
//       "Region-specific shift schedules",
//       "Flexible attendance and leave rules",
//       "Real-time tracking of working hours",
//       "Automated compliance alerts",
//     ],
//     outcome: "Efficient global attendance & shift management.",
//   },
//   {
//     company: "Accenture",
//     logo: "/home/client-logo/accenturedb.png",
//     title: "Workday Security Redesign Project",
//     scenario:
//       "Too many users had unrestricted HR access.",
//     liveWork: [
//       "Role audit using Delivered Security Reports",
//       "Fixing domain access leaks",
//       "Rebuilding Business Process security policies",
//       "Creating new custom roles (HR Partner, TA Partner)",
//     ],
//     outcome: "Compliance improvement & audit pass.",
//   },
// ];

// const ProjectSection = ({ id, course }: any) => {
//   return (
//     <section id={id} className="w-full bg-[#f7f7f7] py-12">
//       <div className="w-full mx-auto flex flex-col  gap-12 px-4">

//         {/* ===== HEADING ===== */}
//         <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
//           <h2 className="text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#CD4647] to-[#7F3B40]">
//             Key Projects
//           </h2>

//           <h2 className="text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#CD4647] to-[#7F3B40] md:text-right">
//             <span
//               dangerouslySetInnerHTML={{ __html: course?.title || "" }}
//             />
//           </h2>
//         </div>

//         {/* ===== GRID ===== */}
//         <div className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

//           {projects.map((item, index) => (
//             <div
//               key={index}
//               className=" text-white bg-gradient-to-tl from-[#C6151D] to-[#600A0E] rounded-xl overflow-hidden flex flex-col"
//             >

//               {/* ===== LOGO TOP WHITE AREA ===== */}
//               <div className="bg-white p-3 m-5 rounded-xl flex justify-center items-center min-h-[70px]">
//                 <Image
//                   src={item.logo}
//                   alt={item.company}
//                   width={120}
//                   height={60}
//                   className="object-contain"
//                 />
//               </div>


//               {/* ===== BLUE CONTENT AREA ===== */}
//               <div className="p-3 flex flex-col gap-1 flex-1">

//                 {/* TITLE */}
//                 <h3 className="font-semibold text-sm leading-snug">
//                   {item.company} – {item.title}
//                 </h3>

//                 <hr className="border-white/70" />

//                 {/* SCENARIO */}
//                 <p className="text-xs text-gray-200">
//                   <span className="font-semibold">Scenario:</span> {item.scenario}
//                 </p>

//                 {/* LIVE WORK */}
//                 <div>
//                   <h4 className="font-semibold text-base mb-2">
//                     Live Work:
//                   </h4>
//                   <ul className="list-disc list-inside text-xs space-y-1 text-gray-200">
//                     {item.liveWork.map((work, i) => (
//                       <li key={i}>{work}</li>
//                     ))}
//                   </ul>
//                 </div>

//               </div>

//               {/* ===== OUTCOME BOTTOM STRIP ===== */}
//               <div className="bg-[#CA8A04] mb-2 p-4 text-sm font-semibold text-center">
//                 Outcome: {item.outcome}
//               </div>

//             </div>
//           ))}

//         </div>
//       </div>
//     </section>
//   );
// };

// export default ProjectSection;


// "use client";

// import React from "react";
// import Image from "next/image";

// const ProjectSection = ({ id, course }: any) => {
//   const projects = course?.project_data || [];

//   // If no project data → don't render section
//   if (!projects.length) return null;

//   return (
//     <section id={id} className="w-full bg-[#f7f7f7] py-12">
//       <div className="w-full mx-auto flex flex-col gap-12 px-4">

//         {/* ===== HEADING ===== */}
//         <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
//           <h2 className="text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#CD4647] to-[#7F3B40]">
//             Key Projects
//           </h2>

//           <h2 className="text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#CD4647] to-[#7F3B40] md:text-right">
//           {course?.title}
//           </h2>
//         </div>

//         {/* ===== GRID ===== */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

//           {projects.map((item: any, index: number) => (
//             <div
//               key={index}
//               className="text-white bg-gradient-to-tl from-[#C6151D] to-[#600A0E] rounded-xl overflow-hidden flex flex-col"
//             >

//               {/* ===== LOGO TOP WHITE AREA ===== */}
//               <div className="bg-white p-3 m-5 rounded-xl flex justify-center items-center min-h-[70px]">
//                 {item.logo && (
//                   <Image
//                     src={item.logo}
//                     alt={item.company || "project-logo"}
//                     width={120}
//                     height={60}
//                     className="object-contain"
//                   />
//                 )}
//               </div>

//               {/* ===== BLUE CONTENT AREA ===== */}
//               <div className="p-3 flex flex-col gap-1 flex-1">

//                 {/* TITLE */}
//                 <h3 className="font-semibold text-sm leading-snug">
//                   {item.company} –{" "}
//                   {item.title || ""}
//                 </h3>

//                 <hr className="border-white/70" />

//                 {/* SCENARIO */}
//                 <p className="text-xs text-gray-200">
//                   <span className="font-semibold">Scenario:</span>{" "}
//                  {item.scenario || ""}
//                 </p>

//                 {/* LIVE WORK */}
//                 {item.liveWork?.length > 0 && (
//                   <div>
//                     <h4 className="font-semibold text-base mb-2">
//                       Live Work:
//                     </h4>
//                     <ul className="list-disc list-inside text-xs space-y-1 text-gray-200">
//                       {item.liveWork?.flatMap((work: string) =>
//                         work
//                           .split(/\n|<br\s*\/?>/gi) // split by new line or <br>
//                           .filter((line) => line.trim() !== "")
//                           .map((line: string, i: number) => (
//                             <li key={i}>
//                              {line.trim()}
//                             </li>
//                           ))
//                       )}
//                     </ul>

//                   </div>
//                 )}

//               </div>

//               {/* ===== OUTCOME BOTTOM STRIP ===== */}
//               <div className="bg-[#CA8A04] mb-2 p-2 text-sm font-semibold text-center">
//                 Outcome:{" "}
//                {item.outcome || ""}
//               </div>

//             </div>
//           ))}

//         </div>
//       </div>
//     </section>
//   );
// };

// export default ProjectSection;


"use client";

import React from "react";
import Image from "next/image";

const staticLogos = [
  "/home/client-logo/accenturedb.png",
  "/home/hero/logo/ibm.svg",
  "/home/hero/logo/microsoft.svg",
  "/home/client-logo/accenturedb.png",
];

const ProjectSection = ({ id, course }: any) => {
  const projects = course?.project_data || [];

  // If no data → don't render
  if (!projects.length) return null;

  const firstProject = projects[0];

  const showFirstDesign = Boolean(
  firstProject?.company && firstProject.company.trim() !== ""
);

const projectCount = projects.length;

const gridCols =
  projectCount === 1
    ? "lg:grid-cols-1"
    : projectCount === 2
    ? "lg:grid-cols-2"
    : projectCount === 3
    ? "lg:grid-cols-3"
    : "lg:grid-cols-4";

  return (
    <section id={id} className="w-full bg-[#f7f7f7]">
      <div className=" border-2 m-2 p-2">

        {/* ===== HEADING ===== */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 pb-5">

          {/* LEFT HEADING - Static "Key Projects" */}
          <div className="flex flex-col md:items-start items-center">
            <h2 className="text-3xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#CD4647] to-[#7F3B40]">
              Key Projects
            </h2>

            <svg
              className="mt-1"
              width="210"
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

          {/* RIGHT HEADING - Dynamic projectTitle or course title */}
          <div className="flex flex-col items-center md:items-center">
            <h2 className="text-xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#CD4647] to-[#7F3B40] text-center">
              {course.projectTitle || course?.title}
            </h2>

            <svg
              className="mt-2"
              width="310"
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


        </div>


        {/* ===== CONDITIONAL DESIGN ===== */}

        {showFirstDesign ? (
          /* ============================= */
          /* ===== DESIGN 1 (>2) ========= */
          /* ============================= */
         <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-6`}>
            {projects.map((item: any, index: number) => (
              <div
                key={index}
                className="text-white bg-gradient-to-tl from-[#C6151D] to-[#600A0E] rounded-xl overflow-hidden flex flex-col"
              >
                {/* LOGO */}
                <div className="bg-white p-3 m-5 rounded-xl flex justify-center items-center max-h-[70px]">
                  {item.logo && (
                    <Image
                      src={item.logo}
                      alt={item.company || "project-logo"}
                      width={100}
                      height={40}
                      className="object-contain"
                    />
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-3 flex flex-col gap-2 flex-1">

                  <h3 className="font-semibold text-sm min-h-10 leading-snug">
                    {item.company} – {item.title}
                  </h3>

                  <hr className="border-2 border-white/70" />

                  <p className="text-xs text-gray-200">
                    <span className="font-semibold">Scenario:</span>{" "}
                    {item.scenario}
                  </p>

                  {item.liveWork?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-base mb-2">
                        Live Work:
                      </h4>

                      <ul className="list-disc list-outside pl-5 text-xs space-y-1 text-gray-200">

                        {item.liveWork.flatMap((work: string) =>
                          work
                            .split(/\n|<br\s*\/?>/gi)
                            .filter((line) => line.trim() !== "")
                            .map((line: string, i: number) => (
                              <li key={i}>{line.trim()}</li>
                            ))
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* OUTCOME */}
                <div className="bg-[#CA8A04] mb-2 p-2 text-sm font-semibold text-center">
                  Outcome: {item.outcome}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ============================= */
          /* ===== DESIGN 2 (<=2) ======== */
          /* ============================= */
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-4`}>

            {projects.map((item: any, index: number) => (
              <div
                key={index}
                className="relative rounded-xl w-full bg-gradient-to-tl from-[#C6151D] to-[#600A0E] h-[340px] max-w-[360px]"
              >
                <div className="absolute inset-0">

                  {/* LOGO */}
                  <div className="bg-white p-3 m-5  items-center justify-center rounded-xl flex min-h-[70px]">
                    <Image
                      src={
                        item.logo ||
                        staticLogos[index % staticLogos.length]
                      }
                      alt="company-logo"
                      width={100}
                      height={40}
                      className="object-contain"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-2 space-y-2">

                    <div className="text-center font-bold text-xs min-h-[24px] text-white">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: item?.title || "",
                        }} />

                      <svg
                        className="mx-auto"
                        width="210"
                        height="6"
                        viewBox="0 0 340 6"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M0 3 Q170 0 340 3 Q170 6 0 3 Z"
                          fill="#FFFFFF"
                        />
                      </svg>
                    </div>

                    <p className="text-xs text-gray-200 leading-relaxed line-clamp-6">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: item?.objective || "",
                        }} />
                    </p>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default ProjectSection;
