"use client";

import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { motion } from "framer-motion";
import {
  FaTimesCircle,
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
  FaRedo,
  FaExclamationTriangle
} from "react-icons/fa";

interface RejectedRequest {
  id: number;
  type: 'clearance' | 'permit' | 'certificate';
  title: string;
  description: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  requesterAddress: string;
  submittedDate: string;
  rejectedDate: string;
  rejectedBy: string;
  rejectionReason: string;
  status: 'rejected';
  documents: string[];
  canReapply: boolean;
  reapplyDeadline?: string;
}

const RejectedRequestsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<RejectedRequest | null>(null);

  // Mock data - in real app this would come from API
  const [requests, setRequests] = useState<RejectedRequest[]>([
    {
      id: 1,
      type: 'permit',
      title: 'Business Permit Application',
      description: 'Application for new business permit for food cart business.',
      requesterName: 'Elena Torres',
      requesterEmail: 'elena@example.com',
      requesterPhone: '+63 924 890 1234',
      requesterAddress: '147 Pineapple St, Barangay South',
      submittedDate: '2024-01-09T11:30:00',
      rejectedDate: '2024-01-11T09:15:00',
      rejectedBy: 'Barangay Zoning Officer Maria Cruz',
      rejectionReason: 'Location violates zoning regulations. Business cannot operate in residential area without proper permits.',
      status: 'rejected',
      documents: ['Business Plan', 'Location Sketch'],
      canReapply: true,
      reapplyDeadline: '2024-02-11'
    },
    {
      id: 2,
      type: 'clearance',
      title: 'Barangay Clearance Certificate',
      description: 'Request for barangay clearance certificate for loan application.',
      requesterName: 'Roberto Silva',
      requesterEmail: 'roberto@example.com',
      requesterPhone: '+63 925 901 2345',
      requesterAddress: '258 Mango Ave, Barangay East',
      submittedDate: '2024-01-07T14:45:00',
      rejectedDate: '2024-01-09T16:20:00',
      rejectedBy: 'Barangay Captain Juan Santos',
      rejectionReason: 'Incomplete documentation. Missing proof of residency and valid identification.',
      status: 'rejected',
      documents: ['Application Form'],
      canReapply: true,
      reapplyDeadline: '2024-02-09'
    },
    {
      id: 3,
      type: 'certificate',
      title: 'Certificate of Indigency',
      description: 'Request for certificate of indigency for scholarship application.',
      requesterName: 'Diana Lopez',
      requesterEmail: 'diana@example.com',
      requesterPhone: '+63 926 012 3456',
      requesterAddress: '369 Banana Rd, Barangay West',
      submittedDate: '2024-01-04T10:00:00',
      rejectedDate: '2024-01-06T13:30:00',
      rejectedBy: 'Barangay Social Worker Pedro Reyes',
      rejectionReason: 'Income verification shows applicant does not meet indigency requirements.',
      status: 'rejected',
      documents: ['Income Statement', 'Valid ID'],
      canReapply: false
    }
  ]);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.rejectionReason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || request.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'clearance': return 'bg-blue-100 text-blue-800';
      case 'permit': return 'bg-green-100 text-green-800';
      case 'certificate': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

  const handleReapply = (request: RejectedRequest) => {
    // In real app, this would create a new request
    console.log('Reapplying for request:', request.id);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

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
            <h1 className="text-3xl font-bold text-gray-800">Rejected Requests</h1>
            <p className="text-gray-600 mt-1">Review rejected barangay requests and reasons</p>
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
              title: "Total Rejected",
              value: requests.length.toString(),
              icon: <FaTimesCircle className="text-red-500" />,
              bgColor: "bg-red-50"
            },
            {
              title: "Can Reapply",
              value: requests.filter(r => r.canReapply).length.toString(),
              icon: <FaRedo className="text-blue-500" />,
              bgColor: "bg-blue-50"
            },
            {
              title: "This Month",
              value: requests.filter(r => {
                const rejectedDate = new Date(r.rejectedDate);
                const now = new Date();
                return rejectedDate.getMonth() === now.getMonth() &&
                       rejectedDate.getFullYear() === now.getFullYear();
              }).length.toString(),
              icon: <FaCalendarAlt className="text-orange-500" />,
              bgColor: "bg-orange-50"
            },
            {
              title: "Incomplete Docs",
              value: requests.filter(r => r.rejectionReason.toLowerCase().includes('documentation') ||
                                       r.rejectionReason.toLowerCase().includes('incomplete')).length.toString(),
              icon: <FaExclamationTriangle className="text-yellow-500" />,
              bgColor: "bg-yellow-50"
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
                placeholder="Search rejected requests by title, requester, or rejection reason..."
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
            </div>
          </div>
        </motion.div>

        {/* Requests Grid */}
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
              <div className="p-6 border-b border-gray-100 bg-red-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(request.type)}`}>
                        {request.type}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                        Rejected
                      </span>
                      {request.canReapply && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          Can Reapply
                        </span>
                      )}
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

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-red-600 text-sm" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{request.requesterName}</h4>
                    <p className="text-sm text-gray-600">Rejected {getTimeAgo(request.rejectedDate)}</p>
                  </div>
                </div>

                {/* Rejection Reason */}
                <div className="bg-red-50 p-4 rounded-lg mb-4">
                  <div className="flex items-start gap-2">
                    <FaExclamationTriangle className="text-red-500 mt-0.5 text-sm" />
                    <div>
                      <h5 className="font-medium text-red-800 mb-1">Rejection Reason:</h5>
                      <p className="text-red-700 text-sm">{request.rejectionReason}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-gray-400 text-xs" />
                    <span className="text-gray-600">{request.requesterEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-gray-400 text-xs" />
                    <span className="text-gray-600">{request.requesterPhone}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Rejected by:</span>
                  <span className="font-medium text-gray-800">{request.rejectedBy}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                {request.canReapply ? (
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReapply(request)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaRedo className="text-sm" />
                      Reapply
                    </motion.button>
                    {request.reapplyDeadline && (
                      <div className="text-xs text-gray-600 flex items-center gap-1">
                        <FaCalendarAlt />
                        Deadline: {new Date(request.reapplyDeadline).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-sm text-gray-600">
                    Cannot reapply for this request
                  </div>
                )}
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
            <FaTimesCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No rejected requests found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterType !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No rejected requests yet."}
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
              <div className="p-6 border-b border-gray-200 bg-red-50">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <FaTimesCircle className="text-red-600 text-2xl" />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{selectedRequest.title}</h2>
                      <p className="text-red-600 font-medium">Request Rejected</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Rejection Details</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-600">Submitted:</span>
                        <p className="font-medium">{new Date(selectedRequest.submittedDate).toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Rejected:</span>
                        <p className="font-medium text-red-600">{new Date(selectedRequest.rejectedDate).toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Rejected By:</span>
                        <p className="font-medium">{selectedRequest.rejectedBy}</p>
                      </div>
                      {selectedRequest.canReapply && selectedRequest.reapplyDeadline && (
                        <div>
                          <span className="text-sm text-gray-600">Reapply Deadline:</span>
                          <p className="font-medium text-blue-600">{new Date(selectedRequest.reapplyDeadline).toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Request Description</h3>
                  <p className="text-gray-700 mb-4">{selectedRequest.description}</p>
                </div>

                {/* Rejection Reason */}
                <div className="bg-red-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                    <FaExclamationTriangle className="text-red-500" />
                    Rejection Reason
                  </h4>
                  <p className="text-red-700">{selectedRequest.rejectionReason}</p>
                </div>

                <div>
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
                {selectedRequest.canReapply ? (
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReapply(selectedRequest)}
                      className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaRedo className="text-sm" />
                      Submit New Application
                    </motion.button>
                  </div>
                ) : (
                  <div className="text-center text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
                    This request cannot be re-submitted. Please contact the barangay office for further assistance.
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default RejectedRequestsPage;