"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaUser,
  FaEnvelope,
  FaShieldAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle
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

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({
  isOpen,
  onClose,
  user
}) => {
  if (!user) return null;

  const getRoleColor = (role: string) => {
    return role === 'admin'
      ? 'bg-red-100 text-red-700 border border-red-200'
      : 'bg-blue-100 text-blue-700 border border-blue-200';
  };

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-700 border border-green-200'
      : 'bg-gray-100 text-gray-700 border border-gray-200';
  };

  const getRoleDescription = (role: string) => {
    return role === 'admin'
      ? 'Administrator users have full access to all system features and user management capabilities.'
      : 'Staff users have access to basic barangay operations and data entry functions.';
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

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
            className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <FaUser className="text-white text-lg" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">User Details</h2>
                    <p className="text-blue-100 text-sm">View user information and account status</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <FaTimes className="text-white text-sm" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Profile Section */}
              <div className="flex items-center gap-6 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center border-2 border-white shadow-md">
                  <span className="text-lg font-bold text-blue-600">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    User ID: {user.id}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className={`px-3 py-1.5 text-sm font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                    <span className={`px-4 py-2 text-sm font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status === 'active' ? (
                        <><FaCheckCircle className="inline mr-1" /> Active</>
                      ) : (
                        <><FaTimesCircle className="inline mr-1" /> Inactive</>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="bg-gray-50 dark:bg-neutral-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                      <FaUser className="text-blue-600 dark:text-blue-400 text-sm" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">Full Name</p>
                      <p className="font-medium text-gray-900 dark:text-white">{user.firstName} {user.lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">Role</p>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">{user.role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">Status</p>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">{user.status}</p>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="bg-gray-50 dark:bg-neutral-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                      <FaEnvelope className="text-purple-600 dark:text-purple-400 text-sm" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Account Information</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">Email Address</p>
                      <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">Account Created</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">Last Updated</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role Description */}
              <div className="mt-8 bg-blue-50 dark:bg-blue-900/10 rounded-xl p-6 border border-blue-200 dark:border-blue-800/50">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaShieldAlt className="text-blue-600 dark:text-blue-400 text-sm" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Role Permissions
                    </h4>
                    <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                      {getRoleDescription(user.role)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-8 py-3 bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded-xl hover:bg-gray-200 dark:hover:bg-neutral-600 transition-all duration-200 font-semibold"
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ViewUserModal;