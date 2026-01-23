"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaHome,
  FaPlus,
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrash,
  FaEye,
  FaUsers,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaDownload,
  FaUserCheck,
  FaExclamationCircle
} from "react-icons/fa";
import AddHouseholdModal from "./components/AddHouseholdModal";

interface Household {
  id: number;
  householdId: string;
  headOfHousehold: {
    id: number;
    name: string;
    relationship: string;
  };
  address: string;
  contactNumber?: string;
  householdType: string;
  economicStatus: string;
  totalMembers: number;
  members: Array<{
    id: number;
    name: string;
    relationship: string;
    age: number;
  }>;
  barangayId: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

const AdminHouseholdsPage: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch households from API
  useEffect(() => {
    fetchHouseholds();
  }, []);

  const fetchHouseholds = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterType !== 'all') params.append('type', filterType);

      const response = await fetch(`/api/households?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch households');
      }

      setHouseholds(data.data || []);
    } catch (err: any) {
      console.error('Error fetching households:', err);
      setError(err.message || 'Failed to load households');
    } finally {
      setLoading(false);
    }
  };

  // Refetch when filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchHouseholds();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, filterStatus, filterType]);

  const getHouseholdTypeColor = (type: string) => {
    switch (type) {
      case 'nuclear': return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'extended': return 'bg-green-100 text-green-700 border border-green-200';
      case 'single_parent': return 'bg-orange-100 text-orange-700 border border-orange-200';
      case 'blended': return 'bg-purple-100 text-purple-700 border border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const getEconomicStatusColor = (status: string) => {
    switch (status) {
      case 'low': return 'bg-red-100 text-red-700 border border-red-200';
      case 'middle': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      case 'high': return 'bg-green-100 text-green-700 border border-green-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200';
  };

  const handleHouseholdAdded = (newHousehold: Household) => {
    setHouseholds(prev => [newHousehold, ...prev]);
  };

  return (
    <div className="p-4 md:p-6 bg-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm">
            <FaHome className="text-blue-600 text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Household Management
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Manage barangay households and family units
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-sm font-medium"
        >
          <FaPlus className="text-xs" />
          Add
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {[
          {
            title: "Total Households",
            value: households.length.toString(),
            icon: <FaHome className="text-blue-500" />,
            color: "blue"
          },
          {
            title: "Active Households",
            value: households.filter(h => h.status === 'active').length.toString(),
            icon: <FaUserCheck className="text-green-500" />,
            color: "green"
          },
          {
            title: "Nuclear Families",
            value: households.filter(h => h.householdType === 'nuclear').length.toString(),
            icon: <FaUsers className="text-purple-500" />,
            color: "purple"
          },
          {
            title: "Extended Families",
            value: households.filter(h => h.householdType === 'extended').length.toString(),
            icon: <FaUsers className="text-orange-500" />,
            color: "orange"
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            whileHover={{ y: -2 }}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  {stat.title}
                </p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
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
        className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FaSearch className="text-sm" />
            </div>
            <input
              type="text"
              placeholder="Search households by ID, address, or head of household..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition w-full md:w-36"
            >
              <option value="all">All Types</option>
              <option value="nuclear">Nuclear</option>
              <option value="extended">Extended</option>
              <option value="single_parent">Single</option>
              <option value="blended">Blended</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition w-full md:w-32"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </motion.div>

            {/* Households List */}
            {!loading && !error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                {households.length > 0 ? (
                  households.map((household, index) => (
                    <motion.div
                      key={household.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      whileHover={{ y: -2 }}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
                    >
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FaHome className="text-blue-600 text-sm" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-sm">
                                {household.householdId}
                              </h3>
                              <p className="text-gray-600 text-xs">
                                Head: {household.headOfHousehold.name}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-1">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                              title="View Details"
                            >
                              <FaEye className="text-gray-600 text-xs" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                              title="Edit Household"
                            >
                              <FaEdit className="text-gray-600 text-xs" />
                            </motion.button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-red-500 text-xs" />
                            <span className="text-xs text-gray-700 truncate">
                              {household.address}
                            </span>
                          </div>

                          {household.contactNumber && (
                            <div className="flex items-center gap-2">
                              <FaPhone className="text-green-500 text-xs" />
                              <span className="text-xs text-gray-700">
                                {household.contactNumber}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <FaUsers className="text-purple-500 text-xs" />
                            <span className="text-xs text-gray-700">
                              {household.totalMembers} members
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-blue-500 text-xs" />
                            <span className="text-xs text-gray-700">
                              {new Date(household.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getHouseholdTypeColor(household.householdType)}`}>
                            {household.householdType.replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getEconomicStatusColor(household.economicStatus)}`}>
                            {household.economicStatus}
                          </span>
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(household.status)}`}>
                            {household.status}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <FaHome className="text-gray-400 text-xl" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">No households found</h3>
                    <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto">
                      {searchTerm || filterType !== "all" || filterStatus !== "all"
                        ? "Try adjusting your search or filter criteria to find what you're looking for."
                        : "Get started by adding your first household to the system."}
                    </p>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Add First Household
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center py-12"
        >
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Loading households...</p>
        </motion.div>
      )}

      {/* Error State */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center py-12"
        >
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FaExclamationCircle className="text-red-500 text-lg" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Error Loading Households</h3>
          <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto">{error}</p>
          <button
            onClick={fetchHouseholds}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      )}

      {/* Add Household Modal */}
      <AddHouseholdModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onHouseholdAdded={handleHouseholdAdded}
      />
    </div>
  );
};

export default AdminHouseholdsPage