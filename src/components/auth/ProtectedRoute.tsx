import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ element, allowedRoles, redirectPath }) => {
  const { isAuth, role } = useSelector((state) => state.auth);

    // If the user is not authenticated, redirect to the specified login page
    if (!isAuth) {
      return <Navigate to={redirectPath || "/"} replace />;
    }

  // If the user's role is not allowed, redirect them to their dashboard
  if (!allowedRoles.includes(role)) {
    return <Navigate to={`/${role}/dashboard`} replace />;
  }
    // If everything is okay, render the requested component
  return element;
};

export default ProtectedRoute;
