import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

const data = [
  { name: 'Jan', cases: 400, recovered: 350, active: 50 },
  { name: 'Feb', cases: 300, recovered: 270, active: 30 },
  { name: 'Mar', cases: 600, recovered: 550, active: 50 },
  { name: 'Apr', cases: 800, recovered: 720, active: 80 },
  { name: 'May', cases: 500, recovered: 470, active: 30 },
  { name: 'Jun', cases: 450, recovered: 400, active: 50 },
];

const StateSummary = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-md p-6"
    >
      <div className="flex items-center mb-6">
        <Activity className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">State-wide Trends</h2>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="cases" 
              stroke="#4F46E5" 
              strokeWidth={2}
              name="Total Cases"
            />
            <Line 
              type="monotone" 
              dataKey="recovered" 
              stroke="#10B981" 
              strokeWidth={2}
              name="Recovered"
            />
            <Line 
              type="monotone" 
              dataKey="active" 
              stroke="#EF4444" 
              strokeWidth={2}
              name="Active Cases"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default StateSummary;