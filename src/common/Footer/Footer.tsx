import { Separator } from '@/components/ui/separator';
import { FaLinkedin, FaYoutube, FaFacebook, FaTwitter } from "react-icons/fa";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../Navbar/logo'
import SeoDropdown from "./SeoDropdown";
const Footer = () => {
  return (
    <div className="w-full h-auto flex flex-col items-center justify-center bg-[#212529] text-gray-300">
      <div className="md:w-11/12 w-11/12 flex flex-col py-3 gap-5">

        {/* Top part (your existing) */}
        <div className="w-full flex flex-col md:flex-row items-start justify-between">
          <div className="flex flex-col items-start mb-3 md:mb-0">
            <Link href={'/'} aria-label='Techpratham'>
              <div className="relative w-40">
                <Image
                  src={'/navbar/logotechnolyfirst2.svg'}
                  alt='Techpratham Logo'
                  width={80}
                  height={30}
                  className='w-full h-auto'
                />

                <span className="absolute bottom-2 pl-1 left-1/2 -translate-x-1/2 text-[7px] text-white">
                  Technology First
                </span>
              </div>
            </Link>
          </div>

          <div className="flex flex-col items-start">
            <div className="text-xl font-semibold mb-1">Follow Us!</div>
            <Separator className="mb-2 w-48" />
            <div className="flex flex-row gap-3 flex-wrap">
              <Link
                href="https://www.facebook.com/profile.php?id=61573041693401"
                target="_blank"
                className="w-8 h-8 rounded-full bg-gradient-to-tl from-[#600A0E] to-[#C6151D] text-white flex items-center justify-center"
              >
                <FaFacebook className="w-6 h-6" />
              </Link>
              <Link
                href="https://www.linkedin.com/company/techpratham/"
                target="_blank"
                className="w-8 h-8 rounded-full bg-gradient-to-tl from-[#600A0E] to-[#C6151D] text-white flex items-center justify-center"
              >
                <FaLinkedin className="w-6 h-6" />
              </Link>

              {/* <Link
                href="https://www.instagram.com/techprathamofficial/"
                target="_blank"
                className="w-8 h-8 rounded-full bg-gradient-to-tl from-[#600A0E] to-[#C6151D] text-white flex items-center justify-center"
              >
                <FaInstagram className="w-6 h-6" />
              </Link> */}
              <Link
                href="https://x.com/TechPratham_"
                className="w-8 h-8 rounded-full bg-gradient-to-tl from-[#600A0E] to-[#C6151D] text-white flex items-center justify-center"
              >
                <FaTwitter className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>

        {/* Middle part (offices + links) */}
        <div className="w-full flex flex-row flex-wrap gap-10 items-start justify-between">
          <div className="flex flex-col gap-1">
            {/* <div className="text-base uppercase font-normal bg-gradient-to-tr from-[#FC7A35] to-[#f8da52] text-transparent bg-clip-text">Registered Office:</div> */}
            <div className="text-base uppercase font-normal inline-block">
              <span className="bg-gradient-to-tr from-[#FC7A35] to-[#f8da52] text-transparent bg-clip-text border-b-2 border-orange-400">
                Registered Office:
              </span>
            </div>
            <div className="flex flex-col capitalize text-[14px] font-light gap-1">
              <Link href="/" className="transition-all duration-300 hover:underline">
                G-31, 1st Floor Sector-3, Noida 201301
              </Link>
            </div>
            {/* <div className="text-base uppercase font-normal bg-gradient-to-tr from-[#FC7A35] to-[#f8da52] text-transparent bg-clip-text">Noida Office:</div> */}
            <div className="text-base uppercase font-normal inline-block">
              <span className="bg-gradient-to-tr from-[#FC7A35] to-[#f8da52] text-transparent bg-clip-text border-b-2 border-orange-400">
                Noida Office:
              </span>
            </div>
            <div className="flex flex-col capitalize text-[14px] font-light gap-1">
              <Link href="/" className="transition-all duration-300 hover:underline">
                C-2, Sector-1, Noida, Uttar Pradesh - 201301
              </Link>
            </div>
            <div className="text-base uppercase font-normal inline-block">
              <span className="bg-gradient-to-tr from-[#FC7A35] to-[#f8da52] text-transparent bg-clip-text border-b-2 border-orange-400">
                Hyderabad Office:
              </span>
            </div>
            <div className="flex flex-col capitalize text-[14px] font-light gap-1">
              <Link href="/" className="transition-all duration-300 hover:underline">
                LVS Arcade, 71, Hitech, 6th floor ,<br />
                Madhapur Road, Jubilee Enclave,<br />
                HITEC City, Hyderabad
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="text-base uppercase font-normal">Trending Certification Courses</div>
            <div className="flex flex-col capitalize text-[12px] font-light">
              <Link href="/courses/workday-certification-trainings" className="transition-all duration-300 hover:underline">Workday training</Link>
              <Link href="/courses/workday-hcm-functional" className="transition-all duration-300 hover:underline">Workday HCM Training</Link>
              <Link href="/courses/workday-finance-training-certification-online" className="transition-all duration-300 hover:underline">Workday Finance Training</Link>
              <Link href="/courses/servicenow-training-in-india" className="transition-all duration-300 hover:underline">Servicenow training</Link>
              <Link href="/courses/sap-certification-training" className="transition-all duration-300 hover:underline">SAP Certification Training</Link>
              <Link href="/courses/master-in-agentic-ai" className="transition-all duration-300 hover:underline">Master In Agentic AI</Link>
              <Link href="/courses/workday-training-in-hyderabad" className="transition-all duration-300 hover:underline">Workday HCM Training in Hyderabad</Link>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="text-base uppercase font-normal">Company</div>
            <div className="flex flex-col capitalize text-xs font-light">
              <Link href="/about-us" className="transition-all duration-300 hover:underline">About Us</Link>
              <Link href="/contact-us" className="transition-all duration-300 hover:underline">Contact Us</Link>
              <Link href="/job-openings" className="transition-all duration-300 hover:underline">Careers</Link>
              <Link href="/corporate-training" className="transition-all duration-300 hover:underline">Corporate Training</Link>
              <Link href="/faqs" className="transition-all duration-300 hover:underline">FAQ's</Link>
              <Link href="/payment" className="transition-all duration-300 hover:underline">Payment</Link>
              <Link href="/privacy-policy" className="transition-all duration-300 hover:underline">Privacy Policy</Link>
              <Link href="/terms-and-conditions" className="transition-all duration-300 hover:underline">Terms & Conditions</Link>
              <Link href="/refund-cancellation-policy" className="transition-all duration-300 hover:underline">Refund/Cancellation Policy</Link>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="text-base uppercase font-normal">CIN:</div>
            <div className="flex flex-col capitalize text-sm font-light gap-1">
              <Link href="/" className="transition-all duration-300 hover:underline">U62013UP2025PTC223378</Link>
            </div>
            <div className="text-base uppercase font-normal">GST:</div>
            <div className="flex flex-col capitalize text-sm font-light gap-1">
              <Link href="/" className="transition-all duration-300 hover:underline">09AALCT8794N1Z2</Link>
            </div>
          </div>
        </div>
      </div>
      {/* <div className='w-full mb-5'>
        <SeoDropdown />
      </div> */}

      {/* Bottom “All Rights Reserved” text */}
      <div className="w-full border-t border-gray-700 md:px-40 pb-12 pt-2 text-sm text-gray-500 
            flex flex-col sm:flex-row 
            sm:justify-between sm:items-center 
            text-center sm:text-left gap-2">

        <span>© {new Date().getFullYear()} TechPratham. All rights reserved.</span>

        <span className="sm:text-right">
          An ISO 9001:2015 Certified Company
        </span>
      </div>
    </div>
  );
}

export default Footer;
