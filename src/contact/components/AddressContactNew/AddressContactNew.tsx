'use client';

import React from 'react';
import { Separator } from '@/components/ui/separator';
import FormContact from '../FormContact/FormContact';
import Image from 'next/image';
import Link from 'next/link';
import { PinTopIcon } from '@radix-ui/react-icons';

const AddressContactNew = () => {
    const offices = [
        {
            title: "Registered Office",
            address: "G-31, 1st Floor Sector-3, Noida 201301",
            phones: [
                { country: "India", flag: "/course/icons/indian.jpg", number: "+91-8882178896" },
                { country: "US", flag: "/course/icons/uslogo.png", number: "+1 (343) 477-0926" }
            ],
            email: "info@techpratham.com",
            gradient: "from-red-500 via-orange-500 to-yellow-500"
        },
        {
            title: "Noida Office",
            address: "C-2, Sector-1, Noida, Uttar Pradesh - 201301",
            phones: [
                { country: "India", flag: "/course/icons/indian.jpg", number: "+91-8882178896" }
            ],
            email: "info@techpratham.com",
            gradient: "from-blue-500 via-purple-500 to-pink-500"
        },
        {
            title: "Hyderabad Office",
            address: "LVS Arcade, 71, Hitech, 6th floor, Madhapur Road, Jubilee Enclave, HITEC City, Hyderabad",
            phones: [
                { country: "India", flag: "/course/icons/indian.jpg", number: "+91-8882178896" },
                { country: "US", flag: "/course/icons/uslogo.png", number: "+1 (343) 477-0926" }
            ],
            email: "info@techpratham.com",
            gradient: "from-green-500 via-teal-500 to-cyan-500"
        }
    ];

    return (
        <div className='md:w-10/12 w-11/12  h-auto grid md:grid-cols-2 grid-cols-1 gap-10 place-content-center'>
            <div className='col-span-1 w-full h-auto flex flex-col gap-5 py-16 z-10 text-left'>
                <div className="w-full h-auto flex flex-col items-start justify-center mb-4">

                    <div className="text-3xl font-bold text-[#7f1d1d] mb-2">
                        Our Office Addresses
                    </div>

                    <svg
                        width="290"
                        height="6"
                        viewBox="0 0 340 6"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0 3 Q170 0 340 3 Q170 6 0 3 Z"
                            fill="#7f1d1d"
                        />
                    </svg>

                    <div className="text-lg text-gray-600 mt-2">
                        Visit us at any of our offices
                    </div>

                </div>

                {offices.map((office, index) => (
                    <div
                        key={index}
                        className='group relative overflow-hidden rounded-2xl bg-white border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 hover:-translate-y-1'
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${office.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                        <div className='relative p-6'>
                            <div className='flex items-start gap-3 mb-4'>
                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${office.gradient} flex items-center justify-center text-white transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg flex-shrink-0`}>
                                    <PinTopIcon className="w-6 h-6" />
                                </div>
                                <div className='flex-1'>
                                    <h3 className='text-xl font-bold text-gray-900 mb-1'>{office.title}</h3>
                                    <Separator className='bg-gradient-to-r from-[#C6151D] to-transparent h-[2px] w-20' />
                                </div>
                            </div>

                            <div className='flex flex-col gap-3 mb-4'>
                                <p className='font-semibold text-gray-800 leading-relaxed'>{office.address}</p>

                                <div className='flex flex-wrap gap-3 items-center'>
                                    {office.phones.map((phone, idx) => (
                                        <span key={idx} className='flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full group-hover:bg-white transition-colors duration-300'>
                                            <Image src={phone.flag} alt={phone.country} width={20} height={20} className='rounded-full' />
                                            <span className='text-sm font-medium text-gray-700'>{phone.number}</span>
                                        </span>
                                    ))}
                                </div>

                                <p className='text-gray-700'>{office.email}</p>
                            </div>

                            <div className='flex flex-wrap gap-3'>
                                <Link
                                    href='https://wa.me/+918882178896'
                                    className='flex items-center gap-2 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg transition-all duration-300 group/btn'
                                >
                                    <Image src='/support/whatsapp.png' alt='WhatsApp' width={24} height={24} className='group-hover/btn:scale-110 transition-transform duration-300' />
                                    <div className='flex flex-col text-xs'>
                                        <span className='font-semibold text-gray-900'>WhatsApp</span>
                                        <span className='text-gray-600'>Click to Chat</span>
                                    </div>
                                </Link>

                                <Link
                                    href='https://g.page/r/CX1XMlbVUiyaEBM/review'
                                    className='flex items-center gap-2 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-all duration-300 group/btn'
                                >
                                    <Image src='/support/google-maps.png' alt='Google Maps' width={24} height={24} className='group-hover/btn:scale-110 transition-transform duration-300' />
                                    <div className='flex flex-col text-xs'>
                                        <span className='font-semibold text-gray-900'>Check Live</span>
                                        <span className='text-gray-600'>Location Here</span>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${office.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
                    </div>
                ))}
            </div>

            <div className='col-span-1 md:pt-36 w-full h-auto  flex flex-col gap-5 items-center justify-center '>
                <FormContact />

                <div className='group mb-5 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#600A0E] to-[#C6151D] p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2'>
                    <div className='absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-500'></div>

                    <div className='relative flex flex-col items-center gap-4'>
                        <div className='bg-white p-3 rounded-xl shadow-lg transform group-hover:scale-105 group-hover:rotate-3 transition-all duration-500'>
                            <Image
                                src='/support/qr-contact.svg'
                                alt='Feedback QR Code'
                                width={200}
                                height={200}
                                className='w-56 h-56'
                            />
                        </div>
                        <div className='px-6 py-3 rounded-full bg-white text-black font-semibold shadow-lg text-center transform group-hover:scale-105 transition-all duration-500'>
                            Post Your Feedback
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddressContactNew;
