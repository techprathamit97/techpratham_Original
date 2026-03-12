'use client';

import React, { useContext, useEffect } from 'react';
import { UserContext } from '@/context/userContext';
import HeaderContact from '../components/HeaderContact/HeaderContact';
import AddressContact from '../components/AddressContact/AddressContact';
import BannerContact from '../components/BannerContact/BannerContact';
import EmailContact from '../components/EmailContact/EmailContact';
import ReachForm from '@/components/common/ReachForm/ReachForm';
import ToolTip from '@/components/common/ToolTip/ToolTip';

const ContactView = () => {
  const { setActiveTab } = useContext(UserContext);

  useEffect(() => {
    setActiveTab('contact');
  }, [setActiveTab]);

  return (
    <div className='w-full h-auto flex flex-col items-center justify-center relative'>

      <ReachForm />

      <ToolTip />

      <HeaderContact />

      <AddressContact />

      <BannerContact />

      <EmailContact />

    </div>
  )
}

export default ContactView;