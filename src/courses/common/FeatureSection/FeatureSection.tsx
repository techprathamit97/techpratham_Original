import Image from 'next/image'
import React from 'react'

const FeatureSection = () => {
    return (
        <div className='w-full h-auto flex flex-col items-center justify-center gap-6'>
            <div className='md:w-10/12 w-11/12 h-auto flex flex-col pt-16 pb-8 gap-10'>
                <div className='text-2xl font-semibold text-left flex flex-row gap-4 items-center justify-start'>
                    <div>Course Features</div>
                    <div className='px-4 py-1 rounded-full border border-[#CD4647] text-[#CD4647] text-base font-light'>100% Money Back Guarantee</div>
                </div>
                <div className='w-full h-auto grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6'>
                    <div className='flex flex-row items-center gap-3'>
                        <Image src='/course/live-video.png' alt='' width={40} height={40} className='w-8' />
                        <div>Live session with class recordings</div>
                    </div>
                    <div className='flex flex-row items-center gap-3'>
                        <Image src='/course/live-video.png' alt='' width={40} height={40} className='w-8' />
                        <div>Track your class wise attendance</div>
                    </div>
                    <div className='flex flex-row items-center gap-3'>
                        <Image src='/course/live-video.png' alt='' width={40} height={40} className='w-8' />
                        <div>Get study material with assignments</div>
                    </div>
                    <div className='flex flex-row items-center gap-3'>
                        <Image src='/course/live-video.png' alt='' width={40} height={40} className='w-8' />
                        <div>Share your feedback for trainers & Training</div>
                    </div>
                    <div className='flex flex-row items-center gap-3'>
                        <Image src='/course/live-video.png' alt='' width={40} height={40} className='w-8' />
                        <div>Track Your Curriculum covered</div>
                    </div>
                    <div className='flex flex-row items-center gap-3'>
                        <Image src='/course/live-video.png' alt='' width={40} height={40} className='w-8' />
                        <div>Get your training certificate from LMS</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FeatureSection