import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRightIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { RocketIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import VideoPlayer from './VideoPlayer';

const BannerHomeEnhanced = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  
  // AWS S3 videos - you can add more videos here
  const videos = [
    {
      url: "https://content.techpratham.com/study_metrial.mp4",
      title: "Learning Materials",
      description: "Comprehensive study materials for your success"
    },
    {
      url: "https://content.techpratham.com/resume-buidling-session.mp4",
      title: "Resume Building",
      description: "Professional resume building session"
    },
    {
      url: "https://content.techpratham.com/interview_preparation.mp4",
      title: "Interview Preparation",
      description: "Master your interview skills"
    },
    {
      url: "https://content.techpratham.com/Live%20Project%20Demonstration.mp4",
      title: "Live Project Demo",
      description: "Real-world project demonstrations"
    }
  ];

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const currentVideo = videos[currentVideoIndex];
  
  return (
    <div className='w-full h-auto flex flex-col items-center justify-center py-20 gap-10 bg-black text-white'>
      <div className='w-10/12 h-auto flex md:flex-row flex-col md:gap-6 gap-10 items-center justify-between'>
        <div className='md:w-1/2 w-full flex flex-col gap-4 capitalize'>
          <div className='mb-6'>
            <Badge className='px-6 py-2 text-base font-light cursor-pointer rounded-full border-2 border-[#D1090F] bg-[#d109103a] hover:bg-[#d109105d] text-[#D1090F]'>
              <RocketIcon className='w-5 h-5' />
              <span className='ml-2'>Formula for Growth</span>
            </Badge>
          </div>
          <div className='lg:text-5xl md:text-4xl text-3xl font-bold flex flex-col md:gap-2 gap-1'>
            <span>Why should you</span>
            <span className='bg-gradient-to-tr from-[#FC7A35] to-[#f8da52] text-transparent bg-clip-text'>upskill now?</span>
          </div>
          <div>Join techpratham - india's premier training institute for a future-ready career</div>
          <Link href='#contact'>
            <Button variant='manual' className='flex items-center justify-center text-base font-normal rounded-full mt-2'>
              <span>Enquiry Now</span>
              <ChevronRightIcon />
            </Button>
          </Link>
        </div>
        
        <div className='md:w-1/2 w-full flex flex-col gap-4'>
          {/* Video Player */}
          <VideoPlayer
            videoUrl={currentVideo.url}
            title={currentVideo.title}
            description={currentVideo.description}
            className="boxShadow"
          />
          
          {/* Video Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={prevVideo}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              disabled={videos.length <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Previous</span>
            </button>
            
            {/* Video Indicators */}
            <div className="flex gap-2">
              {videos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentVideoIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentVideoIndex 
                      ? 'bg-red-600' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={nextVideo}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              disabled={videos.length <= 1}
            >
              <span className="text-sm">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          {/* Video Title and Description */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-2">{currentVideo.title}</h3>
            <p className="text-gray-300 text-sm">{currentVideo.description}</p>
            <p className="text-gray-500 text-xs mt-1">
              Video {currentVideoIndex + 1} of {videos.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BannerHomeEnhanced;