"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBriefcase,
  FaUserFriends,
  FaCheckCircle,
  FaVenus,
  FaMars,
  FaUsers as FaUsersIcon
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

interface ViewResidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  resident: Resident | null;
}

const ViewResidentModal: React.FC<ViewResidentModalProps> = ({
  isOpen,
  onClose,
  resident
}) => {
  if (!resident) return null;

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
      : 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300';
  };

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case 'male': return <FaMars className="text-blue-500" />;
      case 'female': return <FaVenus className="text-pink-500" />;
      default: return <FaUsersIcon className="text-gray-500" />;
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
            className="w-full max-w-4xl bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-8 py-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <FaUser className="text-white text-xl" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Resident Details</h2>
                    <p className="text-green-100 mt-1">Complete resident information and profile</p>
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

            {/* Content */}
            <div className="p-8">
              {/* Profile Section */}
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  {resident.profileImage ? (
                    <img
                      src={resident.profileImage}
                      alt={`${resident.firstName} ${resident.lastName}`}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-neutral-700 shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-full flex items-center justify-center border-4 border-white dark:border-neutral-700 shadow-lg">
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {resident.avatar}
                      </span>
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 bg-white dark:bg-neutral-800 rounded-full p-1">
                    {getGenderIcon(resident.gender)}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {resident.firstName} {resident.middleName} {resident.lastName}
                  </h3>
                  <p className="text-gray-600 dark:text-neutral-400 mt-1">
                    ID: {resident.barangayId} • Age: {calculateAge(resident.dateOfBirth)}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className={`px-4 py-2 text-sm font-semibold rounded-full ${getStatusColor(resident.status)}`}>
                      {resident.status === 'active' ? (
                        <><FaCheckCircle className="inline mr-1" /> Active Resident</>
                      ) : (
                        <>Inactive Resident</>
                      )}
                    </span>
                    {resident.civilStatus && (
                      <span className="px-4 py-2 text-sm font-semibold rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
                        {resident.civilStatus.charAt(0).toUpperCase() + resident.civilStatus.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Personal Information */}
                <div className="bg-gray-50 dark:bg-neutral-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                      <FaUser className="text-blue-600 dark:text-blue-400 text-sm" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">Full Name</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {resident.firstName} {resident.middleName} {resident.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">Date of Birth</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(resident.dateOfBirth).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })} (Age: {calculateAge(resident.dateOfBirth)})
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">Gender</p>
                      <p className="font-medium text-gray-900 dark:text-white capitalize flex items-center gap-2">
                        {resident.gender}
                        {getGenderIcon(resident.gender)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">Civil Status</p>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">
                        {resident.civilStatus || 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 dark:bg-neutral-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                      <FaEnvelope className="text-purple-600 dark:text-purple-400 text-sm" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Information</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">Email Address</p>
                      <p className="font-medium text-gray-900 dark:text-white">{resident.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">Phone Number</p>
                      <p className="font-medium text-gray-900 dark:text-white">{resident.phone}</p>
                    </div>
                    {resident.emergencyContact && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-neutral-400">Emergency Contact</p>
                        <p className="font-medium text-gray-900 dark:text-white">{resident.emergencyContact}</p>
                        {resident.emergencyPhone && (
                          <p className="text-sm text-gray-600 dark:text-neutral-400">{resident.emergencyPhone}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Address and Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Address */}
                <div className="bg-gray-50 dark:bg-neutral-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                      <FaMapMarkerAlt className="text-green-600 dark:text-green-400 text-sm" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Address</h4>
                  </div>
                  <p className="text-gray-900 dark:text-white leading-relaxed">
                    {resident.address}
                  </p>
                  {resident.barangayId && (
                    <p className="text-sm text-gray-500 dark:text-neutral-400 mt-2">
                      Barangay ID: {resident.barangayId}
                    </p>
                  )}
                </div>

                {/* Additional Information */}
                <div className="bg-gray-50 dark:bg-neutral-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
                      <FaBriefcase className="text-indigo-600 dark:text-indigo-400 text-sm" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Additional Information</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">Occupation</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {resident.occupation || 'Not specified'}
                      </p>
                    </div>
                    {resident.familyHead && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-neutral-400">Family Head</p>
                        <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                          <FaUserFriends className="text-sm" />
                          {resident.familyHead}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">Registration Date</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(resident.registrationDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
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

export default ViewResidentModal;