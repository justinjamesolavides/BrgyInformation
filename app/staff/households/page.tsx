"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaHome,
  FaSearch,
  FaFilter,
  FaEye,
  FaUsers,
  FaPhone,
  FaMapMarkerAlt
} from "react-icons/fa";

interface Household {
  id: number;
  householdId: string;
  headOfHousehold: {
    id: number;
    name: string;
    relationship: string;
  };
  address: string;
  contactNumber: string;
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

const StaffHouseholdsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      case 'nuclear': return 'bg-blue-100 text-blue-800';
      case 'extended': return 'bg-green-100 text-green-800';
      case 'single_parent': return 'bg-orange-100 text-orange-800';
      case 'blended': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEconomicStatusColor = (status: string) => {
    switch (status) {
      case 'low': return 'bg-red-100 text-red-800';
      case 'middle': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-6 mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-2xl flex items-center justify-center shadow-lg">
            <FaHome className="text-amber-600 dark:text-amber-400 text-2xl" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-white font-display leading-tight">
              Household Directory
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-lg">
              View and manage barangay households
            </p>
          </div>
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
            title: "Total Households",
            value: households.length.toString(),
            icon: <FaHome className="text-amber-500" />,
            bgColor: "bg-amber-50 dark:bg-amber-900/20",
            iconBg: "bg-amber-100 dark:bg-amber-900/40"
          },
          {
            title: "Active Households",
            value: households.filter(h => h.status === 'active').length.toString(),
            icon: <FaUsers className="text-green-500" />,
            bgColor: "bg-green-50 dark:bg-green-900/20",
            iconBg: "bg-green-100 dark:bg-green-900/40"
          },
          {
            title: "Nuclear Families",
            value: households.filter(h => h.householdType === 'nuclear').length.toString(),
            icon: <FaUsers className="text-blue-500" />,
            bgColor: "bg-blue-50 dark:bg-blue-900/20",
            iconBg: "bg-blue-100 dark:bg-blue-900/40"
          },
          {
            title: "Extended Families",
            value: households.filter(h => h.householdType === 'extended').length.toString(),
            icon: <FaHome className="text-purple-500" />,
            bgColor: "bg-purple-50 dark:bg-purple-900/20",
            iconBg: "bg-purple-100 dark:bg-purple-900/40"
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
                <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`p-4 rounded-xl ${stat.iconBg} group-hover:scale-110 transition-transform duration-200`}>
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
        className="card mb-6"
      >
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400">
                <FaSearch className="text-lg" />
              </div>
              <input
                type="text"
                placeholder="Search households by ID, address, or head of household..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-12 pr-4 py-4 text-base"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="input-field px-4 py-4 pr-10 appearance-none cursor-pointer bg-neutral-50 dark:bg-neutral-800"
                >
                  <option value="all">All Types</option>
                  <option value="nuclear">Nuclear</option>
                  <option value="extended">Extended</option>
                  <option value="single_parent">Single Parent</option>
                  <option value="blended">Blended</option>
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
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none">
                  <FaFilter className="text-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Loading households...</p>
        </motion.div>
      )}

      {/* Error State */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-red-500 text-2xl" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Error Loading Households</h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">{error}</p>
          <button
            onClick={fetchHouseholds}
            className="btn-primary"
          >
            Try Again
          </button>
        </motion.div>
      )}

      {/* Households Grid */}
      {!loading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {households.length > 0 ? (
            households.map((household, index) => (
              <motion.div
                key={household.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ y: -4 }}
                className="card card-interactive group overflow-hidden"
              >
                {/* Header */}
                <div className="relative p-6 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white overflow-hidden">
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12" />
                  </div>

                  <div className="relative flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          <FaHome className="text-2xl" />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          household.status === 'active' ? 'bg-green-500' : 'bg-neutral-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xl text-white mb-1">
                          {household.householdId}
                        </h3>
                        <p className="text-amber-100 text-sm font-medium">{household.headOfHousehold.name}</p>
                        <p className="text-amber-200 text-xs mt-1">
                          {household.totalMembers} members • {household.householdType}
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
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Address */}
                  <div className="flex items-start gap-3 text-sm mb-4">
                    <div className="w-8 h-8 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FaMapMarkerAlt className="text-neutral-500 dark:text-neutral-400 text-xs" />
                    </div>
                    <span className="text-neutral-700 dark:text-neutral-300 font-medium leading-relaxed">
                      {household.address}
                    </span>
                  </div>

                  {/* Contact */}
                  {household.contactNumber && (
                    <div className="flex items-center gap-3 text-sm mb-4">
                      <div className="w-8 h-8 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaPhone className="text-neutral-500 dark:text-neutral-400 text-xs" />
                      </div>
                      <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                        {household.contactNumber}
                      </span>
                    </div>
                  )}

                  {/* Household Info */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getHouseholdTypeColor(household.householdType)}`}>
                      {household.householdType.replace('_', ' ')}
                    </span>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getEconomicStatusColor(household.economicStatus)}`}>
                      {household.economicStatus}
                    </span>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(household.status)}`}>
                      {household.status}
                    </span>
                  </div>

                  {/* Members Preview */}
                  <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Household Members ({household.members.length})
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {household.members.slice(0, 3).map((member, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                            {member.name}
                          </span>
                          <span className="text-neutral-500 dark:text-neutral-400 text-xs">
                            {member.relationship} • {member.age}y
                          </span>
                        </div>
                      ))}
                      {household.members.length > 3 && (
                        <div className="text-center">
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            +{household.members.length - 3} more members
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full text-center py-16"
            >
              <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaHome className="text-neutral-400 dark:text-neutral-500 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">No households found</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
                {searchTerm || filterType !== "all" || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria to find what you're looking for."
                  : "No households available at this time."}
              </p>
              {(searchTerm || filterType !== "all" || filterStatus !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterType('all');
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
    </div>
  );
};

export default StaffHouseholdsPage;