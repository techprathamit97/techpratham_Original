// "use client";

// import React, { useEffect, useState } from "react";
// import { CaretUpIcon } from "@radix-ui/react-icons";
// import { CircleCheckBig } from "lucide-react";
// import LeadForm from "@/components/common/LeadForm/LeadForm";
// import AnimatedGenerateButton from "@/components/ui/animated-generate-button";

// interface Props {
//   id?: string;
//   course: any;
// }

// const ITEM_LIMIT = 6;
// const STATIC_CERTIFICATE = {
//   heading: "Industry-Recognized Certification",
//   paragraph: `
//     <p>
//       This certification validates your hands-on expertise and practical
//       knowledge gained during the training. It is designed to meet current
//       industry standards and enhances your professional credibility.
//     </p>
//   `,
//   image: "/course/certificate/certificate_no_name.webp",
// };

// const FaqSection = ({ id, course }: Props) => {
//   /* ================= STATE ================= */
//   const [leftTab, setLeftTab] = useState<"faq" | "interview">("faq");
//   const [rightTab, setRightTab] = useState<"about" | "dumps">("about");
//   const [activeTab, setActiveTab] = useState<"faq" | "interview" | "dumps">("faq");
//   const [mobileActive, setMobileActive] = useState<
//     "faq" | "interview" | "dumps"
//   >("faq");

//   const [selected, setSelected] = useState<number | null>(null);
//   const [showMoreFaq, setShowMoreFaq] = useState(false);
//   const [showMoreInterview, setShowMoreInterview] = useState(false);
//   const [showLeadForm, setShowLeadForm] = useState(false);

//   /* ================= DATA ================= */
//   const courseFaqs = course?.faqs_data || [];
//   const interviewFaqs = course?.interview_questions_data || [];
//   const aboutCert = course?.about_certificate_data;

//   /* ================= CONDITIONS ================= */
//   const hasFaqs = courseFaqs.length > 0;
//   const hasInterview = interviewFaqs.length > 0;
//   const hasAbout = true;
//   const hasDumps = !!aboutCert;
//   const hasRightSide = hasAbout || hasDumps;
//   const [expanded, setExpanded] = useState(false);

//   const getLimitedHTML = (html: string, wordLimit = 100) => {
//     const text = html.replace(/<[^>]+>/g, "");
//     const words = text.split(" ");

//     if (words.length <= wordLimit) return html;

//     return words.slice(0, wordLimit).join(" ") + "...";
//   };

//   /* ================= VIEWPORT ================= */
//   const [isMobileView, setIsMobileView] = useState(
//     typeof window !== "undefined" && window.innerWidth < 1024
//   );

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobileView(window.innerWidth < 1024);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   /* ================= AUTO FALLBACK ================= */
//   useEffect(() => {
//     if (!hasInterview) setLeftTab("faq");
//     if (!hasAbout && hasDumps) setRightTab("dumps");
//     if (!hasDumps && hasAbout) setRightTab("about");
//   }, [hasInterview, hasAbout, hasDumps]);

//   /* ================= PAGINATION ================= */
//   const faqsToShow = showMoreFaq
//     ? courseFaqs
//     : courseFaqs.slice(0, ITEM_LIMIT);

//   const interviewToShow = showMoreInterview
//     ? interviewFaqs
//     : interviewFaqs.slice(0, ITEM_LIMIT);

//   const toggle = (i: number) => {
//     setSelected(selected === i ? null : i);
//   };

//   /* ================= HEADER CLICK ================= */
//   const handleHeaderClick = (
//     type: "faq" | "interview" | "dumps"
//   ) => {
//     // Set the active tab
//     setActiveTab(type);

//     // Update left tab for desktop layout (faq and interview go to left side)
//     if (type === "faq" || type === "interview") {
//       setLeftTab(type);
//     }

//     if (isMobileView) setMobileActive(type);
//   };

//   return (
//     <section id={id} className="w-full bg-[#F3F4F6] ">
//       <div className="m-2 p-2 border-2">

