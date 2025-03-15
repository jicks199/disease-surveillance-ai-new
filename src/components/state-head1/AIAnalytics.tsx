import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertTriangle } from 'lucide-react';

const AIAnalytics = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-md p-6"
    >
      <div className="flex items-center mb-6">
        <Brain className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">AI-Powered Insights</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <Brain className="h-5 w-5 text-blue-600" />
            <h3 className="ml-2 font-semibold text-blue-900">Prediction Accuracy</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">94%</p>
          <p className="text-sm text-blue-700 mt-1">Based on historical data</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h3 className="ml-2 font-semibold text-green-900">Trend Analysis</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">Stable</p>
          <p className="text-sm text-green-700 mt-1">Next 30 days forecast</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <h3 className="ml-2 font-semibold text-yellow-900">Risk Level</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">Moderate</p>
          <p className="text-sm text-yellow-700 mt-1">Current assessment</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-3">AI Recommendations</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm mr-2">1</span>
            <span className="text-gray-700">Increase testing capacity in urban areas</span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm mr-2">2</span>
            <span className="text-gray-700">Monitor monsoon-related disease patterns</span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm mr-2">3</span>
            <span className="text-gray-700">Strengthen vaccination drives in rural areas</span>
          </li>
        </ul>
      </div>
    </motion.div>
  );
};

export default AIAnalytics;