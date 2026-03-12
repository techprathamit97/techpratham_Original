import React, { useContext } from 'react';
import { UserContext } from '@/context/userContext'
import { BellIcon, CaretDownIcon, Cross1Icon, GearIcon, HamburgerMenuIcon, QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';

const AdminTopBar = () => {
    const { loading, refreshUserData, userData, adminSideBar, setAdminSideBar } = useContext(UserContext);

    return (
        <div className='bg-[#1a1a1a] text-white top-0 right-0 w-full py-2 md:px-8 px-6 shadow flex flex-row items-center justify-end'>

            <div className='flex md:flex-row flex-col gap-2 items-center justify-center'>

                <BellIcon className='md:flex hidden w-5 h-5 cursor-pointer' />

                <QuestionMarkCircledIcon className='md:flex hidden w-5 h-5 cursor-pointer' />

                <GearIcon className='md:flex hidden w-5 h-5 cursor-pointer' />

                <div className='flex flex-row ml-3 gap-2 items-center justify-center'>
                    <Avatar className='w-10 h-10 cursor-pointer'>
                        <AvatarImage src="/navbar/profile.jpg" />
                        <AvatarFallback className='text-black'>TB</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-row gap-1 items-center justify-center'>
                        <span className='font-normal'>{userData?.name}</span>
                        <CaretDownIcon className='w-6 h-6 cursor-pointer' />
                    </div>
                </div>

            </div>

            <Button onClick={() => setAdminSideBar(!adminSideBar)} className='md:hidden flex bg-[#202123] rounded p-2 shadow-md hover:bg-[#3A3A3B] transition-all duration-200'>
                {adminSideBar ? (
                    <Cross1Icon className='w-6 h-6' />
                ) : (
                    <HamburgerMenuIcon className='w-6 h-6' />
                )}
            </Button>
        </div>
    )
}

export default AdminTopBar