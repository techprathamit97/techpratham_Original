import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRightIcon, Tv } from 'lucide-react';
import { RocketIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

const BannerHome = () => {
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
        <div className='md:w-1/2 w-full h-auto transition-all rounded border-4 border-red-600 object-cover boxShadow'>
          <iframe width="100%" height="320" src='https://www.youtube.com/embed/4_qbhsjIB10' title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="shadow-lg"></iframe>
        </div>
      </div>
    </div>
  )
}

export default BannerHome
