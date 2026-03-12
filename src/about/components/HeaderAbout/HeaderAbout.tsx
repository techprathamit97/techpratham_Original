
import React from 'react';
import Image from 'next/image';
import Head from './head'
const HeaderAbout = () => {
    // 1. Define the necessary Keyframes as constants
    // These need to be injected via the 'style' prop where needed.
    const keyframes = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
             @keyframes slideFromBottom {
        from { 
            opacity: 0; 
            transform: translateY(60px); 
        }
        to { 
            opacity: 1; 
            transform: translateY(0); 
        }
    }
    `;

    return (
        <div className="w-full h-auto flex flex-col items-center justify-center">

            {/* Inject keyframes into the top level of the component's style context */}
            <style dangerouslySetInnerHTML={{ __html: keyframes }} />


<Head/>

{/* banner end--------------------------------------------------------------------------------------------------- */}
            {/* Content Section */}
            <div className="max-w-6xl grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10 text-base md:py-16 py-10">
                <div className="w-full flex justify-center">
                    <Image
                        src="/about/teams/teams.jpeg"
                        alt="Mission Image"
                        width={600}
                        height={300}
                        className="md:w-auto w-full md:h-96 h-auto rounded-md shadow-md object-cover"
                        // Apply scale-in animation using the 'style' prop
                        style={{
                            opacity: 0,
                            animation: 'scaleIn 0.7s ease-out 0.5s forwards' // Keyframe animation
                        }}
                    />
                </div>


                <div className="md:col-span-2 p-2 col-span-1 leading-relaxed space-y-4">
                    <h1 className="text-2xl md:text-3xl font-bold gap-1 mb-4"
                        // Apply slide-up animation to heading
                        style={{
                            opacity: 0,
                            animation: 'slideUp 0.8s ease-out 0.7s forwards' // Keyframe animation
                        }}
                    >
                        Get to Know TechPratham...
                    </h1>

                    <p className='text-justify'
                        style={{
                            opacity: 0,
                            animation: 'slideUp 0.8s ease-out 0.9s forwards'
                        }}
                    >
                       
                        At <strong>Tech Pratham</strong>, The Founders brings a collective experience of <strong> 35 years</strong> in the IT industry. As esteemed alumni of top institutions, their deep industry expertise and forward-thinking vision drive our programs. As they have worked with leading MNCs, gaining invaluable insights into industry demands and future trends.
                    </p>

                    <p className='text-justify'
                        style={{
                            opacity: 0,
                            animation: 'slideUp 0.8s ease-out 1.1s forwards'
                        }}
                    >
                        We believe that learning is the key to success in today’s automation era. We are dedicated to empowering individuals and organizations through industry-relevant training, advanced technology education, and hands-on skill development.
                    </p>

                    <p className='text-justify'
                        style={{
                            opacity: 0,
                            animation: 'slideUp 0.8s ease-out 1.3s forwards'
                        }}
                    >
                       We go beyond technical training to nurture innovation, adaptability, and a strong growth mindset. From emerging technologies to professional excellence, our programs are designed to turn potential into performance and ambition into achievement.
                    </p>
                    <p className='text-justify'
                        style={{
                            opacity: 0,
                            animation: 'slideUp 0.8s ease-out 1.3s forwards'
                        }}
                    >
                      At TechPratham, you learn — we make it happen.
We support you at every step of your journey, helping you build skills, shape your career, and create lasting success.
                    </p>
                </div>

            </div>

        </div>
    );
};

export default HeaderAbout;