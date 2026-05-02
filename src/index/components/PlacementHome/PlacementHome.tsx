// import Image from 'next/image'
// import React from 'react'

// const PlacementHome = () => {
//   return (
//     <div className='w-full h-auto flex flex-col gap-10 items-center justify-center py-20 bg-white text-black'>
//       <div className="w-11/12 md:text-3xl text-2xl md:font-semibold font-medium text-black capitalize text-center cursor-pointer transition-all duration-500 ease-in-out hover:scale-110 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-br hover:from-[#1a0a0a] hover:to-[#a3262c]">Student Placement Process</div>
//       <Image src='/home/placement-process.svg' alt='' width={800} height={400} className='w-11/12 h-auto object-contain' />
//     </div>
//   )
// }

// export default PlacementHome

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Crousel from './crousel'
import {   FileText,  Users, BookOpen, MessageCircle } from 'lucide-react';

// ====================================================================
// 1. CAROUSEL COMPONENT (Adapted from your provided code)
// ====================================================================

interface Props {
  id?: string;
//   course?: any;
}

// ====================================================================
// 2. SIDE PANELS & LAYOUT WRAPPER (To replicate the full page image)
// ====================================================================

const LeftPanel = () => (
    <div className="w-full max-w-sm space-y-3 px-2">
        <h2 className="text-[25px] font-bold text-white leading-tight">Our  Success Mantra</h2>
        {/* <p className="text-xl text-gray-200 mb-6"> Process</p> */}

        {/* Profile Building */}
        <div className="bg-white rounded-xl shadow-lg p-2 border-l-4 border-blue-500">
            <h3 className="text-xl font-semibold mb-3 flex items-center text-gray-800">
                <div className="flex items-center">
  <div className="w-10 h-10 mr-2 relative">
    <Image
      src="/about/icons/1.svg"
      alt="Commitment Icon"
      fill
      className="object-contain"
    />
  </div>
  Commitment
</div>
            </h3>
            <ul className="list-disc ml-5 text-gray-600 space-y-1 text-sm">
                <li>Ensuring quality training every day</li>
                {/* <li>Supporting students until successful placement</li> */}
            </ul>
        </div>

        {/* Mock Interviews */}
        <div className="bg-white rounded-xl shadow-lg p-2 border-l-4 border-orange-500">
            <h3 className="text-xl font-semibold mb-3 flex items-center text-gray-800">
            <div className="flex items-center">
  <div className="w-10 h-10 mr-2 relative">
    <Image
      src="/about/icons/2.svg"
      alt="Commitment Icon"
      fill
      className="object-contain"
    />
  </div>
  Fulfillment
</div>
            </h3>
            <ul className="list-disc ml-5 text-gray-600 space-y-1 text-sm">
                <li>Meeting learning goals with confidence</li>
                {/* <li>Delivering skills that empower careers</li> */}
            </ul>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-2 border-l-4 border-[#A149F8]">
            <h3 className="text-xl font-semibold mb-3 flex items-center text-gray-800">
                <div className="flex items-center">
  <div className="w-10 h-10 mr-2 relative">
    <Image
      src="/about/icons/3.svg"
      alt="Commitment Icon"
      fill
      className="object-contain"
    />
  </div>
  Accomplishment
</div>
            </h3>
            <ul className="list-disc ml-5 text-gray-600 space-y-1 text-sm">
                <li>Students achieving industry-ready expertise</li>
                {/* <li>Transforming training into real success</li> */}
            </ul>
        </div>
    
    </div>
);

const RightPanel = () => {
    const supportItems = [
        { icon: 'MessageCircle', label: '24/7 Support' },
        { icon: 'linkedin', label: 'LinkedIn Profile' },
        { icon: 'file-text', label: 'Resume Writing' },
        { icon: 'Alumni Sessions', label: 'Alumni Sessions' },
        { icon: 'users', label: 'Interview Preparation' },
        { icon: 'book-open', label: 'Live Projects' },
    ];
interface IconComponentProps {
  name: string;
  className?: string; // optional
}
    const IconComponent: React.FC<IconComponentProps> = ({ name, className }) => {
        switch (name) {
            case 'MessageCircle': return <MessageCircle className={className}/>
            case 'linkedin': return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.553v-5.626c0-1.343-.473-2.327-1.748-2.327-1.763 0-2.023 1.326-2.023 2.296v5.657h-3.554V9.227h3.38v1.583h.05a3.91 3.91 0 013.518-1.928c2.478 0 4.382 1.63 4.382 5.105v6.465zM5.337 7.027c-1.405 0-2.316-.923-2.316-2.146 0-1.223.911-2.147 2.316-2.147s2.317.924 2.317 2.147c0 1.223-.912 2.146-2.317 2.146zm-.404 13.425H7.07V9.227H4.933v11.225z"/></svg>;
            case 'file-text': return <FileText className={className} />;
            case 'Alumni Sessions': return < Users className={className} />;
            case 'users': return <Users className={className} />;
            case 'book-open': return <BookOpen className={className} />;
            default: return null;
        }
    };

    return (
        <div className="w-full max-w-sm p-3 space-y-6">
            <h2 className="text-[25px] font-bold text-white leading-tight">Beyond Courses:</h2>
            <p className="text-xl text-gray-200 mb-6">Additional Support We Provide</p>
            
            <div className="grid grid-cols-3 gap-4">
                {supportItems.map((item, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-lg p-3 flex flex-col items-center justify-center text-center h-28">
                        <div className='w-10 h-10 mb-1 flex items-center justify-center text-red-900'>
                            <IconComponent name={item.icon} className="w-8  h-8" />
                        </div>
                        <p className="text-xs font-medium text-gray-700">{item.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default function FullPageCarouselLayout({ id }: Props): JSX.Element {
    // const IntroSection  {
    return (
        // Main container with background styles matching the image
        <div id={id}
            className="relative md:max-h-[500px] w-full md:bg-cover  bg-contain bg-center overflow-hidden" 
            // Placeholder for the repeating logo background style
            style={{ 
                backgroundImage: `url('/about/placement_home_bg.webp')`, 
                // backgroundSize: 'cover' 
            }}
        >
            {/* <div className="absolute inset-0 bg-black/70  z-0"></div>  */}
            <div className="absolute inset-0 z-0 bg-red-900/40"></div>
{/* <div className="absolute inset-0 z-10 bg-black/70"></div> */}

            <div className="relative z-10 border-2 p-1   m-2 flex flex-col items-center justify-start ">
                
                {/* Main Content Area (Left Panel | Carousel | Right Panel) */}
                <div className="flex flex-col  lg:flex-row items-center lg:items-stretch justify-center w-full mx-auto">
                    
                    {/* Left Panel */}
                    <div className="w-full lg:w-1/4 order-1 lg:order-1 pt-3">
                        <LeftPanel />
                    </div>

                    {/* Center Carousel */}
                    <div className="w-full lg:w-1/2 flex justify-center order-2 lg:order-2 lg:my-0">
                        <Crousel />
                    </div>

                    {/* Right Panel */}
                    <div className="w-full lg:w-1/3 order-3 lg:order-3">
                        <RightPanel />
                    </div>
                </div>

               
        
            </div>
        </div>
    );
}