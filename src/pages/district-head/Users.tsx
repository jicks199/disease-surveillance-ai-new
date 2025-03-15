import React from 'react';
import UserManagement from '../../components/district-head/UserManagement';

const Users = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
      </div>
      
      <UserManagement />
    </div>
  );
};

export default Users;