import React from 'react';
import Image from 'next/image';

const HeaderFaqs = () => {
    return (
        <div className='w-full h-auto flex flex-col items-center justify-center lg:pt-30'>
            <div className='w-full h-auto flex items-center justify-center relative'>
                <Image src='/about/banner.png' alt='' width={1920} height={1080} className='w-full md:h-96 h-56 object-cover' />
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:text-6xl text-2xl font-semibold text-white text-center'>FAQs</div>
            </div>
        </div>
    )
}

export default HeaderFaqs