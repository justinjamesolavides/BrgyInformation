"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaClipboardList,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExclamationTriangle,
  FaEye,
  FaFilter,
  FaSearch
} from "react-icons/fa";

interface Request {
  id: number;
  type: string;
  requester: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedDate: string;
  deadline?: string;
}

const StaffRequestsContent: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - in real app this would come from API
  const [requests] = useState<Request[]>([
    {
      id: 1,
      type: "Barangay Clearance",
      requester: "Juan Dela Cruz",
      description: "Certificate of residency for employment purposes",
      status: "pending",
      priority: "medium",
      submittedDate: "2024-01-15",
      deadline: "2024-01-20"
    },
    {
      id: 2,
      type: "Business Permit",
      requester: "Maria Santos",
      description: "Food cart business permit application",
      status: "approved",
      priority: "high",
      submittedDate: "2024-01-10",
      deadline: "2024-01-18"
    },
    {
      id: 3,
      type: "Certificate of Indigency",
      requester: "Pedro Garcia",
      description: "Medical assistance application",
      status: "pending",
      priority: "urgent",
      submittedDate: "2024-01-14",
      deadline: "2024-01-16"
    },
    {
      id: 4,
      type: "Barangay Clearance",
      requester: "Ana Reyes",
      description: "School enrollment clearance",
      status: "rejected",
      priority: "low",
      submittedDate: "2024-01-12"
    }
  ]);

  const filteredRequests = requests.filter(request => {
    const matchesStatus = filterStatus === "all" || request.status === filterStatus;
    const matchesSearch = request.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <FaClock className="text-yellow-500" />;
      case 'approved': return <FaCheckCircle className="text-green-500" />;
      case 'rejected': return <FaTimesCircle className="text-red-500" />;
      default: return <FaClock className="text-gray-500" />;
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6"
      >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                <FaClipboardList className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white font-display">
                  Staff - Request Processing
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  Review and process barangay requests (Staff Access)
                </p>
              </div>
            </div>
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
              title: "Total Requests",
              value: requests.length.toString(),
              icon: <FaClipboardList className="text-blue-500" />,
              bgColor: "bg-blue-50 dark:bg-blue-900/20"
            },
            {
              title: "Pending Review",
              value: requests.filter(r => r.status === 'pending').length.toString(),
              icon: <FaClock className="text-yellow-500" />,
              bgColor: "bg-yellow-50 dark:bg-yellow-900/20"
            },
            {
              title: "Approved",
              value: requests.filter(r => r.status === 'approved').length.toString(),
              icon: <FaCheckCircle className="text-green-500" />,
              bgColor: "bg-green-50 dark:bg-green-900/20"
            },
            {
              title: "Urgent",
              value: requests.filter(r => r.priority === 'urgent').length.toString(),
              icon: <FaExclamationTriangle className="text-red-500" />,
              bgColor: "bg-red-50 dark:bg-red-900/20"
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.1, duration: 0.3 }}
              whileHover={{ y: -2, scale: 1.02 }}
              className="card"
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
                <div className={`p-4 rounded-xl ${stat.bgColor}`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
                  placeholder="Search requests by requester, type, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-12 pr-4 py-4 text-base"
                />
              </div>

              <div className="flex gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="input-field px-4 py-4 pr-10 appearance-none cursor-pointer bg-neutral-50 dark:bg-neutral-800"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Requests List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {filteredRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="card hover:shadow-md transition-all duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                        {request.type}
                      </h3>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(request.priority)}`}>
                        {request.priority}
                      </span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                      Requested by: <span className="font-medium text-neutral-900 dark:text-white">{request.requester}</span>
                    </p>
                    <p className="text-neutral-700 dark:text-neutral-300">{request.description}</p>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {getStatusIcon(request.status)}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    Submitted: {new Date(request.submittedDate).toLocaleDateString()}
                    {request.deadline && (
                      <span className="ml-4 text-red-600 dark:text-red-400">
                        Deadline: {new Date(request.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <FaEye className="text-xs" />
                      View Details
                    </motion.button>
                  </div>
                </div>

                {/* Staff Notice */}
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    👤 Staff Access: Can review and recommend approval. Final approval requires admin authorization.
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredRequests.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaClipboardList className="text-neutral-400 dark:text-neutral-500 text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">No requests found</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No requests available for staff review."}
            </p>
          </motion.div>
      )}
    </div>
  );
};

const StaffRequestsPage: React.FC = () => {
  return <StaffRequestsContent />;
};

export default StaffRequestsPage;