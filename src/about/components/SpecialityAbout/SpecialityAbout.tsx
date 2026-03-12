// import React from 'react';
// import Image from 'next/image';

// const SpecialityAbout = () => {
//     return (
//         <div className='w-full h-auto flex flex-col items-center justify-center gap-10 py-16'>
//             <div className='md:w-10/12 w-11/12 h-auto flex flex-col gap-4'>
//                 <div className='text-center md:text-4xl sm:text-3xl text-xl font-bold'>Why to Choose Us?</div>
//                 <div className='text-base md:text-lg md:text-center text-justify'>
//                     Our training programs are designed to meet the demands of the modern tech industry. We collaborate with industry experts to ensure our courses cover the latest tools, technologies, and methodologies. All instructors are seasoned professionals with years of experience in the IT field. They bring real-world insights and hands-on expertise to every session, providing practical knowledge alongside theoretical learning. We prioritize practical experience through live projects, case studies, and interactive labs, ensuring our students gain the confidence to solve real-world challenges. We maintain small class sizes and provide one-on-one mentorship to ensure every student receives individual attention and tailored guidance. Our partnerships with leading IT companies give our students access to internships, job placement assistance, and networking opportunities.
//                 </div>
//             </div>

//             <div className='md:w-10/12 w-11/12 h-auto flex flex-col gap-4'>
//                 <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-4'>

//                     {speciality.map((service: any, index: any) => (
//                         <div key={index} className="w-full h-auto bg-white text-black flex flex-col gap-3 items-start p-5 cursor-pointer shadowBorder">
//                             <Image src={`/about/icons/${service.icon}`} alt='' width={30} height={30} className='w-20 h-auto' />
//                             <div className="text-lg font-semibold">{service.title}</div>
//                             <div className="text-base font-normal text-justify">{service.description}</div>
//                         </div>
//                     ))}

//                 </div>
//             </div>
//         </div>
//     )
// }

// export default SpecialityAbout

// const speciality = [
//     {
//         icon: "trainer.svg",
//         title: "IT Experts as Trainers",
//         description:
//             "Our trainers are industry leaders, skilled at simplifying complex concepts and empowering you with practical knowledge to excel in your IT career. As professional experts, they bring real-world experience and insights to help you achieve success.",
//     },
//     {
//         icon: "decks.svg",
//         title: "Fully Hands-on Training",
//         description:
//             "We believe the best way to learn is by doing. That’s why Our all courses are built around immersive, hands on sessions that mirror real challenges. From day one, you will gain practical experience and develop the skills employers demand.",
//     },
//     {
//         icon: "timing.svg",
//         title: "Flexible Timings",
//         description:
//             "We understand the importance of balancing learning with other commitments. we offer flexible scheduling options to ensure you can learn at a time that suits you bestw hether you are a student or a working professional.",
//     },
//     {
//          icon: "fees.svg",
//         title: "Affordable Fees",
//         description:
//             "We believe that quality education should be accessible to everyone. Our training programs are offered at budget friendly prices, ensuring you receive top instruction without straining your finances.",
//     },
//     {
//         icon: "lab.svg",
//         title: "Lab Assistance",
//         description:
//             "Our dedicated lab support ensures you never face technical challenges alone. Bring your laptop, and our team will assist you in setting up the necessary software and tools, so you can focus entirely on learning and building your skills.",
//     },
//     {
//         icon: "interview.svg",
//         title: "Interview Preparation",
//         description:
//             "Our courses include comprehensive interview preparation, featuring commonly asked questions, practical scenarios, and industry specific insights. Prepare yourself with the skills and confidence to stand out and secure your dream job.",
//     },
// ];

import React from 'react';
import Image from 'next/image';

// --- Define Fixed Colors for the Cards ---
// These colors match the pattern in the provided screenshot (image_86b2de.png)
const cardColors = [
    { main: 'bg-red-500', iconBg: 'bg-red-600'},      // IT Experts as Trainers (Red)
    { main: 'bg-yellow-500', iconBg: 'bg-yellow-600'}, // Fully Hands-on Training (Yellow)
    { main: 'bg-green-500', iconBg: 'bg-green-600' },    // Flexible Timings (Green)
    { main: 'bg-indigo-500', iconBg: 'bg-indigo-600' }, // Affordable Fees (Indigo/Purple)
    { main: 'bg-orange-500', iconBg: 'bg-orange-600' }, // Lab Assistance (Orange)
    { main: 'bg-purple-600', iconBg: 'bg-purple-700' }, // Interview Preparation (Violet/Purple)
];

