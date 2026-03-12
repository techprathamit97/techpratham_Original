'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const BannerContactNew = () => {
    const socialLinks = [
        { name: 'Facebook', icon: '/support/socials/facebook.svg', url: 'https://www.facebook.com/profile.php?id=61573041693401', color: 'hover:bg-blue-50' },
        { name: 'Instagram', icon: '/support/socials/instagram.svg', url: 'https://www.instagram.com/techprathamofficial/', color: 'hover:bg-pink-50' },
        { name: 'LinkedIn', icon: '/support/socials/linkedin.svg', url: 'https://www.linkedin.com/company/techpratham/', color: 'hover:bg-blue-50' },
        { name: 'Google', icon: '/support/socials/google.svg', url: 'https://share.google/53IFpTK4qCyDXY8y7', color: 'hover:bg-red-50' },
        { name: 'WhatsApp', icon: '/support/socials/whatsapp.svg', url: 'https://wa.me/+918882178896', color: 'hover:bg-green-50' },
        { name: 'Pinterest', icon: '/support/socials/pinterest.svg', url: '#', color: 'hover:bg-red-50' },
        { name: 'YouTube', icon: '/support/socials/youtube.svg', url: 'https://www.youtube.com/@TechPratham_official', color: 'hover:bg-red-50' },
        { name: 'X', icon: '/support/socials/x.svg', url: '#', color: 'hover:bg-gray-50' }
    ];

    return (
        <div className='w-full h-auto flex flex-col items-center justify-center py-16 gap-10 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden'>
            <div className='absolute inset-0 bg-[url("/patterns/grid.svg")] opacity-5'></div>
            
            <div className='md:w-10/12 w-11/12 h-auto flex md:flex-row flex-col md:gap-0 gap-10 items-center justify-between relative z-10'>
                <div className='md:w-1/2 w-full flex flex-col gap-6'>
                    <div className='lg:text-4xl md:text-3xl text-2xl font-bold flex flex-col gap-2'>
                        <span className='bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent'>
                            Stay Connected
                        </span>
                        <span className='bg-gradient-to-r from-[#C6151D] to-[#ff6b6b] bg-clip-text text-transparent'>
                            with Us!
                        </span>
                    </div>
                    <p className='text-gray-300 text-lg leading-relaxed'>
                        Follow our social media channels for the latest updates, events, and exclusive content. 
                        Don't miss out—join our community today!
                    </p>
                    <div className='flex flex-wrap gap-3'>
                        <div className='px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/20'>
                            📢 Latest Updates
                        </div>
                        <div className='px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/20'>
                            🎓 Course Announcements
                        </div>
                        <div className='px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/20'>
                            🎉 Exclusive Content
                        </div>
                    </div>
                </div>

                <div className='md:w-1/2 w-full h-full flex flex-row flex-wrap items-center justify-center'>
                    <div className='w-auto h-auto grid grid-cols-4 gap-6 place-items-center'>
                        {socialLinks.map((social, index) => (
                            <Link
                                key={index}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`group relative w-16 h-16 flex items-center justify-center bg-white rounded-xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 ${social.color}`}
                                style={{
                                    animationDelay: `${index * 100}ms`
                                }}
                            >
                                <div className='absolute inset-0 bg-gradient-to-br from-[#C6151D] to-[#ff6b6b] rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500'></div>
                                <Image
                                    src={social.icon}
                                    alt={social.name}
                                    width={36}
                                    height={36}
                                    className='relative z-10 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110'
                                />
                                <div className='absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none'>
                                    {social.name}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className='absolute top-10 right-10 w-64 h-64 bg-[#C6151D] rounded-full blur-3xl opacity-10 animate-pulse'></div>
            <div className='absolute bottom-10 left-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-10 animate-pulse' style={{ animationDelay: '1s' }}></div>
        </div>
    );
};

export default BannerContactNew;
