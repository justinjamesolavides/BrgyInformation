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
  FaMapMarkerAlt,
  FaExclamationTriangle
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
    <div className="p-4 md:p-6 bg-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shadow-sm">
            <FaHome className="text-amber-600 text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Household Directory
            </h1>
            <p className="text-gray-600 text-sm mt-1">
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {[
          {
            title: "Total Households",
            value: households.length.toString(),
            icon: <FaHome className="text-amber-500" />,
            bgColor: "bg-amber-50",
            iconBg: "bg-amber-100"
          },
          {
            title: "Active Households",
            value: households.filter(h => h.status === 'active').length.toString(),
            icon: <FaUsers className="text-green-500" />,
            bgColor: "bg-green-50",
            iconBg: "bg-green-100"
          },
          {
            title: "Nuclear Families",
            value: households.filter(h => h.householdType === 'nuclear').length.toString(),
            icon: <FaUsers className="text-blue-500" />,
            bgColor: "bg-blue-50",
            iconBg: "bg-blue-100"
          },
          {
            title: "Extended Families",
            value: households.filter(h => h.householdType === 'extended').length.toString(),
            icon: <FaHome className="text-purple-500" />,
            bgColor: "bg-purple-50",
            iconBg: "bg-purple-100"
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
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${stat.iconBg}`}>
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
        <div>
          <div className="flex flex-col md:flex-row gap-3">
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
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 pr-8 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="all">All Types</option>
                  <option value="nuclear">Nuclear</option>
                  <option value="extended">Extended</option>
                  <option value="single_parent">Single Parent</option>
                  <option value="blended">Blended</option>
                </select>
                <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  <FaFilter className="text-sm" />
                </div>
              </div>

              <div className="relative flex-1">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 pr-8 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
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
          className="text-center py-12"
        >
          <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Loading households...</p>
        </motion.div>
      )}

      {/* Error State */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FaExclamationTriangle className="text-red-500 text-lg" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Error Loading Households</h3>
          <p className="text-gray-600 mb-4 max-w-md mx-auto text-sm">{error}</p>
          <button
            onClick={fetchHouseholds}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
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
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          {households.length > 0 ? (
            households.map((household, index) => (
              <motion.div
                key={household.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ y: -2 }}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Header */}
                <div className="relative p-4 bg-amber-500 text-white rounded-t-lg">
                  <div className="relative flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          <FaHome className="text-lg" />
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-white ${
                          household.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-white mb-0.5">
                          {household.householdId}
                        </h3>
                        <p className="text-amber-100 text-xs font-medium">{household.headOfHousehold.name}</p>
                        <p className="text-amber-200 text-xs mt-1">
                          {household.totalMembers} members • {household.householdType}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-1">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-1.5 bg-white/30 rounded-lg hover:bg-white/40 transition-all duration-200"
                        title="View Details"
                      >
                        <FaEye className="text-white text-xs" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Address */}
                  <div className="flex items-start gap-2.5 text-sm mb-3">
                    <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FaMapMarkerAlt className="text-gray-500 text-xs" />
                    </div>
                    <span className="text-gray-700 font-medium text-xs leading-relaxed">
                      {household.address}
                    </span>
                  </div>

                  {/* Contact */}
                  {household.contactNumber && (
                    <div className="flex items-center gap-2.5 text-sm mb-3">
                      <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaPhone className="text-gray-500 text-xs" />
                      </div>
                      <span className="text-gray-700 font-medium text-xs">
                        {household.contactNumber}
                      </span>
                    </div>
                  )}

                  {/* Household Info */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className={`px-2 py-0.5 text-[0.6rem] font-medium rounded ${getHouseholdTypeColor(household.householdType)}`}>
                      {household.householdType.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-0.5 text-[0.6rem] font-medium rounded ${getEconomicStatusColor(household.economicStatus)}`}>
                      {household.economicStatus}
                    </span>
                    <span className={`px-2 py-0.5 text-[0.6rem] font-medium rounded ${getStatusColor(household.status)}`}>
                      {household.status}
                    </span>
                  </div>

                  {/* Members Preview */}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-medium text-gray-900">
                        Household Members ({household.members.length})
                      </h4>
                    </div>
                    <div className="space-y-1.5">
                      {household.members.slice(0, 3).map((member, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700 font-medium text-xs">
                            {member.name}
                          </span>
                          <span className="text-gray-500 text-[0.6rem]">
                            {member.relationship} • {member.age}y
                          </span>
                        </div>
                      ))}
                      {household.members.length > 3 && (
                        <div className="text-center">
                          <span className="text-[0.6rem] text-gray-500">
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
              className="col-span-full text-center py-12"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHome className="text-gray-400 text-lg" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No households found</h3>
              <p className="text-gray-600 mb-3 max-w-md mx-auto text-sm">
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
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg text-xs font-medium"
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