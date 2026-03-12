// "use client";

// import Image from "next/image";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";

// import "swiper/css";
// import "swiper/css/navigation";

// const news = [
//   {
//     logo: "/about/weeklogo.webp",
//     title: "TechPratham Transforming HR & ERP Landscape",
//     description:
//       "TechPratham is transforming the HR and ERP ecosystem with its Hire-Train-Deploy model, preparing professionals for platforms like Workday in the AI-driven era...",
//     image: "/about/tribune.webp",
//     link: "https://www.tribuneindia.com/news/business/techpratham-transforming-the-hr-erp-landscape-with-hire-train-deploy-in-the-ai-era/",
//     source: "The Tribune",
//   },
//   {
//     title: "TechPratham in Media Coverage",
//     description:
//       "TechPratham continues to gain recognition in the media for its focus on building future-ready professionals through industry-aligned training programs...",
//     image: "/about/PTI.webp",
//     link: "https://www.ptinews.com/press-release/techpratham-transforming-the-hr-erp-landscape-with-hire-train-deploy-in-the-ai-era/3418112",
//     source: "PTI News",
//   },
 
//   {
//     title: "TechPratham Hire-Train-Deploy Model Gains Attention",
//     description:
//       "The innovative Hire-Train-Deploy model introduced by TechPratham bridges the skills gap by training professionals on industry platforms and deploying them to organizations...",
//     image: "/about/wire.webp",
//     link: "https://thewire.in/ptiprnews/techpratham-transforming-the-hr-erp-landscape-with-hire-train-deploy-in-the-ai-era",
//     source: "The Wire",
//   },
//   {
//     title: "TechPratham in Media Coverage",
//     description:
//       "TechPratham continues to gain recognition in the media for its focus on building future-ready professionals through industry-aligned training programs...",
//     image: "/about/week.webp",
//     link: "https://www.ptinews.com/press-release/techpratham-transforming-the-hr-erp-landscape-with-hire-train-deploy-in-the-ai-era/3418112",
//     source: "PTI News",
//   },
// ];

// export default function NewsHighlights() {
//   return (
//     <section className="w-full py-14 bg-gray-100">
//       <div className=" mx-auto px-4">

//         <h3 className="text-3xl font-bold text-center text-gray-800 mb-10">
//           TechPratham News Highlights
//         </h3>

//         <Swiper
//           modules={[Navigation]}
//           navigation
//           spaceBetween={20}
//           slidesPerView={4}
//         >
//           {news.map((item, index) => (
//             <SwiperSlide key={index}>
//               <a
//                 href={item.link}
//                 target="_blank"
//                 rel="nofollow noopener noreferrer"
//                 className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden group block"
//               >
                
//                 {/* Thumbnail */}
//                 <div className="relative h-48 w-full">
//                   <Image
//                     src={item.image}
//                     alt={item.title}
//                     fill
//                     className="object-contain group-hover:scale-105 transition duration-300"
//                   />
//                 </div>

//                 {/* Content */}
//                 <div className="p-5 text-left">
//                   <p className="text-xs text-red-600 font-semibold mb-1">
//                     {item.source}
//                   </p>

//                   <h4 className="font-semibold text-lg mb-1 line-clamp-2">
//                     {item.title}
//                   </h4>

//                   <p className="text-gray-600 text-sm line-clamp-3">
//                     {item.description}
//                   </p>

//                   <span className="inline-block mt-4 text-red-600 font-medium">
//                     Read More →
//                   </span>
//                 </div>

//               </a>
//             </SwiperSlide>
//           ))}
//         </Swiper>

//       </div>
//     </section>
//   );
// }
"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const news = [
  {
    logo: "/about/tribunerlogo.png",
    title: "TechPratham Introduces Hire-Train-Deploy Model to Transform HR & ERP Talent in the AI Era",
    image: "/about/tribune.webp",
    link: "https://www.tribuneindia.com/news/business/techpratham-transforming-the-hr-erp-landscape-with-hire-train-deploy-in-the-ai-era/",
  },
  {
    logo: "/about/ptilogo.png",
    title: "TechPratham Gains Recognition for Bridging the HR & ERP Skills Gap with Hire-Train-Deploy",
    image: "/about/PTI.webp",
    link: "https://www.ptinews.com/press-release/techpratham-transforming-the-hr-erp-landscape-with-hire-train-deploy-in-the-ai-era/3418112",
  },
  {
    logo: "/about/wirelogo.png",
    title: "TechPratham Empowering Future Professionals Through AI-Focused HR & ERP Training",
    image: "/about/wire.webp",
    link: "https://thewire.in/ptiprnews/techpratham-transforming-the-hr-erp-landscape-with-hire-train-deploy-in-the-ai-era",
  },
  {
    logo: "/about/weeklogo.png",
    title: "TechPratham’s Hire-Train-Deploy Approach Reshaping HR & ERP Careers in the AI-Driven Industry",
    image: "/about/week.webp",
    link: "https://www.theweek.in/wire-updates/business/2026/02/27/techpratham-transforming-the-hr--erp-landscape-with-%E2%80%98hire-train-deploy%E2%80%99-in-the-ai-era.html",
  },
];

export default function NewsHighlights() {
  return (
    <section className="w-full py-14 bg-gray-100">
      <div className="mx-auto px-4">

        <h3 className="text-3xl font-bold text-center text-gray-800 mb-10">
          TechPratham News Highlights
        </h3>

        <Swiper
          modules={[Navigation]}
          navigation
          grabCursor={true}
          spaceBetween={24}
          slidesPerView={4}
          breakpoints={{
            0: {
              slidesPerView: 1.2,
              spaceBetween: 16,
            },
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 4,
            },
          }}
        >
          {news.map((item, index) => (
            <SwiperSlide key={index}>
              <a
                href={item.link}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-3 block text-center"
              >

                {/* Logo */}
                <div className="relative w-full h-24 justify-center">
                  <Image
                    src={item.logo}
                    alt="Media Logo"
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Title */}
                <h4 className="text-base font-semibold text-gray-800 mb-4 leading-snug line-clamp-3">
                  {item.title}
                </h4>

                {/* Article Image */}
                <div className="relative w-full h-40 mb-4 rounded-md overflow-hidden border">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Read Link */}
                <p className="text-blue-600 font-medium text-sm">
                  Read the full article
                </p>

              </a>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
}