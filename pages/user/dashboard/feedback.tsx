import React, { useContext, useEffect } from 'react';
import { UserContext } from '@/context/userContext';
import { useSession } from 'next-auth/react';
import SignOut from '@/src/account/common/SignOut';
import UserLoader from '@/src/account/common/UserLoader';
import UserSidebar from '@/src/account/common/UserSidebar';
import UserTopBar from '@/src/account/common/UserTopBar';
import Head from 'next/head';

const feedback = () => {
    const { userData, loading, authenticated, setActiveUserTab } = useContext(UserContext);
    const { data: session, status: sessionStatus } = useSession();

    useEffect(() => {
        setActiveUserTab("feedback");
    }, [setActiveUserTab]);

    return (
        <React.Fragment>
            <Head>
                <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
                <title>Feedback | User Dashboard</title>
                <meta name="description" content="Explore the Feedback section in User Dashboard of TechPratham." />
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
                            <h2 className="text-xl font-semibold text-white mb-4">System Information || Feedback Page</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Authentication Status</label>
                                    <div className="bg-[#1a1d29] rounded-md p-3">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${authenticated
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {authenticated ? 'Authenticated' : 'Not Authenticated'}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Session Status</label>
                                    <div className="bg-[#1a1d29] rounded-md p-3">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sessionStatus === 'authenticated'
                                            ? 'bg-green-100 text-green-800'
                                            : sessionStatus === 'loading'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {sessionStatus || 'Unknown'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    )
}

export default feedback