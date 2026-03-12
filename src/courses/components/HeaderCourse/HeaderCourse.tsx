import React from 'react'

const HeaderCourse = () => {
    return (
        <div className='w-full h-auto flex flex-col items-center justify-center gap-6  pt-10'>
            <div className='px-4 py-1 rounded border-2 border-black text-black uppercase font-semibold'>
                Courses
            </div>
            <div className='w-11/12 text-center lg:text-5xl md:text-4xl sm:text-3xl text-xl font-bold'>
                Explore Our Courses
            </div>
            <div className='text-center text-base md:text-lg'>
                Explore our comprehensive collection of courses designed to advance your career and skills.
            </div>
        </div>
    )
}

export default HeaderCourse