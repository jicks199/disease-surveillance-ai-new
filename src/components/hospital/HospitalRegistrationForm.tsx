import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";

interface FormData {
  name: string;
  registration_number: string;
  email: string;
  phone_no: string;
  password: string;
  confirmPassword: string;
  district: string;
  address: string;
  total_beds: string;
  total_ventilators: string;
  total_oxygen_capacity: string;
  total_icu_bed: string;
  oxygen_refill_time_estimation: string;
  total_ppe_kit: string;
  total_doctors: string;
  total_nurses: string;
}

const DISTRICTS = [
  "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar",
  "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath",
  "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada",
  "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat",
  "Surendranagar", "Tapi", "Vadodara", "Valsad"
];

const HospitalRegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "", registration_number: "", email: "", phone_no: "",
    password: "", confirmPassword: "", district: "", address: "",
    total_beds: "", total_ventilators: "", total_oxygen_capacity: "",
    total_icu_bed: "", oxygen_refill_time_estimation: "", total_ppe_kit: "",
    total_doctors: "", total_nurses: ""
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError(null);
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    // Validation logic remains the same as in your original code
    if (!formData.name.trim()) newErrors.name = 'Hospital name is required';
    if (!formData.registration_number.trim()) newErrors.registration_number = 'Registration number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone_no.trim()) newErrors.phone_no = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone_no)) newErrors.phone_no = 'Invalid phone number';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.district) newErrors.district = 'District is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    const numericFields: (keyof FormData)[] = [
      'total_beds', 'total_ventilators', 'total_oxygen_capacity',
      'total_icu_bed', 'total_ppe_kit', 'total_doctors', 'total_nurses'
    ];

    numericFields.forEach(field => {
      if (!formData[field]) newErrors[field] = `${field.split('_').join(' ')} is required`;
      else if (isNaN(Number(formData[field])) || Number(formData[field]) < 0)
        newErrors[field] = `Invalid ${field.split('_').join(' ')}`;
    });

    if (!formData.oxygen_refill_time_estimation.trim())
      newErrors.oxygen_refill_time_estimation = 'Oxygen refill time estimation is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('https://diseases-backend-pi.vercel.app/api/v1/hospital/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      setSuccessMessage('Hospital registered successfully!');
      setFormData({
        name: "", registration_number: "", email: "", phone_no: "",
        password: "", confirmPassword: "", district: "", address: "",
        total_beds: "", total_ventilators: "", total_oxygen_capacity: "",
        total_icu_bed: "", oxygen_refill_time_estimation: "", total_ppe_kit: "",
        total_doctors: "", total_nurses: ""
      });

      setTimeout(() => navigate("/hospital/login"), 1500);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 p-6">
            <div className="flex items-center justify-center">
              <Building2 className="h-10 w-10 text-white mr-3" />
              <h2 className="text-3xl font-bold text-white">Hospital Registration</h2>
            </div>
          </div>

          {(apiError || successMessage) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`m-6 p-4 rounded-lg flex items-center gap-2 ${apiError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                }`}
            >
              {apiError ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
              <span>{apiError || successMessage}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Information Section */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {[
                  { name: 'name', label: 'Hospital Name', type: 'text' },
                  { name: 'registration_number', label: 'Registration Number', type: 'text' },
                  { name: 'email', label: 'Email Address', type: 'email' },
                  { name: 'phone_no', label: 'Phone Number', type: 'tel' },
                  { name: 'password', label: 'Password', type: 'password' },
                  { name: 'confirmPassword', label: 'Confirm Password', type: 'password' },
                ].map(field => (
                  <div key={field.name} className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name as keyof FormData]}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border-2 ${errors[field.name as keyof FormData]
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200 focus:border-blue-500'
                        } focus:ring-0 transition-all duration-200 bg-gray-50`}
                    />
                    {errors[field.name as keyof FormData] && (
                      <p className="mt-1 text-sm text-red-600">{errors[field.name as keyof FormData]}</p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Location Section */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Location Details</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 ${errors.district
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-blue-500'
                      } focus:ring-0 transition-all duration-200 bg-gray-50`}
                  >
                    <option value="">Select District</option>
                    {DISTRICTS.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                  {errors.district && <p className="mt-1 text-sm text-red-600">{errors.district}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg border-2 ${errors.address
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-blue-500'
                      } focus:ring-0 transition-all duration-200 bg-gray-50`}
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                </div>
              </div>
            </motion.div>

            {/* Resources Section */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Hospital Resources</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {[
                  { name: 'total_beds', label: 'Total Beds' },
                  { name: 'total_icu_bed', label: 'ICU Beds' },
                  { name: 'total_ventilators', label: 'Ventilators' },
                  { name: 'total_oxygen_capacity', label: 'Oxygen Capacity (liters)' },
                  { name: 'total_ppe_kit', label: 'PPE Kits' },
                  { name: 'total_doctors', label: 'Doctors' },
                  { name: 'total_nurses', label: 'Nurses' },
                ].map(field => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    <input
                      type="number"
                      name={field.name}
                      value={formData[field.name as keyof FormData]}
                      onChange={handleInputChange}
                      min="0"
                      className={`w-full px-4 py-3 rounded-lg border-2 ${errors[field.name as keyof FormData]
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200 focus:border-blue-500'
                        } focus:ring-0 transition-all duration-200 bg-gray-50`}
                    />
                    {errors[field.name as keyof FormData] && (
                      <p className="mt-1 text-sm text-red-600">{errors[field.name as keyof FormData]}</p>
                    )}
                  </div>
                ))}
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Oxygen Refill Time Estimation
                  </label>
                  <textarea
                    name="oxygen_refill_time_estimation"
                    value={formData.oxygen_refill_time_estimation}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="e.g., Every 12 hours"
                    className={`w-full px-4 py-3 rounded-lg border-2 ${errors.oxygen_refill_time_estimation
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-blue-500'
                      } focus:ring-0 transition-all duration-200 bg-gray-50`}
                  />
                  {errors.oxygen_refill_time_estimation && (
                    <p className="mt-1 text-sm text-red-600">{errors.oxygen_refill_time_estimation}</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 rounded-lg text-white font-semibold text-lg
                  ${isLoading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'} 
                  transition-all duration-300 flex items-center justify-center shadow-md`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Registering...
                  </div>
                ) : (
                  'Register Hospital'
                )}
              </button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default HospitalRegistrationForm;