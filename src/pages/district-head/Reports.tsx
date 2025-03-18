import React from "react";
import { useSelector } from "react-redux";
import SuperReports from "../../components/district-head/Reports"; // Adjust the import path as needed

const Reports = () => {
  const { email, role , district } = useSelector((state) => state.auth); // Assuming your Redux store has an 'auth' slice

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
      <SuperReports email={email} role={role} district={district} />
    </div>
  );
};

export default Reports;
