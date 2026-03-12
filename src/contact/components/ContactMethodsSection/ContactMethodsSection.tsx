'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MobileIcon, EnvelopeClosedIcon, ChatBubbleIcon } from '@radix-ui/react-icons';

const ContactMethodsSection = () => {
    const contactMethods = [
        {
            icon: <MobileIcon className="w-8 h-8" />,
            title: "Call Us",
            description: "Speak with our team",
            action: "tel:+918882178896",
            label: "+91-8882178896",
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: <EnvelopeClosedIcon className="w-8 h-8" />,
            title: "Email Us",
            description: "Send us a message",
            action: "mailto:info@techpratham.com",
            label: "info@techpratham.com",
            color: "from-red-500 to-red-600"
        },
        {
            icon: <ChatBubbleIcon className="w-8 h-8" />,
            title: "WhatsApp",
            description: "Chat with us instantly",
            action: "https://wa.me/+918882178896",
            label: "Start Chat",
            color: "from-green-500 to-green-600",
            external: true
        }
    ];

    return (
        <div className='w-full bg-slate-100 h-auto flex flex-col items-center justify-center py-16 '>
            <div className='md:w-10/12 w-11/12 h-auto flex flex-col items-center justify-center gap-8'>
                <div className='text-center'>
                    <h2 className='text-3xl md:text-4xl font-bold text-[#7f1d1d]'>Get In Touch</h2>
                     <svg
          className="mx-auto"
          width="340"
          height="6"
          viewBox="0 0 340 6"
          preserveAspectRatio="none"
        >
          <path
            d="M0 3 Q170 0 340 3 Q170 6 0 3 Z"
            fill="#7f1d1d"
          />
        </svg>
                    <p className='text-gray-600 text-lg'>Choose your preferred way to connect with us</p>
                </div>

                <div className='w-full grid md:grid-cols-3 grid-cols-1 gap-6'>
                    {contactMethods.map((method, index) => (
                        <Link
                            key={index}
                            href={method.action}
                            target={method.external ? "_blank" : undefined}
                            className='group relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2'
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                            
                            <div className='relative z-10 flex flex-col items-center text-center gap-4'>
                                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${method.color} flex items-center justify-center text-white transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                                    {method.icon}
                                </div>
                                
                                <div>
                                    <h3 className='text-xl font-bold text-gray-900 mb-1'>{method.title}</h3>
                                    <p className='text-sm text-gray-600 mb-3'>{method.description}</p>
                                    <p className='text-base font-semibold text-[#C6151D] group-hover:underline'>{method.label}</p>
                                </div>
                            </div>

                            <div className='absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent group-hover:via-[#C6151D] transition-all duration-500'></div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ContactMethodsSection;
