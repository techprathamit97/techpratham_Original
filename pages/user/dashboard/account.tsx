import React, { useContext } from 'react';
import { useSession } from 'next-auth/react';
import { UserContext } from '@/context/userContext';
import SignOut from '@/src/account/common/SignOut';
import UserLoader from '@/src/account/common/UserLoader';
import UserSidebar from '@/src/account/common/UserSidebar';
import UserTopBar from '@/src/account/common/UserTopBar';
import Head from 'next/head';

const account = () => {
    const { userData, loading, authenticated } = useContext(UserContext);
    const { data: session, status: sessionStatus } = useSession();

    return (
        <React.Fragment>
            <Head>
                <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
                <title>Account | User Dashboard</title>
                <meta name="description" content="Explore the Account section in User Dashboard of TechPratham." />
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
                            <h2 className="text-xl font-semibold text-white mb-4">Account Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Account ID</label>
                                    <div className="bg-[#1a1d29] rounded-md p-3">
                                        <p className="text-purple-200 font-mono text-sm break-all">
                                            {userData._id || 'Not available'}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Session Email</label>
                                    <div className="bg-[#1a1d29] rounded-md p-3">
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
        </React.Fragment>
    )
}

export default account