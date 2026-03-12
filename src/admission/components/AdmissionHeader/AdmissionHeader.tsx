import React from 'react';

const AdmissionHeader = () => {
    return (
        <div className='w-full h-auto  flex flex-col items-center justify-center gap-6  pt-10 pb-10 bg-gradient-to-tl from-[#600A0E] to-[#C6151D] text-white'>
            <div className='px-4 py-1 rounded border-2 border-white text-white uppercase font-semibold'>
                Admission
            </div>
            <div className='w-11/12 text-center lg:text-5xl md:text-4xl sm:text-3xl text-xl font-bold'>
                Write your Admission Query Here
            </div>
            <div className='text-center text-base md:text-lg'>
                Start your learning journey with us.<br />
                For queries or support, contact <a href="mailto:admission@techpratham.com" className="text-blue-600 underline">admission@techpratham.com</a>.
            </div>
        </div>
    )
}

export default AdmissionHeader