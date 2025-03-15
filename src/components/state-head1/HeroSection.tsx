import React from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, Users, Heart } from 'lucide-react';
import StateSummary from './StateSummary';
import DistrictFilter from './DistrictFilter';
import AIAnalytics from './AIAnalytics';

const HeroSection = () => {
  const stats = [
    {
      icon: Activity,
      label: 'Total Cases',
      value: '124,567',
      change: '+2.5%',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: TrendingUp,
      label: 'Recovery Rate',
      value: '97.8%',
      change: '+0.3%',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Users,
      label: 'Active Cases',
      value: '3,890',
      change: '-1.2%',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      icon: Heart,
      label: 'Critical Cases',
      value: '245',
      change: '-0.8%',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Gujarat Health Monitor
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Real-time disease surveillance powered by artificial intelligence
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-500">{stat.label}</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className={`mt-2 text-sm ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change} from last week
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="space-y-8">
          <StateSummary />
          <DistrictFilter />
          <AIAnalytics />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;