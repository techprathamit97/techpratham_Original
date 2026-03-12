// import React from 'react';

// import './clientHome.css';

// // Import Swiper React components
// import { Swiper, SwiperSlide } from 'swiper/react';

// // Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/pagination';

// // import required modules
// import { Autoplay, Navigation } from 'swiper/modules';
// import Image from 'next/image';
// import { client } from '@/components/assets/client';

// const ClientHome = () => {
//     return (
//         <div className='w-10/12 h-auto flex flex-col items-center justify-center py-10 gap-10 bg-white text-black'>
//             <div className='w-full h-auto flex flex-col text-center'>
//                 <div className="md:text-3xl text-2xl md:font-semibold font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#CD4647] to-[#7F3B40] capitalize">Placement Client</div>
//             </div>
//             <div className='flex flex-col items-center justify-center w-full h-auto'>
//                 <Swiper
//                     slidesPerView={2}
//                     spaceBetween={20}
//                     breakpoints={{
//                         640: {
//                             slidesPerView: 2,
//                         },
//                         768: {
//                             slidesPerView: 3,
//                         },
//                         1024: {
//                             slidesPerView: 4,
//                         },
//                         1280: {
//                             slidesPerView: 5,
//                         },
//                     }}
//                     autoplay={{
//                         delay: 2500,
//                         disableOnInteraction: false,
//                     }}
//                     navigation={true}
//                     modules={[Autoplay, Navigation]}
//                     className="swiperClient swiperClient"
//                 >
//                     {client.map((item, index) => (
//                         <SwiperSlide key={index} className='w-full h-auto p-4 flex items-center justify-center shadowBorder'>
//                             <Image src={item.image} alt={item.altText} width={1440} height={500} className='w-auto h-44 object-contain' />
//                         </SwiperSlide>
//                     ))}
//                 </Swiper>
//             </div>
//         </div>
//     )
// }

// export default ClientHome

// import React from 'react';
// import './clientHome.css';

// import { Swiper, SwiperSlide } from 'swiper/react';


// import 'swiper/css';
// import 'swiper/css/pagination';


// import { Autoplay } from 'swiper/modules'; 
// import Image from 'next/image';
// import { client } from '@/components/assets/client';

// const ClientHome = () => {
//     return (
//         <div className='w-10/12 h-auto flex flex-col items-center justify-center py-3 md:gap-6 gap-1 bg-white text-black'>
//             <div className='w-full  flex flex-col text-center'>
//                 <div className="md:text-3xl text-2xl md:font-semibold font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#CD4647] to-[#7F3B40] capitalize" >
//                     Placement Client
//                 </div>
//             </div>
//             <div className='flex flex-col items-center justify-center w-full md:h-16 h-17'>
//                 <Swiper
//   slidesPerView={3}   // ✅ default for small screens
//   spaceBetween={10}
//   breakpoints={{
//     640: { slidesPerView: 3 },
//     768: { slidesPerView: 4 },
//     1024: { slidesPerView: 5 },
//     1280: { slidesPerView: 6 },
//   }}
//   autoplay={{
//     delay: 2000,
//     disableOnInteraction: false,
//   }}
//   modules={[Autoplay]}
//   className="swiperClient"
// >

//                     {client.map((item, index) => (
//                         <SwiperSlide key={index} className=' flex items-center justify-center '>
//                             <Image
//                                 src={item.image}
//                                 alt={item.altText}
//                                 width={140}
//                                 height={200}
//                                 className='w-auto md:h-28 h-16 object-contain'
//                             />
//                         </SwiperSlide>
//                     ))}
//                 </Swiper>
//             </div>
//         </div>
//     )
// }

// export default ClientHome;




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

      <section className="relative mx-auto w-full">
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
//  { img: "/home/client-logo/bosch.png" },
  // { src: "/home/client-logo/ascenthr.png", alt: "HCL Tech Logo" },
  // { src: "/home/client-logo/egon zender.svg", alt: "Egon Zender Logo" },
  // { src: "/home/client-logo/Cognizent.svg", alt: "Cognizant Logo" },
  // { src: "/home/client-logo/AscentHR.svg", alt: "AscentHR Logo" },
];


