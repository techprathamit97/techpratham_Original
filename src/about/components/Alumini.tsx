// "use client";
// import Image from "next/image";
// import "@fortawesome/fontawesome-free/css/all.min.css";

// interface IconItem {
//   img?: string;
// }

// const ICON_CONTENT: IconItem[] = [
//   { img: "/home/client-logo/accenture.svg" },
//   { img: "/home/client-logo/aws.svg" },
//   { img: "/home/client-logo/capgemini.svg" },
//   { img: "/home/client-logo/deloitte.svg" },
//   { img: "/home/client-logo/genpact.svg" },
//   { img: "/home/client-logo/hp.svg" },
//   { img: "/home/client-logo/intel.svg" },
//   { img: "/home/client-logo/microsoft.svg" },
//   { img: "/home/client-logo/tcs.svg" },
//   { img: "/home/client-logo/tech-mahindra.svg" },
//   { img: "/home/client-logo/wipro.svg" },
//   { img: "/home/client-logo/zoho.svg" },
//   { img: "/home/client-logo/ZELIS.svg" },
//   { img: "/home/client-logo/WNS.svg" },
//   { img: "/home/client-logo/SaintGobin.svg" },
//   { img: "/home/client-logo/ONX.svg" },
//   { img: "/home/client-logo/Nava.svg" },
//   { img: "/home/client-logo/N.svg" },
//   { img: "/home/client-logo/Infosys.svg" },
//   { img: "/home/client-logo/HCL Tech.svg" },
//   { img: "/home/client-logo/egon zender.svg" },
//   { img: "/home/client-logo/Cognizent.svg" },
//   { img: "/home/client-logo/AscentHR.svg" },
//   { img: "/home/client-logo/bosch.png" },
// ];


// export default function IntegrationsSection() {
//   return (
//     <section className="w-full bg-gray-200 py-12 px-4">

//       {/* Heading */}
//       <h2 className="text-center text-black text-4xl md:text-5xl font-bold mb-10">
//         Our Hiring Partners
//       </h2>

//       {/* Logo Grid */}
//       <div className="max-w-7xl mx-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 justify-items-center">
//         {ICON_CONTENT.map((item, idx) => (
//           <div
//             key={idx}
//             className="relative flex items-center justify-center w-40 h-40 p-2 bg-white shadow-sm border-2 border-gray-200"
//             style={{
//               clipPath:
//                 "polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)",
//             }}
//           >
//             {item.img && (
//               <Image
//                 src={item.img}
//                 alt={`logo-${idx}`}
//                 fill
//                 className="object-contain "
//               />
//             )}
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }


"use client";
import Image from "next/image";
import { useRef } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

interface IconItem {
  img?: string;
}

/* ⭐ MOST IMPORTANT LOGOS (FIRST ROW) */
const IMPORTANT_LOGOS: IconItem[] = [
  { img: "/home/client-logo/accenturedb.png" },
  { img: "/home/client-logo/saintgb.png" },
  { img: "/home/client-logo/CapgeminiD.svg" },
  //   { img: "/home/client-logo/bosch.png" },
  { img: "/home/client-logo/boschb.png" },
  { img: "/home/client-logo/tcsdb.png" },
  { img: "/home/client-logo/bankofab.png" },
];

/* ⭐ REMAINING LOGOS (SECOND ROW SCROLL) */
const OTHER_LOGOS: IconItem[] = [
  { img: "/home/client-logo/congnizantd.jpg" },
  { img: "/home/client-logo/egonzehnderd.png" },
  { img: "/home/client-logo/downlohcl.png" },
  { img: "/home/client-logo/infosysd.png" },
  { img: "/home/client-logo/nava.png" },
  { img: "/home/client-logo/onx.png" },
  { img: "/home/client-logo/saintg.png" },
  { img: "/home/client-logo/wns.png" },
  { img: "/home/client-logo/zelis.jpg" },
  { img: "/home/client-logo/zohod.png" },
  { img: "/home/client-logo/wiprod.png" },
  { img: "/home/client-logo/CapgeminiD.svg" },
  { img: "/home/client-logo/awsd.png" },
  { img: "/home/client-logo/deloitted.png" },
  { img: "/home/client-logo/genpactd.png" },
  { img: "/home/client-logo/download (1).png" },
  { img: "/home/client-logo/microshofd.png" },
  { img: "/home/client-logo/tcsd.png" },
  { img: "/home/client-logo/techmd.png" },
  { img: "/home/client-logo/bosch.png" },
  { img: "/home/client-logo/bankofa.jpg" },
];

export default function IntegrationsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -400 : 400,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-gray-200 py-5 px-4">

      {/* Heading */}
     <div style={{ textAlign: "center", marginBottom: "40px" }}>
  <div style={{ display: "inline-block", textAlign: "center" }}>
    
    <h2 className="text-[#7f1d1d] md:text-3xl text-2xl font-bold">
      Our Corporate Partners
    </h2>

    <svg
      style={{ display: "block", margin: "0 auto" }}
      width="340"     /* 👉 increase width */
      height="6"      /* 👉 very thin */
      viewBox="0 0 340 6"
      preserveAspectRatio="none"
    >
      <path
        d="
          M0 3
          Q170 0 340 3
          Q170 6 0 3
          Z
        "
        fill="#7f1d1d"
      />
    </svg>

  </div>
</div>


      {/* ⭐ FIRST ROW – IMPORTANT LOGOS (2 LINES GRID) */}
      <div className="max-w-7xl mx-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 justify-items-center mb-5">
        {IMPORTANT_LOGOS.map((item, idx) => (
          <div
            key={idx}
            className="relative flex items-center justify-center md:w-40 w-24 md:h-28 h-20 p-2  shadow-xl border-2 border-gray-200"

          >
            <Image
              src={item.img!}
              alt={`important-${idx}`}
              fill
              sizes="(max-width:768px) 128px, 160px"
              className="object-contain"
            />

          </div>
        ))}
      </div>

      {/* ⭐ SECOND ROW – SCROLLABLE LOGOS */}
      <div className="max-w-7xl mx-auto flex items-center gap-4">

        {/* Left Button */}
        <button
          onClick={() => scroll("left")}
          className="px-2 py-1 bg-white border shadow"
        >
          ←
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar"
        >
          {OTHER_LOGOS.map((item, idx) => (
            <div
              key={idx}
              className="relative flex-shrink-0 flex items-center justify-center md:w-20 md:h-20 h-16 w-16 p-2 bg-white shadow-sm border-2 border-gray-200"
              style={{
                clipPath:
                  "polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)",
              }}
            >
              <Image
                src={item.img!}
                alt={`logo-${idx}`}
                fill
                sizes="(max-width:768px) 64px, 112px"
                className="object-contain"
              />

            </div>
          ))}
        </div>

        {/* Right Button */}
        <button
          onClick={() => scroll("right")}
          className="px-2 py-1 bg-white border shadow"
        >
          →
        </button>
      </div>
    </section>
  );
}
