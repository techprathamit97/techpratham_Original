'use client';

import React, { useContext, useEffect } from 'react';
import { UserContext } from '@/context/userContext';
import TrainingHeader from '../components/TrainingHeader/TrainingHeader';
import TrainingIntro from '../components/TrainingIntro/TrainingIntro';
import TrainingPrograms from '../components/TrainingPrograms/TrainingPrograms';
import TrainingShowcase from '../components/TrainingShowcase/TrainingShowcase';
import TrainingPlan from '../components/TrainingPlan/TrainingPlan';
import TrainingAudience from '../components/TrainingAudience/TrainingAudience';
import TrainingFaqs from '../components/TrainingFaqs/TrainingFaqs';
import TrainingSection from '../components/TrainingSection/TrainingSection';
import ReachForm from '@/components/common/ReachForm/ReachForm';
import ToolTip from '@/components/common/ToolTip/ToolTip';

const TrainingView = () => {
  const { setActiveTab } = useContext(UserContext);

  useEffect(() => {
    setActiveTab('training');
  }, [setActiveTab]);

  return (
    <div className='w-full h-auto flex flex-col items-center justify-center'>
      <ReachForm />

      <ToolTip />

      <TrainingHeader />
<TrainingShowcase />
      <TrainingIntro />

      <TrainingPrograms />

      

      <TrainingPlan />

      <TrainingAudience />
<TrainingSection />
      <TrainingFaqs />

      
    </div>
  );
};

export default TrainingView;
