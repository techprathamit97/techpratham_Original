import React, { useState } from 'react';

const main_data = [
    {
        title: "Training mode",
        description: "We offer a comprehensive training mode that includes interactive sessions, hands-on projects, and regular assessments to track your progress."
    },
    {
        title: "Hands-On Practical Training",
        description: "Our training emphasizes practical skills with real-world projects to ensure you gain the experience needed for success."
    },
    {
        title: "Real Projects, Real Outcomes",
        description: "Work on real projects that mirror industry standards, preparing you for the challenges of the professional world."
    },
    {
        title: "Achieve Your Career Aspirations",
        description: "Our goal is to help you achieve your career aspirations through personalized guidance and support."
    }
];

const SpecialitySection = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <div className='w-full h-auto flex flex-col items-center justify-center gap-6'>
            <div className='md:w-10/12 w-11/12 h-auto flex flex-col pt-16 pb-8 gap-6'>
                <div className='text-2xl font-semibold text-left flex flex-row gap-4 items-center justify-start'>
                    <div>Why Choose Tech Pratham?</div>
                </div>
                <div className='w-full h-auto grid md:grid-cols-2 grid-cols-1 gap-4'>
                    <div className='flex flex-col gap-3'>
                        {main_data.map((item, idx) => (
                            <div key={idx} className={`cursor-pointer py-3 px-3 border-l-2 border-l-[#d2d2d2] ${selectedIndex === idx ? 'font-normal bg-[#f7f7f7]' : ''}`} onClick={() => setSelectedIndex(idx)}>
                                {item.title}
                            </div>
                        ))}
                    </div>
                    <div className='flex flex-col gap-4 p-4 bg-[#f7f7f7] border-l-2 border-l-[#d2d2d2]'>
                        <div>
                            {main_data[selectedIndex].description}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SpecialitySection;