//         {/* ================= HEADER ================= */}
//         <div className="w-full relative overflow-x-auto mb-4">
//           <div className="flex w-full min-w-[500px] h-14 drop-shadow-2xl">
//             {[
//               hasFaqs && { label: "FAQ's", key: "faq", hue: 5 },
//               hasInterview && { label: "INTERVIEW QUESTION'S", key: "interview", hue: 210 },
//               hasDumps && { label: "ABOUT CERTIFICATE", key: "dumps", hue: 300 },
//             ]
//               .filter(Boolean)
//               .map((item: any, index, arr) => {
//                 // Fix active color logic - only one section should be active at a time
//                 const isActive = !isMobileView
//                   ? (activeTab === item.key)
//                   : (mobileActive === item.key);

//                 return (
//                   <div
//                     key={item.key}
//                     className={`flex-1 relative cursor-pointer ${index !== 0 ? "-ml-[14px]" : ""}`}
//                   >
//                     <div
//                       className={`absolute inset-0 ${index === 0
//                         ? "clip-chevron-start"
//                         : index === arr.length - 1
//                           ? "clip-chevron-end"
//                           : "clip-chevron"
//                         } ${isActive
//                           ? "bg-gradient-to-tl from-[#C6151D] to-[#600A0E]"
//                           : "bg-[#CA8A04]"
//                         }`}
//                     />

//                     {/* AnimatedGenerateButton inside chevron */}
//                     <div
//                       className="relative z-10 h-full flex items-center justify-center px-2 md:px-4 overflow-hidden"
//                       onClick={() => handleHeaderClick(item.key)}
//                     >
//                       <AnimatedGenerateButton
//                         labelIdle={item.label}
//                         labelActive={item.label}

//                         isActive={isActive}
//                         className="transform scale-60 md:scale-90 max-w-full"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleHeaderClick(item.key);
//                         }}
//                       />
//                     </div>
//                   </div>
//                 );
//               })}
//           </div>
//         </div>

//         {/* ================= CONTENT ================= */}
//         {isMobileView ? (
//           /* ========== MOBILE ========== */
//           <div className="space-y-2">
//             {(mobileActive === "faq"
//               ? faqsToShow
//               : mobileActive === "interview"
//                 ? interviewToShow
//                 : []
//             ).map((item: any, index: number) => (
//               <div
//                 key={index}
//                 onClick={() => toggle(index)}
//                 className="bg-gray-100 p-4 rounded cursor-pointer"
//               >
//                 <div className="flex justify-between items-start gap-2">
//                   <div
//                     className="flex-1 overflow-hidden break-words"
//                     dangerouslySetInnerHTML={{ __html: item.que }}
//                   />
//                   <CaretUpIcon
//                     className={`w-5 h-5 flex-shrink-0 mt-1 ${selected === index ? "" : "rotate-180"
//                       }`}
//                   />
//                 </div>

//                 {selected === index && (
//                   <div className="mt-3 flex">
//                     <CircleCheckBig className="w-5 h-5 mt-1 flex-shrink-0 mr-2" />
//                     <div
//                       className="flex-1 overflow-hidden break-words"
//                       dangerouslySetInnerHTML={{ __html: item.ans }}
//                     />
//                   </div>
//                 )}
//               </div>
//             ))}

//             {mobileActive === "dumps" && aboutCert && (
//               <div className="bg-white p-5 rounded-lg space-y-4">
//                 <h3 className="font-semibold">{aboutCert.heading}</h3>

//                 <div
//                   className={`prose max-w-none `}
//                   dangerouslySetInnerHTML={{
//                     __html: aboutCert.paragraph,
//                   }}
//                   style={
//                     !expanded
//                       ? {
//                         display: "-webkit-box",
//                         WebkitLineClamp: 12,
//                         WebkitBoxOrient: "vertical",
//                         overflow: "hidden",
//                       }
//                       : {}
//                   }
//                 />

//                 <button className="text-red-500" onClick={() => setExpanded(!expanded)}>
//                   {expanded ? "Show Less" : "Show More"}
//                 </button>

//                 <div className="flex justify-center">
//                   <button
//                     onClick={() => setShowLeadForm(true)}
//                     className="w-[250px] py-2 bg-gradient-to-tl from-[#C6151D] to-[#600A0E] hover:bg-orange-500/20 border border-orange-300/30 hover:border-orange-300/50 text-orange-100 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm"
//                   >
//                     Download Dumps
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* MOBILE SHOW MORE / LESS */}
//             {mobileActive === "faq" && courseFaqs.length > ITEM_LIMIT && (
//               <button
//                 onClick={() => setShowMoreFaq(!showMoreFaq)}
//                 className="text-red-700 font-semibold hover:underline"
//               >
//                 {showMoreFaq ? "Show Less" : "Show More"}
//               </button>
//             )}

