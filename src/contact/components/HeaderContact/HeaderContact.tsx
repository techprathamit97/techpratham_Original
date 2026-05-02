// import React from 'react';

// import Image from 'next/image';

// const HeaderContact = () => {
//     return (
//         <Image src='/support/banner2.jpeg' alt='Header Image' width={1920} height={1080} className='w-full md:h-[500px] h-56 object-cover' />
//     )
// }

// export default HeaderContact

// import Image from "next/image";

// const HeaderContact = () => {
//   return (
//     <div className="relative w-full md:h-[400px] h-56">
//       {/* Background Image */}
//       {/* <Image
//         src="/support/banner2.jpeg"
//         alt="Header Image"
//         fill
//         className="object-cover"
//         priority
//       /> */}

//       {/* Dark + Gradient Overlay */}
//       <div className="absolute inset-0 flex-col items-center justify-center py-16 bg-gradient-to-br from-red-500 via-black to-red-900" />

//       {/* Content */}
//       <div className="absolute inset-0 flex items-center">
//         <div className="max-w-5xl px-6 md:px-16 text-white">
//           {/* Small Heading */}
//           <p className="uppercase tracking-widest text-sm md:text-base border-b-2 border-white inline-block pb-1 mb-4">
//             Let’s Connect
//           </p>

//           {/* Main Heading */}
//           <h1 className="text-xl md:text-2xl font-semibold mb-2">
//             We Empower Growth
//           </h1>

//           <h2 className="text-2xl md:text-4xl font-bold md:mb-4 md-2">
//            Let’s Connect
//           </h2>

//           {/* Description */}
//           {/* <p className="max-w-2xl text-sm md:text-lg text-gray-200 leading-relaxed">
//            We help you transform your skills set to meet modern industry demands and achieve measurable impact in your career.
//           </p> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HeaderContact;

// import Image from "next/image";

// const HeaderContact = () => {
//   return (
//     <div className="relative w-full h-[280px] md:h-[420px] overflow-hidden bg-[#730C11]">

//       {/* ================= BACKGROUND ================= */}

//       {/* Main gradient (light from top-right) */}
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,#3b4fd1_0%,#CA8A04_20%,#730C11_80%)]" />

//       {/* Left dark curved shape */}
//       <div className="absolute -right-[300px] top-[-200px] w-[850px] h-[850px] 
//         bg-[radial-gradient(circle,#730C11_55%,transparent_65%)] rounded-full" />

//       {/* Bottom red glow */}
//       <div className="absolute bottom-[-120px] left-[-100px] w-[300px] h-[300px] 
//         bg-[radial-gradient(circle,#ff3b3b66,transparent_70%)] blur-2xl" />

//       {/* Right focus glow */}
//       <div className="absolute right-[12%] top-1/2 -translate-y-1/2 w-[380px] h-[380px] 
//         bg-[radial-gradient(circle,#2f45c5_0%,#1a255c_50%,transparent_70%)] blur-2xl" />

//       {/* Inner dark circle */}
//       <div className="absolute right-[14%] top-1/2 -translate-y-1/2 w-[260px] h-[260px] 
//         rounded-full bg-[#16204a]" />

//       {/* ================= CONTENT ================= */}
//       <div className="relative z-10 flex items-center justify-between h-full px-6 md:px-16">

//         {/* LEFT TEXT */}
//         <div className="text-white max-w-xl">

//           <p className="uppercase tracking-widest text-xs md:text-sm border-b border-white inline-block pb-1 mb-4 opacity-90">
//            Let’s Connect
//           </p>

//           <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-2">
//             Let’s Connect <br /> We Empower Growth
//           </h1>

//           <p className="text-sm md:text-lg text-gray-300">
//             We help you transform your skills set to meet modern industry demands and achieve measurable impact in your career.
//           </p>
//         </div>

//         {/* ================= RIGHT DESIGN ================= */}
//         <div className="relative hidden md:block w-[450px] h-[260px]">

//           {/* MAIN CENTER IMAGE */}
//           <div className="absolute  inset-0 flex items-left justify-center z-20">
//             <Image
//               src="/support/contectI.svg"
//               alt="Contact"
//               width={200}
//               height={200}
//               className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
//             />
//           </div>

//           {/* SMALL FLOATING ELEMENTS (like original UI) */}

//           {/* chat bubble */}
//           <div className="absolute top-[10%] right-[10%] w-12 h-8 bg-blue-500 rounded-full blur-[1px] opacity-80" />

//           {/* mail */}
//           <div className="absolute top-[8%] left-[30%] w-10 h-6 bg-white/10 rounded-md backdrop-blur-sm" />

//           {/* 24/7 badge */}
//           <div className="absolute top-[50%] left-[10%] text-[10px] px-2 py-1 bg-white/10 rounded-full backdrop-blur-md text-white">
//             24/7
//           </div>

//           {/* gear 1 */}
//           <div className="absolute bottom-[20%] right-[15%] w-8 h-8 bg-white/10 rounded-full backdrop-blur-sm" />

//           {/* gear 2 */}
//           <div className="absolute bottom-[10%] right-[5%] w-6 h-6 bg-white/10 rounded-full backdrop-blur-sm" />

//           {/* call button */}
//           <div className="absolute bottom-[5%] left-[40%] w-12 h-12 bg-green-500 rounded-full shadow-lg" />

