import React from 'react';
import { Brain, TrendingUp, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const predictionData = [
  { month: 'Apr', actual: 300, predicted: 320 },
  { month: 'May', actual: 350, predicted: 360 },
  { month: 'Jun', actual: 400, predicted: 410 },
  { month: 'Jul', predicted: 450 },
  { month: 'Aug', predicted: 480 },
  { month: 'Sep', predicted: 420 }
];

const Prediction = () => {
  return (
     <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">AI Disease Prediction</h1>
        <div className="flex space-x-2">
          <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
            <option>Next 3 Months</option>
            <option>Next 6 Months</option>
            <option>Next Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="ml-3 text-lg font-semibold text-gray-900">AI Confidence</h2>
          </div>
          <p className="text-3xl font-bold text-blue-600">94%</p>
          <p className="text-sm text-gray-500 mt-1">Prediction accuracy rate</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="ml-3 text-lg font-semibold text-gray-900">Trend Analysis</h2>
          </div>
          <p className="text-3xl font-bold text-green-600">Stable</p>
          <p className="text-sm text-gray-500 mt-1">Expected disease pattern</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <h2 className="ml-3 text-lg font-semibold text-gray-900">Risk Level</h2>
          </div>
          <p className="text-3xl font-bold text-yellow-600">Moderate</p>
          <p className="text-sm text-gray-500 mt-1">Current risk assessment</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Disease Trend Prediction</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={predictionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#3B82F6" 
                strokeWidth={2} 
                name="Actual Cases"
              />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#10B981" 
                strokeWidth={2} 
                strokeDasharray="5 5"
                name="Predicted Cases"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-gray-900 font-medium">Seasonal Pattern</p>
                <p className="text-gray-500">Expected increase in cases during monsoon season</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">2</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-gray-900 font-medium">Geographic Focus</p>
                <p className="text-gray-500">Higher risk predicted in urban areas</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">3</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-gray-900 font-medium">Demographic Impact</p>
                <p className="text-gray-500">Elderly population may be more affected</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended Actions</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900">Personal Precautions</h3>
              <ul className="mt-2 text-blue-700 space-y-1">
                <li>• Maintain good hygiene practices</li>
                <li>• Stay updated with vaccinations</li>
                <li>• Monitor health symptoms regularly</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-900">Community Measures</h3>
              <ul className="mt-2 text-green-700 space-y-1">
                <li>• Participate in awareness programs</li>
                <li>• Report unusual health patterns</li>
                <li>• Follow local health guidelines</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prediction;