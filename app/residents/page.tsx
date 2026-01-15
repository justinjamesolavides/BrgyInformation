"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  FaUserTimes,
  FaTimes,
  FaExclamationTriangle
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
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterGender, setFilterGender] = useState("all");
  const [selectedResidents, setSelectedResidents] = useState<number[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch residents from API
  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterGender !== 'all') params.append('gender', filterGender);

      const response = await fetch(`/api/residents?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch residents');
      }

      setResidents(data.data || []);
    } catch (err: any) {
      console.error('Error fetching residents:', err);
      setError(err.message || 'Failed to load residents');
    } finally {
      setLoading(false);
    }
  };

  // Refetch when filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchResidents();
    }, 300); // Debounce search

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, filterStatus, filterGender]);


  // Since we're now fetching filtered data from API, we don't need client-side filtering
  const filteredResidents = residents;

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
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-900">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 flex-1 p-4 md:p-6 mobile-spacing">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center">
                <FaUsers className="text-primary-600 dark:text-primary-400 text-xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white font-display">
                  Residents Management
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  Manage barangay residents and their information
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-success-600 hover:bg-success-700 text-white px-4 py-3 rounded-xl shadow-sm transition-all flex items-center gap-2 font-medium"
            >
              <FaDownload className="text-sm" />
              Export Data
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/residents/add')}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-xl shadow-sm transition-all flex items-center gap-2 font-medium"
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              title: "Total Residents",
              value: residents.length.toString(),
              icon: <FaUsers className="text-primary-500" />,
              bgColor: "bg-primary-50 dark:bg-primary-900/20",
              iconBg: "bg-primary-100 dark:bg-primary-900/40",
              change: "+12",
              changeType: "positive" as const
            },
            {
              title: "Active Residents",
              value: residents.filter(r => r.status === 'active').length.toString(),
              icon: <FaUserCheck className="text-success-500" />,
              bgColor: "bg-success-50 dark:bg-success-900/20",
              iconBg: "bg-success-100 dark:bg-success-900/40",
              change: "+8",
              changeType: "positive" as const
            },
            {
              title: "Male Residents",
              value: residents.filter(r => r.gender === 'male').length.toString(),
              icon: <FaUserCheck className="text-blue-500" />,
              bgColor: "bg-blue-50 dark:bg-blue-900/20",
              iconBg: "bg-blue-100 dark:bg-blue-900/40",
              change: "+3",
              changeType: "positive" as const
            },
            {
              title: "Female Residents",
              value: residents.filter(r => r.gender === 'female').length.toString(),
              icon: <FaUserTimes className="text-pink-500" />,
              bgColor: "bg-pink-50 dark:bg-pink-900/20",
              iconBg: "bg-pink-100 dark:bg-pink-900/40",
              change: "+9",
              changeType: "positive" as const
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="card card-interactive"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    {stat.title}
                  </p>
                  <div className="flex items-baseline gap-2 mb-2">
                    <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                      {stat.value}
                    </p>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      stat.changeType === 'positive'
                        ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                        : 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-4 rounded-xl ${stat.iconBg} group-hover:scale-110 transition-transform duration-200`}>
                  {stat.icon}
                </div>
              </div>

              {/* Mini chart visualization */}
              <div className="mt-4">
                <div className="flex items-end gap-1 h-8">
                  {[0.3, 0.5, 0.7, 0.4, 0.8, 0.6, 0.9].map((height, i) => (
                    <motion.div
                      key={i}
                      className={`flex-1 rounded-sm ${
                        stat.title.includes('Male') ? 'bg-blue-400' :
                        stat.title.includes('Female') ? 'bg-pink-400' :
                        stat.title.includes('Active') ? 'bg-success-400' : 'bg-primary-400'
                      }`}
                      initial={{ height: 0 }}
                      animate={{ height: `${height * 100}%` }}
                      transition={{ delay: 0.5 + index * 0.1 + i * 0.05, duration: 0.4 }}
                    />
                  ))}
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
          className="card mb-6"
        >
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Enhanced Search Input */}
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

              {/* Enhanced Filters */}
              <div className="flex gap-3">
                <div className="relative">
                  <select
                    value={filterGender}
                    onChange={(e) => setFilterGender(e.target.value)}
                    className="input-field px-4 py-4 pr-10 appearance-none cursor-pointer bg-neutral-50 dark:bg-neutral-800"
                  >
                    <option value="all">All Genders</option>
                    <option value="male">👨 Male</option>
                    <option value="female">👩 Female</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none">
                    <FaFilter className="text-sm" />
                  </div>
                </div>

                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="input-field px-4 py-4 pr-10 appearance-none cursor-pointer bg-neutral-50 dark:bg-neutral-800"
                  >
                    <option value="all">All Status</option>
                    <option value="active">✅ Active</option>
                    <option value="inactive">⏸️ Inactive</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none">
                    <FaFilter className="text-sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchTerm || filterGender !== "all" || filterStatus !== "all") && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex flex-wrap gap-2"
              >
                {searchTerm && (
                  <span className="inline-flex items-center gap-2 px-3 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 text-sm rounded-xl">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm('')}
                      className="hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full p-0.5"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </span>
                )}
                {filterGender !== "all" && (
                  <span className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm rounded-xl">
                    Gender: {filterGender}
                    <button
                      onClick={() => setFilterGender('all')}
                      className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </span>
                )}
                {filterStatus !== "all" && (
                  <span className="inline-flex items-center gap-2 px-3 py-2 bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-200 text-sm rounded-xl">
                    Status: {filterStatus}
                    <button
                      onClick={() => setFilterStatus('all')}
                      className="hover:bg-success-200 dark:hover:bg-success-800 rounded-full p-0.5"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </span>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600 dark:text-neutral-400">Loading residents...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-error-100 dark:bg-error-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle className="text-error-500 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Error Loading Residents</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">{error}</p>
            <button
              onClick={fetchResidents}
              className="btn-primary"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Residents Grid */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mobile-card-grid"
          >
            {filteredResidents.length > 0 ? (
              filteredResidents.map((resident, index) => (
                <motion.div
                  key={resident.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  whileHover={{ y: -8 }}
                  className="card card-interactive group overflow-hidden"
                >
                  {/* Header with gradient background */}
                  <div className="relative p-6 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12" />
                    </div>

                    <div className="relative flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            {resident.avatar}
                          </div>
                          {/* Online status indicator */}
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                            resident.status === 'active' ? 'bg-success-500' : 'bg-neutral-400'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-xl text-white mb-1 truncate">
                            {resident.firstName} {resident.lastName}
                          </h3>
                          <p className="text-primary-100 text-sm font-medium">{resident.barangayId}</p>
                          <p className="text-primary-200 text-xs mt-1">
                            Age: {calculateAge(resident.dateOfBirth)} • {resident.occupation}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-200"
                          title="View Details"
                        >
                          <FaEye className="text-white text-sm" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-200"
                          title="Edit Resident"
                        >
                          <FaEdit className="text-white text-sm" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Contact Information */}
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
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getCivilStatusColor(resident.civilStatus)}`}>
                        {resident.civilStatus}
                      </span>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(resident.status)}`}>
                        {resident.status === 'active' ? '✅' : '⏸️'} {resident.status}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStatusChange(resident.id, resident.status === 'active' ? 'inactive' : 'active')}
                        className={`flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-all duration-200 ${
                          resident.status === 'active'
                            ? 'bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-300 hover:bg-error-100 dark:hover:bg-error-900/30 border border-error-200 dark:border-error-800'
                            : 'bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300 hover:bg-success-100 dark:hover:bg-success-900/30 border border-success-200 dark:border-success-800'
                        }`}
                      >
                        {resident.status === 'active' ? 'Deactivate' : 'Activate'}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleDeleteResident(resident.id)}
                        className="p-3 bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-300 rounded-xl hover:bg-error-100 dark:hover:bg-error-900/30 transition-all duration-200 border border-error-200 dark:border-error-800"
                        title="Delete Resident"
                      >
                        <FaTrash className="text-sm" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaUsers className="text-neutral-400 dark:text-neutral-500 text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">No residents found</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
                  {searchTerm || filterGender !== "all" || filterStatus !== "all"
                    ? "Try adjusting your search or filter criteria to find what you're looking for."
                    : "Get started by adding your first resident to the system."}
                </p>
                {(searchTerm || filterGender !== "all" || filterStatus !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterGender('all');
                      setFilterStatus('all');
                    }}
                    className="btn-secondary"
                  >
                    Clear all filters
                  </button>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Bulk Actions */}
        {selectedResidents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 surface-elevated p-6 rounded-2xl shadow-xl border-2 border-primary-200 dark:border-primary-800"
          >
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center">
                  <FaUsers className="text-primary-600 dark:text-primary-400" />
                </div>
                <span className="text-lg font-bold text-neutral-900 dark:text-white">
                  {selectedResidents.length} resident{selectedResidents.length > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-success-600 hover:bg-success-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 flex items-center gap-2"
                >
                  <FaUserCheck className="text-xs" />
                  Activate
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-warning-600 hover:bg-warning-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 flex items-center gap-2"
                >
                  <FaUserTimes className="text-xs" />
                  Deactivate
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-error-600 hover:bg-error-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 flex items-center gap-2"
                >
                  <FaTrash className="text-xs" />
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