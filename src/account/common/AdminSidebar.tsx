import React, { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArchiveIcon, AvatarIcon, DashboardIcon, ExitIcon, LaptopIcon, LightningBoltIcon } from '@radix-ui/react-icons';
import { signOut } from 'next-auth/react';
import { UserContext } from '@/context/userContext';
import { BellIcon, CircleCheckBigIcon } from 'lucide-react';
import { TbArticle } from 'react-icons/tb';

const AdminSidebar = () => {
    const { currentTab, adminSideBar } = useContext(UserContext);

    return (
        <div className={`fixed md:relative bg-[#1a1a1a] h-full min-w-72 max-w-80 flex flex-col items-center justify-start py-4 px-8 ${adminSideBar ? 'left-0' : 'md:left-0 -left-76'} z-50`}>

            <div className='w-auto flex flex-row gap-4 items-center justify-start'>
                <Link href='/' className='cursor-pointer'>
                    <Image src='/navbar/techpratham.svg' alt='logo saa' width={200} height={80} className='md:w-40' />
                </Link>
            </div>

            <div className='mt-12 flex overflow-y-scroll flex-col w-full h-full items-start justify-between'>

                <div className='w-full h-full flex-1 flex flex-col gap-2'>

                    <Link href='/admin/dashboard/profile' className={`text-[#606060] flex flex-row gap-3 items-center rounded-tr rounded-br justify-start text-lg py-1 px-3 cursor-pointer transition-all duration-200 ${currentTab === 'profile' && 'bg-[#600A0E] hover:bg-[#C6151D] text-white border-l-2 border-l-[#c1c1c1]'}`}>
                        <AvatarIcon className='w-6 h-6' />
                        <div>Profile</div>
                    </Link>

                    <Link href='/admin/dashboard' className={`text-[#606060] flex flex-row gap-3 items-center rounded-tr rounded-br justify-start text-lg py-1 px-3 cursor-pointer transition-all duration-200 ${currentTab === 'dashboard' && 'bg-[#600A0E] hover:bg-[#C6151D] text-white border-l-2 border-l-[#c1c1c1]'}`}>
                        <DashboardIcon className='w-6 h-6' />
                        <div>Dashboard</div>
                    </Link>

                    <Link href='/admin/dashboard/courses' className={`text-[#606060] flex flex-row gap-3 items-center rounded-tr rounded-br justify-start text-lg py-1 px-3 cursor-pointer transition-all duration-200 ${currentTab === 'courses' && 'bg-[#600A0E] hover:bg-[#C6151D] text-white border-l-2 border-l-[#c1c1c1]'}`}>
                        <LaptopIcon className='w-6 h-6' />
                        <div>Courses</div>
                    </Link>
                    <Link href='/admin/dashboard/lms' className={`text-[#606060] flex flex-row gap-3 items-center rounded-tr rounded-br justify-start text-lg py-1 px-3 cursor-pointer transition-all duration-200 ${currentTab === 'lms' && 'bg-[#600A0E] hover:bg-[#C6151D] text-white border-l-2 border-l-[#c1c1c1]'}`}>
                        <ArchiveIcon className='w-6 h-6' />
                        <div>LMS Content</div>
                    </Link>
                    <Link href='/admin/dashboard/category' className={`text-[#606060] flex flex-row gap-3 items-center rounded-tr rounded-br justify-start text-lg py-1 px-3 cursor-pointer transition-all duration-200 ${currentTab === 'category' && 'bg-[#600A0E] hover:bg-[#C6151D] text-white border-l-2 border-l-[#c1c1c1]'}`}>
                        <LightningBoltIcon className='w-6 h-6' />
                        <div>Category</div>
                    </Link>

                    <Link href='/admin/dashboard/requests' className={`text-[#606060] flex flex-row gap-3 items-center rounded-tr rounded-br justify-start text-lg py-1 px-3 cursor-pointer transition-all duration-200 ${currentTab === 'requests' && 'bg-[#600A0E] hover:bg-[#C6151D] text-white border-l-2 border-l-[#c1c1c1]'}`}>
                        <BellIcon className='w-6 h-6' />
                        <div>Requests</div>
                    </Link>

                    <Link href='/admin/dashboard/enrolled' className={`text-[#606060] flex flex-row gap-3 items-center rounded-tr rounded-br justify-start text-lg py-1 px-3 cursor-pointer transition-all duration-200 ${currentTab === 'enrolled' && 'bg-[#600A0E] hover:bg-[#C6151D] text-white border-l-2 border-l-[#c1c1c1]'}`}>
                        <ArchiveIcon className='w-6 h-6' />
                        <div>Enrolled</div>
                    </Link>
                    <Link href='/admin/dashboard/lead' className={`text-[#606060] flex flex-row gap-3 items-center rounded-tr rounded-br justify-start text-lg py-1 px-3 cursor-pointer transition-all duration-200 ${currentTab === 'enrolled' && 'bg-[#600A0E] hover:bg-[#C6151D] text-white border-l-2 border-l-[#c1c1c1]'}`}>
                        <ArchiveIcon className='w-6 h-6' />
                        <div>Lead</div>
                    </Link>

                    <Link href='/admin/dashboard/completed' className={`text-[#606060] flex flex-row gap-3 items-center rounded-tr rounded-br justify-start text-lg py-1 px-3 cursor-pointer transition-all duration-200 ${currentTab === 'completed' && 'bg-[#600A0E] hover:bg-[#C6151D] text-white border-l-2 border-l-[#c1c1c1]'}`}>
                        <CircleCheckBigIcon className='w-6 h-6' />
                        <div>Completed</div>
                    </Link>

                    <Link href='/admin/dashboard/account' className={`text-[#606060] flex flex-row gap-3 items-center rounded-tr rounded-br justify-start text-lg py-1 px-3 cursor-pointer transition-all duration-200 ${currentTab === 'account' && 'bg-[#600A0E] hover:bg-[#C6151D] text-white border-l-2 border-l-[#c1c1c1]'}`}>
                        <AvatarIcon className='w-6 h-6' />
                        <div>Account</div>
                    </Link>

                    <Link href='/admin/dashboard/articles' className={`text-[#606060] flex flex-row gap-3 items-center rounded-tr rounded-br justify-start text-lg py-1 px-3 cursor-pointer transition-all duration-200 ${currentTab === 'articles' && 'bg-[#600A0E] hover:bg-[#C6151D] text-white border-l-2 border-l-[#c1c1c1]'}`}>
                        <TbArticle className='w-6 h-6' />
                        <div>Articles</div>
                    </Link>
                    <Link href='/admin/dashboard/event' className={`text-[#606060] flex flex-row gap-3 items-center rounded-tr rounded-br justify-start text-lg py-1 px-3 cursor-pointer transition-all duration-200 ${currentTab === 'articles' && 'bg-[#600A0E] hover:bg-[#C6151D] text-white border-l-2 border-l-[#c1c1c1]'}`}>
                        <TbArticle className='w-6 h-6' />
                        <div>Event</div>
                    </Link>
                </div>
            </div>

            <div className={`text-[#606060] w-full border-t border-white flex flex-row gap-3 items-center justify-start text-lg py-1 px-3 cursor-pointer transition-all duration-200 hover:bg-[#373738] hover:text-white`} onClick={() => signOut()}>
                <ExitIcon className='w-6 h-6' />
                <div>Logout</div>
            </div>

        </div >
    )
}

export default AdminSidebar