// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import AdminSidebar from '../components/admin/AdminSideBar';
import AdminDashboardContent from '../components/admin/AdminDashboardContent';
import ProductManagement from '../components/admin/ProductManagement';
import { Menu } from 'lucide-react';
import { useAdminStore } from '../store/useAdminStore';
import RecipeManagement from '../components/admin/RecipeManagement';
import Users from '../components/admin/Users';

const AdminDashboard = () => {
  const { authUser } = useAuthStore();
  const [activeSection, setActiveSection] = useState('dashboard');
  const { isSidebarOpen, closeSidebar } = useAdminStore();

  // Handle URL changes to update the active section
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const section = params.get('section');
    if (section) {
      setActiveSection(section);
    }
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboardContent setActiveSection={setActiveSection} />;
      case 'products':
        return <ProductManagement />;
      case 'recipe': // Corrected case to match the path from AdminDashboardContent
        return <RecipeManagement />;
      case 'users':
        return <Users />;
      default:
        return <AdminDashboardContent setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-base-300 rounded-none overflow-x-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-20 z-40 lg:hidden"
          onClick={closeSidebar}
          aria-label="Close sidebar"
        ></div>
      )}

      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isSidebarOpen={isSidebarOpen}
        closeSidebar={closeSidebar}
      />

      <div className="w-screen pt-10 flex-1 p-4 lg:p-8 rounded-none overflow-x-hidden">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4 lg:mb-8 mt-12 lg:mt-0 font-['inter']">
          Welcome, {authUser.username || authUser.email}!
        </h1>
        <div className="bg-base-200 p-4 lg:p-6 rounded-none shadow-xl">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
