import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, Bed, HeartPulse, Wind, Droplet } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/new/authslice';
import axios from 'axios';

const UserManagement = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestBody = {
    email: auth?.email || "jeetpateljp2612@gmail.com",
    role: auth?.role || "district-head",
    district: auth?.district || "Ahmedabad"
  };

  useEffect(() => {
    const fetchHospitalData = async () => {
      setLoading(true);
      try {
        // Dispatch login action
        dispatch(login({
          email: requestBody.email,
          role: requestBody.role,
          district: requestBody.district
        }));

        // Make POST request to get hospital data
        const response = await axios.post(
          `${import.meta.env.VITE_API_VERCEL}/api/v1/hospital/getHospitals`,
          // 'https://diseases-backend-pi.vercel.app/api/v1/hospital/getHospitals',
          requestBody
        );
        
        setHospitals(response.data.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch hospital data');
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalData();
  }, [dispatch, requestBody.email, requestBody.role, requestBody.district]);

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-8">
          <Stethoscope className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-800">
            Healthcare Dashboard - {requestBody.district}
          </h1>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {hospitals.map(hospital => (
                <motion.div
                  key={hospital._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="truncate">{hospital.name}</span>
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="text-indigo-500 font-medium">📧</span>
                      <span className="truncate">{hospital.email}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="text-indigo-500 font-medium">📞</span>
                      <span>{hospital.phone_no}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="text-indigo-500 font-medium">📍</span>
                      <span className="line-clamp-2">{hospital.address}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg">
                        <Bed className="h-5 w-5 text-blue-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {hospital.total_beds} Beds
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-red-50 p-2 rounded-lg">
                        <HeartPulse className="h-5 w-5 text-red-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {hospital.total_icu_bed} ICU
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-green-50 p-2 rounded-lg">
                        <Wind className="h-5 w-5 text-green-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {hospital.total_ventilators} Vent.
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-purple-50 p-2 rounded-lg">
                        <Droplet className="h-5 w-5 text-purple-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {hospital.total_oxygen_capacity}L O₂
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && !error && hospitals.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <p className="text-gray-500 text-lg">
              No hospital data available for {requestBody.district}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UserManagement;