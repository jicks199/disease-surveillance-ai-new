import React from 'react';
import { FileText, Download, Share2, Printer } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const diseaseData = [
  { name: 'Malaria', cases: 450, recovered: 380, active: 70 },
  { name: 'Dengue', cases: 320, recovered: 280, active: 40 },
  { name: 'COVID-19', cases: 280, recovered: 240, active: 40 },
  { name: 'Chikungunya', cases: 150, recovered: 120, active: 30 }
];

const districtData = [
  { name: 'Ahmedabad', value: 35 },
  { name: 'Surat', value: 25 },
  { name: 'Vadodara', value: 20 },
  { name: 'Rajkot', value: 15 },
  { name: 'Others', value: 5 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const SuperReports = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">AI-Generated Health Reports</h2>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              <Download className="h-5 w-5 mr-2" />
              Export
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Share2 className="h-5 w-5 mr-2" />
              Share
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Printer className="h-5 w-5 mr-2" />
              Print
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Disease Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={diseaseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="active" fill="#EF4444" name="Active Cases" />
                  <Bar dataKey="recovered" fill="#10B981" name="Recovered" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">District-wise Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={districtData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {districtData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-4">
              <FileText className="h-6 w-6 text-indigo-600 mr-2" />
              <h3 className="text-lg font-medium">Monthly Health Summary</h3>
            </div>
            <p className="text-gray-600 mb-4">
              AI-generated analysis of health trends and patterns across Gujarat for the current month.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Cases Analyzed</span>
                <span className="font-medium">1,200</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Recovery Rate</span>
                <span className="font-medium text-green-600">85%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">High-Risk Areas</span>
                <span className="font-medium text-red-600">3 Districts</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-4">
              <FileText className="h-6 w-6 text-indigo-600 mr-2" />
              <h3 className="text-lg font-medium">Predictive Analysis</h3>
            </div>
            <p className="text-gray-600 mb-4">
              AI predictions for potential disease outbreaks and recommended preventive measures.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Risk Level</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                  Moderate
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Predicted Trend</span>
                <span className="font-medium text-blue-600">Stable</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Confidence Score</span>
                <span className="font-medium">92%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperReports;