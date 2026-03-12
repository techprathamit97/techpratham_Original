"use client";

import { Button } from "./button";
import Image from "next/image";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";

interface IconItem {
  icon?: string;
  color?: string;
  img?: string;
}

const ICON_CONTENT: IconItem[] = [
     { img: "about/icons/Workday-Symbol.png" },
     { img: "about/icons/SAP.png" },
     { img: "about/icons/serviceN.svg" },
     { img: "about/icons/microd.png" },
     { img: "about/icons/odoo.png" },
     { img: "about/icons/guidewire.png" },
     { icon: "fa-brands fa-aws", color: "#FF9900" },
      { img: "about/icons/Pega.png" },
       { img: "about/icons/miro.png" },
      { img: "about/icons/Oracle.png" },
     
  { icon: "fa-solid fa-code", color: "#3178C6" },
  { icon: "fa-brands fa-react", color: "#61DAFB" },
  { icon: "fa-brands fa-js", color: "#F7DF1E" },
  
  { icon: "fa-brands fa-node-js", color: "#8CC84B" },
  { icon: "fa-brands fa-python", color: "#3776AB" },
  { icon: "fa-brands fa-css3-alt", color: "#1572B6" },
  { icon: "fa-brands fa-html5", color: "#E34F26" },
  
  { icon: "fa-brands fa-github", color: "#181717" },
  { icon: "fa-brands fa-git-alt", color: "#F05032" },
  
  { icon: "fa-brands fa-angular", color: "#DD0031" },
  { icon: "fa-brands fa-vuejs", color: "#4FC08D" },
  { icon: "fa-brands fa-docker", color: "#2496ED" },
  
 
  
  { icon: "fa-brands fa-google", color: "#4285F4" },
  { icon: "fa-solid fa-database", color: "#00758F" },
  
 
  
 
];

export default function IntegrationsSection() {
  return (
    <section className="max-w-7xl bg-gray-100 mx-auto px-6 grid md:grid-cols-2 gap-10 items-center border border-gray-200 dark:border-gray-700 p-6">
      {/* Left Side */}
      <div>
        <p className="uppercase text-sm font-semibold text-gray-500 dark:text-gray-400">
          Training Programs
        </p>
        <h2 className="text-2xl font-bold mt-2 mb-4">
          Build Skills. Launch Your Career.
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          We envision a world where individuals and organizations thrive through continuous learning, advanced technology training, and strong alignment between education and industry needs.
        </p>
         <p className="text-gray-600 dark:text-gray-300 mb-6">
         We strive to bridge the gap between academic learning and industry demands, cultivating highly skilled professionals who are equipped to succeed in a rapidly evolving digital landscape,while upholding the values of commitment, fulfillment, and accomplishment.
        </p>
        <div className="flex gap-4">
          <Button className="bg-gradient-to-tl from-[#C6151D] to-[#600A0E] text-white px-5 py-2 rounded-lg font-medium">
            <Link href="/courses">
              Explore Courses
            </Link>
          </Button>
          <Button
            variant="outline"
            className="border border-gray-300 dark:border-gray-600 px-5 py-2 rounded-lg font-medium"
          >
            <Link href="/contact-us">
              Reach Out →
            </Link>
          </Button>
        </div>
      </div>

      {/* Right Side */}
      <div className="grid grid-cols-6 gap-4">
        {ICON_CONTENT.map((item, idx) => (
          <div
            key={idx}
            className="relative flex items-center justify-center w-16 h-16 p-2 bg-white dark:bg-gray-800 shadow-sm border-2 border-gray-200 dark:border-gray-700"
            style={{
              clipPath:
                "polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)",
            }}
          >
            {item.img && (
              <Image
                src={`/${item.img}`}
                alt={`integration-${idx}`}
                fill
                className="object-contain object-center p-1.5"
              />
            )}

            {item.icon && (
              <i
                className={`${item.icon} text-2xl`}
                style={{ color: item.color }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
