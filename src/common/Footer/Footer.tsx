import { FaLinkedin, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <div className="w-full h-auto flex flex-col items-center justify-center bg-[#ff2a3b] pt-8 mb-10">
      {/* White floating card */}
      <div className="w-11/12 max-w-7xl bg-white rounded-t-2xl shadow-[0_-2px_30px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 px-6 md:px-8 py-6">

          {/* ---- Brand + About (left) ---- */}
          <div className="flex flex-col gap-4">
            <Link href={'/'} aria-label="Techpratham">
              <div className="relative w-40">
                <Image
                  src={'/navbar/techpratham.png'}
                  alt="Techpratham Logo"
                  width={160}
                  height={48}
                  className="w-full h-auto"
                />
                
              </div>
            </Link>

            <div>
              <h3 className="text-gray-900 font-semibold text-base mb-2">About Us</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                TechPratham is an ISO 9001:2015 certified IT Training and Development,
                delivering industry-focused certification courses with expert
                guidance and placement support.
              </p>
            </div>

            {/* Registration details (CIN / GST) kept from original data */}
            <div className="flex flex-col gap-1 text-sm">
              <span className="text-gray-900 font-medium">CIN:</span>
              <span className="text-gray-700">U62013UP2025PTC223378</span>
              <span className="text-gray-900 font-medium mt-1">GST:</span>
              <span className="text-gray-700">09AALCT8794N1Z2</span>
            </div>
          </div>

          {/* ---- Trending Courses ---- */}
          <div className="flex flex-col gap-3">
            <h3 className="text-gray-900 font-semibold text-base">Courses</h3>
            <ul className="flex flex-col gap-2 text-sm text-gray-700">
              <li><Link href="/courses/workday-certification-trainings" className="hover:text-[#C6151D] hover:underline transition-colors">Workday Training</Link></li>
              <li><Link href="/courses/workday-hcm-functional-training" className="hover:text-[#C6151D] hover:underline transition-colors">Workday HCM Training</Link></li>
              <li><Link href="/courses/workday-finance-training-certification-online" className="hover:text-[#C6151D] hover:underline transition-colors">Workday Finance Training</Link></li>
              <li><Link href="/courses/servicenow-training-in-india" className="hover:text-[#C6151D] hover:underline transition-colors">ServiceNow Training</Link></li>
              <li><Link href="/courses/sap-training-in-india" className="hover:text-[#C6151D] hover:underline transition-colors">SAP Certification Training</Link></li>
              <li><Link href="/courses/master-in-agentic-ai" className="hover:text-[#C6151D] hover:underline transition-colors">Master In Agentic AI</Link></li>
              <li><Link href="/courses/workday-training-in-hyderabad" className="hover:text-[#C6151D] hover:underline transition-colors">Workday HCM Training In Hyderabad</Link></li>
              <li><Link href="/courses/data-science-certification-training-in-india" className="hover:text-[#C6151D] hover:underline transition-colors">Data Science Certification Training</Link></li>
            </ul>
          </div>

          {/* ---- Company ---- */}
          <div className="flex flex-col gap-2">
            <h3 className="text-gray-900 font-semibold text-base">Company</h3>
            <ul className="flex flex-col gap-1 text-sm text-gray-700">
              <li><Link href="/about-us" className="hover:text-[#C6151D] hover:underline transition-colors">About Us</Link></li>
              <li><Link href="/contact-us" className="hover:text-[#C6151D] hover:underline transition-colors">Contact Us</Link></li>
              <li><Link href="/blog" className="hover:text-[#C6151D] hover:underline transition-colors">Blog</Link></li>
              <li><Link href="/job-openings" className="hover:text-[#C6151D] hover:underline transition-colors">Careers</Link></li>
              <li><Link href="/corporate-training" className="hover:text-[#C6151D] hover:underline transition-colors">Corporate Training</Link></li>
              <li><Link href="/faqs" className="hover:text-[#C6151D] hover:underline transition-colors">FAQ&apos;s</Link></li>
              <li><Link href="/payment" className="hover:text-[#C6151D] hover:underline transition-colors">Payment</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-[#C6151D] hover:underline transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-[#C6151D] hover:underline transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link href="/refund-cancellation-policy" className="hover:text-[#C6151D] hover:underline transition-colors">Refund/Cancellation Policy</Link></li>
            </ul>
          </div>

          {/* ---- Contact + Social (right) ---- */}
          <div className="flex flex-col gap-2">
            <h3 className="text-gray-900 font-semibold text-base">Contact Us</h3>

            <div className="flex flex-col gap-2 text-sm">
              <div>
                <span className="text-gray-900 font-semibold">Noida Office:</span>
                <Link
                  href="https://maps.app.goo.gl/ySMUPRpVmsihWD6B8"
                  className="block text-gray-700 hover:text-[#C6151D] hover:underline transition-colors"
                >
                  B-24, Sector-1, Noida, Uttar Pradesh - 201301
                </Link>
              </div>
              <div>
                <span className="text-gray-900 font-semibold">Hyderabad Office:</span>
                <Link
                  href="https://maps.app.goo.gl/GinqyPcv3Ao6euYD6"
                  className="block text-gray-700 hover:text-[#C6151D] hover:underline transition-colors"
                >
                  LVS Arcade, 71, Hitech, 6th floor, Madhapur Road,
                  Jubilee Enclave, HITEC City, Hyderabad - 500081
                </Link>
              </div>

              {/* Phone numbers with country flags */}
              <div className="flex flex-col gap-1">
                <a href="tel:+918882178896" className="flex items-center gap-2 text-[#C6151D] hover:text-[#C6151D] hover:underline transition-colors">
                  <Image src="/course/icons/indian.jpg" alt="India" width={16} height={16} className="" />
                  +91-8882178896
                </a>
                <a href="tel:+13434770926" className="flex items-center gap-2 text-[#C6151D] hover:text-[#C6151D] hover:underline transition-colors">
                  <Image src="/course/icons/uslogo.png" alt="US" width={16} height={16} className="" />
                  +1 (343) 477-0926
                </a>
              </div>

              {/* Email */}
              <a href="mailto:info@techpratham.com" className="text-[#C6151D] hover:text-[#C6151D] hover:underline transition-colors">
                info@techpratham.com
              </a>
            </div>

            {/* Follow Us */}
            <div className="mt-1">
              <h4 className="text-gray-900 font-semibold text-base mb-2">Follow Us</h4>
              <div className="flex flex-row gap-3">
                <Link
                  href="https://www.facebook.com/profile.php?id=61573041693401"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow TechPratham on Facebook (opens in new tab)"
                  className="w-9 h-9 rounded-full bg-gradient-to-tl from-[#600A0E] to-[#C6151D] text-white flex items-center justify-center hover:brightness-110 transition"
                >
                  <FaFacebook className="w-5 h-5" aria-hidden="true" />
                </Link>
                <Link
                  href="https://www.linkedin.com/company/techpratham/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow TechPratham on LinkedIn (opens in new tab)"
                  className="w-9 h-9 rounded-full bg-gradient-to-tl from-[#600A0E] to-[#C6151D] text-white flex items-center justify-center hover:brightness-110 transition"
                >
                  <FaLinkedin className="w-5 h-5" aria-hidden="true" />
                </Link>
                <Link
                  href="https://www.instagram.com/techprathamofficials/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow TechPratham on Instagram (opens in new tab)"
                  className="w-9 h-9 rounded-full bg-gradient-to-tl from-[#600A0E] to-[#C6151D] text-white flex items-center justify-center hover:brightness-110 transition"
                >
                  <FaInstagram className="w-5 h-5" aria-hidden="true" />
                </Link>
                <Link
                  href="https://x.com/TechPrathamEdu"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow TechPratham on X / Twitter (opens in new tab)"
                  className="w-9 h-9 rounded-full bg-gradient-to-tl from-[#600A0E] to-[#C6151D] text-white flex items-center justify-center hover:brightness-110 transition"
                >
                  <FaTwitter className="w-5 h-5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Dark bottom bar (copyright + ISO) ---- */}
        <div className="w-full bg-[#111827] text-gray-300 px-6 md:px-10 py-1
                        flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
          <span>© {new Date().getFullYear()} TechPratham. All rights reserved.</span>
          <span className="text-gray-400">An ISO 9001:2015 Certified Company</span>
        </div>
      </div>
    </div>
  );
}

export default Footer;
