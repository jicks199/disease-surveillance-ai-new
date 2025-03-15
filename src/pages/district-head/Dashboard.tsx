import React from 'react';
import AdminTrends from '../../components/district-head/AdminTrends';

import { Activity, Users, AlertTriangle, Guitar as Hospital } from 'lucide-react';
import { OutbreakAlerts } from '../../components/district-head/OutbreakAlerts';

const StatCard = ({ icon: Icon, title, value, change, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <div className="flex items-center">
      <div className={`p-3 ${color} rounded-lg`}>
        <Icon className="h-6 w-6 text-indigo-600" />
      </div>
      <div className="ml-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? '+' : ''}{change}% from last month
        </p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">District Head Dashboard</h1>
        <div className="flex space-x-2">
          <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Activity}
          title="Total Cases"
          value="45,678"
          change={8}
          color="bg-indigo-50"
        />
        <StatCard
          icon={Users}
          title="Active Cases"
          value="1,234"
          change={12}
          color="bg-green-50"
        />
        <StatCard
          icon={AlertTriangle}
          title="Recovery Rate"
          value="23%"
          change={-5}
          color="bg-yellow-50"
        />
        <StatCard
          icon={Hospital}
          title="Mortality Rate"
          value="20%"
          change={3}
          color="bg-purple-50"
        />
      </div>

      <div className="">
       
          <AdminTrends />
       
       
      </div>
    </div>
  );
};

export default Dashboard;