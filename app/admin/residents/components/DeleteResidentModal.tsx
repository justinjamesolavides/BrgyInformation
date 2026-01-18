"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaTrashAlt,
  FaExclamationTriangle,
  FaUser,
  FaMapMarkerAlt,
  FaCalendarAlt
} from "react-icons/fa";

interface Resident {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone: string;
  address: string;
  barangayId?: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  civilStatus?: string;
  occupation?: string;
  familyHead?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  status: 'active' | 'inactive';
  registrationDate: string;
  avatar: string;
  profileImage?: string;
}

interface DeleteResidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  resident: Resident | null;
  onResidentDeleted: (residentId: number) => void;
}

const DeleteResidentModal: React.FC<DeleteResidentModalProps> = ({
  isOpen,
  onClose,
  resident,
  onResidentDeleted
}) => {
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  const handleDelete = async () => {
    if (!resident || confirmText !== "DELETE") return;

    setLoading(true);

    try {
      const response = await fetch(`/api/residents/${resident.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete resident');
      }

      onResidentDeleted(resident.id);
      onClose();
      setConfirmText("");

    } catch (err: any) {
      console.error('Error deleting resident:', err);
      // You could add error handling here with a toast or alert
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmText("");
    onClose();
  };

  if (!resident) return null;

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
                    <h2 className="text-xl font-bold">Delete Resident</h2>
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
              {/* Warning Icon and Resident Info */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaExclamationTriangle className="text-red-500 text-2xl" />
                </div>

                <div className="flex items-center justify-center gap-3 mb-4">
                  {resident.profileImage ? (
                    <img
                      src={resident.profileImage}
                      alt={`${resident.firstName} ${resident.lastName}`}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-neutral-600"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                        {resident.avatar}
                      </span>
                    </div>
                  )}
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {resident.firstName} {resident.middleName} {resident.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-neutral-400">
                      {resident.barangayId} • Age: {calculateAge(resident.dateOfBirth)}
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
                      Deleting this resident will permanently remove all their records, documents, and history from the system.
                      This action cannot be reversed.
                    </p>
                  </div>
                </div>
              </div>

              {/* Resident Details Summary */}
              <div className="bg-gray-50 dark:bg-neutral-700/50 rounded-xl p-4 mb-6">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FaUser className="text-gray-500" />
                  Resident Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-400 text-xs flex-shrink-0" />
                    <span className="text-gray-700 dark:text-neutral-300 truncate">{resident.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-gray-400 text-xs flex-shrink-0" />
                    <span className="text-gray-700 dark:text-neutral-300">
                      Registered: {new Date(resident.registrationDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

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
                      Delete Resident
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
};

export default DeleteResidentModal;