//             {mobileActive === "interview" &&
//               interviewFaqs.length > ITEM_LIMIT && (
//                 <button
//                   onClick={() => setShowMoreInterview(!showMoreInterview)}
//                   className="text-red-700 font-semibold hover:underline"
//                 >
//                   {showMoreInterview ? "Show Less" : "Show More"}
//                 </button>
//               )}

//             {/* MOBILE CERTIFICATE - ALWAYS VISIBLE */}
//             <div className="bg-white p-5 rounded-lg space-y-2 mt-4">
//               <h3 className="font-semibold">
//                 {STATIC_CERTIFICATE.heading}
//               </h3>

//               <div className="relative overflow-hidden">
//                 <img
//                   src={STATIC_CERTIFICATE.image}
//                   alt="Certificate"
//                   className="w-full rounded"
//                 />

//                 {/* Dynamic Certificate Name Text on Mobile */}
//                 <div className="absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-20">
//                   <div className="text-transparent bg-gradient-to-b from-[#ff0000] to-[#1f1e1f] bg-clip-text text-base md:text-lg font-bold tracking-wide drop-shadow-sm" style={{ fontFamily: 'Noto Serif Ethiopic Condensed, serif' }}>
//                     {course?.certificateName || "Course Name"}
//                   </div>
//                 </div>
//               </div>
//             </div>

//           </div>
//         ) : (
//           /* ========== DESKTOP ========== */
//           <div className="grid gap-8 lg:grid-cols-2">
//             {/* LEFT */}
//             <div className="space-y-2 mt-5">
//               {activeTab === "faq" && faqsToShow.map(
//                 (item: any, index: number) => (
//                   <div
//                     key={index}
//                     onClick={() => toggle(index)}
//                     className="bg-white p-3 rounded cursor-pointer"
//                   >
//                     <div className="flex font-semibold justify-between items-start gap-4">
//                       <div
//                         className="flex-1 overflow-hidden break-words"
//                         dangerouslySetInnerHTML={{ __html: item.que }}
//                       />
//                       <CaretUpIcon
//                         className={`w-5 h-5 flex-shrink-0 mt-1 ${selected === index ? "" : "rotate-180"
//                           }`}
//                       />
//                     </div>

//                     {selected === index && (
//                       <div className="mt-3 flex">
//                         <CircleCheckBig className="w-5 h-5 mt-1 flex-shrink-0 mr-2" />
//                         <div
//                           className="flex-1 overflow-hidden break-words"
//                           dangerouslySetInnerHTML={{ __html: item.ans }}
//                         />
//                       </div>
//                     )}
//                   </div>
//                 )
//               )}

//               {activeTab === "interview" && interviewToShow.map(
//                 (item: any, index: number) => (
//                   <div
//                     key={index}
//                     onClick={() => toggle(index)}
//                     className="bg-gray-100 p-3 rounded cursor-pointer"
//                   >
//                     <div className="flex font-semibold justify-between items-start gap-4">
//                       <div
//                         className="flex-1 overflow-hidden break-words"
//                         dangerouslySetInnerHTML={{ __html: item.que }}
//                       />
//                       <CaretUpIcon
//                         className={`w-5 h-5 flex-shrink-0 mt-1 ${selected === index ? "" : "rotate-180"
//                           }`}
//                       />
//                     </div>

//                     {selected === index && (
//                       <div className="mt-3 flex">
//                         <CircleCheckBig className="w-5 h-5 mt-1 flex-shrink-0 mr-2" />
//                         <div
//                           className="flex-1 overflow-hidden break-words"
//                           dangerouslySetInnerHTML={{ __html: item.ans }}
//                         />
//                       </div>
//                     )}
//                   </div>
//                 )
//               )}

//               {activeTab === "dumps" && aboutCert && (
//                 <div className="bg-white p-5 rounded-lg space-y-4">
//                   <h3 className="font-semibold">{aboutCert.heading}</h3>

