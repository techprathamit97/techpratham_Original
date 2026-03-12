import React from 'react';

const CertificateHeader = () => {
    return (
        <div className='w-full py-10 h-auto flex flex-col items-center justify-center gap-6  pb-10 bg-gradient-to-tl from-[#600A0E] to-[#C6151D] text-white'>
            <div className='px-4 py-1 rounded border-2 border-white text-white uppercase font-semibold'>
                Certificate
            </div>
            <div className='w-11/12 text-center lg:text-5xl md:text-4xl sm:text-3xl text-xl font-bold'>
                Training Certificate
            </div>
            <div className='text-center text-base md:text-lg'>
                View and download your training certificate here.<br />
                For assistance, contact us at <a href="mailto:certificate@techpratham.com" className="text-blue-600 underline">certificate@techpratham.com</a>.
            </div>
        </div>
    )
}

export default CertificateHeader