"use client";
import React, { useContext, useEffect } from 'react';
import { UserContext } from '@/context/userContext';
import AdminLoader from '@/src/account/common/AdminLoader';
import SignOut from '@/src/account/common/SignOut';
import AdminSidebar from '@/src/account/common/AdminSidebar';
import AdminTopBar from '@/src/account/common/AdminTopBar';
import Head from 'next/head';

const AdminAccount = () => {
    const { loading, authenticated, userData, isAdmin, currentTab, setCurrentTab } = useContext(UserContext);

    useEffect(() => {
        setCurrentTab("dashboard");
    }, [currentTab]);

    return (
        <React.Fragment>
            <Head>
                <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
                <title>Dashboard | Admin Dashboard</title>
                <meta name="description" content="Explore the Admin Dashboard of TechPratham." />
            </Head>

            {loading ? (
                <AdminLoader />
            ) : (!authenticated || !isAdmin) ? (
                <SignOut />
            ) : (
                <div className='w-full h-full md:h-screen min-h-screen flex flex-row items-start justify-start fixed'>

                    <AdminSidebar />

                    <div className='bg-black flex flex-col w-full h-full md:relative fixed'>

                        <AdminTopBar />

                        <div className="bg-black p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Dashboard</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Account ID</label>
                                    <div className="bg-[#1a1a1a] rounded-md px-3 py-2">
                                        <p className="text-purple-200 font-mono text-sm break-all">
                                            {userData._id || 'Not available'}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Session Email</label>
                                    <div className="bg-[#1a1a1a] rounded-md px-3 py-2">
                                        <p className="text-purple-200">
                                            {userData?.email || 'Not available'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
        </React.Fragment >
    );
};

export default AdminAccount;