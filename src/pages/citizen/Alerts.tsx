import React from 'react';
import Notifications from '../../components/citizen/Notifications';

const Alerts = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Health Alerts</h1>
        <div className="flex space-x-2">
          <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
            <option>All Alerts</option>
            <option>Emergency</option>
            <option>Warning</option>
            <option>Information</option>
          </select>
        </div>
      </div>
      
      <Notifications />
    </div>
  );
};

export default Alerts;