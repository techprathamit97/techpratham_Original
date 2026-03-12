import React from 'react';
import './certification.css';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

// import required modules
import { EffectCoverflow, Autoplay, Pagination, Navigation } from 'swiper/modules';
import Image from 'next/image';
import { client } from '@/components/assets/client';

const CourseCertification = () => {
  return (
    <div className='md:w-10/12 w-11/12 h-auto flex flex-col items-center justify-center md:gap-10 gap-6 py-10 bg-[#f7f7f7] rounded-2xl shadowBorder overflow-hidden'>
      <div className="w-11/12 md:text-3xl text-2xl md:font-semibold font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#CD4647] to-[#7F3B40] capitalize md:mt-4 mb-0 text-center">ERP Partners</div>
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        loop={true}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        modules={[EffectCoverflow, Pagination, Autoplay, Navigation]}
        className="mySwiper swiperCertificate"
      >
        {client.map((item, index) => (
          <SwiperSlide key={index} className='md:w-80 w-56 md:h-80 h-56 flex flex-col items-center justify-center bg-[#fff] p-6'>
            <div className="flex items-center justify-center w-full h-full">
              <Image src={item.image} alt={item.altText} className="object-contain max-w-full max-h-full" fill={false} width={300} height={300} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default CourseCertification