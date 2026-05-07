import React from 'react';
import Image from 'next/image';
import Achivement from './Achivement';

const CareerHome = () => {
  return (
    <div className='w-full h-auto flex flex-col items-center justify-center  bg-[#F5F4F7] text-black'>

      <div className='w-full pt-5 text-center flex flex-col items-center justify-center gap-6'>
         <div className="md:text-3xl text-2xl md:font-semibold font-medium text-black capitalize cursor-pointer transition-all duration-500 ease-in-out hover:scale-110 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-br hover:from-[#1a0a0a] hover:to-[#a3262c]">In Association With</div>
      <div className='grid grid-cols-6 md:grid-cols-6 lg:grid-cols-6 gap-2 w-11/12 justify-items-center items-center'>
  {[
    '/home/career/mcagi.webp',
    '/home/career/msde.webp',
    '/home/career/nsdc.webp',
    '/home/career/skill-india.webp',
    '/home/career/egac.webp',
    '/home/career/iso-certified.webp',
    '/home/career/microsoft.webp',
    '/home/career/ibm.webp',
    '/home/career/google-analytics.webp',
    '/home/career/otabu.webp',
    '/home/career/iaf.webp',
    '/home/career/rapl.webp',
    
  ].map((src, i) => (
    <Image
      key={i}
      src={src}
      alt='Companies Associated'
      width={500}
      height={300}
      className='w-28 h-16 object-contain cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-lg hover:shadow-red-500/30'
    />
  ))}
</div>

         <Achivement/>
      </div>
     
    </div>
  )
}

export default CareerHome
