
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import AdminSidebar from './AdminSidebar';
import AdminMobileNav from './AdminMobileNav';

const AdminLayout: React.FC = () => {
  const { isAuthenticated } = useData();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminMobileNav />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
