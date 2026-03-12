
'use client';
import React from 'react';
import Image from 'next/image';
import { teams } from '../../../../components/assets/teams';

// 1. Import Slider component and its CSS
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const EducatorHome = () => {
  // Split the teams array: first 3, then remaining 4 (FOR DESKTOP/MD VIEW ONLY)
  const firstRow = teams.slice(0, 3);
  const secondRow = teams.slice(3);

  // 2. Configure react-slick settings for the mobile carousel
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Show one card at a time
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000, // 1 second auto-scroll
    arrows: true, // Shows default next/prev arrows
  };
  const secondRowSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 6, // show 3 cards on desktop
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2500,
  arrows: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};


  return (
    <div className="relative w-full flex flex-col items-center justify-center text-white py-3 overflow-hidden">
        
        <style jsx global>{`
            /* Ensure arrows are visible and white */
            .slick-prev:before, .slick-next:before {
                color: white !important; /* Forces color to white */
                font-size: 30px !important; /* Increases size of the arrow icon */
            }

            /* Adjust arrow position (optional, for better visual placement on mobile) */
            .slick-prev {
                left: 10px !important; /* Move left arrow closer to edge */
                z-index: 10;
            }

            .slick-next {
                right: 10px !important; /* Move right arrow closer to edge */
                z-index: 10;
            }
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
          <Slider {...settings}>
            {teams.map((item, index) => (
              <div key={index} className="px-2"> {/* px-2 for spacing between slides */}
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
            ))}
          </Slider>
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
  <Slider {...secondRowSettings}>
    {secondRow.map((item, index) => (
      <div key={index} className="px-4">
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
    ))}
  </Slider>
</div>

        </div>
        {/* --- End Desktop View --- */}
      </div>
    </div>
  );
};

export default EducatorHome;