import React, { useContext, useEffect } from 'react';
import { UserContext } from '@/context/userContext';
import SignOut from '@/src/account/common/SignOut';
import AdminLoader from '@/src/account/common/AdminLoader';
import AdminSidebar from '@/src/account/common/AdminSidebar';
import AdminTopBar from '@/src/account/common/AdminTopBar';
import { Badge } from '@/components/ui/badge';
import Head from 'next/head';

const profile = () => {
  const { userData, loading, authenticated, isAdmin, currentTab, setCurrentTab } = useContext(UserContext);

  useEffect(() => {
    setCurrentTab("profile");
  }, [currentTab]);

  return (
    <React.Fragment>
      <Head>
        <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
        <title>Profile | Admin Dashboard</title>
        <meta name="description" content="Explore the Profile section in Admin Dashboard of TechPratham." />
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
              <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <div className="bg-[#1a1a1a] rounded-md px-3 py-2">
                    <p className="text-white">{userData.name || 'Not provided'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Id</label>
                  <div className="bg-[#1a1a1a] rounded-md px-3 py-2">
                    <p className="text-white">{userData.email || 'Not provided'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                  <div className="bg-[#1a1a1a] rounded-md px-3 py-2">
                    <p className="text-white">{userData.phone || 'Not provided'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
                  <div className="bg-[#1a1a1a] rounded-md px-3 py-2">
                    <p className="text-white">{userData.position || 'Not specified'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">User Type</label>
                  <div className="bg-[#1a1a1a] rounded-md px-3 py-2">
                    <Badge variant='secondary'>
                      {userData.userType || 'user'}
                    </Badge>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Profile Description</label>
                  <div className="bg-[#1a1a1a] rounded-md p-3 min-h-[100px]">
                    <p className="text-white">{userData.profile || 'No profile description provided'}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </React.Fragment >
  )
}

export default profile