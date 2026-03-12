import React, { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AvatarIcon, DashboardIcon, EnvelopeClosedIcon, ExitIcon, GearIcon, LaptopIcon } from '@radix-ui/react-icons';
import { signOut } from 'next-auth/react';
import { CircleCheckBig } from 'lucide-react';
import { UserContext } from '@/context/userContext';

const UserSidebar = () => {
    const { activeUserTab, userSideBar } = useContext(UserContext);

    return (
        <div className={`fixed md:relative bg-[#1a1a1a] h-full min-w-72 max-w-80 flex flex-col items-center justify-start py-4 px-8 ${userSideBar ? 'left-0' : 'md:left-0 -left-76'} z-50`}>

            <div className='w-auto flex flex-row gap-4 items-center justify-start'>
                <Link href='/' className='cursor-pointer'>
                    <Image src='/navbar/techpratham.svg' alt='logo saa' width={200} height={80} className='md:w-40' />
                </Link>
            </div>

            <div className='mt-12 flex flex-col w-full h-full items-start justify-between'>

                <div className='w-full h-full flex-1 flex flex-col gap-2'>

                    <Link href='/user/dashboard' className={`text-[#606060] flex flex-row gap-3 items-center rounded-tr rounded-br justify-start text-lg py-1 px-3 cursor-pointer transition-all duration-200 ${activeUserTab === 'dashboard' && 'bg-[#600A0E] hover:bg-[#C6151D] text-white border-l-2 border-l-[#c1c1c1]'}`}>
                        <DashboardIcon className='w-6 h-6' />
                        <div>Dashboard</div>
                    </Link>

                    <Link href='/user/dashboard/profile' className={`text-[#606060] flex flex-row gap-3 items-center rounded-tr rounded-br justify-start text-lg py-1 px-3 cursor-pointer transition-all duration-200 ${activeUserTab === 'profile' && 'bg-[#600A0E] hover:bg-[#C6151D] text-white border-l-2 border-l-[#c1c1c1]'}`}>
                        <AvatarIcon className='w-6 h-6' />
                        <div>Profile</div>
                    </Link>

                    <Link href='/user/dashboard/courses' className={`text-[#606060] flex flex-row gap-3 items-center rounded-tr rounded-br justify-start text-lg py-1 px-3 cursor-pointer transition-all duration-200 ${activeUserTab === 'course' && 'bg-[#600A0E] hover:bg-[#C6151D] text-white border-l-2 border-l-[#c1c1c1]'}`}>
                        <LaptopIcon className='w-6 h-6' />
                        <div>Courses</div>
                    </Link>

                    <Link href='/user/dashboard/courses/completed' className={`text-[#606060] flex flex-row gap-3 items-center rounded-tr rounded-br justify-start text-lg py-1 px-3 cursor-pointer transition-all duration-200 ${activeUserTab === 'completed' && 'bg-[#600A0E] hover:bg-[#C6151D] text-white border-l-2 border-l-[#c1c1c1]'}`}>
                        <CircleCheckBig className='w-6 h-6' />
                        <div>Completed</div>
                    </Link>

                    <Link href='/user/dashboard/feedback' className={`text-[#606060] flex flex-row gap-3 items-center rounded-tr rounded-br justify-start text-lg py-1 px-3 cursor-pointer transition-all duration-200 ${activeUserTab === 'feedback' && 'bg-[#600A0E] hover:bg-[#C6151D] text-white border-l-2 border-l-[#c1c1c1]'}`}>
                        <EnvelopeClosedIcon className='w-6 h-auto' />
                        <span>Feedback</span>
                    </Link>
                </div>
            </div>

            <div className={`text-[#606060] w-full border-t border-white flex flex-row gap-3 items-center justify-start text-lg py-1 px-3 cursor-pointer transition-all duration-200 hover:bg-[#373738] hover:text-white`} onClick={() => signOut()}>
                <ExitIcon className='w-6 h-6' />
                <div>Logout</div>
            </div>

        </div>
    )
}

export default UserSidebar