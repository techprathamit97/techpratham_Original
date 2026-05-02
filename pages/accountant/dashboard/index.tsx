import React, { useContext, useEffect } from 'react';
import { UserContext } from '@/context/userContext';
import SignOut from '@/src/account/common/SignOut';
import AdminLoader from '@/src/account/common/AdminLoader';
import AccountantSidebar from '@/src/account/common/AccountantSidebar';
import AccountantTopBar from '@/src/account/common/AccountantTopBar';
import Head from 'next/head';

const AccountantDashboard = () => {
  const { authenticated, loading, isAccountant, setCurrentTab } = useContext(UserContext);

  useEffect(() => {
    if (authenticated) {
      setCurrentTab("dashboard");
    }
  }, [authenticated, setCurrentTab]);

  return (
    <React.Fragment>
      <Head>
        <title>Accountant Dashboard | TechPratham</title>
      </Head>

      {loading ? (
        <AdminLoader />
      ) : (!authenticated || !isAccountant) ? (
        <SignOut />
      ) : (
        <div className='w-full h-full md:h-screen min-h-screen flex flex-row items-start justify-start'>
          <AccountantSidebar />
          <div className='bg-[#000] flex flex-col w-full h-full overflow-hidden'>
            <AccountantTopBar />

            <div className="bg-black p-6 overflow-y-auto h-full flex-1">
              <div className='w-full h-auto flex flex-row items-start justify-between mb-8'>
                <h2 className="text-2xl font-bold text-white">Accountant Dashboard</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Dashboard Cards */}
                <div className="bg-zinc-900 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Invoice Management</h3>
                  <p className="text-zinc-400 text-sm mb-4">Manage invoices with full permissions</p>
                  <div className="text-2xl font-bold text-green-400">Full Access</div>
                </div>

                <div className="bg-zinc-900 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Lead Management</h3>
                  <p className="text-zinc-400 text-sm mb-4">Handle customer leads and inquiries</p>
                  <div className="text-2xl font-bold text-blue-400">Available</div>
                </div>

                <div className="bg-zinc-900 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Course Management</h3>
                  <p className="text-zinc-400 text-sm mb-4">Manage courses and enrollments</p>
                  <div className="text-2xl font-bold text-purple-400">Active</div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <a href="/accountant/dashboard/invoices" className="bg-red-900/20 border border-red-700 p-4 rounded-lg hover:bg-red-900/30 transition-colors">
                    <div className="text-red-400 font-semibold">Manage Invoices</div>
                    <div className="text-zinc-400 text-sm">Create, edit, delete invoices</div>
                  </a>
                  
                  <a href="/accountant/dashboard/leads" className="bg-blue-900/20 border border-blue-700 p-4 rounded-lg hover:bg-blue-900/30 transition-colors">
                    <div className="text-blue-400 font-semibold">Handle Leads</div>
                    <div className="text-zinc-400 text-sm">Manage customer inquiries</div>
                  </a>
                  
                  <a href="/accountant/dashboard/enrolled" className="bg-green-900/20 border border-green-700 p-4 rounded-lg hover:bg-green-900/30 transition-colors">
                    <div className="text-green-400 font-semibold">Enrollments</div>
                    <div className="text-zinc-400 text-sm">View enrolled students</div>
                  </a>
                  
                  <a href="/accountant/dashboard/courses" className="bg-purple-900/20 border border-purple-700 p-4 rounded-lg hover:bg-purple-900/30 transition-colors">
                    <div className="text-purple-400 font-semibold">Courses</div>
                    <div className="text-zinc-400 text-sm">Manage course content</div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default AccountantDashboard;