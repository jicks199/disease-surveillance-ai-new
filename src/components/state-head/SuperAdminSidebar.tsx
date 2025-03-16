import React from "react";
 import { Link, useLocation, useNavigate } from "react-router-dom";
 import {
   LayoutDashboard,
   Bell,
   FileText,
  Settings,
  Users,
  Activity,
  Map,
  Brain,
  LogOut,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/new/authslice";

const SuperAdminSidebar = ({ isOpen }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
<<<<<<< HEAD

=======
 
>>>>>>> b9cf5450c51f0d1cc7f800f9d10960660d3810f5
  const handleLogout = () => {
    dispatch(logout());
    navigate("/state-head/login");
  };
<<<<<<< HEAD

=======
>>>>>>> b9cf5450c51f0d1cc7f800f9d10960660d3810f5
  const menuItems = [
    {
      path: "/state-head/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    { path: "/state-head/alerts", icon: Bell, label: "Manage Alerts" },
    { path: "/state-head/reports", icon: FileText, label: "Reports" },
    { path: "/state-head/trends", icon: Activity, label: "Disease Trends" },
    { path: "/state-head/map", icon: Map, label: "Disease Map" },
    { path: "/state-head/prediction", icon: Brain, label: "AI Predictions" },
    { path: "/state-head/users", icon: Users, label: "User Management" },
    { path: "/state-head/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <aside
<<<<<<< HEAD
      className={`bg-white shadow-lg h-[calc(100vh-4rem)] transition-transform ${
        isOpen ? "w-64" : "w-0"
      }`}
    >
      <div className={`p-4 ${isOpen ? "block" : "hidden"}`}>
=======
       className={`bg-white shadow-lg h-[calc(100vh-4rem)] transition-transform ${
         isOpen ? "w-64" : "w-0"
       }`}
     >
       <div className={`p-4 ${isOpen ? "block" : "hidden"}`}>
>>>>>>> b9cf5450c51f0d1cc7f800f9d10960660d3810f5
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
<<<<<<< HEAD

=======
            
>>>>>>> b9cf5450c51f0d1cc7f800f9d10960660d3810f5
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
<<<<<<< HEAD
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50"
=======
                  isActive 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-600 hover:bg-gray-50'
>>>>>>> b9cf5450c51f0d1cc7f800f9d10960660d3810f5
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
<<<<<<< HEAD
          {/* Logout Button */}
          <button
=======
            {/* Logout Button */}
            <button
>>>>>>> b9cf5450c51f0d1cc7f800f9d10960660d3810f5
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

<<<<<<< HEAD
export default SuperAdminSidebar;
=======
export default SuperAdminSidebar;
>>>>>>> b9cf5450c51f0d1cc7f800f9d10960660d3810f5
