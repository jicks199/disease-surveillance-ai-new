import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bell, 
  Brain, 
  Info, 
  MessageSquare, 
  Newspaper
} from 'lucide-react';

const UserSidebar = ({isOpen}) => {
  const location = useLocation();

  const menuItems = [
    { path: '/citizen/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/citizen/alerts', icon: Bell, label: 'Alerts' },
    { path: '/citizen/prediction', icon: Brain, label: 'AI Prediction' },
    { path: '/citizen/news', icon: Newspaper, label: 'News' },
    { path: '/citizen/about', icon: Info, label: 'About' },
    { path: '/citizen/contact', icon: MessageSquare, label: 'Contact' },
  ];

  return (
    <aside className={`bg-white shadow-lg h-[calc(100vh-4rem)] transition-transform ${isOpen ? 'w-64' : 'w-0'}`}>
          <div className={`p-4 ${isOpen ? 'block' : 'hidden'}`}>
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-indigo-50 text-indigo-600' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>
  );
};

export default UserSidebar;