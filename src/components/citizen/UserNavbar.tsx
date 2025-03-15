import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Bell, User } from 'lucide-react';

const UserNavbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/user/dashboard" className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">
                Gujarat Health Monitor
              </span>
            </Link>
          </div>
          
          <div className="flex items-center">
            <Link to="/user/alerts" className="p-2 text-gray-600 hover:text-blue-600">
              <Bell className="h-6 w-6" />
            </Link>
            <Link to="/user/profile" className="ml-4 p-2 text-gray-600 hover:text-blue-600">
              <User className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;