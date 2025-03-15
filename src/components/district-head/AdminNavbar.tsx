import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Bell, Settings, User } from 'lucide-react';

const AdminNavbar = () => {
  return (
    <nav className="bg-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/admin/dashboard" className="flex items-center">
              <Activity className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-bold text-white">
                Gujarat Health Monitor - Admin
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/admin/alerts" className="p-2 text-white hover:text-indigo-200">
              <Bell className="h-6 w-6" />
            </Link>
            <Link to="/admin/settings" className="p-2 text-white hover:text-indigo-200">
              <Settings className="h-6 w-6" />
            </Link>
            <Link to="/admin/profile" className="p-2 text-white hover:text-indigo-200">
              <User className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;