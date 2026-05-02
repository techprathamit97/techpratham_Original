"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  course: any;
}

// Default SEO FAQs to show when no database content
const defaultSeoFaqs = [
  {
    que: "Salary Expectations For Freshers Post Completion of Professional Courses",
    ans: "Freshers entering the specialized cloud and enterprise technology domain can expect a starting salary ranging from ₹4.5 LPA to ₹8 LPA in India. Candidates with industry-recognized certifications may see a 25–40% increase in their initial packages. In international markets, entry-level professionals can earn between $70,000 and $95,000, making it a highly rewarding career path."
  },
  {
    que: "Career Objectives and Growth After Completion of Course",
    ans: "The immediate goal is to secure a role as a Functional or Technical Consultant by bridging business processes with technical implementation. With experience, professionals can grow from Associate Consultant to Solution Architect and further into Director-level roles. Continuous learning allows specialization in areas like Big Data, AI Integration, and Predictive Analytics."
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

const SeoFaqPopup = ({ course }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const seoFaqs = course?.seo_faqs_data && course.seo_faqs_data.length > 0 
    ? course.seo_faqs_data 
    : defaultSeoFaqs;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleFaq = (index: number) => {
    setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
  };

  return (
    <div className="relative " ref={dropdownRef}>
      {/* Dropdown Button - Same style as FAQ */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white px-2 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-between"
      >
        <span className="text-lg  text-gray-800">View In details </span>
        {isOpen ? (
          <ChevronUp className="w-6 h-6 text-gray-600 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-6 h-6 text-gray-600 flex-shrink-0" />
        )}
      </button>

      {/* Dropdown Content - Absolute Positioned */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-[713px] max-w-[90vw] bg-gradient-to-tl from-[#C6151D] to-[#600A0E]  border-2 border-gray-200 rounded-lg shadow-2xl overflow-hidden animate-slideDown z-50">
         

          {/* Content - FAQ Accordion Format */}
          <div className="p-6 max-h-[300px] overflow-y-auto">
            <div className="space-y-3">
              {seoFaqs.map((faq: any, index: number) => (
                <div key={index} className="border border-yellow-800 rounded-lg overflow-hidden bg-yellow-800">
                  {/* FAQ Question - Clickable */}
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-yellow-700 transition-colors bg-yellow-800"
                  >
                    <h3 
                      className="text-base font-semibold text-white pr-4"
                      dangerouslySetInnerHTML={{ __html: faq.que }} 
                    />
                    {expandedFaqIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-white flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-white flex-shrink-0" />
                    )}
                  </button>
                  
                  {/* FAQ Answer - Expandable */}
                  {expandedFaqIndex === index && (
                    <div className="px-4 pb-4 pt-2 border-t border-yellow-700 bg-yellow-800">
                      <div 
                        className="text-white/90 leading-relaxed text-sm"
                        dangerouslySetInnerHTML={{ __html: faq.ans }} 
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          
        </div>
      )}
    </div>
  );
};

export default SeoFaqPopup;
