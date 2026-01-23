"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaDatabase, FaSearch, FaFilter, FaPrint, FaDownload } from "react-icons/fa";
import { FiPrinter } from "react-icons/fi";

const DocumentLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [logs, setLogs] = useState([
    {
      id: 1,
      documentType: "Barangay Clearance",
      residentName: "Juan Dela Cruz",
      issuedBy: "Maria Santos",
      dateIssued: "2024-01-22",
      amount: 50,
      status: "completed",
      referenceNumber: "BC-2024-001"
    },
    {
      id: 2,
      documentType: "Cedula",
      residentName: "Ana Reyes",
      issuedBy: "Carlos Garcia",
      dateIssued: "2024-01-22",
      amount: 15,
      status: "completed",
      referenceNumber: "CED-2024-002"
    },
    {
      id: 3,
      documentType: "Business Clearance",
      residentName: "Pedro Martinez",
      issuedBy: "Maria Santos",
      dateIssued: "2024-01-21",
      amount: 100,
      status: "completed",
      referenceNumber: "BUS-2024-003"
    },
    {
      id: 4,
      documentType: "Certificate of Residency",
      residentName: "Luisa Fernandez",
      issuedBy: "Carlos Garcia",
      dateIssued: "2024-01-21",
      amount: 25,
      status: "completed",
      referenceNumber: "COR-2024-004"
    },
    {
      id: 5,
      documentType: "Employment Clearance",
      residentName: "Roberto Lim",
      issuedBy: "Maria Santos",
      dateIssued: "2024-01-20",
      amount: 75,
      status: "voided",
      referenceNumber: "EMP-2024-005"
    },
    {
      id: 6,
      documentType: "Barangay Clearance",
      residentName: "Carmen Aquino",
      issuedBy: "Carlos Garcia",
      dateIssued: "2024-01-20",
      amount: 50,
      status: "completed",
      referenceNumber: "BC-2024-006"
    }
  ]);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || log.documentType.toLowerCase().includes(filterType.toLowerCase());
    const matchesDate = !filterDate || log.dateIssued === filterDate;
    
    return matchesSearch && matchesType && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "voided": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    if (type.includes("Clearance")) return "📋";
    if (type.includes("Cedula")) return "💳";
    if (type.includes("Certificate")) return "📜";
    return "📄";
  };

  const getTotalAmount = () => {
    return filteredLogs
      .filter(log => log.status === "completed")
      .reduce((sum, log) => sum + log.amount, 0);
  };

  const printReport = () => {
    window.print();
  };

  const exportCSV = () => {
    const csvContent = [
      ["Document Type", "Resident Name", "Issued By", "Date Issued", "Amount", "Status", "Reference Number"],
      ...filteredLogs.map(log => [
        log.documentType,
        log.residentName,
        log.issuedBy,
        log.dateIssued,
        log.amount,
        log.status,
        log.referenceNumber
      ])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaDatabase className="text-purple-600 text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Document Logs</h1>
              <p className="text-gray-600">Audit trail and transaction history</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={printReport}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FaPrint className="text-sm" />
              Print Report
            </button>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <FaDownload className="text-sm" />
              Export CSV
            </button>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-50 rounded-lg p-4 mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Document Types</option>
            <option value="clearance">Clearance</option>
            <option value="cedula">Cedula</option>
            <option value="certificate">Certificate</option>
          </select>
          
          <input
            type="date"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          
          <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg px-3 py-2">
            <span className="text-sm text-gray-600">Total:</span>
            <span className="font-semibold text-green-600">₱{getTotalAmount().toLocaleString()}</span>
          </div>
        </div>
      </motion.div>

      {/* Logs Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resident
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issued By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log, index) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{getTypeIcon(log.documentType)}</span>
                      <div className="text-sm font-medium text-gray-900">
                        {log.documentType}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.residentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.issuedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(log.dateIssued).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₱{log.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {log.referenceNumber}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <FaDatabase className="mx-auto text-4xl text-gray-300 mb-4" />
            <p className="text-gray-500">No document logs found matching your criteria</p>
          </div>
        )}
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-blue-800 text-sm font-medium">Total Transactions</div>
          <div className="text-2xl font-bold text-blue-900">{filteredLogs.length}</div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-green-800 text-sm font-medium">Completed</div>
          <div className="text-2xl font-bold text-green-900">
            {filteredLogs.filter(l => l.status === 'completed').length}
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-yellow-800 text-sm font-medium">Pending</div>
          <div className="text-2xl font-bold text-yellow-900">
            {filteredLogs.filter(l => l.status === 'pending').length}
          </div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-purple-800 text-sm font-medium">Total Revenue</div>
          <div className="text-2xl font-bold text-purple-900">₱{getTotalAmount().toLocaleString()}</div>
        </div>
      </motion.div>
    </div>
  );
};

export default DocumentLogs;