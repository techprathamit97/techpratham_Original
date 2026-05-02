"use client";

import React, { useState, useEffect } from "react";
import { CaretUpIcon } from "@radix-ui/react-icons";
import { CircleCheckBig } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  id?: string;
  course: any;
}

const whoShouldTakeData = [
  { text: "IT Professionals", color: "red" },
  { text: "Non-IT Career Switchers", color: "purple" },
  { text: "Fresh Graduates", color: "blue" },
  { text: "Working Professionals", color: "purple" },
  { text: "Ops/Administrators/HR", color: "blue" },
  { text: "Developers", color: "purple" },
  { text: "BA/QA Engineers", color: "blue" },
  { text: "Cloud / Infra", color: "purple" },
];

// Default SEO FAQs to show when no database content
const defaultSeoFaqs = [
   {
    que: "Career Objectives and Growth After Completion of Course",
    ans: "The immediate goal is to secure a role as a Functional or Technical Consultant by bridging business processes with technical implementation. With experience, professionals can grow from Associate Consultant to Solution Architect and further into Director-level roles. Continuous learning allows specialization in areas like Big Data, AI Integration, and Predictive Analytics."
  },
  {
    que: "Salary Expectations For Freshers Post Completion of Professional Courses",
    ans: "Freshers entering the specialized cloud and enterprise technology domain can expect a starting salary ranging from ₹4.5 LPA to ₹8 LPA in India. Candidates with industry-recognized certifications may see a 25–40% increase in their initial packages. In international markets, entry-level professionals can earn between $70,000 and $95,000, making it a highly rewarding career path."
  },
 
  {
    que: "Why is this Course so Popular?",
    ans: "This course is popular due to high global demand and a shortage of skilled professionals, ensuring strong job security and attractive salaries. Over 80% of Fortune 500 companies use cloud platforms, making these skills essential. It is also suitable for non-coders as it focuses more on business logic than heavy programming, and it prepares learners for future technologies like Enterprise AI."
  },
  {
    que: "Top Hiring Industry after this course",
    ans: "Top hiring industries include global consulting firms such as the Big 4 and IT service companies, Banking and Financial Services (BFSI), Healthcare and Life Sciences, and E-commerce and High-Tech companies that require scalable cloud-based solutions."
  },
  {
    que: "Other Related Courses",
    ans: "Related courses include ERP specializations in Finance, Supply Chain, and Human Capital Management, Cloud Infrastructure and Integration, Business Intelligence and Data Analytics, and AI and Automation for Enterprise systems."
  }
];

const INITIAL_FAQ_LIMIT = 5;
const ITEMS_PER_VIEW = 4;

const SeoSection = ({ id, course }: Props) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [showAllFaqs, setShowAllFaqs] = useState(false);

  const seoFaqs = course?.seo_faqs_data && course.seo_faqs_data.length > 0 
    ? course.seo_faqs_data 
    : defaultSeoFaqs;

  const toggle = (i: number) => {
    setSelected(selected === i ? null : i);
  };

  const displayedFaqs = showAllFaqs ? seoFaqs : seoFaqs.slice(0, INITIAL_FAQ_LIMIT);

  return (
    <section id={id} className="w-full bg-[#F3F4F6] py-3 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
     

        <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-4 w-full">
          
          {/* LEFT SIDE - SEO FAQs (70%) */}
          <div className="bg-gradient-to-tl from-[#9b861c] to-[#600A0E] rounded-lg p-3 pt-6 shadow-sm w-full">
            <div className="space-y-3">
              {displayedFaqs.map((faq: any, index: number) => (
                <div
                  key={index}
                  onClick={() => toggle(index)}
                  className="bg-gray-100 p-4 rounded-lg border border-gray-400 cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-start gap-2">
                    <h2 
                      className="font-medium"
                    >
                      {faq.que}
                    </h2>
                    <CaretUpIcon
                      className={`w-5 h-5 flex-shrink-0 mt-1 transition-transform ${
                        selected === index ? "" : "rotate-180"
                      }`}
                    />
                  </div>

                  {selected === index && (
                    <div className="mt-3 flex">
                      <CircleCheckBig className="w-5 h-5 mt-1 flex-shrink-0 mr-2 text-green-600" />
                      <div 
                        className="flex-1 overflow-hidden break-words text-gray-700"
                        dangerouslySetInnerHTML={{ __html: faq.ans }} 
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Show More / Show Less Button */}
            {seoFaqs.length > INITIAL_FAQ_LIMIT && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowAllFaqs(!showAllFaqs)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  {showAllFaqs ? "Show Less" : `Show More (${seoFaqs.length - INITIAL_FAQ_LIMIT} more)`}
                </button>
              </div>
            )}
          </div>

          {/* RIGHT SIDE - Who Should Take (30%) Show 4, Scroll 1 by 1 */}
          <div className="bg-white rounded-lg p-3 shadow-sm h-fit w-full min-w-0">
            <div className="text-center bg-gradient-to-tl from-[#C6151D] to-[#600A0E] p-2 mb-3 rounded-xl">
              <h2 className="text-white md:text-xl text-xl font-bold">
                {course?.whoShouldTakeTitle || `Who Should Take ${course?.title || 'This Course'}`}
              </h2>
            </div>

            {/* Continuous Smooth Scrolling */}
            <div className="h-[300px] overflow-hidden relative">
              <motion.div 
                className="space-y-3"
                animate={{ 
                  y: [0, -(whoShouldTakeData.length * 75)]
                }}
                transition={{
                  duration: whoShouldTakeData.length * 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                {/* Render all items twice for seamless loop */}
                {[...whoShouldTakeData, ...whoShouldTakeData].map((item, index) => (
                  <div
                    key={index}
                    className={`h-[60px] flex items-center justify-center rounded-xl border border-gray-200 shadow-sm transition-all
                      ${
                        item.color === "blue"
                          ? "border-l-[6px] border-red-800 "
                          : "border-l-[6px] border-yellow-700"
                      }
                    `}
                  >
                    <p className="text-[16px] font-medium text-gray-900 text-center">
                      {item.text}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeoSection;