"use client";

import React, { useState } from "react";
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

const StaffResidentsContent: React.FC = () => {
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
    <div className="p-4 md:p-6 bg-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
      >
          <div className="flex-1 w-full md:w-auto">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Staff - Residents Management
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  View and manage resident information (Staff Access)
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg transition-all flex items-center gap-2 font-medium"
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
          className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6"
        >
          <div>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaSearch className="text-sm" />
                </div>
                <input
                  type="text"
                  placeholder="Search residents by name, email, or barangay ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
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
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {filteredResidents.map((resident, index) => (
            <motion.div
              key={resident.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ y: -2 }}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Header */}
              <div className="p-4 bg-white border-b border-gray-100 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-800 font-bold text-lg">
                    {resident.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {resident.firstName} {resident.lastName}
                    </h3>
                    <p className="text-gray-500 text-xs">{resident.barangayId}</p>
                    <p className="text-gray-600 text-xs mt-1">
                      Age: {calculateAge(resident.dateOfBirth)} • {resident.occupation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2.5 text-sm">
                    <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                      <FaEnvelope className="text-gray-500 text-xs" />
                    </div>
                    <span className="text-gray-700 font-medium truncate text-xs">{resident.email}</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-sm">
                    <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                      <FaPhone className="text-gray-500 text-xs" />
                    </div>
                    <span className="text-gray-700 font-medium text-xs">{resident.phone}</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-sm">
                    <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                      <FaMapMarkerAlt className="text-gray-500 text-xs" />
                    </div>
                    <span className="text-gray-700 font-medium truncate text-xs">{resident.address}</span>
                  </div>
                </div>

                {/* Status Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className={`px-2 py-0.5 text-[0.6rem] font-medium rounded-full bg-gray-100 text-gray-800`}>
                    {resident.gender === 'male' ? '👨' : resident.gender === 'female' ? '👩' : '🧑'} {resident.gender}
                  </span>
                  <span className={`px-2 py-0.5 text-[0.6rem] font-medium rounded-full bg-gray-100 text-gray-800`}>
                    {resident.civilStatus}
                  </span>
                  <span className={`px-2 py-0.5 text-[0.6rem] font-medium rounded-full ${getStatusColor(resident.status)}`}>
                    {resident.status === 'active' ? '✅' : '⏸️'} {resident.status}
                  </span>
                </div>

                {/* Staff Actions - Limited permissions */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-2 px-3 text-xs font-medium rounded-lg transition-all duration-200 bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <FaEye className="text-xs" />
                      View Details
                    </div>
                  </motion.button>
                </div>

                <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-[0.6rem] text-blue-800">
                    🔒 Staff Access: Limited permissions
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
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-gray-400 text-lg" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No residents found</h3>
            <p className="text-gray-600 text-sm max-w-md mx-auto">
              {searchTerm ? "Try adjusting your search criteria." : "No residents available for staff review."}
            </p>
          </motion.div>
      )}
    </div>
  );
};

const StaffResidentsPage: React.FC = () => {
  return <StaffResidentsContent />;
};

export default StaffResidentsPage;