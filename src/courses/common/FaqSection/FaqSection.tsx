




"use client";

import React, { useEffect, useState } from "react";
import { CaretUpIcon } from "@radix-ui/react-icons";
import { CircleCheckBig } from "lucide-react";
import LeadForm from "@/components/common/LeadForm/LeadForm";

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
  image: "/course/certificate/certificate_simple.webp",
};

const FaqSection = ({ id, course }: Props) => {
  /* ================= STATE ================= */
  const [leftTab, setLeftTab] = useState<"faq" | "interview">("faq");
  const [rightTab, setRightTab] = useState<"about" | "dumps">("about");
  const [mobileActive, setMobileActive] = useState<
    "faq" | "interview" | "about" | "dumps"
  >("faq");

  const [selected, setSelected] = useState<number | null>(null);
  const [showMoreFaq, setShowMoreFaq] = useState(false);
  const [showMoreInterview, setShowMoreInterview] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);

  /* ================= DATA ================= */
  const courseFaqs = course?.faqs_data || [];
  const interviewFaqs = course?.interview_questions_data || [];
  const aboutCert = course?.about_certificate_data;

  /* ================= CONDITIONS ================= */
  const hasFaqs = courseFaqs.length > 0;
  const hasInterview = interviewFaqs.length > 0;
  const hasAbout = true;
  const hasDumps = !!aboutCert;
  const hasRightSide = hasAbout || hasDumps;
  const [expanded, setExpanded] = useState(false);

  const getLimitedHTML = (html: string, wordLimit = 100) => {
    const text = html.replace(/<[^>]+>/g, "");
    const words = text.split(" ");

    if (words.length <= wordLimit) return html;

    return words.slice(0, wordLimit).join(" ") + "...";
  };

  /* ================= VIEWPORT ================= */
  const isMobileView =
    typeof window !== "undefined" && window.innerWidth < 1024;

  /* ================= AUTO FALLBACK ================= */
  useEffect(() => {
    if (!hasInterview) setLeftTab("faq");
    if (!hasAbout && hasDumps) setRightTab("dumps");
    if (!hasDumps && hasAbout) setRightTab("about");
  }, [hasInterview, hasAbout, hasDumps]);

  /* ================= PAGINATION ================= */
  const faqsToShow = showMoreFaq
    ? courseFaqs
    : courseFaqs.slice(0, ITEM_LIMIT);

  const interviewToShow = showMoreInterview
    ? interviewFaqs
    : interviewFaqs.slice(0, ITEM_LIMIT);

  const toggle = (i: number) => {
    setSelected(selected === i ? null : i);
  };

  /* ================= HEADER CLICK ================= */
  const handleHeaderClick = (
    type: "faq" | "interview" | "about" | "dumps"
  ) => {
    if (type === "faq" || type === "interview") setLeftTab(type);
    else setRightTab(type);

    if (isMobileView) setMobileActive(type);
  };

  return (
    <section id={id} className="w-full bg-gray-200 py-16">
      <div className="max-w-6xl mx-auto px-4 space-y-8">

        {/* ================= HEADER ================= */}
        <div className="w-full  relative  overflow-x-auto" >
          <div className="flex w-full min-w-[400px]  h-14 drop-shadow-2xl">
            {[
              hasFaqs && { label: "FAQ's", key: "faq" },
              hasInterview && { label: "INTERVIEW Question's", key: "interview" },
              hasAbout && { label: "ABOUT CERTIFICATE", key: "about" },
              hasDumps && { label: "CERTIFICATION DUMPS", key: "dumps" },
            ]
              .filter(Boolean)
              .map((item: any, index, arr) => {
                const isDesktopActive = !isMobileView
                  ? (item.key === leftTab &&
                    (item.key === "faq" || item.key === "interview")) ||
                  (item.key === rightTab &&
                    (item.key === "about" || item.key === "dumps"))
                  : false;

                const isMobileActive =
                  isMobileView && mobileActive === item.key;

                return (
                  <div
                    key={item.key}
                    onClick={() => handleHeaderClick(item.key)}
                    className={`flex-1 relative cursor-pointer ${index !== 0 ? "-ml-[14px]" : ""
                      }`}
                  >
                    <div
                      className={`absolute inset-0 ${index === 0
                        ? "clip-chevron-start"
                        : index === arr.length - 1
                          ? "clip-chevron-end"
                          : "clip-chevron"
                        } ${isDesktopActive || isMobileActive
                          ? "bg-gradient-to-tl from-[#C6151D] to-[#600A0E]"
                          : "bg-[#CA8A04]"
                        }`}
                    />
                    <div className="relative z-10 h-full flex items-center justify-center px-1 md:px-2 text-center">
                      <span className="text-[6px] md:text-xs font-bold text-white uppercase">
                        {item.label}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        {isMobileView ? (
          /* ========== MOBILE ========== */
          <div className="space-y-2">
            {(mobileActive === "faq"
              ? faqsToShow
              : mobileActive === "interview"
                ? interviewToShow
                : []
            ).map((item: any, index: number) => (
              <div
                key={index}
                onClick={() => toggle(index)}
                className="bg-gray-100 p-4 rounded cursor-pointer"
              >
                <div className="flex justify-between items-center gap-2">
                  <div dangerouslySetInnerHTML={{ __html: item.que }} />
                  <CaretUpIcon
                    className={`w-5 h-5 ${selected === index ? "" : "rotate-180"
                      }`}
                  />
                </div>

                {selected === index && (
                  <div className="mt-3 flex gap-2">
                    <CircleCheckBig className="w-5 h-5 mt-1" />
                    <div dangerouslySetInnerHTML={{ __html: item.ans }} />
                  </div>
                )}
              </div>
            ))}

            {/* MOBILE SHOW MORE / LESS */}
            {mobileActive === "faq" && courseFaqs.length > ITEM_LIMIT && (
              <button
                onClick={() => setShowMoreFaq(!showMoreFaq)}
                className="text-red-700 font-semibold hover:underline"
              >
                {showMoreFaq ? "Show Less" : "Show More"}
              </button>
            )}

            {mobileActive === "interview" &&
              interviewFaqs.length > ITEM_LIMIT && (
                <button
                  onClick={() => setShowMoreInterview(!showMoreInterview)}
                  className="text-red-700 font-semibold hover:underline"
                >
                  {showMoreInterview ? "Show Less" : "Show More"}
                </button>
              )}

            {mobileActive === "about" && (
              <div className="bg-white p-5 rounded-lg space-y-2">
                <h3 className="font-semibold">
                  {STATIC_CERTIFICATE.heading}
                </h3>

                <img
                  src={STATIC_CERTIFICATE.image}
                  alt="Certificate"
                  className="w-full rounded"
                />
              </div>
            )}


            {mobileActive === "dumps" && aboutCert && (
              <div className="bg-white p-5 rounded-lg space-y-3">
                <h3 className="font-semibold">{aboutCert.heading}</h3>

                <div
                  className={`prose max-w-none `}
                  dangerouslySetInnerHTML={{
                    __html: aboutCert.paragraph,
                  }}
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
            )}

          </div>
        ) : (
          /* ========== DESKTOP ========== */
          <div
            className={`grid gap-8 ${hasRightSide ? "lg:grid-cols-2" : "grid-cols-1"
              }`}
          >
            {/* LEFT */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">
                {leftTab === "faq" ? "Course FAQs" : "Interview Questions"}
              </h2>

              {(leftTab === "faq" ? faqsToShow : interviewToShow).map(
                (item: any, index: number) => (
                  <div
                    key={index}
                    onClick={() => toggle(index)}
                    className="bg-gray-100 p-3 rounded cursor-pointer"
                  >
                    <div className="flex font-semibold   justify-between items-center gap-4">
                      <div dangerouslySetInnerHTML={{ __html: item.que }} />
                      <CaretUpIcon
                        className={`w-5 h-5 ${selected === index ? "" : "rotate-180"
                          }`}
                      />
                    </div>

                    {selected === index && (
                      <div className="mt-3 flex gap-2">
                        <CircleCheckBig className="w-5 h-5 mt-1" />
                        <div
                          dangerouslySetInnerHTML={{ __html: item.ans }}
                        />
                      </div>
                    )}
                  </div>
                )
              )}

              {/* DESKTOP SHOW MORE / LESS */}
              {leftTab === "faq" && courseFaqs.length > ITEM_LIMIT && (
                <button
                  onClick={() => setShowMoreFaq(!showMoreFaq)}
                  className="text-red-700 font-semibold hover:underline"
                >
                  {showMoreFaq ? "Show Less" : "Show More"}
                </button>
              )}

              {leftTab === "interview" &&
                interviewFaqs.length > ITEM_LIMIT && (
                  <button
                    onClick={() =>
                      setShowMoreInterview(!showMoreInterview)
                    }
                    className="text-red-700 font-semibold hover:underline"
                  >
                    {showMoreInterview ? "Show Less" : "Show More"}
                  </button>
                )}
            </div>

            {/* RIGHT */}
            {hasRightSide && (
              <div className="space-y-6 mt-10">
                {rightTab === "about" && (
                  <div className="bg-white p-5 rounded-lg space-y-4">
                    <h3 className="font-semibold">
                      {STATIC_CERTIFICATE.heading}
                    </h3>
                    <div className=" border-2">
                      <img
                        src={STATIC_CERTIFICATE.image}
                        alt="Certificate"
                        className="w-full max-h-[300px] rounded"
                      />
                    </div>

                  </div>
                )}


                {rightTab === "dumps" && aboutCert && (
                  <div className="bg-white p-5 rounded-lg space-y-4">
                    <h3 className="font-semibold">{aboutCert.heading}</h3>

                    <div
                      className={`prose max-w-none `}
                      dangerouslySetInnerHTML={{
                        __html: aboutCert.paragraph,
                      }}
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
                )}

              </div>
            )}
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
