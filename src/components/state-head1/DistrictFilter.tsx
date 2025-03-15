import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Filter, ChevronDown } from 'lucide-react';
import { Menu } from '@headlessui/react';

const gujaratDistricts = [
  'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar',
  'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhoomi Dwarka', 'Gandhinagar',
  'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch', 'Mahisagar', 'Mehsana',
  'Morbi', 'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot',
  'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad'
];

const DistrictFilter = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-md p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Map className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">District-wise Analysis</h2>
        </div>
        <Menu as="div" className="relative">
          <Menu.Button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            {selectedDistrict}
            <ChevronDown className="h-4 w-4 ml-2" />
          </Menu.Button>
          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-y-auto">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } block px-4 py-2 text-sm w-full text-left`}
                    onClick={() => setSelectedDistrict('All Districts')}
                  >
                    All Districts
                  </button>
                )}
              </Menu.Item>
              {gujaratDistricts.map((district) => (
                <Menu.Item key={district}>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } block px-4 py-2 text-sm w-full text-left`}
                      onClick={() => setSelectedDistrict(district)}
                    >
                      {district}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Menu>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {selectedDistrict !== 'All Districts' ? (
          <>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900">Active Cases</h3>
              <p className="text-2xl font-bold text-blue-600">234</p>
              <p className="text-sm text-blue-700">+12 from yesterday</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-900">Recovery Rate</h3>
              <p className="text-2xl font-bold text-green-600">96.5%</p>
              <p className="text-sm text-green-700">+0.5% this week</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-purple-900">Vaccination Status</h3>
              <p className="text-2xl font-bold text-purple-600">82%</p>
              <p className="text-sm text-purple-700">Of eligible population</p>
            </div>
          </>
        ) : (
          <div className="col-span-3 text-center py-8 text-gray-500">
            Select a district to view detailed statistics
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DistrictFilter;