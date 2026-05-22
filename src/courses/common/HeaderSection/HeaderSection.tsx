import React from 'react';
import { ArrowTopRightIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { CircleCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { categoryPrice } from "@/components/assets/categoryPrice";

import './header.css';
const getPriceByCategory = (category?: string) => {
    if (!category) return null;

    const match = categoryPrice.find(
        (item) =>
            item.Category.toLowerCase() === category.toLowerCase()
    );

    return match?.price ?? null;
};
const formatINR = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);

const HeaderSection = ({ course }: any) => {
    const makeSlug = (text:string)=>{
  return text.toLowerCase().replace(/\s+/g,"-");
}
    return (
        <div className='flex flex-col bg-gradient-to-tl from-[#C6151D] to-[#600A0E] items-center justify-center w-full h-auto headerImage text-white relative'>
            
      {/* <div className="absolute inset-0 bg-yellow-950/50 to-transparent" /> */}

            {/* <Link href={`/courses/enrollment/${course.link}`} className='absolute top-10 right-10 w-12 h-12 rounded-full border border-white grid place-content-center transition-all duration-300 hover:text-black hover:bg-white cursor-pointer'>
                <ArrowTopRightIcon className='w-8 h-8' />
            </Link> */}

            <div className="md:w-10/12 w-11/12 h-auto grid md:grid-cols-1 grid-cols-1 gap-5 items-center py-4 z-20">
            
                <div className='w-6xl h-auto'>
                    <div className='flex flex-row gap-2 items-center justify-start mb-6 md:text-sm text-xs'>
                        <span>Courses</span>
                        <ChevronRightIcon />
                        <Link href={`/courses/domain/${course.category}`} className='transition-all duration-300 hover:underline'>{course.category}</Link>
                        <ChevronRightIcon />
                        {/* <span>{}</span> */}
                        <div dangerouslySetInnerHTML={{ __html: course.title }} />
                    </div>

                    <span className={`px-4 py-1 rounded-full md:text-base text-sm font-normal bg-gradient-to-tl from-[#C6151D] to-[#600A0E] text-gray-200`}>
                        {course.category}
                    </span>

                    <div className="md:text-2xl text-2xl font-semibold leading-tight flex-1 pr-2 mt-3 mb-1"><h1 dangerouslySetInnerHTML={{ __html: course.title }} /></div>
                    <div className="md:text-xs md:w-[700px] text-sm text-justify mb-4 flex-grow flex flex-row gap-2">
                        <CircleCheck className='w-6 h-6 mt-[2px] md:flex hidden' />
                        <div dangerouslySetInnerHTML={{ __html: course.shortDesc }} />
                    </div>

                    <div className='w-full h-auto flex md:flex-row flex-col gap-2 md:items-center items-start justify-between mb-4'>
                        <div className="flex items-center gap-1">
                            <span className="flex flex-row items-center justify-start">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fcbc05" className="w-6 h-6">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fcbc05" className="w-6 h-6">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fcbc05" className="w-6 h-6">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fcbc05" className="w-6 h-6">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fcbc05" className="w-6 h-6">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                {/* <svg width="20" height="20" viewBox="0 0 24 24" className="w-6 h-6">
                                    <defs>
                                        <linearGradient id="halfFill" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="50%" stopColor="#fcbc05" />
                                            <stop offset="50%" stopColor="#ffffff" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                                        fill="url(#halfFill)"
                                        stroke="#fcbc05"
                                        strokeWidth=""
                                    />
                                </svg> */}
                            </span>
                            {/* <span className="text-[#fcbc05] text-base font-medium">{course.rating}</span> */}
                            <span>5/5</span>
                            <span className="text-white font-normal">(4,890 Reviews)</span>
                        </div>

                    </div>

                    <div className="flex px-3 py-2 gap-4 rounded-xl border border-gray-200 max-w-fit mb-4">
                        <div className="flex flex-col gap-1">
                            <p className="md:text-sm xs:text-xs text-gray-300">Level</p>
                            <p className="md:text-sm xs:text-base font-semibold text-gray-200">{course.level}</p>
                        </div>
                        {/* <div className="h-8 w-px bg-gray-300 self-center"></div> */}
                        <div className="flex flex-col gap-1">
                            <p className="md:text-sm xs:text-xs text-gray-300">Duration</p>
                            <p className="md:text-sm xs:text-base font-semibold text-gray-200">{course.duration}</p>
                        </div>
                    </div>

                    <div className='w-full h-auto flex flex-row flex-wrap gap-3'>
                        <Link href={`/courses/enrollment/${course.link}`} className='w-auto'>
                            <Button variant='manual' className='w-full'>Enroll Now</Button>
                        </Link>
                       

                        {/* <Link href={course?.curriculum} className='w-auto'>
                            <Button variant='outline' className='w-full'>DOWNLOAD CURRICULUM</Button>
                        </Link> */}
                        {/* <Link href={course?.interview} className='w-auto'>
                            <Button variant='outline' className='w-full'>INTERVIEW QUESTIONS</Button>
                        </Link> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeaderSection