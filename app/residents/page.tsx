"use client";

import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaPlus,
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrash,
  FaEye,
  FaHome,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaDownload,
  FaIdCard,
  FaUserCheck,
  FaUserTimes
} from "react-icons/fa";

interface Resident {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone: string;
  address: string;
  barangayId: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  civilStatus: 'single' | 'married' | 'widowed' | 'divorced';
  occupation: string;
  status: 'active' | 'inactive';
  registrationDate: string;
  avatar: string;
}

const ResidentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterGender, setFilterGender] = useState("all");
  const [selectedResidents, setSelectedResidents] = useState<number[]>([]);

  // Mock data - in real app this would come from API
  const [residents, setResidents] = useState<Resident[]>([
    {
      id: 1,
      firstName: "Juan",
      lastName: "Dela Cruz",
      middleName: "Santos",
      email: "juan@example.com",
      phone: "+63 917 123 4567",
      address: "123 Main St, Barangay Central",
      barangayId: "BRGY-001",
      dateOfBirth: "1985-03-15",
      gender: "male",
      civilStatus: "married",
      occupation: "Teacher",
      status: "active",
      registrationDate: "2024-01-15",
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
      registrationDate: "2024-02-20",
      avatar: "MS"
    },
    {
      id: 3,
      firstName: "Pedro",
      lastName: "Garcia",
      middleName: "Reyes",
      email: "pedro@example.com",
      phone: "+63 919 345 6789",
      address: "789 Pine Rd, Barangay South",
      barangayId: "BRGY-003",
      dateOfBirth: "1978-11-08",
      gender: "male",
      civilStatus: "married",
      occupation: "Farmer",
      status: "inactive",
      registrationDate: "2024-03-10",
      avatar: "PG"
    },
    {
      id: 4,
      firstName: "Ana",
      lastName: "Reyes",
      email: "ana@example.com",
      phone: "+63 920 456 7890",
      address: "321 Elm St, Barangay East",
      barangayId: "BRGY-004",
      dateOfBirth: "1995-05-30",
      gender: "female",
      civilStatus: "single",
      occupation: "Student",
      status: "active",
      registrationDate: "2024-04-05",
      avatar: "AR"
    },
    {
      id: 5,
      firstName: "Carlos",
      lastName: "Mendoza",
      email: "carlos@example.com",
      phone: "+63 921 567 8901",
      address: "654 Maple Dr, Barangay West",
      barangayId: "BRGY-005",
      dateOfBirth: "1982-09-12",
      gender: "male",
      civilStatus: "married",
      occupation: "Driver",
      status: "active",
      registrationDate: "2024-05-12",
      avatar: "CM"
    }
  ]);

  const filteredResidents = residents.filter(resident => {
    const fullName = `${resident.firstName} ${resident.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         resident.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resident.barangayId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || resident.status === filterStatus;
    const matchesGender = filterGender === "all" || resident.gender === filterGender;
    return matchesSearch && matchesStatus && matchesGender;
  });

  const handleSelectResident = (residentId: number) => {
    setSelectedResidents(prev =>
      prev.includes(residentId)
        ? prev.filter(id => id !== residentId)
        : [...prev, residentId]
    );
  };

  const handleSelectAll = () => {
    setSelectedResidents(
      selectedResidents.length === filteredResidents.length
        ? []
        : filteredResidents.map(resident => resident.id)
    );
  };

  const handleStatusChange = (residentId: number, newStatus: 'active' | 'inactive') => {
    setResidents(prev => prev.map(resident =>
      resident.id === residentId ? { ...resident, status: newStatus } : resident
    ));
  };

  const handleDeleteResident = (residentId: number) => {
    setResidents(prev => prev.filter(resident => resident.id !== residentId));
  };

  const getGenderColor = (gender: string) => {
    switch (gender) {
      case 'male': return 'bg-blue-100 text-blue-800';
      case 'female': return 'bg-pink-100 text-pink-800';
      default: return 'bg-purple-100 text-purple-800';
    }
  };

  const getCivilStatusColor = (status: string) => {
    switch (status) {
      case 'single': return 'bg-green-100 text-green-800';
      case 'married': return 'bg-blue-100 text-blue-800';
      case 'widowed': return 'bg-gray-100 text-gray-800';
      case 'divorced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 flex-1 p-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Residents Management</h1>
            <p className="text-gray-600 mt-1">Manage barangay residents and their information</p>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <FaDownload className="text-sm" />
              Export Data
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FaPlus className="text-sm" />
              Add Resident
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              title: "Total Residents",
              value: residents.length.toString(),
              icon: <FaUsers className="text-blue-500" />,
              bgColor: "bg-blue-50"
            },
            {
              title: "Active Residents",
              value: residents.filter(r => r.status === 'active').length.toString(),
              icon: <FaUserCheck className="text-green-500" />,
              bgColor: "bg-green-50"
            },
            {
              title: "Male Residents",
              value: residents.filter(r => r.gender === 'male').length.toString(),
              icon: <FaUserCheck className="text-blue-500" />,
              bgColor: "bg-blue-50"
            },
            {
              title: "Female Residents",
              value: residents.filter(r => r.gender === 'female').length.toString(),
              icon: <FaUserTimes className="text-pink-500" />,
              bgColor: "bg-pink-50"
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              whileHover={{ y: -2 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search residents by name, email, or barangay ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Residents Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredResidents.map((resident, index) => (
            <motion.div
              key={resident.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {resident.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {resident.firstName} {resident.lastName}
                      </h3>
                      <p className="text-blue-100 text-sm">{resident.barangayId}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                      title="View Details"
                    >
                      <FaEye className="text-white text-sm" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                      title="Edit Resident"
                    >
                      <FaEdit className="text-white text-sm" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <FaEnvelope className="text-gray-400" />
                    <span className="text-gray-600">{resident.email}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <FaPhone className="text-gray-400" />
                    <span className="text-gray-600">{resident.phone}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span className="text-gray-600">{resident.address}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <FaCalendarAlt className="text-gray-400" />
                    <span className="text-gray-600">
                      Age: {calculateAge(resident.dateOfBirth)} years
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <FaIdCard className="text-gray-400" />
                    <span className="text-gray-600">{resident.occupation}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getGenderColor(resident.gender)}`}>
                    {resident.gender}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCivilStatusColor(resident.civilStatus)}`}>
                    {resident.civilStatus}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(resident.status)}`}>
                    {resident.status}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleStatusChange(resident.id, resident.status === 'active' ? 'inactive' : 'active')}
                    className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg transition-colors ${
                      resident.status === 'active'
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {resident.status === 'active' ? 'Deactivate' : 'Activate'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteResident(resident.id)}
                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    title="Delete Resident"
                  >
                    <FaTrash className="text-xs" />
                  </motion.button>
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
            <FaUsers className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No residents found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterGender !== "all" || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first resident."}
            </p>
          </motion.div>
        )}

        {/* Bulk Actions */}
        {selectedResidents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 bg-white p-4 rounded-lg shadow-lg border border-gray-200"
          >
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {selectedResidents.length} resident{selectedResidents.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  Activate
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Deactivate
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                >
                  Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default ResidentsPage;