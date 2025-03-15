import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const userRole = localStorage.getItem("role"); // Assuming role is stored in localStorage

  if (!userRole) {
    return <Navigate to="/" replace />; // Redirect to role selection if no role is found
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={`/${userRole}/dashboard`} replace />; // Redirect unauthorized users
  }

  return element;
};

export default ProtectedRoute;
