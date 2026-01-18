"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaUserPlus,
  FaSearch,
  FaFilter,
  FaEdit,
  FaEye,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMale,
  FaFemale,
  FaUserCheck,
  FaUserTimes,
  FaUserFriends
} from "react-icons/fa";
import AddResidentModal from "./components/AddResidentModal";

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

const AdminResidentsPage: React.FC = () => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterGender, setFilterGender] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, filterStatus, filterGender]);

  const handleResidentAdded = (newResident: Resident) => {
    setResidents(prev => [newResident, ...prev]);
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case 'male': return <FaMale className="text-blue-500" />;
      case 'female': return <FaFemale className="text-pink-500" />;
      default: return <FaUsers className="text-gray-500" />;
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

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center shadow-lg">
            <FaUsers className="text-blue-600 dark:text-blue-400 text-2xl" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-white font-display">
              Resident Management
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-lg">
              Admin access to resident records and management
            </p>
          </div>
        </div>

        {/* Add Resident Button */}
        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.4), 0 10px 10px -5px rgba(59, 130, 246, 0.2)"
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-10 py-5 rounded-2xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-4 shadow-xl hover:shadow-2xl font-bold text-lg relative overflow-hidden group"
          animate={{
            boxShadow: [
              "0 4px 6px -1px rgba(59, 130, 246, 0.3)",
              "0 10px 15px -3px rgba(59, 130, 246, 0.2)",
              "0 4px 6px -1px rgba(59, 130, 246, 0.3)"
            ]
          }}
          transition={{
            boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          {/* Animated background effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <FaUserPlus className="text-2xl relative z-10 group-hover:rotate-12 transition-transform duration-300" />
          <span className="relative z-10">Add New Resident</span>
        </motion.button>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-700 p-6 mb-8"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaSearch className="text-sm" />
              </div>
              <input
                type="text"
                placeholder="Search residents by name, email, or barangay ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 dark:text-white cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 dark:text-white cursor-pointer"
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Residents List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-700 overflow-hidden"
      >
        {/* Table Header */}
        <div className="bg-gray-50 dark:bg-neutral-700 px-6 py-4 border-b border-gray-200 dark:border-neutral-600">
          <div className="flex items-center gap-3">
            <FaUsers className="text-gray-500 dark:text-neutral-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Residents ({residents.length})
            </h3>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-neutral-400">Loading residents...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUserTimes className="text-red-500 text-2xl" />
              </div>
              <p className="text-red-600 dark:text-red-400 font-medium mb-2">Error loading residents</p>
              <p className="text-gray-600 dark:text-neutral-400 text-sm">{error}</p>
            </div>
          ) : residents.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-gray-400 dark:text-neutral-500 text-2xl" />
              </div>
              <p className="text-gray-600 dark:text-neutral-400 font-medium mb-2">No residents found</p>
              <p className="text-gray-500 dark:text-neutral-500 text-sm">
                {searchTerm || filterStatus !== 'all' || filterGender !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first resident'
                }
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-neutral-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-neutral-400 uppercase tracking-wider">Resident</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-neutral-400 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-neutral-400 uppercase tracking-wider">Details</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-neutral-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-neutral-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-600">
                {residents.map((resident, index) => (
                  <motion.tr
                    key={resident.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          {resident.profileImage ? (
                            <img
                              src={resident.profileImage}
                              alt={`${resident.firstName} ${resident.lastName}`}
                              className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-neutral-600 shadow-sm"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-full flex items-center justify-center border-2 border-white dark:border-neutral-600 shadow-sm">
                              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                {resident.avatar}
                              </span>
                            </div>
                          )}
                          <div className="absolute -bottom-1 -right-1">
                            {getGenderIcon(resident.gender)}
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {resident.firstName} {resident.middleName} {resident.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-neutral-400">
                            ID: {resident.barangayId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <FaEnvelope className="text-gray-400 text-xs" />
                          <span className="text-gray-900 dark:text-white">{resident.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FaPhone className="text-gray-400 text-xs" />
                          <span className="text-gray-900 dark:text-white">{resident.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <FaCalendarAlt className="text-gray-400 text-xs" />
                          <span className="text-gray-600 dark:text-neutral-400">
                            Age: {calculateAge(resident.dateOfBirth)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-neutral-400">
                          {resident.occupation || 'No occupation specified'}
                        </div>
                        {resident.familyHead && (
                          <div className="flex items-center gap-2 text-sm">
                            <FaUserFriends className="text-gray-400 text-xs" />
                            <span className="text-gray-600 dark:text-neutral-400">
                              Family: {resident.familyHead}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(resident.status)}`}>
                        {resident.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FaEye className="text-sm" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                          title="Edit Resident"
                        >
                          <FaEdit className="text-sm" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>

      {/* Add Resident Modal */}
      <AddResidentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onResidentAdded={handleResidentAdded}
      />
    </div>
  );
};

export default AdminResidentsPage;