"use client";

import React, { useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import NotificationPanel from "../components/NotificationPanel";
import { motion } from "framer-motion";
import { useNotifications } from "../components/NotificationProvider";
import {
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaDownload,
  FaCalendarAlt,
  FaUsers,
  FaFileAlt,
  FaCheckCircle,
  FaClock,
  FaFilter,
  FaPrint,
  FaShare,
  FaEye,
  FaFilePdf,
  FaBell,
  FaFileExcel,
  FaFileCsv
} from "react-icons/fa";

const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedReport, setSelectedReport] = useState("overview");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const { addNotification } = useNotifications();

  // Mock data for reports
  const reportData = {
    overview: {
      totalResidents: 1247,
      activeUsers: 387,
      totalRequests: 245,
      approvedRequests: 189,
      pendingRequests: 34,
      rejectedRequests: 22,
      monthlyGrowth: 12.5,
      weeklyGrowth: 3.2
    },
    residents: {
      totalResidents: 1247,
      newResidents: 45,
      activeResidents: 1189,
      inactiveResidents: 58,
      byGender: { male: 623, female: 624 },
      byAgeGroup: { '0-18': 234, '19-35': 456, '36-55': 389, '56+': 168 },
      byCivilStatus: { single: 456, married: 623, widowed: 89, divorced: 79 }
    },
    requests: {
      totalRequests: 245,
      approvedRequests: 189,
      pendingRequests: 34,
      rejectedRequests: 22,
      averageProcessingTime: 3.2,
      byType: { clearance: 89, permit: 67, certificate: 89 },
      byPriority: { urgent: 12, high: 34, medium: 145, low: 54 },
      monthlyTrend: [45, 52, 48, 67, 89, 78, 92, 85, 76, 98, 87, 95]
    },
    users: {
      totalUsers: 387,
      activeUsers: 345,
      newUsers: 23,
      staffUsers: 45,
      residentUsers: 342,
      loginActivity: [234, 245, 267, 289, 312, 334, 345]
    }
  };

  const reports = [
    {
      id: "overview",
      title: "System Overview",
      description: "Comprehensive overview of all system metrics",
      icon: <FaChartBar className="text-blue-500" />,
      color: "bg-blue-50 border-blue-200"
    },
    {
      id: "residents",
      title: "Residents Report",
      description: "Detailed analysis of resident data and demographics",
      icon: <FaUsers className="text-green-500" />,
      color: "bg-green-50 border-green-200"
    },
    {
      id: "requests",
      title: "Requests Report",
      description: "Request processing statistics and trends",
      icon: <FaFileAlt className="text-purple-500" />,
      color: "bg-purple-50 border-purple-200"
    },
    {
      id: "users",
      title: "Users Report",
      description: "User activity and engagement metrics",
      icon: <FaChartLine className="text-orange-500" />,
      color: "bg-orange-50 border-orange-200"
    }
  ];

  const exportOptions = [
    { id: "pdf", label: "PDF Report", icon: <FaFilePdf />, color: "bg-red-500 hover:bg-red-600" },
    { id: "excel", label: "Excel Sheet", icon: <FaFileExcel />, color: "bg-green-500 hover:bg-green-600" },
    { id: "csv", label: "CSV Data", icon: <FaFileCsv />, color: "bg-blue-500 hover:bg-blue-600" }
  ];

  const handleExport = (format: string) => {
    // In real app, this would generate and download the actual file
    addNotification('success', 'Export Started', `Generating ${format.toUpperCase()} report...`);
    setTimeout(() => {
      addNotification('success', 'Export Complete', `${format.toUpperCase()} report downloaded successfully`);
    }, 2000);
  };

  const handlePrint = () => {
    window.print();
    addNotification('info', 'Print', 'Opening print dialog...');
  };

  const handleShare = () => {
    // In real app, this would generate a shareable link
    addNotification('info', 'Share', 'Share link copied to clipboard');
  };

  const renderOverviewReport = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <motion.div whileHover={{ y: -2 }} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Residents</p>
            <p className="text-2xl font-bold text-gray-800">{reportData.overview.totalResidents.toLocaleString()}</p>
            <div className="text-xs text-green-600 mt-1">+{reportData.overview.monthlyGrowth}% this month</div>
          </div>
          <FaUsers className="text-blue-500 text-2xl" />
        </div>
      </motion.div>

      <motion.div whileHover={{ y: -2 }} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Users</p>
            <p className="text-2xl font-bold text-gray-800">{reportData.overview.activeUsers}</p>
            <div className="text-xs text-green-600 mt-1">+{reportData.overview.weeklyGrowth}% this week</div>
          </div>
          <FaChartLine className="text-green-500 text-2xl" />
        </div>
      </motion.div>

      <motion.div whileHover={{ y: -2 }} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Requests</p>
            <p className="text-2xl font-bold text-gray-800">{reportData.overview.totalRequests}</p>
            <div className="text-xs text-blue-600 mt-1">Processed this month</div>
          </div>
          <FaFileAlt className="text-purple-500 text-2xl" />
        </div>
      </motion.div>

      <motion.div whileHover={{ y: -2 }} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Approval Rate</p>
            <p className="text-2xl font-bold text-gray-800">
              {Math.round((reportData.overview.approvedRequests / reportData.overview.totalRequests) * 100)}%
            </p>
            <div className="text-xs text-green-600 mt-1">Success rate</div>
          </div>
          <FaCheckCircle className="text-green-500 text-2xl" />
        </div>
      </motion.div>
    </div>
  );

  const renderResidentsReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div whileHover={{ y: -2 }} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Gender Distribution</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Male</span>
              <span className="font-semibold">{reportData.residents.byGender.male}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: '50%'}}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Female</span>
              <span className="font-semibold">{reportData.residents.byGender.female}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-pink-600 h-2 rounded-full" style={{width: '50%'}}></div>
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Age Groups</h3>
          <div className="space-y-3">
            {Object.entries(reportData.residents.byAgeGroup).map(([age, count]) => (
              <div key={age} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{age} years</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Civil Status</h3>
          <div className="space-y-3">
            {Object.entries(reportData.residents.byCivilStatus).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 capitalize">{status}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderRequestsReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div whileHover={{ y: -2 }} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Request Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Approved</span>
              </div>
              <span className="font-semibold">{reportData.requests.approvedRequests}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Pending</span>
              </div>
              <span className="font-semibold">{reportData.requests.pendingRequests}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Rejected</span>
              </div>
              <span className="font-semibold">{reportData.requests.rejectedRequests}</span>
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Request Types</h3>
          <div className="space-y-4">
            {Object.entries(reportData.requests.byType).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 capitalize">{type}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div whileHover={{ y: -2 }} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Request Trends</h3>
        <div className="h-64 flex items-end justify-between gap-2">
          {reportData.requests.monthlyTrend.map((value, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className="w-full bg-blue-500 rounded-t"
                style={{height: `${(value / 100) * 200}px`}}
              ></div>
              <span className="text-xs text-gray-500 mt-2">{index + 1}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-4 text-center">Monthly request volume over the past 12 months</p>
      </motion.div>
    </div>
  );

  const renderUsersReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div whileHover={{ y: -2 }} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">User Statistics</h3>
            <FaUsers className="text-blue-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Users</span>
              <span className="font-semibold">{reportData.users.totalUsers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Active Users</span>
              <span className="font-semibold text-green-600">{reportData.users.activeUsers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">New This Month</span>
              <span className="font-semibold text-blue-600">{reportData.users.newUsers}</span>
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">User Types</h3>
            <FaChartPie className="text-purple-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Staff Members</span>
              <span className="font-semibold">{reportData.users.staffUsers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Residents</span>
              <span className="font-semibold">{reportData.users.residentUsers}</span>
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Activity</h3>
            <FaChartLine className="text-green-500" />
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{reportData.users.loginActivity[reportData.users.loginActivity.length - 1]}</p>
            <p className="text-sm text-gray-600">Active logins today</p>
          </div>
        </motion.div>
      </div>

      <motion.div whileHover={{ y: -2 }} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Login Activity</h3>
        <div className="h-64 flex items-end justify-center gap-4">
          {reportData.users.loginActivity.map((value, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className="w-8 bg-green-500 rounded-t hover:bg-green-600 transition-colors cursor-pointer"
                style={{height: `${(value / 350) * 200}px`}}
                title={`Day ${index + 1}: ${value} logins`}
              ></div>
              <span className="text-xs text-gray-500 mt-2">D{index + 1}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-4 text-center">Daily login activity for the past week</p>
      </motion.div>
    </div>
  );

  const renderReportContent = () => {
    switch (selectedReport) {
      case "overview":
        return renderOverviewReport();
      case "residents":
        return renderResidentsReport();
      case "requests":
        return renderRequestsReport();
      case "users":
        return renderUsersReport();
      default:
        return renderOverviewReport();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">

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
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Reports & Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Comprehensive insights and data analysis for your barangay system
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
              <FaCalendarAlt className="text-gray-500" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-transparent border-none outline-none text-sm dark:text-gray-200"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>

            <div className="relative">
              <motion.button
                ref={notificationButtonRef}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2 relative"
              >
                <FaBell className="text-sm" />
                <span className="hidden md:inline">Notifications</span>
                {/* Notification badge */}
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  1
                </span>
              </motion.button>

              <NotificationPanel
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
                triggerRef={notificationButtonRef}
              />
            </div>

            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrint}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <FaPrint className="text-sm" />
                Print
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FaShare className="text-sm" />
                Share
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Report Type Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {reports.map((report) => (
            <motion.button
              key={report.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedReport(report.id)}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                selectedReport === report.id
                  ? `${report.color} border-blue-500 shadow-lg`
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="text-2xl">{report.icon}</div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">{report.title}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{report.description}</p>
            </motion.button>
          ))}
        </motion.div>

        {/* Report Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          {renderReportContent()}
        </motion.div>

        {/* Export Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Export Report</h3>
          <div className="flex flex-wrap gap-4">
            {exportOptions.map((option) => (
              <motion.button
                key={option.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleExport(option.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white transition-colors ${option.color}`}
              >
                {option.icon}
                {option.label}
              </motion.button>
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            Export the current report in your preferred format. PDF reports include charts and detailed analysis.
          </p>
        </motion.div>

      </div>
    </div>
  );
};

export default ReportsPage;