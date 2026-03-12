"use client";
import React, { useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { UserContext } from '@/context/userContext';
import SignOut from '@/src/account/common/SignOut';
import UserLoader from '@/src/account/common/UserLoader';
import UserTopBar from '@/src/account/common/UserTopBar';
import UserSidebar from '@/src/account/common/UserSidebar';
import Head from 'next/head';

const UserAccount = () => {
    const { data: session, status: sessionStatus } = useSession();
    const { loading, authenticated, userData, activeUserTab, setActiveUserTab } = useContext(UserContext);

    useEffect(() => {
        setActiveUserTab("dashboard");
    }, [setActiveUserTab]);

    return (
        <React.Fragment>
            <Head>
                <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
                <title>Dashboard | User Dashboard</title>
                <meta name="description" content="Explore the User Dashboard of TechPratham." />
            </Head>

            {loading ? (
                <UserLoader />
            ) : !authenticated ? (
                <SignOut />
            ) : (
                <div className='w-full h-full md:h-screen min-h-screen flex flex-row items-start justify-start fixed'>

                    <UserSidebar />

                    <div className='bg-[#000] flex flex-col w-full h-full md:relative fixed'>

                        <UserTopBar />

                        <div className="w-full h-auto flex flex-col overflow-auto p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Dashboard</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Account ID</label>
                                    <div className="bg-[#1a1a1a] rounded-md px-3 py-2 h-10 flex items-center">
                                        <p className="text-purple-200 font-mono text-sm break-all">
                                            {userData._id || 'Not available'}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-normal text-gray-300 mb-2">Session Email</label>
                                    <div className="bg-[#1a1a1a] rounded-md px-3 py-2 h-10 flex items-center">
                                        <p className="text-purple-200">
                                            {session?.user?.email || 'Not available'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment >
    );
};

export default UserAccount;