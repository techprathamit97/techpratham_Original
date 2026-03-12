'use client';

import React, { useState } from 'react';
import { PinTopIcon } from '@radix-ui/react-icons';

const MapSection = () => {
    const [activeLocation, setActiveLocation] = useState(0);

    const locations = [
        {
            name: "Registered Office - Noida",
            address: "G-31, 1st Floor Sector-3, Noida 201301",
            mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.5827!2d77.3167!3d28.5833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM0JzU5LjkiTiA3N8KwMTknMDAuMSJF!5e0!3m2!1sen!2sin!4v1234567890"
        },
        {
            name: "Noida Office",
            address: "C-2, Sector-1, Noida, Uttar Pradesh - 201301",
            mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.5827!2d77.3167!3d28.5833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM0JzU5LjkiTiA3N8KwMTknMDAuMSJF!5e0!3m2!1sen!2sin!4v1234567890"
        },
        {
            name: "Hyderabad Office",
            address: "LVS Arcade, 71, Hitech, 6th floor, Madhapur Road, HITEC City, Hyderabad",
            mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.5!2d78.3808!3d17.4485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDI2JzU0LjYiTiA3OMKwMjInNTAuOSJF!5e0!3m2!1sen!2sin!4v1234567890"
        }
    ];

    return (
        <div className='w-full h-auto flex flex-col items-center justify-center py-16 bg-slate-100'>
            <div className='md:w-10/12 w-11/12 h-auto flex flex-col gap-8'>
                <div className='text-center'>
                    <h2 className='text-3xl md:text-4xl font-bold text-[#7f1d1d]'>Find Us On Map</h2>
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
                    <p className='text-gray-600 text-lg'>Visit any of our office locations</p>
                </div>

                <div className='flex flex-wrap justify-center gap-4 mb-6'>
                    {locations.map((location, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveLocation(index)}
                            className={`group flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                                activeLocation === index
                                    ? 'bg-gradient-to-r from-[#600A0E] to-[#C6151D] text-white shadow-lg scale-105'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <PinTopIcon className={`w-5 h-5 ${activeLocation === index ? 'animate-bounce' : ''}`} />
                            {location.name}
                        </button>
                    ))}
                </div>

                <div className='relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-gray-200'>
                    <div className='absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg'>
                        <div className='flex items-start gap-2'>
                            <PinTopIcon className="w-5 h-5 text-[#C6151D] flex-shrink-0 mt-1" />
                            <div>
                                <h3 className='font-bold text-gray-900'>{locations[activeLocation].name}</h3>
                                <p className='text-sm text-gray-600 mt-1'>{locations[activeLocation].address}</p>
                            </div>
                        </div>
                    </div>

                    <iframe
                        src={locations[activeLocation].mapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className='transition-opacity duration-500'
                    ></iframe>
                </div>

                <div className='text-center'>
                    <a
                        href='https://g.page/r/CX1XMlbVUiyaEBM'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#600A0E] to-[#C6151D] text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105'
                    >
                        <PinTopIcon className="w-5 h-5" />
                        View All Locations on Google Maps
                    </a>
                </div>
            </div>
        </div>
    );
};

export default MapSection;