// --- Card Component Redesigned to Match Screenshot ---
const SpecialityCard = ({ service, index }: { service: typeof speciality[0], index: number }) => {
    const colors = cardColors[index % cardColors.length]; // Cycle through colors

    return (
        <div
            key={index}
            className={`w-full relative flex flex-col bg-transparent items-center  cursor-pointer 
                        rounded-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02]`}
            style={{ 
                // Setting a fixed height for visual consistency, adjust as needed
                minHeight: '400px', 
            }}
        >
            {/* 1. Top Section (Text Content) */}
            <div className='mx-2 hadow-2xl  z-10'  >
            <div className='w-full s  px-6 pt-10 pb-16 text-center bg-[#D9D9D9] ' style={{ 
                    // This creates the rounded cut-out look at the top of the color block
                    borderTopLeftRadius: '5% 10px', 
                    borderTopRightRadius: '5% 10px',
                    
                    
                }}>
                <div className='text-lg font-bold text-gray-800 mb-2'>
                    {service.title}
                </div>
                <div className='text-sm text-justify pb-6 text-gray-600 text-center'>
                    {service.description}
                </div>
            </div>
            </div>
            {/* 2. Bottom Section (Colored Shape) */}
            <div 
                className={`w-full h-20 absolute bottom-0 ${colors.main} z-20`}
                style={{ 
                    // This creates the rounded cut-out look at the top of the color block
                    borderBottomLeftRadius: '20% 60px', 
                    borderBottomRightRadius: '20% 60px',
                    top: '70%', // Adjust this value to control the height of the color section
                    
                }}
            >
            </div>

            {/* 3. Icon Wrapper (Overlapping the two sections) */}
            <div 
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                            w-24 h-24 rounded-full flex items-center justify-center 
                            border-[6px] border-white shadow-lg z-20 ${colors.iconBg}`}
                style={{ top: '70%' }} // Adjust vertical position to sit in the middle
            >
                {/* Image/Icon */}
                {/* Note: In the screenshot, the icons are white/inverted for visibility */}
                <Image
                    src={`/about/icons/${service.icon}`}
                    alt={`${service.title} Icon`}
                    width={50}
                    height={50}
                    // Apply filter to make the icon white/light for the colored background
                    className="w-12 h-12 filter invert brightness-0" 
                />
            </div>
        </div>
    );
}

// --- Main Component ---
const SpecialityAbout = () => {
    return (
        <div className='w-full h-auto flex flex-col items-center justify-center gap-6 py-16 bg-[#f7f7f7]'>
            <div className='md:w-10/12 w-11/12 h-auto flex flex-col gap-4'>
                <div className='text-center md:text-4xl sm:text-3xl text-xl font-bold'>Why to Choose Us?</div>
                <div className='text-base md:text-sm md:text-center text-justify'>
                    Our training programs are designed to meet the demands of the modern tech industry. We collaborate with industry experts to ensure our courses cover the latest tools, technologies, and methodologies. All instructors are seasoned professionals with years of experience in the IT field. They bring real-world insights and hands-on expertise to every session, providing practical knowledge alongside theoretical learning. We prioritize practical experience through live projects, case studies, and interactive labs, ensuring our students gain the confidence to solve real-world challenges. We maintain small class sizes and provide one-on-one mentorship to ensure every student receives individual attention and tailored guidance. Our partnerships with leading IT companies give our students access to internships, job placement assistance, and networking opportunities.
                </div>
            </div>

            <div className='md:w-10/12 w-11/12 h-auto flex flex-col gap-4'>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2'>
                    {speciality.map((service, index) => (
                        <SpecialityCard key={index} service={service} index={index} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SpecialityAbout

// --- Data Array (Speciality) ---
const speciality = [
    { icon: "trainer.svg", title: "IT Experts as Trainers", description: "Our trainers are industry leaders, skilled at simplifying complex concepts and empowering you with practical knowledge to excel in your IT career. As professional experts, they bring real-world experience and insights to help you achieve success.", },
    { icon: "decks.svg", title: "Fully Hands-on Training & Lab Assistance", description: "We believe the best way to learn is by doing. That’s why Our all courses are built around immersive, hands on sessions that mirror real challenges. From day one, you will gain practical experience and develop the skills employers demand.", },
    { icon: "timing.svg", title: "Flexible Timings", description: "We understand the importance of balancing learning with other commitments. we offer flexible scheduling options to ensure you can learn at a time that suits you bestw hether you are a student or a working professional.", },
    { icon: "fees.svg", title: "24/7 Support", description: "We provide round-the-clock support to ensure your learning never stops. Whether you need guidance, clarification, or technical help, our friendly and experienced team is always available to assist you at any time, making sure you progress confidently.", },
    { icon: "lab.svg", title: "Interview Preparation", description: "Our courses include comprehensive interview preparation, featuring commonly asked questions, practical scenarios, and industry specific insights. Prepare yourself with the skills and confidence to stand out and secure your dream job.", },
    { icon: "interview.svg", title: "Job Assistance", description: "We provide dedicated job assistance to help you achieve your career goals. From resume building and interview preparation to connecting with top employers, our team ensures you are fully supported throughout your job search journey.", },
];