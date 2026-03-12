import React from 'react';

const SkillSection = ({ course }: any) => {
    return (
        <div className='w-full h-auto flex flex-col items-center justify-center gap-6 bg-[#f7f7f7]'>
            <div className='md:w-10/12 w-11/12 h-auto flex flex-col py-16 gap-6'>
                <div className='text-center space-y-4'>
                    <div className='inline-flex items-center gap-3 bg-white px-6 py-2 rounded-full shadow-sm border border-gray-200'>
                        <div className='w-2 h-2 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full'></div>
                        <span className='text-sm font-medium text-gray-600 uppercase tracking-wider'>Top Skills & Tools Covered</span>
                    </div>
                </div>
                <div className='w-full h-auto grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5'>
                    {course?.skills_data.map((skill: any, idx: any) => (
                        <div key={idx} className='p-6 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:shadow-orange-100 transition-all duration-300 cursor-pointer transform hover:-translate-y-1'>
                            <div className='flex items-center justify-between mb-4'>
                                <div className='w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300'>
                                    {(idx + 1).toString().padStart(2, '0')}
                                </div>
                            </div>
                            <h3 className='text-lg font-semibold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors duration-300'>
                                {skill}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SkillSection