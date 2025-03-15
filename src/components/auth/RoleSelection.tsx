import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Stethoscope, Briefcase, Shield } from "lucide-react"; // Use Stethoscope for Hospital

const roles = [
  { name: "User", icon: User, path: "/citizen/" },
  { name: "Hospital", icon: Stethoscope, path: "/hospital/login" }, // Fixed Icon
  { name: "District Head", icon: Briefcase, path: "/district-head/login" },
  { name: "State Head", icon: Shield, path: "/state-head/login" },
];

const RoleSelection = () => {
  const navigate = useNavigate();
  // useEffect(() => {
  //   localStorage.removeItem("role");
  //   sessionStorage.removeItem("role");
  // }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Select Your Role</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {roles.map(({ name, icon: Icon, path }) => (
          <button
            key={name}
            onClick={() => navigate(path)}
            className="flex items-center space-x-3 bg-white shadow-md p-6 rounded-lg hover:bg-gray-50 transition w-64"
          >
            <Icon className="h-8 w-8 text-blue-600" />
            <span className="text-lg font-semibold">{name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoleSelection;