//         </div>

//       </div>
//     </div>
//   );
// };

// export default HeaderContact;

"use client";

import * as React from "react";
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import LeadForm from "@/components/common/LeadForm/LeadForm";
import Image from "next/image";
import {
  FaWhatsapp, FaInstagram, FaLinkedin, FaTwitter,
  FaYoutube, FaFacebook, FaPhoneAlt, FaEnvelope
} from "react-icons/fa";
import {
  BiSupport, BiTimeFive, BiMessageDetail, BiGlobe
} from "react-icons/bi";
import { useState } from "react";

function cn(...inputs: (string | undefined | null | boolean | { [key: string]: any })[]) {
  return inputs.flat().filter(Boolean).join(" ");
}

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-white text-red-600 hover:bg-gray-100",
        outline: "border border-white text-white hover:bg-white/10",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

const iconConfigs = [
  { Icon: FaWhatsapp, color: "#25D366" },
  { Icon: FaPhoneAlt, color: "#34B7F1" },
  { Icon: BiSupport, color: "#FF5722" },
  { Icon: BiTimeFive, color: "#FFC107" },
  { Icon: FaInstagram, color: "#E1306C" },
  { Icon: FaFacebook, color: "#1877F2" },
  { Icon: FaLinkedin, color: "#0077B5" },
  { Icon: FaTwitter, color: "#1DA1F2" },
  { Icon: FaYoutube, color: "#FF0000" },
  { Icon: FaEnvelope, color: "#EA4335" },
  { Icon: BiMessageDetail, color: "#4CAF50" },
  { Icon: BiGlobe, color: "#607D8B" },
  { Icon: FaWhatsapp, color: "#128C7E" },
  { Icon: BiSupport, color: "#E91E63" },
  { Icon: FaPhoneAlt, color: "#2196F3" },
];

export default function CombinedFeatureDemo() {
  const orbitCount = 3;
  const orbitGap = 8;
  const iconsPerOrbit = Math.ceil(iconConfigs.length / orbitCount);
  const [showLeadForm, setShowLeadForm] = useState(false);
  return (
    <section
      className="relative w-full flex items-center justify-between h-[25rem] overflow-hidden"
      style={{
        // Custom CSS Gradient to match the exact "Light and Dark" red/black theme of your image
        background: `
          radial-gradient(circle at 85% 50%, rgba(255, 0, 0, 0.2) 0%, transparent 50%),
          linear-gradient(to right, #951016 0%, #660000 30%, #1a0000 70%, #000000 100%)
        `
      }}
    >
      {/* Content Side */}
      <div className="md:w-1/2 w-full md:pl-16 pl-5 opacity-80 z-20 ">
        <h1 className="text-4xl border-b-[3px] border-white inline-block sm:text-6xl font-bold mb-4 text-white">
          Let’s Connect...
        </h1>
        <p className="text-red-100 mb-8 max-w-lg leading-relaxed opacity-90">
          We help you transform your skills set to meet modern industry demands and achieve measurable impact in your career.
        </p>
        <div className="flex items-center gap-4">
          <Button variant="default" asChild>
            <a href="tel:+918882178896">Quick Connect</a>
          </Button>
          <Button onClick={() => setShowLeadForm(true)} variant="outline">Learn More</Button>
        </div>
      </div>
<div className="absolute inset-0 bg-black/50 md:hidden z-10" />
      {/* Orbit Side */}
      <div className=" w-1/2 h-full flex items-center justify-start">
      
        <div className="relative w-[50rem] h-[50rem] translate-x-[40%] flex items-center justify-center">
          
          {/* Center Hub */}
          <div className="w-24 h-24 rounded-full bg-white shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center z-20 border-4 border-white">
  <div className="relative w-24 h-24">
    <Image
      src="/course/support.webp" // 👈 replace with your image path
      alt="Support"
      fill
      className="object-contain"
    />
  </div>
</div>

          {/* Orbiting Icons */}
          {[...Array(orbitCount)].map((_, orbitIdx) => {
            const size = `${12 + orbitGap * (orbitIdx + 1)}rem`;
            const angleStep = (2 * Math.PI) / iconsPerOrbit;

            return (
              <div
                key={orbitIdx}
                className="absolute rounded-full border border-dashed border-white"
                style={{
                  width: size,
                  height: size,
                  animation: `spin ${15 + orbitIdx * 8}s linear infinite`,
                }}
              >
                {iconConfigs
                  .slice(orbitIdx * iconsPerOrbit, orbitIdx * iconsPerOrbit + iconsPerOrbit)
                  .map((cfg, iconIdx) => {
                    const angle = iconIdx * angleStep;
                    const x = 50 + 50 * Math.cos(angle);
                    const y = 50 + 50 * Math.sin(angle);

                    return (
                      <div
                        key={iconIdx}
                        className="absolute bg-white rounded-full p-2.5 shadow-xl hover:scale-125 transition-transform"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        {cfg.Icon && <cfg.Icon className="w-6 h-6" style={{ color: cfg.color }} />}
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </div>
      {showLeadForm && (
        <LeadForm
          course={{ title: "" }}
          onClose={() => setShowLeadForm(false)}
          onSuccess={() => setShowLeadForm(false)}
        />
      )}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}