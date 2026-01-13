"use client";

import React, { useState } from "react";
import StaffSidebar from "../../components/StaffSidebar";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaPlus,
  FaSearch,
  FaFilter,
  FaEdit,
  FaEye,
  FaHome,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaDownload
} from "react-icons/fa";

interface Resident {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  barangayId: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  civilStatus: 'single' | 'married' | 'widowed' | 'divorced';
  occupation: string;
  status: 'active' | 'inactive';
  avatar: string;
}

const StaffResidentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - in real app this would come from API
  const [residents] = useState<Resident[]>([
    {
      id: 1,
      firstName: "Juan",
      lastName: "Dela Cruz",
      email: "juan@example.com",
      phone: "+63 917 123 4567",
      address: "123 Main St, Barangay Central",
      barangayId: "BRGY-001",
      dateOfBirth: "1985-03-15",
      gender: "male",
      civilStatus: "married",
      occupation: "Teacher",
      status: "active",
      avatar: "JD"
    },
    {
      id: 2,
      firstName: "Maria",
      lastName: "Santos",
      email: "maria@example.com",
      phone: "+63 918 234 5678",
      address: "456 Oak Ave, Barangay North",
      barangayId: "BRGY-002",
      dateOfBirth: "1990-07-22",
      gender: "female",
      civilStatus: "single",
      occupation: "Nurse",
      status: "active",
      avatar: "MS"
    },
    {
      id: 3,
      firstName: "Pedro",
      lastName: "Garcia",
      email: "pedro@example.com",
      phone: "+63 919 345 6789",
      address: "789 Pine Rd, Barangay South",
      barangayId: "BRGY-003",
      dateOfBirth: "1978-11-08",
      gender: "male",
      civilStatus: "married",
      occupation: "Farmer",
      status: "inactive",
      avatar: "PG"
    }
  ]);

  const filteredResidents = residents.filter(resident => {
    const fullName = `${resident.firstName} ${resident.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) ||
           resident.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           resident.barangayId.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getGenderColor = (gender: string) => {
    switch (gender) {
      case 'male': return 'bg-blue-100 text-blue-800';
      case 'female': return 'bg-pink-100 text-pink-800';
      default: return 'bg-purple-100 text-purple-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Sidebar */}
      <StaffSidebar />

      {/* Main Content */}
      <div className="ml-64 flex-1 p-4 md:p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                <FaUsers className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white font-display">
                  Staff - Residents Management
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  View and manage resident information (Staff Access)
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl shadow-sm transition-all flex items-center gap-2 font-medium"
            >
              <FaDownload className="text-sm" />
              Export Data
            </motion.button>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-6"
        >
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400">
                  <FaSearch className="text-lg" />
                </div>
                <input
                  type="text"
                  placeholder="Search residents by name, email, or barangay ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-12 pr-4 py-4 text-base"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Residents Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filteredResidents.map((resident, index) => (
            <motion.div
              key={resident.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ y: -4 }}
              className="card card-interactive"
            >
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                    {resident.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xl text-white truncate">
                      {resident.firstName} {resident.lastName}
                    </h3>
                    <p className="text-blue-100 text-sm">{resident.barangayId}</p>
                    <p className="text-blue-200 text-xs mt-1">
                      Age: {calculateAge(resident.dateOfBirth)} • {resident.occupation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                      <FaEnvelope className="text-neutral-500 dark:text-neutral-400 text-xs" />
                    </div>
                    <span className="text-neutral-700 dark:text-neutral-300 font-medium truncate">{resident.email}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                      <FaPhone className="text-neutral-500 dark:text-neutral-400 text-xs" />
                    </div>
                    <span className="text-neutral-700 dark:text-neutral-300 font-medium">{resident.phone}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                      <FaMapMarkerAlt className="text-neutral-500 dark:text-neutral-400 text-xs" />
                    </div>
                    <span className="text-neutral-700 dark:text-neutral-300 font-medium truncate">{resident.address}</span>
                  </div>
                </div>

                {/* Status Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getGenderColor(resident.gender)}`}>
                    {resident.gender === 'male' ? '👨' : resident.gender === 'female' ? '👩' : '🧑'} {resident.gender}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200`}>
                    {resident.civilStatus}
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(resident.status)}`}>
                    {resident.status === 'active' ? '✅' : '⏸️'} {resident.status}
                  </span>
                </div>

                {/* Staff Actions - Limited permissions */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-all duration-200 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FaEye className="text-xs" />
                      View Details
                    </div>
                  </motion.button>
                </div>

                {/* Staff Notice */}
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
                    🔒 Staff Access: Limited editing permissions. Contact admin for modifications.
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredResidents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaUsers className="text-neutral-400 dark:text-neutral-500 text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">No residents found</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
              {searchTerm ? "Try adjusting your search criteria." : "No residents available for staff review."}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StaffResidentsPage;