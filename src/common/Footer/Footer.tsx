import { FaLinkedin, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const NAVY = "#1E1546";
const RED = "#E3172C";

const Footer = () => {
  return (
    <footer className="tp-footer w-full h-auto flex flex-col items-center justify-center bg-[#1E1546] text-white pt-8 overflow-hidden">
      <div className="w-11/12 max-w-7xl relative z-10">
        {/* ---- Top grid ---- */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pb-6">

          {/* ---- Brand + About (left) ---- */}
          <div className="flex flex-col gap-3">
            <Link href={'/'} aria-label="Techpratham">
              <div className="flex items-center gap-3">
                <div className="relative w-28">
                  <Image
                    src={'/navbar/techpratham.png'}
                    alt="Techpratham Logo"
                    width={160}
                    height={48}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </Link>

            <p className="text-white/70 text-[13px] leading-relaxed max-w-xs">
              Industry-focused certification courses with expert guidance and
              placement support. An ISO 9001:2015 certified IT Training and
              Development company.
            </p>

            {/* Registration details (CIN / GST) */}
            <div className="flex flex-col gap-0.5 text-[11px] text-white/50">
              <span>CIN: U62013UP2025PTC223378</span>
              <span>GST: 09AALCT8794N1Z2</span>
            </div>

            {/* Social icons — outlined circles */}
            <div className="flex flex-row gap-2.5 mt-0.5">
              {[
                { href: "https://www.facebook.com/profile.php?id=61573041693401", label: "Facebook", Icon: FaFacebook },
                { href: "https://www.linkedin.com/company/techpratham/", label: "LinkedIn", Icon: FaLinkedin },
                { href: "https://www.instagram.com/techprathamofficials/", label: "Instagram", Icon: FaInstagram },
                { href: "https://x.com/TechPrathamEdu", label: "X / Twitter", Icon: FaTwitter },
              ].map(({ href, label, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow TechPratham on ${label} (opens in new tab)`}
                  className="w-8 h-8 rounded-full border border-white/25 text-white/80 flex items-center justify-center hover:bg-[#E3172C] hover:border-[#E3172C] hover:text-white transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>

          {/* ---- Courses ---- */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-white font-semibold text-sm">Courses</h3>
            <ul className="flex flex-col gap-1 text-[13px] text-white/70">
              <li><Link href="/courses/workday-certification-trainings" className="hover:text-[#E3172C] transition-colors">Workday Training</Link></li>
              <li><Link href="/courses/workday-hcm-functional-training" className="hover:text-[#E3172C] transition-colors">Workday HCM Training</Link></li>
              <li><Link href="/courses/workday-finance-training-certification-online" className="hover:text-[#E3172C] transition-colors">Workday Finance Training</Link></li>
              <li><Link href="/courses/servicenow-training-in-india" className="hover:text-[#E3172C] transition-colors">ServiceNow Training</Link></li>
              <li><Link href="/courses/sap-training-in-india" className="hover:text-[#E3172C] transition-colors">SAP Certification Training</Link></li>
              <li><Link href="/courses/workday-training-in-hyderabad" className="hover:text-[#E3172C] transition-colors">Workday HCM Training In Hyderabad</Link></li>
              <li><Link href="/courses/data-science-certification-training-in-india" className="hover:text-[#E3172C] transition-colors">Data Science Certification Training</Link></li>
              <li><Link href="/courses/software-testing-training-in-india" className="hover:text-[#E3172C] transition-colors">Software Testing Training in India</Link></li>
              <li><Link href="/courses/salesforce-training-in-india" className="hover:text-[#E3172C] transition-colors">Salesforce Training in India</Link></li>
              <li><Link href="/courses/ai-training-in-india" className="hover:text-[#E3172C] transition-colors">AI Training in India</Link></li>
              <li><Link href="/courses/agentic-ai-training-in-india" className="hover:text-[#E3172C] transition-colors">Agentic AI Training in India</Link></li>
            </ul>
          </div>

          {/* ---- Quick Links ---- */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-white font-semibold text-sm">Quick Links</h3>
            <ul className="flex flex-col gap-1 text-[13px] text-white/70">
              <li><Link href="/about-us" className="hover:text-[#E3172C] transition-colors">About Us</Link></li>
              <li><Link href="/contact-us" className="hover:text-[#E3172C] transition-colors">Contact Us</Link></li>
              <li><Link href="/blog" className="hover:text-[#E3172C] transition-colors">Blog</Link></li>
              <li><Link href="/review" className="hover:text-[#E3172C] transition-colors">Reviews</Link></li>
              <li><Link href="/job-openings" className="hover:text-[#E3172C] transition-colors">Careers</Link></li>
              <li><Link href="/corporate-training" className="hover:text-[#E3172C] transition-colors">Corporate Training</Link></li>
              <li><Link href="/faqs" className="hover:text-[#E3172C] transition-colors">FAQ&apos;s</Link></li>
              <li><Link href="/payment" className="hover:text-[#E3172C] transition-colors">Payment</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-[#E3172C] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-[#E3172C] transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link href="/refund-cancellation-policy" className="hover:text-[#E3172C] transition-colors">Refund/Cancellation Policy</Link></li>
            </ul>
          </div>

          {/* ---- Contact (right) ---- */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-white font-semibold text-sm">Contact Us</h3>

            <div className="flex flex-col gap-2.5 text-[13px]">
              <div>
                <span className="text-white font-semibold">Noida Office</span>
                <Link
                  href="https://maps.app.goo.gl/ySMUPRpVmsihWD6B8"
                  className="block text-white/70 hover:text-[#E3172C] transition-colors"
                >
                  B-24, Sector-1, Noida, Uttar Pradesh - 201301
                </Link>
              </div>
              <div>
                <span className="text-white font-semibold">Hyderabad Office</span>
                <Link
                  href="https://maps.app.goo.gl/GinqyPcv3Ao6euYD6"
                  className="block text-white/70 hover:text-[#E3172C] transition-colors"
                >
                  LVS Arcade, 71, Hitech, 6th floor, Madhapur Road,
                  Jubilee Enclave, HITEC City, Hyderabad - 500081
                </Link>
              </div>

              {/* Phone numbers with country flags */}
              <div className="flex flex-col gap-1 mt-1">
                <a href="tel:+918882178896" className="flex items-center gap-2 text-white/80 hover:text-[#E3172C] transition-colors">
                  <Image src="/course/icons/indian.jpg" alt="India" width={16} height={16} />
                  +91-8882178896
                </a>
                <a href="tel:+13434770926" className="flex items-center gap-2 text-white/80 hover:text-[#E3172C] transition-colors">
                  <Image src="/course/icons/uslogo.png" alt="US" width={16} height={16} />
                  +1 (343) 477-0926
                </a>
              </div>

              {/* Email */}
              <a href="mailto:info@techpratham.com" className="text-[#E3172C] hover:underline transition-colors">
                info@techpratham.com
              </a>
            </div>
          </div>
        </div>

        {/* ---- Big animated TECHPRATHAM wordmark ---- */}
        <div className="w-full flex items-center justify-center select-none pt-2 pb-1">
          <span className="tp-wordmark" aria-hidden="true">
            TECHPRATHAM
          </span>
        </div>
      </div>

      {/* ---- Bottom bar ---- */}
      <div className="w-full border-t border-white/10 mb-10 relative z-10">
        <div className="w-11/12 max-w-7xl mx-auto py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px] text-white/50">
          <span>© {new Date().getFullYear()} TechPratham. All rights reserved.</span>
          <span>An ISO 9001:2015 Certified Company</span>
        </div>
      </div>

      {/* ---- Styles for the animated wordmark ---- */}
      <style jsx>{`
        /* Dotted-grid background (subtle lighter dots on navy) */
        .tp-footer {
          position: relative;
          background-color: ${NAVY};
          background-image: radial-gradient(
            rgba(255, 255, 255, 0.12) 1.5px,
            transparent 1.5px
          );
          background-size: 46px 46px;
          background-position: 0 0;
        }
        .tp-wordmark {
          font-weight: 900;
          letter-spacing: 0.02em;
          line-height: 1;
          /* Scales with the viewport so it fills the width like the design */
          font-size: clamp(2rem, 9vw, 7.5rem);
          /* Static outlined letters */
          -webkit-text-stroke: 2px ${RED};
          color: transparent;
        }
      `}</style>
    </footer>
  );
}

export default Footer;
