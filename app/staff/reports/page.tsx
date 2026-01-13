"use client";

import React, { useState } from "react";
import StaffSidebar from "../../components/StaffSidebar";
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

const StaffReportsPage: React.FC = () => {
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
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Sidebar */}
      <StaffSidebar />

      {/* Main Content */}
      <div className="ml-64 flex-1 p-4 md:p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                <FaFileAlt className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white font-display">
                  Staff - Reports & Analytics
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  Generate and view barangay reports (Staff Access)
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex items-center gap-2 bg-white dark:bg-neutral-800 px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
              <FaCalendarAlt className="text-neutral-500 dark:text-neutral-400" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-transparent border-none outline-none text-sm font-medium text-neutral-900 dark:text-white cursor-pointer"
              >
                <option value="week">📅 This Week</option>
                <option value="month">📆 This Month</option>
                <option value="quarter">📊 This Quarter</option>
                <option value="year">📈 This Year</option>
              </select>
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
              title: "Total Reports",
              value: reports.length.toString(),
              icon: <FaFileAlt className="text-blue-500" />,
              bgColor: "bg-blue-50 dark:bg-blue-900/20"
            },
            {
              title: "Available",
              value: reports.filter(r => r.status === 'available').length.toString(),
              icon: <FaDownload className="text-green-500" />,
              bgColor: "bg-green-50 dark:bg-green-900/20"
            },
            {
              title: "This Month",
              value: reports.filter(r => r.period.includes('January')).length.toString(),
              icon: <FaCalendarAlt className="text-purple-500" />,
              bgColor: "bg-purple-50 dark:bg-purple-900/20"
            },
            {
              title: "Generating",
              value: reports.filter(r => r.status === 'generating').length.toString(),
              icon: <FaChartLine className="text-orange-500" />,
              bgColor: "bg-orange-50 dark:bg-orange-900/20"
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

        {/* Reports Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {reports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ y: -4 }}
              className="card card-interactive"
            >
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    {getTypeIcon(report.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-white truncate">
                      {report.title}
                    </h3>
                    <p className="text-blue-100 text-sm">{report.period}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-neutral-700 dark:text-neutral-300 mb-4 text-sm">
                  {report.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(report.type)}`}>
                    {report.type}
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>

                <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
                  Generated: {new Date(report.generatedDate).toLocaleDateString()}
                </div>

                {/* Staff Actions */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-all duration-200 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FaEye className="text-xs" />
                      View Report
                    </div>
                  </motion.button>

                  {report.status === 'available' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-3 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-colors border border-green-200 dark:border-green-800"
                    >
                      <FaDownload className="text-sm" />
                    </motion.button>
                  )}
                </div>

                {/* Staff Notice */}
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
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
          className="mt-8 card"
        >
          <div className="p-6">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Generate New Report</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group relative overflow-hidden bg-gradient-to-r ${action.color} text-white p-6 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg text-left`}
                >
                  {/* Content */}
                  <div className="relative flex items-start gap-4">
                    <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                      {action.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg mb-1">{action.title}</div>
                      <div className="text-sm opacity-90 group-hover:opacity-100 transition-opacity">
                        {action.description}
                      </div>
                    </div>
                  </div>

                  {/* Shine effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out" />
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StaffReportsPage;