import React, { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArchiveIcon, AvatarIcon, DashboardIcon, ExitIcon, LaptopIcon, LightningBoltIcon } from '@radix-ui/react-icons';
import { signOut } from 'next-auth/react';
import { UserContext } from '@/context/userContext';
import { BellIcon, BookOpen, CircleCheckBigIcon, Users } from 'lucide-react';
import { TbArticle } from 'react-icons/tb';

const AccountantSidebar = () => {
    const { currentTab, adminSideBar } = useContext(UserContext);

    return (
        <div className={`fixed md:relative bg-[#1a1a1a] h-full min-w-72 max-w-80 flex flex-col items-center justify-start py-4 px-8 ${adminSideBar ? 'left-0' : 'md:left-0 -left-76'} z-50`}>

            <div className='w-auto flex flex-row gap-4 items-center justify-start'>
                  <Link href={'/'} aria-label='Techpratham'>
            <div className="relative w-36">
              <Image
                src={'/navbar/logotechnolyfirst2.svg'}
                alt='Techpratham Logo'
                width={80}
                height={30}
                className='w-full h-auto'
              />

              <span className="absolute bottom-2 pl-1 left-1/2 -translate-x-1/2 text-[7px] text-white">
                Technology First
              </span>
            </div>
          </Link>
            </div>

            <div className='mt-12 flex overflow-y-scroll flex-col w-full h-full items-start justify-between'>

                <div className='w-full h-full flex-1 flex flex-col gap-2'>

                    <Link href='/accountant/dashboard/profile' className={`text-[#606060] flex flex-row gap-3 items-center rounded-tr rounded-br justify-start text-lg py-1 px-3 cursor-pointer transition-all duration-200 ${currentTab === 'profile' && 'bg-[#600A0E] hover:bg-[#C6151D] text-white border-l-2 border-l-[#c1c1c1]'}`}>
                        <AvatarIcon className='w-6 h-6' />
                        <div>Profile</div>
                    </Link>

                    <Link href='/lms/quizzes' className={`text-[#606060] flex flex-row gap-3 items-center rounded-tr rounded-br justify-start text-lg py-1 px-3 cursor-pointer transition-all duration-200 ${currentTab === 'quizzes' && 'bg-[#600A0E] hover:bg-[#C6151D] text-white border-l-2 border-l-[#c1c1c1]'}`}>
                        <BookOpen className='w-6 h-6' />
                        <div>Quizzes</div>
                    </Link>
                    <Link href='/accountant/dashboard/quiz-analytics' className={`text-[#606060] flex flex-row gap-3 items-center rounded-tr rounded-br justify-start text-lg py-1 px-3 cursor-pointer transition-all duration-200 ${currentTab === 'quiz-analytics' && 'bg-[#600A0E] hover:bg-[#C6151D] text-white border-l-2 border-l-[#c1c1c1]'}`}>
                        <TbArticle className='w-6 h-6' />
                        <div>Quiz Analytics</div>
                    </Link>
                    <Link href='/lms' className={`text-[#606060] flex flex-row gap-3 items-center rounded-tr rounded-br justify-start text-lg py-1 px-3 cursor-pointer transition-all duration-200 ${currentTab === 'lms-dashboard' && 'bg-[#600A0E] hover:bg-[#C6151D] text-white border-l-2 border-l-[#c1c1c1]'}`}>
                        <BellIcon className='w-6 h-6' />
                        <div>LMS Dashboard</div>
                    </Link>
                    <Link href='/accountant/dashboard/lms' className={`text-[#606060] flex flex-row gap-3 items-center rounded-tr rounded-br justify-start text-lg py-1 px-3 cursor-pointer transition-all duration-200 ${currentTab === 'lms' && 'bg-[#600A0E] hover:bg-[#C6151D] text-white border-l-2 border-l-[#c1c1c1]'}`}>
                        <ArchiveIcon className='w-6 h-6' />
                        <div>e-Book Content's</div>
                    </Link>
                    
                    {/* Leads - Only for Accountant */}
                    <Link href='/accountant/dashboard/leads' className={`text-[#606060] flex flex-row gap-3 items-center rounded-tr rounded-br justify-start text-lg py-1 px-3 cursor-pointer transition-all duration-200 ${currentTab === 'leads' && 'bg-[#600A0E] hover:bg-[#C6151D] text-white border-l-2 border-l-[#c1c1c1]'}`}>
                        <Users className='w-6 h-6' />
                        <div>Leads</div>
                    </Link>

                    <Link href='/accountant/dashboard/completed' className={`text-[#606060] flex flex-row gap-3 items-center rounded-tr rounded-br justify-start text-lg py-1 px-3 cursor-pointer transition-all duration-200 ${currentTab === 'completed' && 'bg-[#600A0E] hover:bg-[#C6151D] text-white border-l-2 border-l-[#c1c1c1]'}`}>
                        <CircleCheckBigIcon className='w-6 h-6' />
                        <div>Completed</div>
                    </Link>

                    {/* Invoices - Full permissions for Accountant */}
                    <Link href='/accountant/dashboard/invoices' className={`text-[#606060] flex flex-row gap-3 items-center rounded-tr rounded-br justify-start text-lg py-1 px-3 cursor-pointer transition-all duration-200 ${currentTab === 'invoices' && 'bg-[#600A0E] hover:bg-[#C6151D] text-white border-l-2 border-l-[#c1c1c1]'}`}>
                        <TbArticle className='w-6 h-6' />
                        <div>Invoices</div>
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

export default AccountantSidebar