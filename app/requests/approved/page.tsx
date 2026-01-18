"use client";

import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
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
  FaPrint,
  FaShare
} from "react-icons/fa";

interface ApprovedRequest {
  id: number;
  type: 'clearance' | 'permit' | 'certificate';
  title: string;
  description: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  requesterAddress: string;
  submittedDate: string;
  approvedDate: string;
  approvedBy: string;
  referenceNumber: string;
  status: 'approved';
  documents: string[];
  notes?: string;
}

const ApprovedRequestsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<ApprovedRequest | null>(null);

  // Mock data - in real app this would come from API
  const [requests, setRequests] = useState<ApprovedRequest[]>([
    {
      id: 1,
      type: 'clearance',
      title: 'Barangay Clearance Certificate',
      description: 'Request for barangay clearance certificate for employment purposes.',
      requesterName: 'Carlos Mendoza',
      requesterEmail: 'carlos@example.com',
      requesterPhone: '+63 921 567 8901',
      requesterAddress: '654 Maple Dr, Barangay West',
      submittedDate: '2024-01-10T08:30:00',
      approvedDate: '2024-01-12T14:20:00',
      approvedBy: 'Barangay Captain Juan Santos',
      referenceNumber: 'BRGY-CLR-2024-001',
      status: 'approved',
      documents: ['Valid ID', 'Proof of Residence', 'Application Form'],
      notes: 'Approved after verification of all requirements.'
    },
    {
      id: 2,
      type: 'permit',
      title: 'Business Permit Application',
      description: 'Application for new business permit for small retail store.',
      requesterName: 'Rosa Dela Cruz',
      requesterEmail: 'rosa@example.com',
      requesterPhone: '+63 922 678 9012',
      requesterAddress: '987 Cedar St, Barangay Central',
      submittedDate: '2024-01-08T10:15:00',
      approvedDate: '2024-01-11T16:45:00',
      approvedBy: 'Barangay Secretary Maria Garcia',
      referenceNumber: 'BRGY-PMT-2024-002',
      status: 'approved',
      documents: ['Business Plan', 'Location Sketch', 'DTI Registration'],
      notes: 'Business location inspection completed successfully.'
    },
    {
      id: 3,
      type: 'certificate',
      title: 'Certificate of Residency',
      description: 'Request for certificate of residency for school enrollment.',
      requesterName: 'Miguel Santos',
      requesterEmail: 'miguel@example.com',
      requesterPhone: '+63 923 789 0123',
      requesterAddress: '321 Birch Ave, Barangay North',
      submittedDate: '2024-01-05T13:20:00',
      approvedDate: '2024-01-08T11:30:00',
      approvedBy: 'Barangay Treasurer Pedro Reyes',
      referenceNumber: 'BRGY-CRT-2024-003',
      status: 'approved',
      documents: ['Valid ID', 'Proof of Residence', 'Birth Certificate'],
      notes: 'All documents verified. Certificate ready for pickup.'
    }
  ]);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase());
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

  const handlePrintCertificate = (request: ApprovedRequest) => {
    // In real app, this would generate and print the certificate
    console.log('Printing certificate for request:', request.id);
  };

  const handleShareCertificate = (request: ApprovedRequest) => {
    // In real app, this would share the certificate digitally
    console.log('Sharing certificate for request:', request.id);
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
            <h1 className="text-3xl font-bold text-gray-800">Approved Requests</h1>
            <p className="text-gray-600 mt-1">View and manage approved barangay requests</p>
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
              title: "Total Approved",
              value: requests.length.toString(),
              icon: <FaCheckCircle className="text-green-500" />,
              bgColor: "bg-green-50"
            },
            {
              title: "This Month",
              value: requests.filter(r => {
                const approvedDate = new Date(r.approvedDate);
                const now = new Date();
                return approvedDate.getMonth() === now.getMonth() &&
                       approvedDate.getFullYear() === now.getFullYear();
              }).length.toString(),
              icon: <FaCalendarAlt className="text-blue-500" />,
              bgColor: "bg-blue-50"
            },
            {
              title: "Clearance Certificates",
              value: requests.filter(r => r.type === 'clearance').length.toString(),
              icon: <FaFileAlt className="text-blue-500" />,
              bgColor: "bg-blue-50"
            },
            {
              title: "Business Permits",
              value: requests.filter(r => r.type === 'permit').length.toString(),
              icon: <FaFileAlt className="text-green-500" />,
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
                placeholder="Search approved requests by title, requester, or reference number..."
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
              <div className="p-6 border-b border-gray-100 bg-green-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(request.type)}`}>
                        {request.type}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Approved
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{request.title}</h3>
                    <p className="text-gray-600 text-sm">Ref: {request.referenceNumber}</p>
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
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-green-600 text-sm" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{request.requesterName}</h4>
                    <p className="text-sm text-gray-600">Approved {getTimeAgo(request.approvedDate)}</p>
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

                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-gray-700">{request.description}</p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Approved by:</span>
                  <span className="font-medium text-gray-800">{request.approvedBy}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePrintCertificate(request)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaPrint className="text-sm" />
                    Print
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleShareCertificate(request)}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaShare className="text-sm" />
                    Share
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
            <FaCheckCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No approved requests found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterType !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No approved requests yet."}
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
              <div className="p-6 border-b border-gray-200 bg-green-50">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-600 text-2xl" />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{selectedRequest.title}</h2>
                      <p className="text-green-600 font-medium">Approved - {selectedRequest.referenceNumber}</p>
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
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Approval Details</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-600">Submitted:</span>
                        <p className="font-medium">{new Date(selectedRequest.submittedDate).toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Approved:</span>
                        <p className="font-medium text-green-600">{new Date(selectedRequest.approvedDate).toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Approved By:</span>
                        <p className="font-medium">{selectedRequest.approvedBy}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Reference Number:</span>
                        <p className="font-medium font-mono bg-gray-100 px-2 py-1 rounded">{selectedRequest.referenceNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Request Description</h3>
                  <p className="text-gray-700 mb-4">{selectedRequest.description}</p>

                  {selectedRequest.notes && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Approval Notes:</h4>
                      <p className="text-blue-700">{selectedRequest.notes}</p>
                    </div>
                  )}
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
                    onClick={() => handlePrintCertificate(selectedRequest)}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaPrint className="text-sm" />
                    Print Certificate
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleShareCertificate(selectedRequest)}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaShare className="text-sm" />
                    Share Digital Copy
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

export default ApprovedRequestsPage;