//                   <div
//                     className={`prose max-w-none `}
//                     dangerouslySetInnerHTML={{
//                       __html: aboutCert.paragraph,
//                     }}
//                     style={
//                       !expanded
//                         ? {
//                           display: "-webkit-box",
//                           WebkitLineClamp: 12,
//                           WebkitBoxOrient: "vertical",
//                           overflow: "hidden",
//                         }
//                         : {}
//                     }
//                   />

//                   <button className="text-red-500" onClick={() => setExpanded(!expanded)}>
//                     {expanded ? "Show Less" : "Show More"}
//                   </button>

//                   <div className="flex justify-center">
//                     <button
//                       onClick={() => setShowLeadForm(true)}
//                       className="w-[250px] py-2 bg-gradient-to-tl from-[#C6151D] to-[#600A0E] hover:bg-orange-500/20 border border-orange-300/30 hover:border-orange-300/50 text-orange-100 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm"
//                     >
//                       Download Dumps
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* DESKTOP SHOW MORE / LESS */}
//               {activeTab === "faq" && courseFaqs.length > ITEM_LIMIT && (
//                 <button
//                   onClick={() => setShowMoreFaq(!showMoreFaq)}
//                   className="text-red-700 font-semibold hover:underline"
//                 >
//                   {showMoreFaq ? "Show Less" : "Show More"}
//                 </button>
//               )}

//               {activeTab === "interview" &&
//                 interviewFaqs.length > ITEM_LIMIT && (
//                   <button
//                     onClick={() =>
//                       setShowMoreInterview(!showMoreInterview)
//                     }
//                     className="text-red-700 font-semibold hover:underline"
//                   >
//                     {showMoreInterview ? "Show Less" : "Show More"}
//                   </button>
//                 )}
//             </div>

//             {/* RIGHT - FIXED ABOUT CERTIFICATE */}
//             <div className="space-y-6 mt-5">
//               <div className="bg-white p-5 rounded-lg space-y-4">
//                 <h3 className="font-semibold">
//                   {STATIC_CERTIFICATE.heading}
//                 </h3>

//                 <div className="border-2 relative overflow-hidden group">

//                   {/* Image */}
//                   <img
//                     src={STATIC_CERTIFICATE.image}
//                     alt="Certificate"
//                     className="w-full rounded"
//                   />

//                   {/* Dynamic Certificate Name Text on Image */}
//                   <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-20">
//                     <div
//                       className="text-transparent bg-gradient-to-b from-[#ff0000] to-[#1f1e1f] bg-clip-text text-lg md:text-2xl lg:text-2xl font-bold uppercase tracking-wide drop-shadow-sm whitespace-nowrap"
//                       style={{ fontFamily: 'Noto Serif Ethiopic Condensed, serif' }}
//                     >
//                       {course?.certificateName || "Course Name"}
//                     </div>
//                   </div>

//                   {/* Hover Shine Effect */}
//                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ================= CHEVRON CLIPS ================= */}
//       <style jsx>{`
//         .clip-chevron {
//           clip-path: polygon(
//             0% 0%,
//             calc(100% - 15px) 0%,
//             100% 50%,
//             calc(100% - 15px) 100%,
//             0% 100%,
//             15px 50%
//           );
//         }
//         .clip-chevron-start {
//           clip-path: polygon(
//             0% 0%,
//             calc(100% - 15px) 0%,
//             100% 50%,
//             calc(100% - 15px) 100%,
//             0% 100%
//           );
//         }
//         .clip-chevron-end {
//           clip-path: polygon(
//             0% 0%,
//             100% 0%,
//             100% 100%,
//             0% 100%,
//             15px 50%
//           );
//         }
//       `}</style>
//       {showLeadForm && (
//         <LeadForm
//           course={{ title: course?.title }}
//           onClose={() => setShowLeadForm(false)}
//           onSuccess={() => setShowLeadForm(false)}
//         />
//       )}
//     </section>
//   );
// };

// export default FaqSection;

"use client";
import React, { useEffect, useState } from "react";
import Script from "next/script";
import { CaretUpIcon } from "@radix-ui/react-icons";
import { CircleCheckBig } from "lucide-react";
import LeadForm from "@/components/common/LeadForm/LeadForm";
import AnimatedGenerateButton from "@/components/ui/animated-generate-button";

interface Props {
  id?: string;
  course: any;
}

const ITEM_LIMIT = 6;

