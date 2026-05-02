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
      
      console.log('=== ACCOUNT REDIRECT DEBUG ===');
      console.log('User role:', userRole);
      console.log('isAdmin:', isAdmin);
      console.log('isAccountant:', isAccountant);
      console.log('userData:', userData);
      console.log('==============================');
      
      if (userRole === 'admin') {
        console.log('Redirecting to admin dashboard');
        router.replace('/admin/dashboard');
      } else if (userRole === 'accountant') {
        console.log('Redirecting to accountant dashboard');
        router.replace('/accountant/dashboard');
      } else {
        console.log('Redirecting to user dashboard');
        router.replace('/user/dashboard');
      }
    } else if (!loading && !authenticated) {
      // If not authenticated, redirect to login
      console.log('Not authenticated, redirecting to login');
      router.replace('/auth/login');
    }
  }, [loading, authenticated, isAdmin, isAccountant, userData, router]);

  // Show loading while determining redirect
  return <AdminLoader />;
};

export default AccountRedirect;