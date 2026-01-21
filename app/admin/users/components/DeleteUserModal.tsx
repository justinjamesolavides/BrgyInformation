"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaTrashAlt,
  FaExclamationTriangle,
  FaUser,
  FaShieldAlt
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

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUserDeleted: (userId: number) => void;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  isOpen,
  onClose,
  user,
  onUserDeleted
}) => {
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!user || confirmText !== "DELETE") return;

    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      // Comprehensive validation of user ID
      if (!user || !user.id) {
        throw new Error('User data is missing or invalid');
      }

      // Validate and normalize the user ID
      let userId: number;
      if (typeof user.id === 'string') {
        userId = parseInt(user.id.trim(), 10);
      } else if (typeof user.id === 'number') {
        userId = user.id;
      } else {
        throw new Error('Invalid user ID: must be a number or numeric string');
      }

      if (isNaN(userId) || userId <= 0) {
        throw new Error('Invalid user ID: must be a positive number');
      }

      // Create the API URL with the validated ID
      const apiUrl = `/api/users/${userId}`;

      let response;
      try {
        response = await fetch(apiUrl, {
          method: 'DELETE',
        });
      } catch (fetchError: any) {
        // Handle network errors
        throw new Error('Network error. Please check your connection and try again.');
      }

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          // If we can't parse the error response, provide a generic message
          errorData = { error: `Server error (${response.status})` };
        }
        throw new Error(errorData.error || 'Failed to delete user');
      }

      onUserDeleted(user.id);
      onClose();
      setConfirmText("");

    } catch (err: any) {
      // Handle error silently without console logging
      let errorMessage = 'Unable to delete this user. Please try again.';

      // Provide user-friendly error messages based on common error types
      if (err.message) {
        const errorText = err.message.toLowerCase();
        if (errorText.includes('invalid user id') || errorText.includes('not a valid positive number') || errorText.includes('parameter is missing')) {
          errorMessage = 'Invalid user ID. Unable to delete this user.';
        } else if (errorText.includes('user not found')) {
          errorMessage = 'User not found. The user may have already been deleted.';
        } else if (errorText.includes('authentication required') || errorText.includes('unauthorized')) {
          errorMessage = 'Authentication required. Please log in again.';
        } else if (errorText.includes('admin access required') || errorText.includes('insufficient permissions')) {
          errorMessage = 'Insufficient permissions to delete this user.';
        } else if (errorText.includes('cannot delete your own account')) {
          errorMessage = 'You cannot delete your own administrator account.';
        } else if (errorText.includes('network') || errorText.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else {
          // For unknown errors, show a generic message but log the details
          console.warn('Unexpected delete error:', err);
          errorMessage = 'Unable to delete this user. Please try again.';
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmText("");
    setError(null);
    onClose();
  };

  if (!user) return null;

  // Additional safety wrapper to prevent any rendering errors
  try {
    return (
      <AnimatePresence>
        {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 px-6 py-4 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <FaTrashAlt className="text-white text-lg" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Delete User</h2>
                    <p className="text-red-100 text-sm">This action cannot be undone</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <FaTimes className="text-white text-sm" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Warning Icon and User Info */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaExclamationTriangle className="text-red-500 text-2xl" />
                </div>

                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                      {(user.firstName?.charAt(0) || 'U')}{(user.lastName?.charAt(0) || '')}
                    </span>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {user.firstName || 'Unknown'} {user.lastName || 'User'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-neutral-400">
                      {user.email || 'No email provided'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning Message */}
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">
                      Permanent Action
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Deleting this user will permanently remove their account and all associated data.
                      This action cannot be reversed.
                    </p>
                  </div>
                </div>
              </div>

              {/* Admin Warning */}
              {user.role === 'admin' && (
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <FaShieldAlt className="text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">
                        Administrator Account
                      </h4>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        This is an administrator account. Deleting it may affect system administration capabilities.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Confirmation Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-2">
                  Type <span className="font-mono bg-gray-100 dark:bg-neutral-700 px-2 py-1 rounded text-sm">DELETE</span> to confirm
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 placeholder-gray-400 dark:placeholder-neutral-500 text-gray-900 dark:text-white font-mono"
                  placeholder="DELETE"
                  maxLength={6}
                />
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 rounded-xl"
                >
                  <div className="flex items-start gap-3">
                    <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">
                        Deletion Failed
                      </h4>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        {error}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded-xl hover:bg-gray-200 dark:hover:bg-neutral-600 transition-all duration-200 font-semibold"
                >
                  Cancel
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDelete}
                  disabled={loading || confirmText !== "DELETE"}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FaTrashAlt className="text-sm" />
                      Delete User
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    );
  } catch (renderError) {
    // Fallback UI in case of rendering errors
    console.warn('DeleteUserModal render error:', renderError);
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl p-6 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-red-500 text-2xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 dark:text-neutral-400 mb-4">
            Unable to display the delete confirmation. Please try again.
          </p>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded-xl hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
};

export default DeleteUserModal;