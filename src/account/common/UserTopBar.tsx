import React, { useContext } from 'react';
import { UserContext } from '@/context/userContext';

import { BellIcon, CaretDownIcon, Cross1Icon, GearIcon, HamburgerMenuIcon, QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';

const UserTopBar = () => {
    const { loading, refreshUserData, userSideBar, setUserSideBar, userData } = useContext(UserContext);

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

            <Button onClick={() => setUserSideBar(!userSideBar)} className='md:hidden flex bg-[#202123] rounded p-2 shadow-md hover:bg-[#3A3A3B] transition-all duration-200'>
                {userSideBar ? (
                    <Cross1Icon className='w-6 h-6' />
                ) : (
                    <HamburgerMenuIcon className='w-6 h-6' />
                )}
            </Button>
        </div>
    )
}

export default UserTopBar

{/* <div className="flex space-x-2">
                    <button
                        onClick={() => refreshUserData()}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                        disabled={loading}
                    >
                        {loading ? 'Refreshing...' : 'Refresh'}
                    </button>
                    <button
                        onClick={() => signOut()}
                        className="bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200 transition-colors"
                    >
                        Sign Out
                    </button>
                </div> */}