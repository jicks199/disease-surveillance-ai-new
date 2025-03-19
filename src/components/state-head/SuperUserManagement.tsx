import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Trash2, Shield, Loader, X, CheckCircle, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux"; // Added useSelector
import { login } from "../../redux/new/authslice"; // Fixed import

const API_URL = `${import.meta.env.VITE_API_VERCEL}/api/v1/users`;
const CREATE_USER_API = `${import.meta.env.VITE_API_VERCEL}/api/v1/signup`;
const DELETE_USER_API = `${import.meta.env.VITE_API_VERCEL}/api/v1/district-head/delete`;

interface User {
  id: string;
  name: string;
  email: string;
  mobile_no: string;
  district: string;
  password?: string;
  role?: string;
}

interface InputFieldProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
}

const gujaratDistricts = [
  "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar",
  "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar",
  "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana",
  "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot",
  "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad",
];

const InputField = React.memo(({ label, type, name, value, onChange, error, placeholder }: InputFieldProps) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
        error ? "border-red-500" : "border-gray-300 hover:border-gray-400"
      }`}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
));
InputField.displayName = "InputField";

const SuperUserManagement: React.FC = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth); // Access Redux state
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "", email: "", mobile_no: "", district: "", password: "", confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);

      // Get email and role from Redux state with fallback values
      const requestBody = {
        email: auth?.email || "admin@example.com", // Use Redux state or fallback
        role: auth?.role || "admin", // Use Redux state or fallback
      };

      console.log(requestBody)

      // Dispatch login action with email and role
      dispatch(login({ email: requestBody.email, role: requestBody.role }));

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" ,},
        // credentials: "include", // Include credentials if using authentication
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error(`Failed to fetch users: ${response.status}`);

      const result = await response.json();
      console.log("Fetched Data from API:", result);

      const userData = Array.isArray(result.data) ? result.data : [];
      setUsers(userData);

      // Update Redux store for logged-in user if needed
      // if (userData.length > 0) {
      //   userData.forEach(user => {
      //     dispatch(login({ email: user.email, role: user.role }));
      //   });
      // }
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
      setMessage({ type: 'error', text: 'Failed to fetch users' });
      setIsMessageModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, auth]); // Added auth to dependencies

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    const fields = ["name", "email", "mobile_no", "district", "password", "confirmPassword"];
    fields.forEach((field) => {
      if (!formData[field].trim()) newErrors[field] = `${field.replace("_", " ")} is required`;
    });
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const response = await fetch(CREATE_USER_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create user");

      await fetchUsers();
      setIsModalOpen(false);
      setMessage({ type: 'success', text: 'User created successfully!' });
      setIsMessageModalOpen(true);
    } catch (err) {
      setErrors({ submit: err.message });
      setMessage({ type: 'error', text: `Error creating user: ${err.message}` });
      setIsMessageModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, fetchUsers]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }, [errors]);

  const deleteUserByEmail = async (email: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(DELETE_USER_API, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete user: ${response.status}`);
      }

      await fetchUsers();
      setMessage({ type: 'success', text: 'User deleted successfully!' });
      setIsMessageModalOpen(true);
    } catch (err) {
      console.error("Error deleting user:", err);
      setMessage({ type: 'error', text: `Error deleting user: ${err.message}` });
      setIsMessageModalOpen(true);
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  const confirmDelete = (email: string) => {
    setUserToDelete(email);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Shield className="h-6 w-6 text-indigo-600" />
            District-wise Management
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            + Add User
          </motion.button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader className="animate-spin h-8 w-8 text-indigo-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Mobile</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">District</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.length > 0 ? (
                  <AnimatePresence>
                    {users.map((user) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-gray-500" />
                            <span className="text-sm font-medium text-gray-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{user.mobile_no}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{user.district}</td>
                        <td className="px-6 py-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => confirmDelete(user.email)}
                            disabled={isLoading}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50"
                          >
                            <Trash2 className="h-5 w-5" />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Add User Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative"
            >
              {/* Form content remains the same */}
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors">
                <X className="h-6 w-6" />
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <User className="h-6 w-6 text-indigo-600" /> Add New User
              </h2>
              {errors.submit && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {errors.submit}
                </motion.div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="name" type="text" name="name" value={formData.name} onChange={handleInputChange} error={errors.name} placeholder="John Doe" />
                  <InputField label="email" type="email" name="email" value={formData.email} onChange={handleInputChange} error={errors.email} placeholder="john@example.com" />
                  <InputField label="mobile no" type="tel" name="mobile_no" value={formData.mobile_no} onChange={handleInputChange} error={errors.mobile_no} placeholder="1234567890" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                        errors.district ? "border-red-500" : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <option value="" disabled>Select District</option>
                      {gujaratDistricts.map((district) => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                    {errors.district && <p className="mt-1 text-sm text-red-600">{errors.district}</p>}
                  </div>
                  <InputField label="password" type="password" name="password" value={formData.password} onChange={handleInputChange} error={errors.password} placeholder="••••••••" />
                  <InputField label="confirm password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} error={errors.confirmPassword} placeholder="••••••••" />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <motion.button whileHover={{ scale: 1.05 }} type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all">
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg disabled:opacity-60 flex items-center gap-2 transition-all"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="animate-spin h-5 w-5" /> Creating...
                      </>
                    ) : (
                      "Add User"
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete the user with email: <span className="font-medium">{userToDelete}</span>?</p>
              <div className="flex justify-end gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => userToDelete && deleteUserByEmail(userToDelete)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center gap-2"
                >
                  {isLoading ? <Loader className="animate-spin h-5 w-5" /> : "Delete"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success/Error Message Modal */}
      <AnimatePresence>
        {isMessageModalOpen && message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div className={`p-4 rounded-lg shadow-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              <p>{message.text}</p>
              <button onClick={() => setIsMessageModalOpen(false)} className="ml-4 text-sm hover:text-gray-600">✕</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SuperUserManagement;