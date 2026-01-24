"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaFileAlt, FaDownload, FaChartBar, FaCalendarAlt } from "react-icons/fa";

const AdminReportsPage: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSampleReport = () => {
    setIsGenerating(true);
    
    // Simulate report generation delay
    setTimeout(() => {
      // Create sample CSV data
      const csvContent = `Name,Age,Gender,Address,Contact Number,Occupation,Date Registered
John Doe,35,Male,123 Main St,+63 917 123 4567,Teacher,2024-01-15
Jane Smith,28,Female,456 Oak Ave,+63 918 234 5678,Nurse,2024-01-16
Robert Johnson,42,Male,789 Pine Rd,+63 919 345 6789,Engineer,2024-01-17
Maria Garcia,31,Female,321 Elm St,+63 920 456 7890,Doctor,2024-01-18
Carlos Santos,38,Male,654 Maple Dr,+63 921 567 8901,Business Owner,2024-01-19
Ana Reyes,26,Female,987 Cedar Ln,+63 922 678 9012,Software Developer,2024-01-20
Michael Brown,45,Male,147 Birch Blvd,+63 923 789 0123,Accountant,2024-01-21
Lisa Wilson,33,Female,258 Spruce Way,+63 924 890 1234,Lawyer,2024-01-22`;

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `barangay_sample_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="p-4 md:p-6 bg-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shadow-sm">
            <FaFileAlt className="text-green-600 text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Reports & Analytics
            </h1>
            <p className="text-gray-600 text-sm mt-1">
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {[
          {
            title: "Total Reports",
            value: "24",
            icon: <FaFileAlt className="text-blue-500" />,
            color: "blue"
          },
          {
            title: "This Month",
            value: "8",
            icon: <FaCalendarAlt className="text-green-500" />,
            color: "green"
          },
          {
            title: "Analytics",
            value: "12",
            icon: <FaChartBar className="text-purple-500" />,
            color: "purple"
          },
          {
            title: "Downloads",
            value: "156",
            icon: <FaDownload className="text-orange-500" />,
            color: "orange"
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            whileHover={{ y: -2 }}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  {stat.title}
                </p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
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
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      >
        {[
          {
            title: "Resident Reports",
            description: "Comprehensive resident statistics and demographics",
            icon: <FaFileAlt className="text-blue-500" />,
            color: "blue"
          },
          {
            title: "Household Reports",
            description: "Household composition and living arrangements",
            icon: <FaFileAlt className="text-green-500" />,
            color: "green"
          },
          {
            title: "Announcement Reports",
            description: "Announcement reach and engagement metrics",
            icon: <FaFileAlt className="text-purple-500" />,
            color: "purple"
          },
          {
            title: "Request Reports",
            description: "Service request trends and completion rates",
            icon: <FaFileAlt className="text-orange-500" />,
            color: "orange"
          }
        ].map((report, index) => (
          <motion.div
            key={report.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            whileHover={{ y: -2 }}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  {report.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {report.title}
                  </h3>
                  <p className="text-gray-600 text-xs mt-1">
                    {report.description}
                  </p>
                </div>
              </div>
              <button className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100">
                <FaDownload className="text-gray-600 text-xs" />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center flex flex-col items-center justify-center min-h-[300px]"
      >
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <FaChartBar className="text-gray-400 text-xl" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">
          Advanced Analytics Coming Soon
        </h3>
        <p className="text-gray-600 text-sm mb-6 max-w-md">
          Comprehensive reporting and analytics features are currently under development for admin users.
        </p>
        <div className="flex justify-center">
          <button 
            onClick={generateSampleReport}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                <FaDownload className="text-sm" />
                Generate Sample Report
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminReportsPage;