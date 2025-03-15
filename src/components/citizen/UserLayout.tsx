import React from 'react';
import { Outlet } from 'react-router-dom';
import UserNavbar from './UserNavbar';
import UserSidebar from './UserSidebar';
import UserFooter from './UserFooter';
import AdminSidebar from '../district-head/AdminSidebar';
import { Menu } from 'lucide-react';

const UserLayout = ({ isSidebarOpen, toggleSidebar }) => {
  return (
     <div className="flex">
      <UserSidebar isOpen={isSidebarOpen} />
      <div className="flex-1">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <button onClick={toggleSidebar} className="text-gray-600 hover:text-gray-900">
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold">User Dashboard</h1>
        </header>
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;