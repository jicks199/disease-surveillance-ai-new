import React from 'react';
import { logout } from '../../State/slices/authSlice'; 
import { Link, useLocation, useNavigate } from 'react-router-dom';import { 
  LayoutDashboard, 
  Bell, 
  FileText, 
  Settings,
  Users,
  Activity,
  Map,
  Brain,
  LogOut
} from 'lucide-react';
import { useDispatch } from 'react-redux';

const SuperAdminSidebar = ({ isOpen }) => {
  const location = useLocation();
  const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
      dispatch(logout());
      navigate('/'); // Redirect to login page after logout
    };

  const menuItems = [
    { path: '/state-head/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/state-head/alerts', icon: Bell, label: 'Manage Alerts' },
    { path: '/state-head/reports', icon: FileText, label: 'Reports' },
    { path: '/state-head/trends', icon: Activity, label: 'Disease Trends' },
    { path: '/state-head/map', icon: Map, label: 'Disease Map' },
    { path: '/state-head/prediction', icon: Brain, label: 'AI Predictions' },
    { path: '/state-head/users', icon: Users, label: 'User Management' },
    { path: '/state-head/settings', icon: Settings, label: 'Settings' }
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
            {/* Logout Button */}
            <button
            onClick={handleLogout}
            className="flex items-center w-full space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default SuperAdminSidebar;