// import React from 'react';
// import Image from 'next/image';

// const TrainingHeader = () => {
//     return (
//         <div className=' w-full h-auto flex items-center justify-center relative'>
//             <Image src='/training/banner1.jpeg' alt='' width={1920} height={1080} className='w-full h-96 md:object-cover object-contain ' />
//             <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:text-6xl text-2xl font-semibold text-white text-center'>Corporate Training</div>
//         </div>
//     )
// }

// export default TrainingHeader

import Image from "next/image";

const HeaderContact = () => {
  return (
    <div className="relative w-full md:h-[400px] h-56">
      {/* Background Image */}
      <Image
        src="/training/banner2.jpeg"
        alt="Header Image"
        fill
        className="object-cover"
        priority
      />

      {/* Dark + Gradient Overlay (FROM RIGHT) */}
      <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/60 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex justify-end items-center">
        <div className="max-w-5xl px-6 md:px-16 text-white text-left">
          {/* Small Heading */}
          <p className="uppercase tracking-widest text-xs md:text-base border-b-2 border-white inline-block pb-1 mb-4 md:mb-1">
           Corporate Upskilling
          </p>

          {/* Main Heading */}
          <h1 className="text-xs md:text-2xl font-semibold mb-2">
            Future-Ready Workforce Solutions
          </h1>

          <h2 className="text-xl md:text-4xl font-bold mb-2">
            Transforming Talent Into Impact
          </h2>

          {/* Description */}
          <p className="max-w-2xl ml-auto text-xs md:text-lg text-gray-200 leading-relaxed">
          We partner with organizations to deliver customized training solutions that empower teams, strengthen leadership, and drive sustainable growth.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeaderContact;
