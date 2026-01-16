"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaFileAlt, FaDownload, FaChartBar, FaCalendarAlt } from "react-icons/fa";

const AdminReportsPage: React.FC = () => {
  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-6 mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center shadow-lg">
            <FaFileAlt className="text-green-600 dark:text-green-400 text-2xl" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-white font-display">
              Reports & Analytics
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-lg">
              Admin access to comprehensive barangay reports and analytics
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        {[
          {
            title: "Total Reports",
            value: "24",
            icon: <FaFileAlt className="text-green-500" />,
            bgColor: "bg-green-50 dark:bg-green-900/20",
            iconBg: "bg-green-100 dark:bg-green-900/40"
          },
          {
            title: "This Month",
            value: "8",
            icon: <FaCalendarAlt className="text-blue-500" />,
            bgColor: "bg-blue-50 dark:bg-blue-900/20",
            iconBg: "bg-blue-100 dark:bg-blue-900/40"
          },
          {
            title: "Analytics",
            value: "12",
            icon: <FaChartBar className="text-purple-500" />,
            bgColor: "bg-purple-50 dark:bg-purple-900/20",
            iconBg: "bg-purple-100 dark:bg-purple-900/40"
          },
          {
            title: "Downloads",
            value: "156",
            icon: <FaDownload className="text-orange-500" />,
            bgColor: "bg-orange-50 dark:bg-orange-900/20",
            iconBg: "bg-orange-100 dark:bg-orange-900/40"
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="card card-interactive"
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
              <div className={`p-4 rounded-xl ${stat.iconBg} group-hover:scale-110 transition-transform duration-200`}>
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
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {[
          {
            title: "Resident Reports",
            description: "Comprehensive resident statistics and demographics",
            icon: <FaFileAlt className="text-blue-500" />,
            color: "bg-blue-50 dark:bg-blue-900/20"
          },
          {
            title: "Household Reports",
            description: "Household composition and living arrangements",
            icon: <FaFileAlt className="text-green-500" />,
            color: "bg-green-50 dark:bg-green-900/20"
          },
          {
            title: "Announcement Reports",
            description: "Announcement reach and engagement metrics",
            icon: <FaFileAlt className="text-purple-500" />,
            color: "bg-purple-50 dark:bg-purple-900/20"
          },
          {
            title: "Request Reports",
            description: "Service request trends and completion rates",
            icon: <FaFileAlt className="text-orange-500" />,
            color: "bg-orange-50 dark:bg-orange-900/20"
          }
        ].map((report, index) => (
          <motion.div
            key={report.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            whileHover={{ y: -4 }}
            className="card card-interactive group"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${report.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  {report.icon}
                </div>
                <button className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors opacity-0 group-hover:opacity-100">
                  <FaDownload className="text-neutral-600 dark:text-neutral-400 text-sm" />
                </button>
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                {report.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                {report.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 card"
      >
        <div className="p-8 text-center">
          <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaChartBar className="text-neutral-400 dark:text-neutral-500 text-3xl" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
            Advanced Analytics Coming Soon
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
            Comprehensive reporting and analytics features are currently under development for admin users.
          </p>
          <button className="btn-primary">
            <FaDownload className="text-sm mr-2" />
            Generate Sample Report
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminReportsPage;