import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaFacebook } from 'react-icons/fa';

const BannerContact = () => {
    return (
        <div className='w-full h-auto flex flex-col items-center justify-center py-10 gap-10 bg-black text-white'>
            <div className='md:w-10/12 w-11/12 h-auto flex md:flex-row flex-col md:gap-0 gap-10 items-center justify-between'>
                <div className='md:w-1/2 w-full flex flex-col gap-4 capitalize'>
                    <div className='lg:text-3xl md:text-2xl text-xl font-bold flex flex-col md:gap-2 gap-1'>
                        Stay Connected with Us!
                    </div>
                    <div>Follow our social media channels for the latest updates, events, and exclusive content. Don’t miss out—join our community today!</div>
                </div>
                <div className='md:w-1/2 w-full h-full flex flex-row flex-wrap items-center justify-center'>
                    <div className='w-auto h-auto grid grid-cols-4 gap-6 place-items-center'>
                        <Link href='https://www.facebook.com/profile.php?id=61573041693401' target="_blank" className='w-16 h-16 flex items-center justify-center bg-white rounded transition-all hover:transform hover:scale-110 duration-300 group'>
                            <Image src='/support/socials/facebook.svg' alt='Facebook' width={46} height={46} className='transition-all duration-300 group-hover:rotate-12' />
                        </Link>
                        <Link href='https://www.instagram.com/techprathamofficial/' target="_blank" className='w-16 h-16 flex items-center justify-center bg-white rounded transition-all hover:transform hover:scale-110 duration-300 group'>
                            <Image src='/support/socials/instagram.svg' alt='Instagram' width={46} height={46} className='transition-all duration-300 group-hover:rotate-12' />
                        </Link>
                        <Link href='https://www.linkedin.com/company/techpratham/' target="_blank" className='w-16 h-16 flex items-center justify-center bg-white rounded transition-all hover:transform hover:scale-110 duration-300 group'>
                            <Image src='/support/socials/linkedin.svg' alt='LinkedIn' width={46} height={46} className='transition-all duration-300 group-hover:rotate-12' />
                        </Link>
                        <Link href='https://share.google/53IFpTK4qCyDXY8y7' target="_blank" className='w-16 h-16 flex items-center justify-center bg-white rounded transition-all hover:transform hover:scale-110 duration-300 group'>
                            <Image src='/support/socials/google.svg' alt='Google' width={46} height={46} className='transition-all duration-300 group-hover:rotate-12' />
                        </Link>
                        <Link href='https://wa.me/+918882178896' target="_blank" className='w-16 h-16 flex items-center justify-center bg-white rounded transition-all hover:transform hover:scale-110 duration-300 group'>
                            <Image src='/support/socials/whatsapp.svg' alt='WhatsApp' width={46} height={46} className='transition-all duration-300 group-hover:rotate-12' />
                        </Link>
                        <div className='w-16 h-16 flex items-center justify-center bg-white rounded transition-all hover:transform hover:scale-110 duration-300 group'>
                            <Image src='/support/socials/pinterest.svg' alt='Pinterest' width={46} height={46} className='transition-all duration-300 group-hover:rotate-12' />
                        </div>
                        <Link href='https://www.youtube.com/@TechPratham_official' target="_blank" className='w-16 h-16 flex items-center justify-center bg-white rounded transition-all hover:transform hover:scale-110 duration-300 group'>
                            <Image src='/support/socials/youtube.svg' alt='YouTube' width={46} height={46} className='transition-all duration-300 group-hover:rotate-12' />
                        </Link>
                        <div className='w-16 h-16 flex items-center justify-center bg-white rounded transition-all hover:transform hover:scale-110 duration-300 group'>
                            <Image src='/support/socials/x.svg' alt='X (formerly Twitter)' width={46} height={46} className='transition-all duration-300 group-hover:rotate-12' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BannerContact