import { cn } from "@/lib/utils";
import { LogoCloud } from "./logo-cloud-3";

export default function DemoOne() {
  return (
    <div className=" w-full place-content-center">
    <div
        aria-hidden="true"
        className={cn(
          "-z-10 -top-1/2 -translate-x-1/2 pointer-events-none absolute left-1/2 h-[90vmin] md:w-[120vmin] rounded-b-full",
          "bg-[radial-gradient(ellipse_at_center,--theme(--color-foreground/.1),transparent_50%)]",
          "blur-[30px]"
        )}
      />

      <section className="relative mx-auto bg-[#fdfbfb] w-full">
        <div className="text-center py-3 ">
        <h2 className="text-[#7f1d1d] md:text-3xl text-2xl font-bold">
          Placement Client  
        </h2>

        <svg
          className="mx-auto"
          width="340"
          height="6"
          viewBox="0 0 340 6"
          preserveAspectRatio="none"
        >
          <path
            d="M0 3 Q170 0 340 3 Q170 6 0 3 Z"
            fill="#7f1d1d"
          />
        </svg>
      </div>
       
        <div className="mx-auto   " />

        <LogoCloud logos={logos} />

        <div className="  bg-border [mask-image:linear-gradient(to_right,transparent,black,transparent)]" />
      </section>
    </div>
  );
}


const logos = [
  { src: "/home/client-logo/techmd.png", alt: "Accenture Logo" },
  { src: "/home/client-logo/tcsd.jpg", alt: "AWS Logo" },
  { src: "/home/client-logo/microshofd.png", alt: "Capgemini Logo" },
  { src: "/home/client-logo/download (1).png", alt: "Deloitte Logo" },
  { src: "/home/client-logo/genpactd.png", alt: "Genpact Logo" },
  { src: "/home/client-logo/deloitted.png", alt: "HP Logo" },
  { src: "/home/client-logo/awsd.png", alt: "Intel Logo" },
  { src: "/home/client-logo/CapgeminiD.svg", alt: "Microsoft Logo" },
  { src: "/home/client-logo/wiprod.png", alt: "Infosys Logo" },
  { src: "/home/client-logo/zohod.png", alt: "Zoho Logo" },
  { src: "/home/client-logo/zelis.jpg", alt: "Zelis Logo" },
  { src: "/home/client-logo/wns.png", alt: "Wipro Logo" },
  { src: "/home/client-logo/saintg.png", alt: "Saint Gobain Logo" },
  { src: "/home/client-logo/onx.png", alt: "ONX Logo" },
  { src: "/home/client-logo/nava.png", alt: "Nava Logo" },
  { src: "/home/client-logo/infosysd.png", alt: "Infosys Logo" },
  { src: "/home/client-logo/downlohcl.png", alt: "HCL Logo" },
  { src: "/home/client-logo/egonzehnderd.png", alt: "Egon Zehnder Logo" },
  { src: "/home/client-logo/congnizantd.jpg", alt: "Cognizant Logo" },
  { src: "/home/client-logo/bosch.png", alt: "Bosch Logo" },
  { src: "/home/client-logo/bankofa.jpg", alt: "Bank of America Logo" },
];


