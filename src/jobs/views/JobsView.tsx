'use client';

import React, { useContext, useEffect } from 'react';
import { UserContext } from '@/context/userContext';
import HeaderJobs from '../components/HeaderJobs/HeaderJobs';
import JobsSection from '../components/JobsSection/JobsSection';
import ReachForm from '@/components/common/ReachForm/ReachForm';
import ToolTip from '@/components/common/ToolTip/ToolTip';

const JobsView = () => {
  const { setActiveTab } = useContext(UserContext);

  useEffect(() => {
    setActiveTab('jobs');
  }, [setActiveTab]);

  return (
    <div className='w-full h-auto flex flex-col items-center justify-center'>

      <ReachForm />

      <ToolTip />

      <HeaderJobs />

      <JobsSection />

    </div>
  )
}

export default JobsView;