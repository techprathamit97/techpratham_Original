'use client';

import React, { useContext, useEffect } from 'react';
import { UserContext } from '@/context/userContext';
import AdmissionHeader from '../components/AdmissionHeader/AdmissionHeader';
import AdmissionForm from '../components/AdmissionForm/AdmissionForm';
import ReachForm from '@/components/common/ReachForm/ReachForm';
import ToolTip from '@/components/common/ToolTip/ToolTip';

const AdmissionView = () => {
  const { setActiveTab } = useContext(UserContext);

  useEffect(() => {
    setActiveTab('admission');
  }, [setActiveTab]);

  return (
    <div className='w-full h-auto flex flex-col items-center justify-center'>

      <ReachForm />

      <ToolTip />

      <AdmissionHeader />

      <AdmissionForm />

    </div>
  )
}

export default AdmissionView;