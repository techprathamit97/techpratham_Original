import Image from 'next/image';
import React from 'react';

const BlogsHeader = () => {
    return (
        <div className='w-full h-auto flex items-center justify-center relative'>
    

            <Image src='/header/blogs.jfif' alt='' width={1920} height={1080} className='w-full md:h-96 md:object-cover object-contain' />
            {/* <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:text-6xl text-2xl font-semibold text-white text-center'>Blogs</div> */}
        </div>
    )
}

export default BlogsHeader