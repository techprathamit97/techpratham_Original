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
        backgroundImage: "url('/home/hero/contanctUS.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content Side */}
      <div className="md:w-1/2 w-full md:pl-16 pl-5 opacity-80 z-20 ">
        <h1 className="text-4xl border-b-[3px] border-white inline-block sm:text-6xl font-bold mb-4 text-white">
          Let’s Connect...
        </h1>
        <p className="text-white mb-8 max-w-lg leading-relaxed opacity-90">
          We help you transform your skills set to meet modern industry demands and achieve measurable impact in your career.
        </p>
        <div className="flex items-center gap-4">
          <Button variant="default" asChild>
            <a href="tel:+918882178896">Quick Connect</a>
          </Button>
          <Button onClick={() => setShowLeadForm(true)} variant="outline">Learn More</Button>
        </div>
      </div>
      <div className="absolute inset-0 bg-black/30 md:hidden z-10" />
      {/* Orbit Side */}

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