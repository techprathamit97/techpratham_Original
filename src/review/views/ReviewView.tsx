'use client';

import React, { useContext, useEffect } from 'react';
import { UserContext } from '@/context/userContext';
import ReviewForm from '../components/ReviewForm/ReviewForm';
import TestimonialSection from '../components/TestimonialSection/TestimonialSection';

const ReviewView = () => {
  const { setActiveTab } = useContext(UserContext);

  useEffect(() => {
    setActiveTab('reviews');
  }, [setActiveTab]);

  return (
    <div className='w-full h-auto flex flex-col items-center justify-center relative'>
      {/* Hero Section */}
      <div className='w-full h-auto flex flex-col items-center justify-center py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden'>
        <div className='absolute inset-0 bg-[url("/patterns/grid.svg")] opacity-5'></div>
        
        <div className='md:w-10/12 w-11/12 h-auto flex flex-col items-center text-center gap-6 relative z-10'>
          <div className='inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/20'>
            ⭐ Share Your Experience
          </div>
          
          <h1 className='text-4xl md:text-6xl font-bold'>
            <span className='bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent'>
              Your Voice
            </span>
            <br />
            <span className='bg-gradient-to-r from-[#C6151D] to-[#ff6b6b] bg-clip-text text-transparent'>
              Matters to Us
            </span>
          </h1>
          
          <p className='text-gray-300 text-lg md:text-xl max-w-3xl leading-relaxed'>
            Help us improve and inspire others by sharing your learning journey. 
            Your honest feedback shapes our future and guides fellow learners.
          </p>
        </div>

        <div className='absolute top-10 right-10 w-64 h-64 bg-[#C6151D] rounded-full blur-3xl opacity-10 animate-pulse'></div>
        <div className='absolute bottom-10 left-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-10 animate-pulse' style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Review Form Section */}
      <div className='w-full h-auto flex flex-col items-center justify-center py-16 bg-white'>
        <div className='md:w-10/12 w-11/12 h-auto'>
          <ReviewForm />
        </div>
      </div>

      {/* Testimonials Section */}
      <TestimonialSection 
        limit={9}
        showStats={true}
        showLoadMore={true}
        minRating={0}
      />

      {/* CTA Section */}
      <div className='w-full h-auto flex flex-col items-center justify-center py-16 bg-gradient-to-br from-[#600A0E] to-[#C6151D] text-white'>
        <div className='md:w-10/12 w-11/12 h-auto flex flex-col items-center text-center gap-6'>
          <h2 className='text-3xl md:text-4xl font-bold'>
            Ready to Start Your Learning Journey?
          </h2>
          <p className='text-gray-100 text-lg max-w-2xl'>
            Join thousands of satisfied students who have transformed their careers with our expert-led training programs.
          </p>
          <div className='flex flex-wrap gap-4 justify-center'>
            <a
              href='/courses'
              className='px-8 py-4 bg-white text-[#C6151D] font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg'
            >
              Browse Courses
            </a>
            <a
              href='/contact-us'
              className='px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-[#C6151D] transition-all duration-300 hover:scale-105'
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewView;
