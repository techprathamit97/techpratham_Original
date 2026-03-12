
import React, { useEffect, useRef, useState } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const ToolTip = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // ✅ GOOGLE ADS – PHONE NUMBER SWAPPING (RUN ONCE)
  useEffect(() => {
    if (typeof window !== "undefined" && typeof (window as any).gtag !== "undefined") {
      (window as any).gtag("config", "AW-17462500412/yVWVCN2Py-0bELy44oZB", {
        phone_conversion_number: "+91-8882178896",
      });
    }
  }, []);

  // ✅ CLICK OUTSIDE HANDLER (UNCHANGED)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // ✅ WHATSAPP CONVERSION
const trackWhatsApp = () => {

  if (typeof window !== "undefined") {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: "whatsapp_click",
      source: "floating_tooltip",
    });

    (window as any).dataLayer.push({
      event: "google_ads_conversion",
      conversion_id: "17462500412",
      conversion_label: "K_E4CNSPy-0bELy44oZB",
    });
  }
};

const trackCall = () => {

  if (typeof window !== "undefined") {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: "phone_call_click",
      source: "floating_tooltip",
    });

    (window as any).dataLayer.push({
      event: "google_ads_conversion",
      conversion_id: "17462500412",
      conversion_label: "K_E4CNSPy-0bELy44oZB",
    });
  }
};


  return (
    <>
      {/* Floating Tooltip */}
      <div ref={menuRef} className="w-auto md:flex hidden flex-col items-center justify-center">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 rounded-full shadow border border-[#dddedd] p-2 bg-white text-black fixed md:bottom-10 bottom-4 md:left-10 left-4 z-[100] grid place-content-center cursor-pointer transition-transform duration-300 hover:scale-105"
        >
          {!isOpen ? (
            <Image src="/home/contact/call-us.png" alt="call" width={50} height={50} />
          ) : (
            <Cross2Icon className="w-8 h-8" />
          )}
        </div>

        <div
          className={`w-auto flex flex-col gap-2 md:bottom-28 bottom-24 md:left-10 left-4 fixed z-[100] transition-all duration-300 ${
            isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-5 scale-95 pointer-events-none"
          }`}
        >
          <Link
            href="https://wa.me/+918882178896"
            onClick={trackWhatsApp}
            className="w-full flex flex-row gap-2 items-center justify-center relative group"
          >
            <div className="w-16 h-16 rounded-full bg-white shadow border p-2 group-hover:scale-110 transition">
              <Image src="/home/contact/whatsapp.png" alt="whatsapp" width={50} height={50} />
            </div>
            <p className="bg-black text-white px-2 py-1 rounded absolute left-20 opacity-0 group-hover:opacity-100">
              Chat with us
            </p>
          </Link>

          <Link
            href="tel:+918882178896"
            onClick={trackCall}
            className="w-full flex flex-row gap-2 items-center justify-center relative group"
          >
            <div className="w-16 h-16 rounded-full bg-white shadow border p-2 group-hover:scale-110 transition">
              <Image src="/home/contact/call-us.png" alt="call" width={50} height={50} />
            </div>
            <p className="bg-black text-white px-2 py-1 rounded absolute left-20 opacity-0 group-hover:opacity-100">
              Call us now
            </p>
          </Link>
        </div>
      </div>

      {/* Desktop Bottom Bar */}
      <div className="w-full md:flex hidden h-11 bg-gradient-to-tl from-[#600A0E] to-[#C6151D] fixed bottom-0 left-0 z-50 items-center justify-center">
        <div className="w-10/12 flex gap-4">
          <div className="flex bg-[#CA8A04] p-2 gap-1">
            <FaWhatsapp className="w-6 h-6" />
            <Link href="https://wa.me/+918882178896" onClick={trackWhatsApp}>
              +91-8882178896
            </Link>
          </div>
       <div className="flex bg-[#CA8A04] p-2 gap-1 items-center">
  <Image src="/course/icons/indian.jpg" alt="India Flag" width={36} height={36} />
  <Link href="tel:+918882178896" onClick={trackCall}>
    +91-8882178896
  </Link>
</div>

<div className="flex bg-[#CA8A04] p-2 gap-1 items-center">
  <Image src="/course/icons/uslogo.png" alt="US Flag" width={36} height={36} />
  <Link href="tel:+13434770926" onClick={trackCall}>
    +1 (343) 477-0926
  </Link>
</div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="w-full bg-gradient-to-tl from-[#C6151D] to-[#600A0E] md:hidden flex fixed bottom-0 left-0 z-50 text-white">
        <Link
          href="https://wa.me/+918882178896"
          onClick={trackWhatsApp}
          className="flex-1 flex items-center justify-center gap-2 py-3"
        >
          <FaWhatsapp />
          WhatsApp
        </Link>

        <div className="w-1 h-10 bg-yellow-600 self-center" />

        <Link
          href="tel:+918882178896"
          onClick={trackCall}
          className="flex-1 flex items-center justify-center gap-2 py-3"
        >
          <Phone />
          Call
        </Link>
      </div>
    </>
  );
};

export default ToolTip;
