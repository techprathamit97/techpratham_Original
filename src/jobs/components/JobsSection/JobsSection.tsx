import React from 'react';
import { ArrowTopRightIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import Image from 'next/image';

const JobsSection = () => {
    return (
        <div className='w-full h-auto flex flex-col items-center justify-center bg-white'>
            <div className='md:w-10/12 w-11/12 h-auto flex flex-col items-center justify-center py-16 gap-8'>
                <div
                    className='p-[3px] shadow flex items-center justify-center w-full h-full bg-gradient-to-tl'
                    style={{
                        backgroundImage: 'linear-gradient(to top left, #ff0000, #ff9900, #33cc33, #3399ff, #9900cc, #ff3399)'
                    }}
                >
                    <div className='w-full h-auto bg-[#eee] p-6 flex md:flex-row flex-col md:gap-0 gap-8 items-start justify-between'>
                        <div className='flex flex-col gap-3'>
                            <div className='md:text-3xl text-xl font-bold'>Join Our Team</div>
                            <div className='mb-6 md:w-10/12 w-full'>
                                We're looking for passionate individuals to join our growing team.
                                If you're interested in exciting opportunities and want to be part of
                                our innovative company culture, we'd love to hear from you.
                            </div>
                            <div className='flex md:flex-row flex-col gap-2 items-start justify-start md:w-auto w-full'>
                                <div className='p-2 rounded text-sm font-normal bg-white flex flex-row gap-2 items-center justify-center transition-all duration-300 hover:text-white hover:bg-black cursor-pointer'>
                                    <Image src='/support/work-from-home.png' alt='' width={40} height={40} />
                                    <span>Remote/Hybrid</span>
                                </div>
                                <div className='p-2 rounded text-sm font-normal bg-white flex flex-row gap-2 items-center justify-center transition-all duration-300 hover:text-white hover:bg-black cursor-pointer'>
                                    <Image src='/support/working-time.png' alt='' width={40} height={40} />
                                    <span>Full Time</span>
                                </div>
                            </div>
                        </div>
                        <div className='md:w-2/12 w-full flex justify-end'>
                            <Link
                                href="https://docs.google.com/forms/d/e/1FAIpQLSeHYS_l6MXeEFUemTmchIm49LBHetX3sVunysl6SXq777UjIg/viewform"
                                target="_blank"
                                rel="noopener noreferrer"
                                className='flex flex-row gap-1 items-center justify-center font-semibold cursor-pointer'
                            >
                                <span className='hover:underline'>Apply Now</span>
                                <ArrowTopRightIcon className='w-5 h-5' />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobsSection