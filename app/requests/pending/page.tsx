"use client";

import React, { useState } from "react";
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
  FaExclamationTriangle
} from "react-icons/fa";

interface Request {
  id: number;
  type: 'clearance' | 'permit' | 'certificate';
  title: string;
  description: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  requesterAddress: string;
  submittedDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending';
  documents: string[];
  notes?: string;
}

const PendingRequestsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [selectedRequests, setSelectedRequests] = useState<number[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  // Mock data - in real app this would come from API
  const [requests, setRequests] = useState<Request[]>([
    {
      id: 1,
      type: 'clearance',
      title: 'Barangay Clearance Certificate',
      description: 'Request for barangay clearance certificate for employment purposes.',
      requesterName: 'Juan Dela Cruz',
      requesterEmail: 'juan@example.com',
      requesterPhone: '+63 917 123 4567',
      requesterAddress: '123 Main St, Barangay Central',
      submittedDate: '2024-01-15T10:30:00',
      priority: 'high',
      status: 'pending',
      documents: ['Valid ID', 'Proof of Residence', 'Application Form'],
      notes: 'Urgent requirement for job application deadline next week.'
    },
    {
      id: 2,
      type: 'permit',
      title: 'Business Permit Application',
      description: 'Application for new business permit for small retail store.',
      requesterName: 'Maria Santos',
      requesterEmail: 'maria@example.com',
      requesterPhone: '+63 918 234 5678',
      requesterAddress: '456 Oak Ave, Barangay North',
      submittedDate: '2024-01-14T14:20:00',
      priority: 'medium',
      status: 'pending',
      documents: ['Business Plan', 'Location Sketch', 'DTI Registration'],
      notes: 'Business location inspection required.'
    },
    {
      id: 3,
      type: 'certificate',
      title: 'Certificate of Indigency',
      description: 'Request for certificate of indigency for medical assistance.',
      requesterName: 'Pedro Garcia',
      requesterEmail: 'pedro@example.com',
      requesterPhone: '+63 919 345 6789',
      requesterAddress: '789 Pine Rd, Barangay South',
      submittedDate: '2024-01-13T09:15:00',
      priority: 'urgent',
      status: 'pending',
      documents: ['Medical Certificate', 'Income Proof', 'Valid ID'],
      notes: 'Medical emergency - please prioritize processing.'
    },
    {
      id: 4,
      type: 'clearance',
      title: 'Police Clearance Certificate',
      description: 'Request for police clearance certificate for overseas employment.',
      requesterName: 'Ana Reyes',
      requesterEmail: 'ana@example.com',
      requesterPhone: '+63 920 456 7890',
      requesterAddress: '321 Elm St, Barangay East',
      submittedDate: '2024-01-12T16:45:00',
      priority: 'medium',
      status: 'pending',
      documents: ['Valid ID', 'Birth Certificate', 'Application Form'],
      notes: 'Required for visa application processing.'
    }
  ]);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requesterEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || request.type === filterType;
    const matchesPriority = filterPriority === "all" || request.priority === filterPriority;
    return matchesSearch && matchesType && matchesPriority;
  });

  const handleSelectRequest = (requestId: number) => {
    setSelectedRequests(prev =>
      prev.includes(requestId)
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    );
  };

  const handleSelectAll = () => {
    setSelectedRequests(
      selectedRequests.length === filteredRequests.length
        ? []
        : filteredRequests.map(request => request.id)
    );
  };

  const handleApproveRequest = (requestId: number) => {
    // In real app, this would make an API call
    setRequests(prev => prev.filter(request => request.id !== requestId));
    // You could add logic to move to approved requests
  };

  const handleRejectRequest = (requestId: number) => {
    // In real app, this would make an API call
    setRequests(prev => prev.filter(request => request.id !== requestId));
    // You could add logic to move to rejected requests
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'clearance': return 'bg-blue-100 text-blue-800';
      case 'permit': return 'bg-green-100 text-green-800';
      case 'certificate': return 'bg-purple-100 text-purple-800';
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
            <h1 className="text-3xl font-bold text-gray-800">Pending Requests</h1>
            <p className="text-gray-600 mt-1">Review and process pending barangay requests</p>
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
              title: "Total Pending",
              value: requests.length.toString(),
              icon: <FaClock className="text-yellow-500" />,
              bgColor: "bg-yellow-50"
            },
            {
              title: "Urgent Requests",
              value: requests.filter(r => r.priority === 'urgent').length.toString(),
              icon: <FaExclamationTriangle className="text-red-500" />,
              bgColor: "bg-red-50"
            },
            {
              title: "Clearance Requests",
              value: requests.filter(r => r.type === 'clearance').length.toString(),
              icon: <FaFileAlt className="text-blue-500" />,
              bgColor: "bg-blue-50"
            },
            {
              title: "Avg. Processing Time",
              value: "2.5 days",
              icon: <FaCalendarAlt className="text-green-500" />,
              bgColor: "bg-green-50"
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
                placeholder="Search requests by title, requester name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="clearance">Clearance</option>
                <option value="permit">Permit</option>
                <option value="certificate">Certificate</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(request.type)}`}>
                        {request.type}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(request.priority)}`}>
                        {request.priority}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{request.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{request.description}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedRequest(request)}
                      className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      title="View Details"
                    >
                      <FaEye className="text-sm" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Requester Info */}
              <div className="p-6 bg-gray-50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-blue-600 text-sm" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{request.requesterName}</h4>
                    <p className="text-sm text-gray-600">{getTimeAgo(request.submittedDate)}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-gray-400 text-xs" />
                    <span className="text-gray-600">{request.requesterEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-gray-400 text-xs" />
                    <span className="text-gray-600">{request.requesterPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-400 text-xs" />
                    <span className="text-gray-600">{request.requesterAddress}</span>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="p-6 border-t border-gray-100">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Submitted Documents:</h5>
                <div className="flex flex-wrap gap-2">
                  {request.documents.map((doc, docIndex) => (
                    <span
                      key={docIndex}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                    >
                      {doc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 border-t border-gray-100 bg-gray-50">
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
            </motion.div>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FaClock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No pending requests</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterType !== "all" || filterPriority !== "all"
                ? "Try adjusting your search or filter criteria."
                : "All caught up! No pending requests at the moment."}
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
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedRequest.title}</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(selectedRequest.type)}`}>
                        {selectedRequest.type}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(selectedRequest.priority)}`}>
                        {selectedRequest.priority} priority
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Requester Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <FaUser className="text-gray-400" />
                        <span className="font-medium">{selectedRequest.requesterName}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaEnvelope className="text-gray-400" />
                        <span>{selectedRequest.requesterEmail}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaPhone className="text-gray-400" />
                        <span>{selectedRequest.requesterPhone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span>{selectedRequest.requesterAddress}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Request Details</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-600">Submitted:</span>
                        <p className="font-medium">{new Date(selectedRequest.submittedDate).toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Description:</span>
                        <p className="mt-1">{selectedRequest.description}</p>
                      </div>
                      {selectedRequest.notes && (
                        <div>
                          <span className="text-sm text-gray-600">Notes:</span>
                          <p className="mt-1 text-gray-700">{selectedRequest.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Submitted Documents</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedRequest.documents.map((doc, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <FaFileAlt className="text-gray-400" />
                        <span className="text-sm">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50">
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
            </motion.div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default PendingRequestsPage;