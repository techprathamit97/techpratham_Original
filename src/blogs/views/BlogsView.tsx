'use client';

import React, { useContext, useEffect } from 'react';
import { UserContext } from '@/context/userContext';
import BlogsHeader from '../components/BlogsHeader/BlogsHeader';
import BlogsSection from '../components/BlogsSection/BlogsSection';
import ReachForm from '@/components/common/ReachForm/ReachForm';
import ToolTip from '@/components/common/ToolTip/ToolTip';

const BlogsView = () => {
  const { setActiveTab } = useContext(UserContext);

  useEffect(() => {
    setActiveTab('blogs');
  }, [setActiveTab]);

  return (
    <div className='w-full h-auto flex flex-col items-center justify-center'>

      <ReachForm />

      <ToolTip />

      <BlogsHeader />

      <BlogsSection />

    </div>
  )
}

export default BlogsView;