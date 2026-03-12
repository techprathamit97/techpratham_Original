import React from 'react';

interface SectionProps {
  id?: string;
}
const IntroSection = ({ id,course }: any) => {
    return (
        <div id={id} className='w-full h-auto flex flex-col items-center justify-center gap-6'>
            <div className='md:w-10/12 w-11/12 h-auto grid md:grid-cols-5 grid-cols-1 gap-8 py-5'>
                <div className='md:col-span-3 col-span-1 w-full h-auto flex flex-col items-start gap-4'>
                    <div className=' items-center gap-3 bg-white md:px-6 px-2 py-2 md:rounded-full rounded-sm shadow-sm border border-gray-200'>
                        {/* <div className='md:flex hidden w-2 h-2 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full'></div> */}
                        <h2 className="text-base font-bold text-gray-800 uppercase">
                            About&nbsp;
                            <span dangerouslySetInnerHTML={{ __html: course.title }} />
                        </h2>
                    </div>
                    <div className='w-full h-full text-base text-justify font-normal text-gray-600  '><div dangerouslySetInnerHTML={{ __html: course.description }} /></div>
                </div>
                <div className="md:col-span-2 col-span-1 flex items-center justify-center w-full h-full">
                    <iframe width="100%" height="290" src={course.videoLink} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="rounded-lg shadow-lg"></iframe>
                </div>
            </div>
        </div>
    )
}

export default IntroSection