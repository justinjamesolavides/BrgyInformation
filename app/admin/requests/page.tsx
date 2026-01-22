"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import { motion } from "framer-motion";
import {
  FaClock,
  FaCheck,
  FaTimes,
  FaEye,
  FaFileAlt,
  FaUser,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaFilter,
  FaSearch,
  FaDownload,
  FaExclamationTriangle,
  FaPlus
} from "react-icons/fa";
import Link from "next/link";

interface Request {
  id: number;
  type: 'clearance' | 'permit' | 'certificate' | 'residency';
  title: string;
  description: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  requesterAddress: string;
  submittedDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'rejected';
  documents: string[];
  notes?: string;
}

const AdminRequestsPage: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch requests from API
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`/api/requests?status=${filterStatus}&type=${filterType}&priority=${filterPriority}&search=${searchTerm}`);
        if (response.ok) {
          const data = await response.json();
          setRequests(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounced search
    const handler = setTimeout(() => {
      fetchRequests();
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [filterStatus, filterType, filterPriority, searchTerm]);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requesterEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleApproveRequest = async (requestId: number) => {
    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (response.ok) {
        setRequests(prev => prev.map(req => 
          req.id === requestId ? { ...req, status: 'approved' } : req
        ));
      }
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'rejected' }),
      });

      if (response.ok) {
        setRequests(prev => prev.map(req => 
          req.id === requestId ? { ...req, status: 'rejected' } : req
        ));
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'clearance': return 'bg-blue-100 text-blue-800';
      case 'permit': return 'bg-green-100 text-green-800';
      case 'certificate': return 'bg-purple-100 text-purple-800';
      case 'residency': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-neutral-900">
      <Sidebar />
      
      <div className="ml-64 flex-1 p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Requests</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Review and process barangay requests</p>
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
              icon: <FaFileAlt className="text-blue-500" />,
              bgColor: "bg-blue-50 dark:bg-blue-900/20"
            },
            {
              title: "Pending",
              value: requests.filter(r => r.status === 'pending').length.toString(),
              icon: <FaClock className="text-yellow-500" />,
              bgColor: "bg-yellow-50 dark:bg-yellow-900/20"
            },
            {
              title: "Approved",
              value: requests.filter(r => r.status === 'approved').length.toString(),
              icon: <FaCheck className="text-green-500" />,
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
              whileHover={{ y: -2 }}
              className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
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
          className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search requests by title, requester name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="clearance">Clearance</option>
                <option value="permit">Permit</option>
                <option value="certificate">Certificate</option>
                <option value="residency">Residency</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Requests List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-neutral-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(request.type)}`}>
                          {request.type}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(request.priority)}`}>
                          {request.priority}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{request.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{request.description}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedRequest(request)}
                        className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                        title="View Details"
                      >
                        <FaEye className="text-sm" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Requester Info */}
                <div className="p-6 bg-gray-50 dark:bg-neutral-700/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <FaUser className="text-blue-600 dark:text-blue-400 text-sm" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white">{request.requesterName}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{getTimeAgo(request.submittedDate)}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-gray-400 text-xs" />
                      <span className="text-gray-600 dark:text-gray-400">{request.requesterEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-gray-400 text-xs" />
                      <span className="text-gray-600 dark:text-gray-400">{request.requesterPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-gray-400 text-xs" />
                      <span className="text-gray-600 dark:text-gray-400">{request.requesterAddress}</span>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="p-6 border-t border-gray-100 dark:border-neutral-700">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Submitted Documents:</h5>
                  <div className="flex flex-wrap gap-2">
                    {request.documents.map((doc, docIndex) => (
                      <span
                        key={docIndex}
                        className="px-2 py-1 bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 text-xs rounded-md"
                      >
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                {request.status === 'pending' && (
                  <div className="p-6 border-t border-gray-100 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-700/50">
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleApproveRequest(request.id)}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <FaCheck className="text-sm" />
                        Approve
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRejectRequest(request.id)}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <FaTimes className="text-sm" />
                        Reject
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {filteredRequests.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FaFileAlt className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No requests found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm || filterType !== "all" || filterPriority !== "all" || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No requests at the moment."}
            </p>
          </motion.div>
        )}

        {/* Request Detail Modal */}
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedRequest(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-neutral-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{selectedRequest.title}</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(selectedRequest.type)}`}>
                        {selectedRequest.type}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(selectedRequest.priority)}`}>
                        {selectedRequest.priority} priority
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedRequest.status)}`}>
                        {selectedRequest.status}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Requester Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <FaUser className="text-gray-400 dark:text-gray-500" />
                        <span className="font-medium text-gray-800 dark:text-white">{selectedRequest.requesterName}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaEnvelope className="text-gray-400 dark:text-gray-500" />
                        <span className="text-gray-700 dark:text-gray-300">{selectedRequest.requesterEmail}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaPhone className="text-gray-400 dark:text-gray-500" />
                        <span className="text-gray-700 dark:text-gray-300">{selectedRequest.requesterPhone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaMapMarkerAlt className="text-gray-400 dark:text-gray-500" />
                        <span className="text-gray-700 dark:text-gray-300">{selectedRequest.requesterAddress}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Request Details</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Submitted:</span>
                        <p className="font-medium text-gray-800 dark:text-white">{new Date(selectedRequest.submittedDate).toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Description:</span>
                        <p className="mt-1 text-gray-700 dark:text-gray-300">{selectedRequest.description}</p>
                      </div>
                      {selectedRequest.notes && (
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">Notes:</span>
                          <p className="mt-1 text-gray-700 dark:text-gray-300">{selectedRequest.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Submitted Documents</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedRequest.documents.map((doc, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                        <FaFileAlt className="text-gray-400 dark:text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedRequest.status === 'pending' && (
                <div className="p-6 border-t border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-700/50">
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        handleApproveRequest(selectedRequest.id);
                        setSelectedRequest(null);
                      }}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaCheck className="text-sm" />
                      Approve Request
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        handleRejectRequest(selectedRequest.id);
                        setSelectedRequest(null);
                      }}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaTimes className="text-sm" />
                      Reject Request
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminRequestsPage;