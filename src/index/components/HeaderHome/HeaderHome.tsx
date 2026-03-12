import React from 'react';

import './header.css';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { certificate } from '@/components/assets/certificate';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { certification } from '@/components/assets/certification';

const HeaderHome = () => {
    return (
        <div className='w-full h-auto flex flex-col items-center justify-center bg-gradient-to-r from-[#371414] to-[#D1090F] text-white overflow-hidden'>
            <div className='md:w-10/12 w-11/12 h-auto flex md:flex-row flex-col items-start gap-20 pt-16 pb-24'>
                <div className='md:w-8/12 w-full flex flex-col gap-10'>
                    <div className='md:text-4xl text-3xl md:leading-[46px] leading-[36px] font-bold'>India's <span className='bg-gradient-to-tr from-[#FC7A35] to-[#f8da52] text-transparent bg-clip-text'>Leading Job Oriented Project</span> based Upskilling platform.</div>
                    <div className='flex flex-col items-start text-left'>
                        <h2 className='text-2xl font-semibold mb-2 bg-gradient-to-tr from-[#FC7A35] to-[#f8da52] text-transparent bg-clip-text'>
                            Our Mission
                        </h2>
                        <div className='flex flex-row gap-1 md:text-lg text-base font-normal'>
                            <Image src='/home/sign.jpeg' alt='' width={10} height={10} className='w-6 h-6' />
                            <div>1 Skill = 1 Job = <strong>1 Family</strong> = 6 Person = Happy Life</div>
                        </div>
                        <div className='flex flex-row gap-1 md:text-lg text-base font-normal'>
                            <Image src='/home/sign.jpeg' alt='' width={10} height={10} className='w-6 h-6' />
                            <div>Gain hands-on experience with real projects guided by <strong>industry experts</strong></div>
                        </div>
                    </div>
                    <section className='text-white overflow-x-hidden h-auto w-full'>
                        <div className='flex nowrap whitespace-nowrap'>
                            <section className="message">
                                {certification.map((item, index) => (
                                    <Card key={index} className='w-44 h-32 p-4 flex items-center justify-center'>
                                        <Image src={item.image} alt={item.altText} width={1440} height={500} className='w-full h-full object-contain' />
                                    </Card>
                                ))}
                            </section>
                            <section className="message mx-4">
                                {certification.map((item, index) => (
                                    <Card key={index} className='w-44 h-32 p-4 flex items-center justify-center'>
                                        <Image src={item.image} alt={item.altText} width={1440} height={500} className='w-full h-full object-contain' />
                                    </Card>
                                ))}
                            </section>
                        </div>
                    </section>
                </div>
                <div className='flex flex-col items-center justify-center md:min-w-96 w-full h-auto'>
                    <Swiper
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        navigation={true}
                        modules={[Autoplay, Pagination, Navigation]}
                        className="mySwiper swiperHome"
                    >
                        {certificate.map((item, index) => (
                            <SwiperSlide key={index}>
                                <Image src={item.image} alt={item.altText} width={1440} height={500} className='w-full h-full object-cover' />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    )
}

export default HeaderHome