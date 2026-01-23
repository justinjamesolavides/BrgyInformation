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
                <FaClipboardList className="text-blue-600 text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Staff - Request Processing
                </h1>
                <p className="text-gray-600 text-sm mt-1">
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
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        >
          {[
            {
              title: "Total Requests",
              value: requests.length.toString(),
              icon: <FaClipboardList className="text-blue-500" />,
              bgColor: "bg-blue-50"
            },
            {
              title: "Pending Review",
              value: requests.filter(r => r.status === 'pending').length.toString(),
              icon: <FaClock className="text-yellow-500" />,
              bgColor: "bg-yellow-50"
            },
            {
              title: "Approved",
              value: requests.filter(r => r.status === 'approved').length.toString(),
              icon: <FaCheckCircle className="text-green-500" />,
              bgColor: "bg-green-50"
            },
            {
              title: "Urgent",
              value: requests.filter(r => r.priority === 'urgent').length.toString(),
              icon: <FaExclamationTriangle className="text-red-500" />,
              bgColor: "bg-red-50"
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.1, duration: 0.3 }}
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
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
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
                  placeholder="Search requests by requester, type, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none appearance-none cursor-pointer"
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
          className="space-y-3"
        >
          {filteredRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-base font-semibold text-gray-900">
                        {request.type}
                      </h3>
                      <span className={`px-2 py-0.5 text-[0.6rem] font-medium rounded ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                      <span className={`px-2 py-0.5 text-[0.6rem] font-medium rounded ${getPriorityColor(request.priority)}`}>
                        {request.priority}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2 text-sm">
                      Requested by: <span className="font-medium text-gray-900">{request.requester}</span>
                    </p>
                    <p className="text-gray-700 text-sm">{request.description}</p>
                  </div>

                  <div className="flex items-center gap-1.5 ml-3">
                    {getStatusIcon(request.status)}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Submitted: {new Date(request.submittedDate).toLocaleDateString()}
                    {request.deadline && (
                      <span className="ml-3 text-red-600">
                        Deadline: {new Date(request.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1.5 text-xs"
                    >
                      <FaEye className="text-xs" />
                      View Details
                    </motion.button>
                  </div>
                </div>

                {/* Staff Notice */}
                <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200 mt-3">
                  <p className="text-[0.6rem] text-blue-800">
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
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaClipboardList className="text-gray-400 text-lg" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No requests found</h3>
            <p className="text-gray-600 text-sm max-w-md mx-auto">
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