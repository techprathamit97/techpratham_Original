// import React from 'react';

// import Image from 'next/image';

// const HeaderContact = () => {
//     return (
//         <Image src='/support/banner2.jpeg' alt='Header Image' width={1920} height={1080} className='w-full md:h-[500px] h-56 object-cover' />
//     )
// }

// export default HeaderContact

import Image from "next/image";

const HeaderContact = () => {
  return (
    <div className="relative w-full md:h-[400px] h-56">
      {/* Background Image */}
      <Image
        src="/support/banner2.jpeg"
        alt="Header Image"
        fill
        className="object-cover"
        priority
      />

      {/* Dark + Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-5xl px-6 md:px-16 text-white">
          {/* Small Heading */}
          <p className="uppercase tracking-widest text-sm md:text-base border-b-2 border-white inline-block pb-1 mb-4">
            Let’s Connect
          </p>

          {/* Main Heading */}
          <h1 className="text-xl md:text-2xl font-semibold mb-2">
            We Empower Growth
          </h1>

          <h2 className="text-2xl md:text-4xl font-bold md:mb-4 md-2">
           Creating Impactful Learning Journeys
          </h2>

          {/* Description */}
          <p className="max-w-2xl text-sm md:text-lg text-gray-200 leading-relaxed">
           We help you transform your skills set to meet modern industry demands and achieve measurable impact in your career.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeaderContact;
