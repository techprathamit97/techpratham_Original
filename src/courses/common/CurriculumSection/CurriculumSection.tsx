import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { CircleCheckBig } from "lucide-react";
import { CaretUpIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import CourseCard from "./CourseCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import PhoneInput from "@/components/common/PhoneInput/PhoneInput";
import { getLeadSource, isGoogleAdsVisitor } from '@/lib/leadSourceDetection';

/**
 * Renders the curriculum PDF as canvas pages via pdf.js instead of an iframe,
 * so the browser's native PDF viewer (with its download and print buttons) is
 * not used and right-click is blocked. Client-only because pdf.js needs the DOM.
 */
const ProtectedPDFViewer = dynamic(
  () =>
    import("@/components/lms/ProtectedPDFViewer").catch((error) => {
      console.error("Failed to load ProtectedPDFViewer:", error);
      const Fallback = () => (
        <div className="rounded-lg border border-red-300 bg-red-50 p-6 text-sm text-red-700">
          Viewer failed to load.
        </div>
      );
      return { default: Fallback };
    }),
  {
    ssr: false,
    loading: () => (
      <div className="py-16 text-center text-sm text-gray-500">
        Loading curriculum...
      </div>
    ),
  }
);

// Courses that should show PDF in left side (CNA courses)
const PDF_COURSES = [
  "servicenow-admin-certification",
  "servicenow-it-operations-management-itom-implementation",
  "servicenow-itsm-training",
  "servicenow-training-in-india",
  "salesforce-devops-engineering"
];

// PDF paths for courses - stored in /training folder
const PDF_PATHS: Record<string, string> = {
  "servicenow-admin-certification": "/training/TechPratham_ServiceNow.pdf",
  "servicenow-it-operations-management-itom-implementation": "/training/TechPratham_ITOM_Content.pdf",
  "servicenow-itsm-training": "/training/TechPratham_ServiceNow.pdf",
  "servicenow-training-in-india": "/training/TechPratham_ServiceNow_Admin_ITSM.pdf",
  "salesforce-devops-engineering": "/training/salesforce-devOps-engineering.pdf"
};

const getPdfUrl = (courselink: string): string => {
  // Create slug from course link (same logic as shouldShowPdf)
  const courseSlug = courselink?.toLowerCase().replace(/<[^>]*>/g, '').replace(/\s+/g, "-") || "";

  // Match course slug to PDF path
  for (const [key, path] of Object.entries(PDF_PATHS)) {
    if (courseSlug.includes(key)) {
      // #toolbar=0 disables the top toolbar
      // #navpanes=0 disables the left-hand page thumbnails/bookmarks menu sidebar
      return `${path}#toolbar=0&navpanes=0`;
    }
  }

  // Default PDF
  return `/training/TechPratham_ServiceNow.pdf#toolbar=0&navpanes=0`;
};

interface CurriculumItem {
  que: string;
  ans: string;
  topics?: string[];
  id?: string;
}

interface Course {
  _id: string;
  title: string;
  category: string;
  link: string;
  curriculum_data?: CurriculumItem[];
  curriculumTitle?: string;
}

export default function CurriculumSection({ id, course }: { id?: string; course: Course }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showAllCurriculum, setShowAllCurriculum] = useState(false);
  // const [showAllRelated, setShowAllRelated] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  // PDF Download Form State
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [pdfSubmitting, setPdfSubmitting] = useState(false);
  const [pdfSubmitSuccess, setPdfSubmitSuccess] = useState(false);
  const [pdfSubmitError, setPdfSubmitError] = useState("");

  const { register, handleSubmit: handlePdfSubmit, reset: resetPdfForm, setValue: setPdfValue, formState: { errors: pdfErrors } } = useForm({
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      course: course?.title ? course.title.replace(/<[^>]*>/g, "") : "",
      formType: "course-pdf-download",
      consent: true,
    },
  });

  const onPdfSubmit = async (data: any) => {
    // Allow submission even if phone validation state is not set
    // The PhoneInput component will handle validation
    if (!phoneNumber || phoneNumber.length < 5) {
      setPdfSubmitError("Please enter a valid phone number");
      return;
    }

    try {
      setPdfSubmitting(true);
      setPdfSubmitError("");

      const source = getLeadSource();

      console.log("Submitting PDF form with data:", { ...data, phone: phoneNumber, source });

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          phone: phoneNumber,
          source: source,
        }),
      });

      if (response.ok) {
        setPdfSubmitSuccess(true);
        console.log("PDF download form submitted successfully:", data);

        resetPdfForm();
        setPhoneNumber("");
        setIsPhoneValid(false);

        // Google Ads conversion tracking - only for Google Ads traffic
        if (isGoogleAdsVisitor() && typeof window !== "undefined") {
          if ((window as any).gtag) {
            (window as any).gtag("event", "conversion", {
              send_to: "AW-17462500412/K_E4CNSPy-0bELy44oZB",
            });
          } else {
            (window as any).dataLayer = (window as any).dataLayer || [];
            (window as any).dataLayer.push({
              event: "google_ads_conversion",
              conversion_id: "17462500412",
              conversion_label: "K_E4CNSPy-0bELy44oZB",
            });
          }
        }
        
        // TODO: Add Facebook/Instagram conversion tracking here if needed
        // if (leadSource === 'facebook_ads' || leadSource === 'instagram_ads') {
        //     // Facebook Pixel conversion tracking
        // }

        // Close dialog and trigger download after success
        setTimeout(() => {
          // Open PDF in new tab for download
          const pdfUrl = getPdfUrl(course?.link || "");
          console.log("Opening PDF URL:", pdfUrl);
          window.open(pdfUrl, '_blank');

          setPdfDialogOpen(false);
          setPdfSubmitSuccess(false);
        }, 2000);

      } else {
        const errorData = await response.json();
        console.error("Form submission failed:", errorData);
        setPdfSubmitError(errorData.message || "Failed to submit form. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting PDF form:", error);
      setPdfSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setPdfSubmitting(false);
    }
  };

  // Update course field when course prop changes
  useEffect(() => {
    if (course?.link) {
      setPdfValue("course", course.link.replace(/<[^>]*>/g, ""));
    }
  }, [course?.link, setPdfValue]);

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await fetch("/api/course/fetch");
      const data = await res.json();
      setCourses(data);
    };
    fetchCourses();
  }, []);

  const relatedCourses = useMemo(() => {
    if (!courses.length || !course?.category) return [];
    return courses.filter(
      (c) => c.category === course.category && c._id !== course._id
    );
  }, [courses, course]);

  const visibleCourses = relatedCourses;

  function toggle(index: number) {
    setSelected(selected === index ? null : index);
  }

  const curriculumData = course.curriculum_data ?? [];

  const visibleCurriculum = curriculumData;

  // Check if this course should show PDF.
  // Matched on course.link, not course.title, because the entries in
  // PDF_COURSES and PDF_PATHS are link slugs. Titles are free text and can be
  // edited or contain HTML, so they do not match reliably.
  const courseSlug = course.link?.toLowerCase().replace(/<[^>]*>/g, '').replace(/\s+/g, "-") || "";
  const shouldShowPdf = PDF_COURSES.some(
    (pdfCourse) => courseSlug.includes(pdfCourse.toLowerCase().replace(/\s+/g, "-")) || pdfCourse.toLowerCase() === courseSlug
  );

  return (
    <section id={id} className="w-full bg-white ">
      <div className="flex justify-center m-2 border-2">
        <div className="w-11/12 max-w-7xl grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* LEFT SIDE */}
          <div className="lg:col-span-3 flex flex-col gap-2">

            <div className="text-center flex flex-col mt-3 items-left">
              <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#CD4647] to-[#7F3B40]">
                {shouldShowPdf ? "Course Curriculum" : (course.curriculumTitle || `${course.title} Course Curriculum`)}
              </h2>
            </div>

            {/* CONDITIONAL RENDER: PDF for special courses, Accordion for others */}
            {shouldShowPdf ? (
              /* PDF VIEWER */
              <div className="bg-[#f7f7f7] rounded-lg p-5 flex flex-col gap-4 h-[500px]">
                <div className="w-full h-full overflow-y-auto rounded-lg">
                  <ProtectedPDFViewer
                    fileUrl={getPdfUrl(course.link)}
                    maxWidth={900}
                  />
                </div>
                <button
                  type="button"
                  className="mt-2 inline-flex items-center justify-center px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors cursor-pointer"
                  onClick={() => setPdfDialogOpen(true)}
                >
                  Download Curriculum PDF
                </button>

                {/* PDF Download Form Dialog */}
                <Dialog open={pdfDialogOpen} onOpenChange={setPdfDialogOpen}>
                  <DialogContent className="sm:max-w-[425px] max-w-[90vw] max-h-[90vh] overflow-y-auto bg-white">
                    <DialogHeader className="pb-2">
                      <DialogTitle className="text-xl font-bold text-center text-gray-800">
                        Download Course Curriculum
                      </DialogTitle>
                    </DialogHeader>

                    <form
                      onSubmit={handlePdfSubmit(onPdfSubmit)}
                      className="flex flex-col gap-3 mt-1"
                    >
                      {/* Success/Error Messages */}
                      {pdfSubmitSuccess && (
                        <div className="bg-green-100 border border-green-400 rounded-lg px-3 py-2 text-green-700 text-sm text-center">
                          ✅ Form submitted successfully! Downloading PDF...
                        </div>
                      )}

                      {pdfSubmitError && (
                        <div className="bg-red-100 border border-red-400 rounded-lg px-3 py-2 text-red-700 text-sm text-center">
                          ❌ {pdfSubmitError}
                        </div>
                      )}

                      {/* Name Field */}
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
                        <Input
                          {...register("fullName", { required: "Full name is required" })}
                          type="text"
                          placeholder="Enter your full name"
                          disabled={pdfSubmitting}
                          className="w-full border-gray-300 focus:border-red-500 focus:ring-red-500"
                        />
                        {pdfErrors.fullName && (
                          <span className="text-red-500 text-xs">{pdfErrors.fullName.message}</span>
                        )}
                      </div>

                      {/* Phone Number Field */}
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Contact Number <span className="text-red-500">*</span></label>
                        <PhoneInput
                          value={phoneNumber}
                          onChange={(phone) => {
                            setPhoneNumber(phone);
                            setPdfValue("phone", phone);
                          }}
                          onValidationChange={setIsPhoneValid}
                          placeholder="Enter contact number"
                          required
                          size="md"
                        />
                      </div>

                      {/* Email ID Field */}
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Email ID <span className="text-red-500">*</span></label>
                        <Input
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address",
                            },
                          })}
                          type="email"
                          placeholder="Enter your email ID"
                          disabled={pdfSubmitting}
                          className="w-full border-gray-300 focus:border-red-500 focus:ring-red-500"
                        />
                        {pdfErrors.email && (
                          <span className="text-red-500 text-xs">{pdfErrors.email.message}</span>
                        )}
                      </div>

                      {/* Course Autofill Field */}
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Course</label>
                        <Input
                          {...register("course")}
                          type="text"
                          disabled
                          className="w-full bg-gray-100 cursor-not-allowed font-medium text-gray-600"
                        />
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={pdfSubmitting}
                        className="w-full mt-2 font-semibold bg-red-800 hover:bg-red-900 text-white"
                      >
                        {pdfSubmitting ? "Submitting..." : "Download PDF"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              /* OLD FORMAT - Accordion */
              <div className="bg-[#f7f7f7] rounded-lg p-5 flex flex-col gap-4 max-h-[450px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
                {visibleCurriculum.map((item, index) => (
                  <div key={index} className="flex gap-4">

                    {/* Timeline */}
                    <div className={`flex flex-col items-center ${item.que.toLowerCase().includes("value added learning with extra module recordings") ||
                      (item.que.toLowerCase().includes("value") && item.que.toLowerCase().includes("added") && item.que.toLowerCase().includes("learning"))
                      ? "hidden"
                      : ""
                      }`}>
                      <div className="w-3 h-3 bg-red-800 rounded-full mt-6" />
                      <Separator orientation="vertical" className="flex-1 bg-red-800" />
                    </div>

                    {/* Accordion */}
                    <div
                      {...(!(item.que.toLowerCase().includes("value added learning with extra module recordings") ||
                        (item.que.toLowerCase().includes("value") && item.que.toLowerCase().includes("added") && item.que.toLowerCase().includes("learning"))) && {
                        onClick: () => toggle(index)
                      })}
                      className={`w-full rounded-xl py-2 transition-colors duration-200 ${item.que.toLowerCase().includes("value added learning with extra module recordings") ||
                        (item.que.toLowerCase().includes("value") && item.que.toLowerCase().includes("added") && item.que.toLowerCase().includes("learning"))
                        ? "bg-gradient-to-tl from-[#C6151D] to-[#600A0E] ml-7 text-white"
                        : "bg-yellow-600 text-black hover:bg-red-800  cursor-pointer px-3"
                        }`}
                    >
                      <div className={`flex items-center ${item.que.toLowerCase().includes("value added learning with extra module recordings") ||
                        (item.que.toLowerCase().includes("value") && item.que.toLowerCase().includes("added") && item.que.toLowerCase().includes("learning"))
                        ? "justify-between w-full"
                      : "px-3"
                      }`}>
                      {/* Left Arrows for Value Added Learning */}
                      {(item.que.toLowerCase().includes("value added learning with extra module recordings") ||
                        (item.que.toLowerCase().includes("value") && item.que.toLowerCase().includes("added") && item.que.toLowerCase().includes("learning"))) && (
                          <div className="flex items-center w-16 justify-center">
                            <span className="arrow text-2xl text-orange-200 font-bold">❯</span>
                            <span className="arrow text-2xl text-orange-200 font-bold">❯</span>
                            <span className="arrow text-2xl text-orange-200 font-bold">❯</span>
                          </div>
                        )}

                      <div
                        className={`text-lg font-semibold transition-colors duration-200 ${item.que.toLowerCase().includes("value added learning with extra module recordings") ||
                          (item.que.toLowerCase().includes("value") && item.que.toLowerCase().includes("added") && item.que.toLowerCase().includes("learning"))
                          ? "text-orange-200 pl-3 font-bold text-[17px] text-center flex-1"
                          : "hover:text-white flex-1"
                          }`}
                        dangerouslySetInnerHTML={{ __html: item.que }}
                      />

                      {/* Right Arrows for Value Added Learning */}
                      {(item.que.toLowerCase().includes("value added learning with extra module recordings") ||
                        (item.que.toLowerCase().includes("value") && item.que.toLowerCase().includes("added") && item.que.toLowerCase().includes("learning"))) && (
                          <div className="flex items-center w-16 justify-center">
                            <span className="arrow text-2xl text-orange-200 font-bold">❮</span>
                            <span className="arrow text-2xl text-orange-200 font-bold">❮</span>
                            <span className="arrow text-2xl text-orange-200 font-bold">❮</span>
                          </div>
                        )}

                      {/* CaretUpIcon - Only for regular questions */}
                      {!(item.que.toLowerCase().includes("value added learning with extra module recordings") ||
                        (item.que.toLowerCase().includes("value") && item.que.toLowerCase().includes("added") && item.que.toLowerCase().includes("learning"))) && (
                          <CaretUpIcon
                            className={`w-6 h-6 transition-transform duration-300 ml-2 text-white ${selected === index ? "rotate-0" : "rotate-180"
                              }`}
                          />
                        )}
                    </div>

                    {/* CONTENT - Only for regular questions */}
                    {!(item.que.toLowerCase().includes("value added learning with extra module recordings") ||
                      (item.que.toLowerCase().includes("value") && item.que.toLowerCase().includes("added") && item.que.toLowerCase().includes("learning"))) && (
                        <div
                          className={`transition-all duration-500 ease-in-out ${selected === index
                            ? "max-h-[500px] opacity-100 mt-4"
                            : "max-h-0 opacity-0 overflow-hidden"
                            }`}
                        >
                          <Separator className="mb-4 bg-yellow-600" />

                          <div
                            className="text-sm"
                            dangerouslySetInnerHTML={{ __html: item.ans }}
                          />

                          {item?.topics?.map((topic: string, i: number) => (
                            <div key={i} className="flex items-center gap-2 mt-2 text-sm">
                              <CircleCheckBig className="w-4 h-4 text-red-800" />
                              <span>{topic}</span>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
                ))}

              {/* SHOW MORE / LESS */}

            </div>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-2 flex flex-col md:mt-12 gap-4">
            <h3 className="text-lg font-semibold text-red-800">
              {course.category} Courses
            </h3>

            <div className="h-[410px] overflow-y-auto [&::-webkit-scrollbar]:hidden pr-2 flex flex-col gap-4">
              {relatedCourses.length === 0 && (
                <p className="text-sm text-gray-500">No related courses found</p>
              )}

              {relatedCourses.map((c) => (
                <CourseCard key={c._id} course={c} />
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes bgMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .arrow {
          animation: moveArrow 1.5s linear infinite;
        }
        .arrow:nth-child(1) { 
          animation-delay: 0s; 
        }
        .arrow:nth-child(2) { 
          animation-delay: 0.2s; 
        }
        .arrow:nth-child(3) { 
          animation-delay: 0.4s; 
        }
        @keyframes moveArrow {
          0% {
            transform: translateX(0);
            opacity: 0.3;
          }
          50% {
            transform: translateX(8px);
            opacity: 1;
          }
          100% {
            transform: translateX(16px);
            opacity: 0.3;
          }
        }
      `}</style>
    </section>
  );
}