
'use client';
import React from 'react';
import Image from 'next/image';
import { teams } from '../../../../components/assets/teams';

// Migrated off react-slick onto Swiper (already used by other homepage
// sections) so the homepage ships a single carousel runtime instead of two.
// Settings below reproduce the previous react-slick behaviour exactly:
//   mobile row  -> 1 slide, autoplay 2000ms, loop, arrows
//   second row  -> 6 slides desktop / 2 at <=1024 / 1 at <=640, autoplay 2500ms
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const EducatorHome = () => {
  // Split the teams array: first 3, then remaining 4 (FOR DESKTOP/MD VIEW ONLY)
  const firstRow = teams.slice(0, 3);
  const secondRow = teams.slice(3);

  return (
    <div className="relative w-full flex flex-col items-center justify-center text-white py-3 overflow-hidden">
        
        <style jsx global>{`
            /* Match the previous slick arrow styling: white and enlarged. */
            .educator-swiper .swiper-button-prev,
            .educator-swiper .swiper-button-next {
                color: #ffffff !important;
                z-index: 10;
            }
            .educator-swiper .swiper-button-prev:after,
            .educator-swiper .swiper-button-next:after {
                font-size: 30px !important;
            }
            .educator-swiper .swiper-button-prev { left: 10px !important; }
            .educator-swiper .swiper-button-next { right: 10px !important; }
        `}</style>
        
   
      <div className="absolute inset-0">
        <Image
          src="/about/teams/teambg.jpeg" 
          alt="Team background"
          fill
          className="object-cover object-center"
          priority
        />
        
      </div>

  
      <div className="relative z-10 flex flex-col items-center justify-center w-full">
      
        <div className="flex flex-col items-center text-center mb-5">
          <h2 className="md:text-4xl text-red-900 text-3xl font-bold">Meet Our Team</h2>
          <p className="md:text-lg text-red-900 text-base text-gray-200">
            Get to know the dedicated faculty and experts
          </p>
        </div>

        
        <div className="md:hidden w-full px-4">
          <Swiper
            className="educator-swiper"
            modules={[Autoplay, Navigation]}
            navigation
            loop
            speed={500}
            slidesPerView={1}
            autoplay={{ delay: 2000, disableOnInteraction: false }}
          >
            {teams.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="px-2"> {/* px-2 for spacing between slides */}
                  <div
                    // Increased h-80 for more height, used justify-between for content spacing
                    className="bg-[#9c1111] border border-white/30 rounded-xl p-5 flex flex-col items-center text-center h-[340px] justify-between" 
                  >
                    {/* Circular Image */}
                    <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white mb-4 mt-4">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={200}
                        height={200}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    {/* Name & Position */}
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    <p className="text-base text-gray-200 mb-4">{item.position}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        
        <div className="hidden md:flex flex-col items-center w-full">
    
            <div className="flex flex-wrap justify-center gap-8 w-[90%] max-w-7xl mb-3">
              {firstRow.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#9c1111] border border-white rounded-xl p-5 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 w-[180px] md:w-[215px]"
                >
                  {/* Circular Image */}
                  <div className="w-20 h-20  md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white ">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={140}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Name & Position */}
                  <h3 className="text-lg md:text-xl font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-200">{item.position}</p>
                </div>
              ))}
            </div>

            {/* Second Row (4 members) */}
            <div className="w-full max-w-6xl px-6">
  <Swiper
    className="educator-swiper"
    modules={[Autoplay, Navigation]}
    navigation
    loop
    speed={500}
    autoplay={{ delay: 2500, disableOnInteraction: false }}
    slidesPerView={6}
    breakpoints={{
      0: { slidesPerView: 1 },
      641: { slidesPerView: 2 },
      1025: { slidesPerView: 6 },
    }}
  >
    {secondRow.map((item, index) => (
      <SwiperSlide key={index}>
        <div className="px-4">
          <div className="bg-[#9c1111] border border-white/30 rounded-xl p-2 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 h-[170px]">
            
            {/* Circular Image */}
            <div className="w-32 h-32 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white">
              <Image
                src={item.image}
                alt={item.name}
                width={200}
                height={200}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Name & Position */}
            <h3 className="text-sm md:text-sm font-semibold">{item.name}</h3>
            <p className="text-xs text-gray-200">{item.position}</p>
          </div>
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
</div>

        </div>
        {/* --- End Desktop View --- */}
      </div>
    </div>
  );
};

export default EducatorHome;