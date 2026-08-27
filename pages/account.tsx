import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '@/context/userContext';
import AdminLoader from '@/src/account/common/AdminLoader';

const AccountRedirect = () => {
  const router = useRouter();
  const { authenticated, loading, isAdmin, isAccountant, userData } = useContext(UserContext);

  useEffect(() => {
    if (!loading && authenticated) {
      // Role-based redirect logic
      const userRole = userData?.role?.type;
      
    
      
      if (userRole === 'admin') {
      
        router.replace('/admin/dashboard');
      } else if (userRole === 'accountant') {
  
        router.replace('/accountant/dashboard');
      } else {
       
        router.replace('/user/dashboard');
      }
    } else if (!loading && !authenticated) {
      // If not authenticated, redirect to login
     
      router.replace('/auth/login');
    }
  }, [loading, authenticated, isAdmin, isAccountant, userData, router]);

  // Show loading while determining redirect
  return <AdminLoader />;
};

export default AccountRedirect;