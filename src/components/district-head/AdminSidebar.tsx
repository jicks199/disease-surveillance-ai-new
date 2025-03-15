import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../State/slices/authSlice'; // Import logout action
import { 
  LayoutDashboard, 
  Bell, 
  FileText, 
  Settings,
  Users,
  Activity,
  Map,
  Brain,
  LogOut // Add logout icon from Lucide
} from 'lucide-react';

const AdminSidebar = ({ isOpen }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login'); // Redirect to login page after logout
  };

  const menuItems = [
    { path: '/district-head/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/district-head/alerts', icon: Bell, label: 'Manage Alerts' },
    { path: '/district-head/reports', icon: FileText, label: 'Reports' },
    { path: '/district-head/trends', icon: Activity, label: 'Disease Trends' },
    { path: '/district-head/map', icon: Map, label: 'Disease Map' },
    { path: '/district-head/prediction', icon: Brain, label: 'AI Predictions' },
    { path: '/district-head/users', icon: Users, label: 'User Management' },
    { path: '/district-head/settings', icon: Settings, label: 'Settings' }
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

export default AdminSidebar;
