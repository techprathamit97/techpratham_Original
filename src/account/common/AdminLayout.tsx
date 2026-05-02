import React, { useContext } from 'react';
import { UserContext } from '@/context/userContext';
import AdminSidebar from './AdminSidebar';
import AdminTopBar from './AdminTopBar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { adminSideBar } = useContext(UserContext);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        <AdminSidebar />
        <div className={`flex-1 transition-all duration-300 ${adminSideBar ? 'ml-0' : 'ml-0 md:ml-72'}`}>
          <AdminTopBar />
          <main className="min-h-screen">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;