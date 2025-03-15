import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const diseaseData = [
  { month: 'Jan', malaria: 65, dengue: 28, covid: 45 },
  { month: 'Feb', malaria: 59, dengue: 32, covid: 49 },
  { month: 'Mar', malaria: 80, dengue: 41, covid: 52 },
  { month: 'Apr', malaria: 81, dengue: 37, covid: 47 },
  { month: 'May', malaria: 56, dengue: 45, covid: 44 },
  { month: 'Jun', malaria: 55, dengue: 35, covid: 48 }
];

const Trends = () => {
  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Disease Trends Over Time</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={diseaseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="malaria" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="dengue" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="covid" stroke="#EF4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Disease Distribution</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={diseaseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="malaria" fill="#3B82F6" />
              <Bar dataKey="dengue" fill="#10B981" />
              <Bar dataKey="covid" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Trends;