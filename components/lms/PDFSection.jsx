"use client";
import React, { useState } from 'react';
import dynamic from "next/dynamic";
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
import { toS3Key, toSecurePdfUrl } from "@/lib/pdfKey";

/**
 * pdf.js touches browser-only APIs, so the protected viewer is client-only.
 * The catch keeps a load failure visible instead of leaving the fallback up.
 */
const ProtectedPDFViewer = dynamic(
  () =>
    import("@/components/lms/ProtectedPDFViewer").catch((error) => {
      console.error("Failed to load ProtectedPDFViewer:", error);
      const Fallback = () => (
        <div className="rounded-lg border border-red-300 bg-red-50 p-6 text-sm text-red-700">
          <p className="mb-1 font-semibold">Viewer failed to load.</p>
          <p className="font-mono text-xs">{String(error?.message || error)}</p>
        </div>
      );
      return { default: Fallback };
    }),
  {
    ssr: false,
    loading: () => (
      <div className="py-16 text-center text-sm text-gray-500">
        Loading document...
      </div>
    ),
  }
);

const PDFSection = ({
  pdfUrl,
  width = "fullscreen",
  customWidth = "100%",
  height = "1000px",
  title,
  downloadEnabled = true,
  displayType = "embed",
  /**
   * Renders via pdf.js canvas instead of the browser's native PDF viewer, which
   * removes the download / print controls and makes right-click blockable.
   * Puck stores select values as strings, so "false" must be handled too.
   */
  protectedView = "true"
}) => {
  const isProtected = protectedView !== false && protectedView !== "false";

  // Existing content stores absolute bucket URLs; derive the key at render time
  // so no stored lesson data needs migrating.
  const s3Key = toS3Key(pdfUrl);
  const securePdfUrl = toSecurePdfUrl(pdfUrl);
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
      course: title || "PDF Document",
      formType: "pdf-download",
      consent: true,
    },
  });

  // Determine container styles based on width setting
  const getContainerStyles = () => {
    const baseStyles = {
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    };

    if (width === "fullscreen") {
      return {
        ...baseStyles,
        width: "100vw",
        
        position: "relative"
      };
    } else if (width === "container") {
      return {
        ...baseStyles,
        width: "110%"
      };
    } else {
      return {
        ...baseStyles,
        width: customWidth,
        margin: "0 auto"
      };
    }
  };

  // Check if visitor came from Google Ads
  const isGoogleAdsVisitor = () => {
    if (typeof window === "undefined") return false;
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.has("gclid") || searchParams.get("utm_source") === "google";
  };

  const onPdfSubmit = async (data) => {
    // Allow submission even if phone validation state is not set
    // The PhoneInput component will handle validation
    if (!phoneNumber || phoneNumber.length < 5) {
      setPdfSubmitError("Please enter a valid phone number");
      return;
    }

    try {
      setPdfSubmitting(true);
      setPdfSubmitError("");

      const googleAdsVisitor = isGoogleAdsVisitor();
      const source = googleAdsVisitor ? "google_ads" : "website_form";

     

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
      

        resetPdfForm();
        setPhoneNumber("");
        setIsPhoneValid(false);

        // Google Ads conversion tracking
        if (googleAdsVisitor && typeof window !== "undefined") {
          if ((window).gtag) {
            (window).gtag("event", "conversion", {
              send_to: "AW-17462500412/K_E4CNSPy-0bELy44oZB",
            });
          } else {
            (window).dataLayer = (window).dataLayer || [];
            (window).dataLayer.push({
              event: "google_ads_conversion",
              conversion_id: "17462500412",
              conversion_label: "K_E4CNSPy-0bELy44oZB",
            });
          }
        }

        // Close dialog and trigger download after success
        setTimeout(() => {
          // This is an intentional, lead-gated download. Route it through the
          // proxy when protected so the bucket URL is still never exposed.
          const downloadUrl = isProtected && securePdfUrl ? securePdfUrl : pdfUrl;
          window.open(downloadUrl, '_blank');

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

  if (!pdfUrl) {
    return (
      <div style={getContainerStyles()}>
        <div style={{
          width: "100%",
          height: "200px",
          border: "2px dashed #ccc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "16px",
          color: "#999",
          borderRadius: "8px"
        }}>
          No PDF selected. Please upload a PDF file.
        </div>
      </div>
    );
  }

  // Clean PDF URL - remove toolbars and navigation panes
 const cleanPdfUrl =
  `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;

  // In protected mode the link points at the proxy so the bucket URL stays hidden.
  const linkHref = isProtected && securePdfUrl ? securePdfUrl : cleanPdfUrl;

  if (displayType === "link") {
    return (
      <div style={{ 
        ...getContainerStyles(),
        border: "1px solid #e0e0e0",
        borderRadius: "0",
        textAlign: "center",
        backgroundColor: "#f9f9f9"
      }}>
        {title && (
          <h3 style={{ 
            margin: "0 0 15px 0",
            fontSize: "18px",
            fontWeight: "600",
            color: "#333"
          }}>
            {title}
          </h3>
        )}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
          <a 
            href={linkHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
             
              backgroundColor: "#007bff",
              color: "white",
              textDecoration: "none",
              borderRadius: "5px",
              fontSize: "14px",
              fontWeight: "500"
            }}
          >
            📄 View PDF
          </a>
          
        </div>
      </div>
    );
  }

  // Canvas rendering sizes itself to its parent, so the container must not be
  // forced wider than that parent.
  const useCanvasViewer = isProtected && s3Key;

  return (
    <>
      {/* CSS for full-width iframe */}
      <style jsx>{`
        .pdf-container {
          ${useCanvasViewer ? `
            /*
             * The canvas viewer fills whatever width it is given, so it stays at
             * 100% of the parent. The iframe branch below keeps 100vw, but that
             * value is wider than the 75vw wrapper applied in puckConfig and
             * also includes the vertical scrollbar, which is what produced the
             * horizontal scrollbar under the PDF.
             */
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: hidden !important;
          ` : width === "fullscreen" ? `
            width: 100vw !important;
            
            position: relative !important;
          ` : width === "container" ? `
            width: 100% !important;
          ` : `
            width: ${customWidth} !important;
            margin: 0 auto !important;
          `}
          padding: 0 !important;
          box-sizing: border-box !important;
        }
        
        .pdf-iframe {
          width: 100% !important;
          height: ${height} !important;
          border: none !important;
          margin: 0 !important;
          padding: 0 !important;
          display: block !important;
          background: white;
        }
        
        .pdf-wrapper {
        
          
          background: white;
          ${useCanvasViewer ? `
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: hidden !important;
          ` : ``}
        }
      `}</style>
      
      <div className="pdf-container">
        {title && (
          <h3 style={{ 
            margin: "0 0 15px 0",
            fontSize: "18px",
            fontWeight: "600",
            color: "#333",
            textAlign: "center",
            padding: width === "fullscreen" ? "0 15px" : "0"
          }}>
            {title}
          </h3>
        )}
        
        <div className="pdf-wrapper">
          {useCanvasViewer ? (
            /**
             * Canvas rendering via pdf.js. No native viewer means no built-in
             * download or print control, and right-click is cancellable.
             */
            <ProtectedPDFViewer
              fileKey={s3Key}
              maxWidth={1000}
            />
          ) : (
            <iframe
              src={cleanPdfUrl}
              className="pdf-iframe"
              title={title || "PDF Document"}
              loading="lazy"
            />
          )}
        </div>
        
        
      </div>

      {/* PDF Download Form Dialog */}
      <Dialog open={pdfDialogOpen} onOpenChange={setPdfDialogOpen}>
        <DialogContent className="sm:max-w-[425px] max-w-[90vw] max-h-[90vh]  bg-white">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-xl font-bold text-center text-gray-800">
              Download PDF Document
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

            {/* Document Title Autofill Field */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Document</label>
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
    </>
  );
};

export default PDFSection;