const STATIC_CERTIFICATE = {
  heading: "Industry-Recognized Certification",
  paragraph: `
    <p>
      This certification validates your hands-on expertise and practical
      knowledge gained during the training. It is designed to meet current
      industry standards and enhances your professional credibility.
    </p>
  `,
  image: "/course/certificate/certificate_no_name.webp",
};

/* ─── helper: strip HTML tags for schema text ─── */
const stripHtml = (html: string): string =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

const FaqSection = ({ id, course }: Props) => {
  /* ================= STATE ================= */
  const [activeTab, setActiveTab] = useState<"faq" | "interview" | "dumps">("faq");
  const [mobileActive, setMobileActive] = useState<"faq" | "interview" | "dumps">("faq");
  const [selected, setSelected] = useState<number | null>(null);
  const [showMoreFaq, setShowMoreFaq] = useState(false);
  const [showMoreInterview, setShowMoreInterview] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [expanded, setExpanded] = useState(false);

  /* ================= DATA ================= */
  const courseFaqs = course?.faqs_data || [];
  const interviewFaqs = course?.interview_questions_data || [];
  const aboutCert = course?.about_certificate_data;

  /* ================= CONDITIONS ================= */
  const hasFaqs = courseFaqs.length > 0;
  const hasInterview = interviewFaqs.length > 0;
  const hasDumps = !!aboutCert;

  /* ================= AEO: FAQPage JSON-LD schema ================= */
  // Uses ALL faqs (not limited) so Google indexes every Q&A
  const faqSchema =
    courseFaqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: courseFaqs.map((faq: any) => ({
            "@type": "Question",
            name: stripHtml(faq.que),
            acceptedAnswer: {
              "@type": "Answer",
              text: stripHtml(faq.ans),
            },
          })),
        }
      : null;

  /* ================= AEO: Course JSON-LD schema ================= */
  const courseSchema = course
    ? {
        "@context": "https://schema.org",
        "@type": "Course",
        name: course.title || "",
        description: stripHtml(course.description || course.title || ""),
        provider: {
          "@type": "Organization",
          name: "TechPratham",
          url: "https://www.techpratham.com",
        },
        educationalCredentialAwarded: course.certificateName || "",
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: ["online", "onsite"],
          inLanguage: "en-IN",
        },
      }
    : null;

  /* ================= VIEWPORT ================= */
  const [isMobileView, setIsMobileView] = useState(
    typeof window !== "undefined" && window.innerWidth < 1024
  );
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ================= AUTO FALLBACK ================= */
  useEffect(() => {
    if (!hasInterview && activeTab === "interview") setActiveTab("faq");
    if (!hasDumps && activeTab === "dumps") setActiveTab("faq");
  }, [hasInterview, hasDumps]);

  /* ================= PAGINATION ================= */
  const faqsToShow = showMoreFaq ? courseFaqs : courseFaqs.slice(0, ITEM_LIMIT);
  const interviewToShow = showMoreInterview ? interviewFaqs : interviewFaqs.slice(0, ITEM_LIMIT);

  const toggle = (i: number) => setSelected(selected === i ? null : i);

  /* ================= HEADER CLICK ================= */
  const handleHeaderClick = (type: "faq" | "interview" | "dumps") => {
    setActiveTab(type);
    setSelected(null);
    if (isMobileView) setMobileActive(type);
  };

  /* ================= SHARED FAQ ITEM RENDERER ================= */
  // itemScope + itemProp = microdata for AEO (works alongside JSON-LD)
  const renderFaqItem = (item: any, index: number, bgClass: string) => (
    <div
      key={index}
      itemScope
      itemType="https://schema.org/Question"
      onClick={() => toggle(index)}
      className={`${bgClass} p-3 rounded cursor-pointer`}
    >
      <div className="flex font-semibold justify-between items-start gap-4">
        <span
          itemProp="name"
          className="flex-1 overflow-hidden break-words"
          dangerouslySetInnerHTML={{ __html: item.que }}
        />
        <CaretUpIcon
          className={`w-5 h-5 flex-shrink-0 mt-1 transition-transform ${
            selected === index ? "" : "rotate-180"
          }`}
        />
      </div>
      {selected === index && (
        <div
          className="mt-3 flex"
          itemScope
          itemType="https://schema.org/Answer"
        >
          <CircleCheckBig className="w-5 h-5 mt-1 flex-shrink-0 mr-2" />
          <span
            itemProp="text"
            className="flex-1 overflow-hidden break-words"
            dangerouslySetInnerHTML={{ __html: item.ans }}
          />
        </div>
      )}
    </div>
  );

  /* ================= DUMPS / ABOUT CERT PANEL ================= */
  const renderDumpsPanel = () =>
    aboutCert ? (
      <div className="bg-white p-5 rounded-lg space-y-4">
        <h3 className="font-semibold">{aboutCert.heading}</h3>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: aboutCert.paragraph }}
          style={
            !expanded
              ? {
                  display: "-webkit-box",
                  WebkitLineClamp: 12,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }
              : {}
          }
        />
        <button className="text-red-500" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Show Less" : "Show More"}
        </button>
        <div className="flex justify-center">
          <button
            onClick={() => setShowLeadForm(true)}
            className="w-[250px] py-2 bg-gradient-to-tl from-[#C6151D] to-[#600A0E] hover:bg-orange-500/20 border border-orange-300/30 hover:border-orange-300/50 text-orange-100 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm"
          >
            Download Dumps
          </button>
        </div>
      </div>
    ) : null;

  /* ================= CERTIFICATE PANEL ================= */
  const renderCertPanel = (isMobile = false) => (
    <div className="bg-white p-5 rounded-lg space-y-2 mt-4">
      <h3 className="font-semibold">{STATIC_CERTIFICATE.heading}</h3>
      <div className={`${isMobile ? "" : "border-2"} relative overflow-hidden group`}>
        <img
          src={STATIC_CERTIFICATE.image}
          alt="Certificate"
          className="w-full rounded"
        />
        <div
          className={`absolute ${
            isMobile ? "top-[58%]" : "top-[38%]"
          } left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-20`}
        >
          <div
            className={`text-transparent bg-gradient-to-b from-[#ff0000] to-[#1f1e1f] bg-clip-text ${
              isMobile
                ? "text-base md:text-lg"
                : "text-lg md:text-2xl lg:text-2xl uppercase whitespace-nowrap"
            } font-bold tracking-wide drop-shadow-sm`}
            style={{ fontFamily: "Noto Serif Ethiopic Condensed, serif" }}
          >
            {course?.certificateName || "Course Name"}
          </div>
        </div>
        {!isMobile && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
        )}
      </div>
    </div>
  );

  /* ================= RENDER ================= */
  return (
    <section id={id} className="w-full bg-[#F3F4F6]">

      {/* ── AEO: Inject FAQPage schema into <head> ── */}
      {faqSchema && (
        <Script
          id="faq-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* ── AEO: Inject Course schema into <head> ── */}
      {courseSchema && (
        <Script
          id="course-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
        />
      )}

      <div className="m-2 p-2 border-2">

        {/* ================= HEADER ================= */}
        <div className="w-full relative overflow-x-auto mb-4">
          <div className="flex w-full min-w-[500px] h-14 drop-shadow-2xl">
            {[
              hasFaqs && { label: "FAQ's", key: "faq" as const },
              hasInterview && { label: "INTERVIEW QUESTION'S", key: "interview" as const },
              hasDumps && { label: "ABOUT CERTIFICATE", key: "dumps" as const },
            ]
              .filter(Boolean)
              .map((item: any, index, arr) => {
                const isActive = !isMobileView
                  ? activeTab === item.key
                  : mobileActive === item.key;
                return (
                  <div
                    key={item.key}
                    className={`flex-1 relative cursor-pointer ${index !== 0 ? "-ml-[14px]" : ""}`}
                  >
                    <div
                      className={`absolute inset-0 ${
                        index === 0
                          ? "clip-chevron-start"
                          : index === arr.length - 1
                          ? "clip-chevron-end"
                          : "clip-chevron"
                      } ${
                        isActive
                          ? "bg-gradient-to-tl from-[#C6151D] to-[#600A0E]"
                          : "bg-[#CA8A04]"
                      }`}
                    />
                    <div
                      className="relative z-10 h-full flex items-center justify-center px-2 md:px-4 overflow-hidden"
                      onClick={() => handleHeaderClick(item.key)}
                    >
                      <AnimatedGenerateButton
                        labelIdle={item.label}
                        labelActive={item.label}
                        isActive={isActive}
                        className="transform scale-60 md:scale-90 max-w-full"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleHeaderClick(item.key);
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        {isMobileView ? (

          /* ─────────── MOBILE ─────────── */
          <div className="space-y-2">

            {/* FAQ items */}
            <div className={mobileActive === "faq" ? "block" : "hidden"}>
              {faqsToShow.map((item: any, index: number) =>
                renderFaqItem(item, index, "bg-gray-100")
              )}
              {courseFaqs.length > ITEM_LIMIT && (
                <button
                  onClick={() => setShowMoreFaq(!showMoreFaq)}
                  className="text-red-700 font-semibold hover:underline mt-2 block"
                >
                  {showMoreFaq ? "Show Less" : "Show More"}
                </button>
              )}
            </div>

            {/* Interview items */}
            <div className={mobileActive === "interview" ? "block" : "hidden"}>
              {interviewToShow.map((item: any, index: number) =>
                renderFaqItem(item, index, "bg-gray-100")
              )}
              {interviewFaqs.length > ITEM_LIMIT && (
                <button
                  onClick={() => setShowMoreInterview(!showMoreInterview)}
                  className="text-red-700 font-semibold hover:underline mt-2 block"
                >
                  {showMoreInterview ? "Show Less" : "Show More"}
                </button>
              )}
            </div>

            {/* Dumps / About Certificate */}
            <div className={mobileActive === "dumps" ? "block" : "hidden"}>
              {renderDumpsPanel()}
            </div>

            {/* Static certificate — always visible on mobile */}
            {renderCertPanel(true)}
          </div>

        ) : (

          /* ─────────── DESKTOP ─────────── */
          <div className="grid gap-8 lg:grid-cols-2">

            {/* LEFT COLUMN */}
            <div className="space-y-2 mt-5">

              {/*
                AEO FIX: All three panels are always in the DOM.
                Inactive panels use `sr-only` so Google crawls them
                but users only see the active tab.
              */}

              {/* FAQ panel */}
              <div className={activeTab === "faq" ? "block space-y-2" : "sr-only"}>
                {faqsToShow.map((item: any, index: number) =>
                  renderFaqItem(item, index, "bg-white")
                )}
                {courseFaqs.length > ITEM_LIMIT && (
                  <button
                    onClick={() => setShowMoreFaq(!showMoreFaq)}
                    className="text-red-700 font-semibold hover:underline"
                  >
                    {showMoreFaq ? "Show Less" : "Show More"}
                  </button>
                )}
              </div>

              {/* Interview panel */}
              <div className={activeTab === "interview" ? "block space-y-2" : "sr-only"}>
                {interviewToShow.map((item: any, index: number) =>
                  renderFaqItem(item, index, "bg-gray-100")
                )}
                {interviewFaqs.length > ITEM_LIMIT && (
                  <button
                    onClick={() => setShowMoreInterview(!showMoreInterview)}
                    className="text-red-700 font-semibold hover:underline"
                  >
                    {showMoreInterview ? "Show Less" : "Show More"}
                  </button>
                )}
              </div>

              {/* Dumps panel */}
              <div className={activeTab === "dumps" ? "block" : "sr-only"}>
                {renderDumpsPanel()}
              </div>
            </div>

            {/* RIGHT COLUMN — always visible certificate */}
            <div className="space-y-6 mt-5">
              {renderCertPanel(false)}
            </div>

          </div>
        )}
      </div>

      {/* ================= CHEVRON CLIPS ================= */}
      <style jsx>{`
        .clip-chevron {
          clip-path: polygon(
            0% 0%,
            calc(100% - 15px) 0%,
            100% 50%,
            calc(100% - 15px) 100%,
            0% 100%,
            15px 50%
          );
        }
        .clip-chevron-start {
          clip-path: polygon(
            0% 0%,
            calc(100% - 15px) 0%,
            100% 50%,
            calc(100% - 15px) 100%,
            0% 100%
          );
        }
        .clip-chevron-end {
          clip-path: polygon(
            0% 0%,
            100% 0%,
            100% 100%,
            0% 100%,
            15px 50%
          );
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      `}</style>

      {showLeadForm && (
        <LeadForm
          course={{ title: course?.title }}
          onClose={() => setShowLeadForm(false)}
          onSuccess={() => setShowLeadForm(false)}
        />
      )}
    </section>
  );
};

export default FaqSection;