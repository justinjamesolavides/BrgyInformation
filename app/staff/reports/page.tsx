"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaFileAlt,
  FaChartLine,
  FaDownload,
  FaCalendarAlt,
  FaEye,
  FaUsers,
  FaClipboardList,
  FaCheckCircle
} from "react-icons/fa";

interface Report {
  id: number;
  title: string;
  description: string;
  type: string;
  generatedDate: string;
  period: string;
  status: 'available' | 'generating' | 'error';
  downloadUrl?: string;
}

const StaffReportsContent: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Mock data - in real app this would come from API
  const [reports] = useState<Report[]>([
    {
      id: 1,
      title: "Monthly Resident Report",
      description: "Comprehensive overview of resident registrations and activities",
      type: "residents",
      generatedDate: "2024-01-15",
      period: "January 2024",
      status: "available",
      downloadUrl: "#"
    },
    {
      id: 2,
      title: "Request Processing Summary",
      description: "Analysis of request approvals, rejections, and processing times",
      type: "requests",
      generatedDate: "2024-01-15",
      period: "January 2024",
      status: "available",
      downloadUrl: "#"
    },
    {
      id: 3,
      title: "Barangay Clearance Statistics",
      description: "Monthly statistics for barangay clearance requests",
      type: "clearances",
      generatedDate: "2024-01-14",
      period: "January 2024",
      status: "available",
      downloadUrl: "#"
    },
    {
      id: 4,
      title: "Population Demographics",
      description: "Age, gender, and civil status distribution",
      type: "demographics",
      generatedDate: "2024-01-10",
      period: "Q4 2023",
      status: "available",
      downloadUrl: "#"
    }
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'residents': return <FaUsers className="text-blue-500" />;
      case 'requests': return <FaClipboardList className="text-green-500" />;
      case 'clearances': return <FaCheckCircle className="text-purple-500" />;
      case 'demographics': return <FaChartLine className="text-orange-500" />;
      default: return <FaFileAlt className="text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'residents': return 'bg-blue-100 text-blue-800';
      case 'requests': return 'bg-green-100 text-green-800';
      case 'clearances': return 'bg-purple-100 text-purple-800';
      case 'demographics': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'generating': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
              <FaFileAlt className="text-blue-600 text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Staff - Reports & Analytics
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Generate and view barangay reports (Staff Access)
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-lg border border-gray-200">
            <FaCalendarAlt className="text-gray-500 text-sm" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-white text-sm font-medium text-gray-900 cursor-pointer transition-colors w-full focus:outline-none focus:ring-1 focus:ring-blue-500 rounded py-1"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
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
              title: "Total Reports",
              value: reports.length.toString(),
              icon: <FaFileAlt className="text-blue-500" />,
              bgColor: "bg-blue-50"
            },
            {
              title: "Available",
              value: reports.filter(r => r.status === 'available').length.toString(),
              icon: <FaDownload className="text-green-500" />,
              bgColor: "bg-green-50"
            },
            {
              title: "This Month",
              value: reports.filter(r => r.period.includes('January')).length.toString(),
              icon: <FaCalendarAlt className="text-purple-500" />,
              bgColor: "bg-purple-50"
            },
            {
              title: "Generating",
              value: reports.filter(r => r.status === 'generating').length.toString(),
              icon: <FaChartLine className="text-orange-500" />,
              bgColor: "bg-orange-50"
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

        {/* Reports Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {reports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ y: -2 }}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="p-4 bg-blue-500 text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center">
                    {getTypeIcon(report.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-white truncate">
                      {report.title}
                    </h3>
                    <p className="text-blue-100 text-xs">{report.period}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-gray-700 mb-3 text-xs">
                  {report.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-0.5 text-[0.6rem] font-medium rounded ${getTypeColor(report.type)}`}>
                    {report.type}
                  </span>
                  <span className={`px-2 py-0.5 text-[0.6rem] font-medium rounded ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>

                <div className="text-[0.6rem] text-gray-500 mb-4">
                  Generated: {new Date(report.generatedDate).toLocaleDateString()}
                </div>

                {/* Staff Actions */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-2 px-3 text-xs font-medium rounded-lg transition-all duration-200 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <FaEye className="text-xs" />
                      View Report
                    </div>
                  </motion.button>

                  {report.status === 'available' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-green-200"
                    >
                      <FaDownload className="text-xs" />
                    </motion.button>
                  )}
                </div>

                {/* Staff Notice */}
                <div className="mt-3 p-2 bg-yellow-50 rounded-lg border border-yellow-200 mt-3">
                  <p className="text-[0.6rem] text-yellow-800">
                    📊 Staff Access: Can view and download reports. Report generation requires admin approval.
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm p-4"
        >
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Generate New Report</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  title: "Resident Summary",
                  description: "Current resident statistics and demographics",
                  icon: <FaUsers className="text-blue-500" />,
                  color: "bg-blue-500 hover:bg-blue-600"
                },
                {
                  title: "Request Analytics",
                  description: "Processing times and approval rates",
                  icon: <FaClipboardList className="text-green-500" />,
                  color: "bg-green-500 hover:bg-green-600"
                },
                {
                  title: "Clearance Report",
                  description: "Monthly clearance certificate summary",
                  icon: <FaCheckCircle className="text-purple-500" />,
                  color: "bg-purple-500 hover:bg-purple-600"
                }
              ].map((action, index) => (
                <motion.button
                  key={action.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`bg-gray-50 hover:bg-gray-100 text-gray-800 p-3 rounded-lg transition-all duration-200 border border-gray-200 text-left`}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="p-1.5 bg-gray-200 rounded">
                      {action.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-xs">{action.title}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    {action.description}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
      </motion.div>
    </div>
  );
};

const StaffReportsPage: React.FC = () => {
  return <StaffReportsContent />;
};

export default StaffReportsPage;