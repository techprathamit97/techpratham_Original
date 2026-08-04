'use client';

import React, { useContext, useEffect } from 'react';
import { UserContext } from '@/context/userContext';
import HeaderAbout from '../components/HeaderAbout/HeaderAbout';
import MissionAbout from '../components/MissionAbout/MissionAbout';

import TeamsAbout from '../../index/components/EducatorHome/EducatorHome';
import ReachForm from '@/components/common/ReachForm/ReachForm';


import ToolTip from '@/components/common/ToolTip/ToolTip';
import Alumini from '../components/Alumini';

const AboutView = () => {
  const { setActiveTab } = useContext(UserContext);

  useEffect(() => {
    setActiveTab('about');
  }, [setActiveTab]);

  return (
    <div className='w-full h-auto flex flex-col items-center justify-center'>

      <ReachForm />

      <ToolTip />

      <HeaderAbout />

      <MissionAbout />

      {/* <SpecialityAbout /> */}
      {/* <CardsParallax/> */}
      {/* <BannerAbout /> */}
     {/* <ThreeDBoll/> */}
      <TeamsAbout />
      <Alumini/>

    </div>
  )
}

export default AboutView;
