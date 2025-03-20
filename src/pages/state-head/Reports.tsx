import React from "react";
import { useSelector } from "react-redux";
import SuperReports from "../../components/state-head/SuperReports"; // Adjust the import path as needed

const Reports = () => {
  const { email, role } = useSelector((state) => state.auth); // Assuming your Redux store has an 'auth' slice

  // Optional: Add a check to ensure email and role are available
  if (!email || !role) {
    return (
      <div className="space-y-6 p-6">
        <p className="text-red-600">Please log in to view reports.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <SuperReports email={email} role={role} />
    </div>
  );
};

export default Reports;
