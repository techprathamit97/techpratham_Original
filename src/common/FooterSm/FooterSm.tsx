import { Separator } from '@/components/ui/separator';
import { FaLinkedin, FaYoutube, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const FooterSm = () => {
  return (
    <div className='w-full h-auto flex items-center justify-center bg-[#1E2328] text-white'>
      <div className='md:w-10/12 w-11/12 flex flex-col py-10 gap-14'>

        <div className='w-full flex flex-col'>
          <div className='text-xl font-semibold mb-1'>Follow Us!</div>
          <Separator className='mb-4 w-80' />
          <div className='flex flex-row gap-3'>
            <div className='w-10 h-10 rounded-full bg-gradient-to-r from-[#CD4647] to-[#7F3B40] flex items-center justify-center'>
              <FaFacebook className='w-6 h-6' />
            </div>
            <div className='w-10 h-10 rounded-full bg-gradient-to-r from-[#CD4647] to-[#7F3B40] flex items-center justify-center'>
              <FaLinkedin className='w-6 h-6' />
            </div>
            <div className='w-10 h-10 rounded-full bg-gradient-to-r from-[#CD4647] to-[#7F3B40] flex items-center justify-center'>
              <FaYoutube className='w-6 h-6' />
            </div>
            <div className='w-10 h-10 rounded-full bg-gradient-to-r from-[#CD4647] to-[#7F3B40] flex items-center justify-center'>
              <FaInstagram className='w-6 h-6' />
            </div>
            <div className='w-10 h-10 rounded-full bg-gradient-to-r from-[#CD4647] to-[#7F3B40] flex items-center justify-center'>
              <FaTwitter className='w-6 h-6' />
            </div>
          </div>
        </div>

        <div className='w-full flex flex-col gap-2'>
          <Link href={'/'} aria-label='Techpratham'>
            <Image src={'/navbar/techpratham.svg'} alt='' width={100} height={50} className='w-56 h-auto' />
          </Link>
          <div className='text-sm font-light'>At Tech Pratham,kk we are a forward thinking IT education dedicated to empowering individuals with the skills they need to thrive in the digital age. Our mission is to bridge the gap between traditional learning and the evolving demands of the tech industry by offering innovative, industry relevant training programs. What sets us apart is our commitment to creating a learning environment that is not only accessible but also engaging and impactful. With flexible schedules, expert mentorship, and real-world project experience, we ensure every student is equipped to achieve their career goals.</div>
        </div>

      </div>
    </div>
  )
}

export default FooterSm
