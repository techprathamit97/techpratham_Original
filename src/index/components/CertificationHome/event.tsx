// import React from 'react';
// import './certification.css';

// // Import Swiper React components
// import { Swiper, SwiperSlide } from 'swiper/react';

// // Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/effect-coverflow';
// import 'swiper/css/pagination';

// // import required modules
// import { EffectCoverflow, Autoplay, Pagination, Navigation } from 'swiper/modules';
// import Image from 'next/image';
// import { client } from '@/components/assets/client';

// const CertificationHome = () => {
//   return (
//     <div className='md:w-10/12 w-11/12 h-auto flex flex-col items-center justify-center md:gap-10 gap-6 py-10 mb-20 bg-[#f7f7f7] rounded-2xl shadowBorder overflow-hidden'>
//       <div className="w-11/12 md:text-3xl text-2xl md:font-semibold font-medium text-black capitalize md:mt-4 mb-0 text-center cursor-pointer transition-all duration-500 ease-in-out hover:scale-110 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-br hover:from-[#1a0a0a] hover:to-[#a3262c]">ERP Partners</div>
//       <Swiper
//         effect={'coverflow'}
//         grabCursor={true}
//         centeredSlides={true}
//         slidesPerView={'auto'}
//         loop={true}
//         pagination={{
//           clickable: true,
//         }}
//         autoplay={{
//           delay: 2500,
//           disableOnInteraction: false,
//         }}
//         coverflowEffect={{
//           rotate: 50,
//           stretch: 0,
//           depth: 100,
//           modifier: 1,
//           slideShadows: true,
//         }}
//         modules={[EffectCoverflow, Pagination, Autoplay, Navigation]}
//         className="mySwiper swiperCertificate"
//       >
//         {client.map((item, index) => (
//           <SwiperSlide key={index} className='md:w-80 w-56 md:h-80 h-56 flex flex-col items-center justify-center bg-[#fff] p-6'>
//             <div className="flex items-center justify-center w-full h-full">
//               <Image src={item.image} alt={item.altText} className="object-contain max-w-full max-h-full" fill={false} width={300} height={300} />
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   )
// }

import { Calendar } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type EventData = {
  _id: string;
  image: string;
};

const Exo9EventsSection = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/event");
        const data = await res.json();
        setEvents(data);
      } catch (e) {
        console.log("Error fetching events", e);
      }
    };

    load();
  }, []);

  // Auto slider (every 3 seconds)
  useEffect(() => {
    if (events.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % events.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [events]);

  return (
    <div className="w-full py-10 bg-white">
      <div className=' left-3 top-4'>
         <a className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition duration-300 border-[#600A0E] text-white animate-pulse bg-yellow-600 shadow-md">
              <Calendar className="h-4 w-4" />
              <span className="tracking-wide">New</span>
            </a>
      </div>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* LEFT SECTION */}
          <div className="flex flex-col items-center justify-center text-center space-y-6">

            {/* NEW BADGE */}
           

            {/* CENTERED HEADING */}
            <h2 className="text-4xl md:text-4xl font-bold text-black leading-tight">
              Spotlight @ Tech Pratham
            </h2>

          </div>

          {/* RIGHT SECTION: AUTO-SLIDER */}
          <div className="flex justify-center">

            {events.length > 0 ? (
              <div className="relative border-[10px] border-white rounded-3xl overflow-hidden shadow-2xl w-[305px] h-[376px] max-w-lg aspect-square">

                <Image
                  key={index}
                  src={events[index].image}
                  alt="Event"
                  fill
                  className="object-contain transition-all duration-700 ease-in-out"
                />

              </div>
            ) : (
              <div className="text-white">No Events Available</div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default Exo9EventsSection;
