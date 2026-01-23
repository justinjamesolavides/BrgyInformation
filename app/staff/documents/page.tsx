"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaFileAlt, FaCertificate, FaIdCard, FaBuilding, FaUser, FaSearch, FaFilter } from "react-icons/fa";

const DocumentServices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const documentTypes = [
    {
      id: 1,
      title: "Barangay Clearance",
      description: "For employment, school, or business purposes",
      icon: <FaCertificate className="text-blue-500" />,
      category: "clearance",
      processingTime: "1-2 hours",
      fee: "₱50.00"
    },
    {
      id: 2,
      title: "Cedula (Community Tax Certificate)",
      description: "Annual tax requirement for residents",
      icon: <FaIdCard className="text-green-500" />,
      category: "tax",
      processingTime: "30 minutes",
      fee: "₱15.00"
    },
    {
      id: 3,
      title: "Certificate of Residency",
      description: "Proof of domicile in the barangay",
      icon: <FaUser className="text-purple-500" />,
      category: "certificate",
      processingTime: "1 hour",
      fee: "₱25.00"
    },
    {
      id: 4,
      title: "Business Clearance",
      description: "For operating businesses within the barangay",
      icon: <FaBuilding className="text-orange-500" />,
      category: "business",
      processingTime: "2-3 hours",
      fee: "₱100.00"
    }
  ];

  const filteredDocuments = documentTypes.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || doc.category === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
          <h1 className="text-2xl font-bold text-gray-900">Document Services</h1>
        </div>
        <p className="text-gray-600">Process various barangay documents and certificates</p>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-50 rounded-lg p-4 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="clearance">Clearance</option>
              <option value="tax">Tax Documents</option>
              <option value="certificate">Certificates</option>
              <option value="business">Business</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Document Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredDocuments.map((doc, index) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                {doc.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">{doc.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{doc.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Processing Time:</span>
                    <span className="font-medium text-gray-700">{doc.processingTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Fee:</span>
                    <span className="font-medium text-green-600">{doc.fee}</span>
                  </div>
                </div>

                <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Process Document
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredDocuments.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FaFileAlt className="mx-auto text-4xl text-gray-300 mb-4" />
          <p className="text-gray-500">No documents found matching your search</p>
        </motion.div>
      )}
    </div>
  );
};

export default DocumentServices;