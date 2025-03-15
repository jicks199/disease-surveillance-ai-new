import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope } from 'lucide-react';

// Static hospital data
const hospitalData = [
  { id: '1', name: 'Apollo Hospital', email: 'contact@apollo.com', mobile_no: '9876543210', location: 'Gandhinagar' },
  { id: '2', name: 'Sterling Hospital', email: 'info@sterling.com', mobile_no: '8765432109', location: 'Gandhinagar' },
  { id: '3', name: 'Zydus Hospital', email: 'support@zydus.com', mobile_no: '7654321098', location: 'Gandhinagar' },
  { id: '4', name: 'Shalby Hospital', email: 'admin@shalby.com', mobile_no: '6543210987', location: 'Gandhinagar' },
];

const UserManagement: React.FC = () => {
  const [hospitals] = useState(hospitalData);

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-6"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-indigo-600" />
            Hospital Management
          </h1>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Mobile</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {hospitals.map(hospital => (
                  <motion.tr
                    key={hospital.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{hospital.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{hospital.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{hospital.mobile_no}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{hospital.location}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {hospitals.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No hospital data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default UserManagement;
