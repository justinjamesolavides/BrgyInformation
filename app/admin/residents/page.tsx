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
  FaUserFriends,
  FaTrash
} from "react-icons/fa";
import Link from "next/link";
import ViewResidentModal from "./components/ViewResidentModal";
import EditResidentModal from "./components/EditResidentModal";
import DeleteResidentModal from "./components/DeleteResidentModal";

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

  // Modal states
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  // Modal handlers
  const handleViewResident = (resident: Resident) => {
    setSelectedResident(resident);
    setIsViewModalOpen(true);
  };

  const handleEditResident = (resident: Resident) => {
    setSelectedResident(resident);
    setIsEditModalOpen(true);
  };

  const handleDeleteResident = (resident: Resident) => {
    setSelectedResident(resident);
    setIsDeleteModalOpen(true);
  };

  const handleResidentUpdated = (updatedResident: Resident) => {
    setResidents(prev => prev.map(resident =>
      resident.id === updatedResident.id ? updatedResident : resident
    ));
  };

  const handleResidentDeleted = (residentId: number) => {
    setResidents(prev => prev.filter(resident => resident.id !== residentId));
  };

  const closeAllModals = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedResident(null);
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
    <div className="p-4 md:p-6 bg-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm">
            <FaUsers className="text-blue-600 text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Resident Management
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Admin access to resident records and management
            </p>
          </div>
        </div>

        {/* Add Resident Button */}
        <Link href="/admin/residents/add">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-sm font-medium"
          >
            <FaUserPlus className="text-xs" />
            Add
          </motion.button>
        </Link>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaSearch className="text-sm" />
              </div>
              <input
                type="text"
                placeholder="Search residents by name, email, or barangay ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition w-full md:w-32"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition w-full md:w-32"
            >
              <option value="all">All</option>
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
        className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
      >
        {/* Table Header */}
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2.5">
            <FaUsers className="text-gray-500 text-sm" />
            <h3 className="text-sm font-semibold text-gray-800">
              Residents ({residents.length})
            </h3>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-600 text-sm">Loading residents...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaUserTimes className="text-red-500 text-lg" />
              </div>
              <p className="text-red-600 font-medium mb-1">Error loading residents</p>
              <p className="text-gray-600 text-sm">{error}</p>
            </div>
          ) : residents.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaUsers className="text-gray-400 text-lg" />
              </div>
              <p className="text-gray-600 font-medium mb-1">No residents found</p>
              <p className="text-gray-500 text-sm">
                {searchTerm || filterStatus !== 'all' || filterGender !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first resident'
                }
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Resident</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Details</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {residents.map((resident, index) => (
                  <motion.tr
                    key={resident.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {resident.profileImage ? (
                            <img
                              src={resident.profileImage}
                              alt={`${resident.firstName} ${resident.lastName}`}
                              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                              <span className="text-xs font-bold text-blue-600">
                                {resident.avatar}
                              </span>
                            </div>
                          )}
                          <div className="absolute -bottom-0.5 -right-0.5">
                            {getGenderIcon(resident.gender)}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 text-sm">
                            {resident.firstName} {resident.middleName} {resident.lastName}
                          </div>
                          <div className="text-xs text-gray-600">
                            ID: {resident.barangayId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-sm">
                          <FaEnvelope className="text-gray-400 text-xs" />
                          <span className="text-gray-900 text-xs">{resident.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm">
                          <FaPhone className="text-gray-400 text-xs" />
                          <span className="text-gray-900 text-xs">{resident.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-sm">
                          <FaCalendarAlt className="text-gray-400 text-xs" />
                          <span className="text-gray-600 text-xs">
                            Age: {calculateAge(resident.dateOfBirth)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          {resident.occupation || 'No occupation specified'}
                        </div>
                        {resident.familyHead && (
                          <div className="flex items-center gap-1.5 text-sm">
                            <FaUserFriends className="text-gray-400 text-xs" />
                            <span className="text-gray-600 text-xs">
                              Family: {resident.familyHead}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(resident.status)}`}>
                        {resident.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleViewResident(resident)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View Resident Details"
                        >
                          <FaEye className="text-xs" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditResident(resident)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                          title="Edit Resident"
                        >
                          <FaEdit className="text-xs" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteResident(resident)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Resident"
                        >
                          <FaTrash className="text-xs" />
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

      {/* View Resident Modal */}
      <ViewResidentModal
        isOpen={isViewModalOpen}
        onClose={closeAllModals}
        resident={selectedResident}
      />

      {/* Edit Resident Modal */}
      <EditResidentModal
        isOpen={isEditModalOpen}
        onClose={closeAllModals}
        resident={selectedResident}
        onResidentUpdated={handleResidentUpdated}
      />

      {/* Delete Resident Modal */}
      <DeleteResidentModal
        isOpen={isDeleteModalOpen}
        onClose={closeAllModals}
        resident={selectedResident}
        onResidentDeleted={handleResidentDeleted}
      />
    </div>
  );
};

export default AdminResidentsPage;