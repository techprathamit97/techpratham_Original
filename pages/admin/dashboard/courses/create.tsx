import React, { useContext, useEffect } from 'react';
import CourseTab from '@/src/account/components/CourseTab';
import AdminSidebar from '@/src/account/common/AdminSidebar';
import AdminTopBar from '@/src/account/common/AdminTopBar';
import { UserContext } from '@/context/userContext';
import AdminLoader from '@/src/account/common/AdminLoader';
import SignOut from '@/src/account/common/SignOut';
import Head from 'next/head';

const CreateCourse = () => {
    const { authenticated, loading, isAdmin, currentTab, setCurrentTab } = useContext(UserContext);

    useEffect(() => {
        setCurrentTab("courses");
    }, [currentTab]);

    return (
        <React.Fragment>
            <Head>
                <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
                <title>Create Course | Admin Dashboard</title>
                <meta name="description" content="Create Course Section in Admin Dashboard of TechPratham." />
            </Head>

            {loading ? (
                <AdminLoader />
            ) : (!authenticated || !isAdmin) ? (
                <SignOut />
            ) : (
                <div className='w-full h-full md:h-screen min-h-screen flex flex-row items-start justify-start fixed'>

                    <AdminSidebar />

                    <div className='bg-[#000] flex flex-col w-full h-full md:relative fixed'>

                        <AdminTopBar />

                        <div className='w-full h-full p-6 overflow-auto'>
                            <CourseTab />
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    )
}

export default CreateCourse