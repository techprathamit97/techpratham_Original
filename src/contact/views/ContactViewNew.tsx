'use client';

import React, { useContext, useEffect, lazy, Suspense } from 'react';
import { UserContext } from '@/context/userContext';
import HeaderContact from '../components/HeaderContact/HeaderContact';
import ReachForm from '@/components/common/ReachForm/ReachForm';
import ToolTip from '@/components/common/ToolTip/ToolTip';

const ContactMethodsSection = lazy(() => import('../components/ContactMethodsSection/ContactMethodsSection'));
const AddressContactNew = lazy(() => import('../components/AddressContactNew/AddressContactNew'));
const BannerContactNew = lazy(() => import('../components/BannerContactNew/BannerContactNew'));
const EmailContact = lazy(() => import('../components/EmailContact/EmailContact'));
const MapSection = lazy(() => import('../components/MapSection/MapSection'));
const FAQSection = lazy(() => import('../components/FAQSection/FAQSection'));

const LoadingFallback = () => (
  <div className='w-full h-64 flex items-center justify-center'>
    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#C6151D]'></div>
  </div>
);

const ContactViewNew = () => {
  const { setActiveTab } = useContext(UserContext);

  useEffect(() => {
    setActiveTab('contact');
  }, [setActiveTab]);

  return (
    <div className='w-full h-auto flex flex-col items-center justify-center relative'>
      <ReachForm />
      <ToolTip />

      {/* Hero Section - Keep as is */}
      <HeaderContact />

      {/* Quick Contact Methods - New Interactive Section */}
      <Suspense fallback={<LoadingFallback />}>
        <ContactMethodsSection />
      </Suspense>

      {/* Office Locations & Contact Form - Redesigned with animations */}
      <Suspense fallback={<LoadingFallback />}>
        <AddressContactNew />
      </Suspense>

      {/* Social Media Banner - Enhanced with animations */}
      <Suspense fallback={<LoadingFallback />}>
        <BannerContactNew />
      </Suspense>

      {/* Email Contact Section - Keep existing design */}
      <Suspense fallback={<LoadingFallback />}>
        <EmailContact />
      </Suspense>

      {/* Interactive Map Section - New */}
      <Suspense fallback={<LoadingFallback />}>
        <MapSection />
      </Suspense>

      {/* FAQ Section - New */}
      <Suspense fallback={<LoadingFallback />}>
        <FAQSection />
      </Suspense>
    </div>
  );
};

export default ContactViewNew;
