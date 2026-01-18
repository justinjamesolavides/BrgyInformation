"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaUser,
  FaSave,
  FaExclamationTriangle
} from "react-icons/fa";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'staff';
  status: 'active' | 'inactive';
  createdAt: string;
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUserUpdated: (updatedUser: User) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  user,
  onUserUpdated
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "staff" as "admin" | "staff",
    status: "active" as "active" | "inactive"
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) return "First name is required";
    if (!formData.lastName.trim()) return "Last name is required";
    if (!formData.email.trim()) return "Email is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return "Please enter a valid email address";

    if (!["admin", "staff"].includes(formData.role)) return "Invalid role selected";
    if (!["active", "inactive"].includes(formData.status)) return "Invalid status selected";

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updateData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        role: formData.role,
        status: formData.status
      };

      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user');
      }

      // Update the user in the list
      const updatedUser = { ...user, ...updateData };
      onUserUpdated(updatedUser);
      onClose();

    } catch (err: any) {
      console.error('Error updating user:', err);
      setError(err.message || 'Failed to update user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <FaUser className="text-white text-xl" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Edit User</h2>
                    <p className="text-indigo-100 mt-1">Modify user information and account settings</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <FaTimes className="text-white text-lg" />
                </motion.button>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
              <div className="absolute -top-5 -left-5 w-20 h-20 bg-white/10 rounded-full"></div>
            </div>

            {/* Form Content */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                      <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
                    </div>
                  </motion.div>
                )}

                {/* User Avatar Display */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 rounded-full flex items-center justify-center border-4 border-white dark:border-neutral-700 shadow-lg">
                    <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-neutral-400">
                      User ID: {user.id} • Created {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-3">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400 dark:placeholder-neutral-500 text-gray-900 dark:text-white"
                      placeholder="Enter first name"
                      required
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-3">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400 dark:placeholder-neutral-500 text-gray-900 dark:text-white"
                      placeholder="Enter last name"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-3">
                      Email Address <span className="text-red-500">*</span>
                      <span className="text-xs font-normal text-gray-500 dark:text-neutral-400 ml-2">
                        (Required for login and notifications)
                      </span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400 dark:placeholder-neutral-500 text-gray-900 dark:text-white"
                      placeholder="user@example.com"
                      required
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-3">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900 dark:text-white cursor-pointer"
                      required
                    >
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                    <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                      {formData.role === 'admin'
                        ? 'Full system access and user management'
                        : 'Basic operations and data entry access'
                      }
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-3">
                      Account Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900 dark:text-white cursor-pointer"
                      required
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                      {formData.status === 'active'
                        ? 'User can log in and access the system'
                        : 'User account is disabled'
                      }
                    </p>
                  </div>
                </div>

                {/* Warning for Role Changes */}
                {formData.role !== user.role && (
                  <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <FaExclamationTriangle className="text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                          Role Change Warning
                        </p>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                          Changing the user's role will affect their system access permissions.
                          {formData.role === 'admin'
                            ? ' They will gain full administrative privileges.'
                            : ' They will lose administrative privileges and only have staff access.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-neutral-700">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-4 bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded-xl hover:bg-gray-200 dark:hover:bg-neutral-600 transition-all duration-200 font-semibold"
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Updating User...
                      </>
                    ) : (
                      <>
                        <FaSave className="text-sm" />
                        Update User
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditUserModal;