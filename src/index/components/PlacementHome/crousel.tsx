'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import { useRef } from 'react';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

const images = [
  "/achiv/1.webp",
  "/achiv/2.webp",
  "/achiv/3.webp",
  "/achiv/4.webp",
  "/achiv/5.webp",
  "/achiv/6.webp",
  "/achiv/7.webp",
  "/achiv/8.webp",
  "/achiv/9.webp",
  "/achiv/10.webp",
  "/achiv/11.webp",
  "/achiv/12.webp",
  "/achiv/13.webp",
  "/achiv/14.webp",
  "/achiv/15.webp",
  "/achiv/16.webp",
  "/achiv/17.webp",
  "/achiv/18.webp",
  "/achiv/19.webp",
  "/achiv/20.webp",
  "/achiv/21.webp",
  "/achiv/22.webp",
  "/achiv/23.webp",
  "/achiv/24.webp",
  "/achiv/25.webp",
  "/achiv/26.webp",
  "/achiv/29.webp",
  "/achiv/27.webp",
  "/achiv/28.webp",
  "/achiv/29.webp",
  "/achiv/30.webp",
  "/achiv/31.webp",
  "/achiv/32.webp",
  "/achiv/33.webp",
  "/achiv/34.webp",
  "/achiv/35.webp",
  "/achiv/36.webp",
  
];

export default function ThreeDCarousel() {
  const swiperRef = useRef<any>(null);

  
  return (
    <div
      className="w-full flex flex-col items-center py-2"
      // ✅ Hover events on wrapper, NOT on Swiper
      onMouseEnter={() => swiperRef.current?.autoplay?.stop()}
      onMouseLeave={() => swiperRef.current?.autoplay?.start()}
    >
       <div className="text-center flex flex-col items-center w-full">
          <h2 className="text-xl md:text-[25px] my-2 text-white font-semibold">
            Our Learner Voice
          </h2>

        
        </div>
        
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        loop={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 200,
          modifier: 3,
          slideShadows: false,
        }}
        modules={[EffectCoverflow, Autoplay]}
        className="w-full max-w-2xl"
      >
        {images.map((img, idx) => (
          <SwiperSlide
            key={idx}
            style={{ width: '190px', height: '400px' }}
          >
            <div className="w-full h-full  rounded-xl overflow-hidden shadow-xl">
              <Image
                src={img}
                alt="carousel"
                fill
                loading="lazy"
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
