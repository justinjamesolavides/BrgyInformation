"use client";

import React, { useState, useRef, useEffect } from "react";
import StaffSidebar from "../components/StaffSidebar";
import NotificationPanel from "../components/NotificationPanel";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUsers,
  FaFileAlt,
  FaClipboardList,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaChartLine,
  FaBell,
  FaPlus,
  FaEye,
  FaCalendarAlt,
  FaClock,
  FaUserCheck,
  FaDownload,
  FaUpload,
  FaCog,
  FaSearch,
  FaFilter,
  FaTachometerAlt,
  FaUserPlus,
  FaFileSignature,
  FaArrowUp,
  FaArrowDown,
  FaSignOutAlt
} from "react-icons/fa";

const StaffDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);

  // Mock data - in real app this would come from API
  const stats = {
    totalResidents: 1247,
    totalUsers: 387,
    pendingRequests: 23,
    approvedRequests: 156,
    rejectedRequests: 12,
    monthlyGrowth: 8.3
  };

  const recentActivities = [
    {
      id: 1,
      type: "request",
      title: "New Barangay Clearance Request",
      user: "Juan Dela Cruz",
      time: "2 minutes ago",
      status: "pending",
      icon: <FaFileAlt className="text-blue-500" />
    },
    {
      id: 2,
      type: "approval",
      title: "Certificate of Residency Approved",
      user: "Maria Santos",
      time: "15 minutes ago",
      status: "approved",
      icon: <FaCheckCircle className="text-green-500" />
    },
    {
      id: 3,
      type: "rejection",
      title: "Business Permit Rejected",
      user: "Pedro Garcia",
      time: "1 hour ago",
      status: "rejected",
      icon: <FaTimesCircle className="text-red-500" />
    },
    {
      id: 4,
      type: "user",
      title: "New Resident Registration",
      user: "System",
      time: "2 hours ago",
      status: "completed",
      icon: <FaUserCheck className="text-purple-500" />
    }
  ];

  const urgentTasks = [
    {
      id: 1,
      title: "Review Urgent Medical Certificate Request",
      description: "Certificate of Indigency for emergency medical assistance",
      requester: "Elena Torres",
      priority: "urgent",
      deadline: "2 hours",
      type: "certificate"
    },
    {
      id: 2,
      title: "Business Permit Location Inspection",
      description: "Scheduled inspection for new food cart business",
      requester: "Roberto Silva",
      priority: "high",
      deadline: "Today 3:00 PM",
      type: "permit"
    },
    {
      id: 3,
      title: "Barangay Clearance Verification",
      description: "Verify documents for employment clearance",
      requester: "Diana Lopez",
      priority: "medium",
      deadline: "Tomorrow",
      type: "clearance"
    }
  ];

  const quickActions = [
    {
      title: "Add Resident",
      description: "Register new resident",
      icon: <FaUsers className="text-2xl" />,
      color: "bg-blue-500 hover:bg-blue-600",
      path: "/residents/add"
    },

    {
      title: "Review Pending",
      description: "Check pending requests",
      icon: <FaClipboardList className="text-2xl" />,
      color: "bg-yellow-500 hover:bg-yellow-600",
      path: "/requests/pending"
    },
    {
      title: "Generate Report",
      description: "Monthly barangay report",
      icon: <FaChartLine className="text-2xl" />,
      color: "bg-purple-500 hover:bg-purple-600",
      path: "/reports"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "text-yellow-600 bg-yellow-100";
      case "approved": return "text-green-600 bg-green-100";
      case "rejected": return "text-red-600 bg-red-100";
      case "completed": return "text-blue-600 bg-blue-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="flex min-h-screen bg-white">

      {/* Sidebar */}
      <StaffSidebar />

      {/* Main Content */}
      <div className="ml-64 flex-1 p-4 md:p-6 bg-white min-h-screen">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
        >
          <div className="flex-1 w-full md:w-auto">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1.5 h-6 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-600 rounded-full"></div>
              <h1 className="text-xl font-semibold text-gray-900">
                Barangay Dashboard
              </h1>
            </div>
            <p className="text-gray-700 text-sm font-medium">
              Welcome back, Staff!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <motion.div
              className="flex items-center gap-1.5 bg-white px-2.5 py-2 rounded-lg border border-gray-300 shadow-sm transition-all duration-300 flex-1 md:flex-none"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaCalendarAlt className="text-gray-500 text-sm" />
              <select
                value={selectedPeriod}
                onChange={(e) => {
                  setIsLoading(true);
                  setSelectedPeriod(e.target.value);
                  // Simulate loading delay
                  setTimeout(() => setIsLoading(false), 800);
                }}
                disabled={isLoading}
                className="bg-white border border-gray-300 text-xs font-medium text-gray-900 cursor-pointer transition-colors disabled:opacity-50 w-full md:w-auto focus:ring-2 focus:ring-blue-500 rounded px-2 py-1.5"
                aria-label="Select time period"
              >
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="quarter">Quarter</option>
                <option value="year">Year</option>
              </select>
            </motion.div>

            <div className="relative">
              <motion.button
                ref={notificationButtonRef}
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1.5 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Notifications ${unreadCount > 0 ? `(2 unread)` : '(no unread)'}`}
                aria-expanded={isNotificationOpen}
                aria-haspopup="dialog"
              >
                <FaBell className="text-xs" />
                <span className="hidden md:inline text-xs font-medium">Notifications</span>
                {/* Notification badge */}
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[0.6rem] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  2
                </span>
              </motion.button>

              <NotificationPanel
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
                triggerRef={notificationButtonRef}
              />
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <AnimatePresence mode="wait">
        <motion.div
          key={selectedPeriod}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          {[
            {
              title: "Total Residents",
              value: stats.totalResidents.toLocaleString(),
              icon: <FaUsers className="text-blue-500" />,
              color: "blue"
            },
            {
              title: "Total Users",
              value: stats.totalUsers.toLocaleString(),
              icon: <FaUserPlus className="text-green-500" />,
              color: "green"
            },
            {
              title: "Pending Requests",
              value: stats.pendingRequests.toString(),
              icon: <FaClipboardList className="text-amber-500" />,
              color: "amber"
            },
            {
              title: "Processing Rate",
              value: "94.2%",
              icon: <FaChartLine className="text-purple-500" />,
              color: "purple"
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ y: -2 }}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{stat.title}</p>
                  <motion.p
                    key={`${selectedPeriod}-${stat.title}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
                    className="text-xl font-semibold text-gray-900 mt-1"
                  >
                    {stat.value}
                  </motion.p>
                </div>
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-gradient-to-b from-purple-500 via-pink-500 to-red-500 rounded-full"></div>
                  <h3 className="text-base font-bold text-gray-800" id="recent-activities-heading">Recent Activities</h3>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100">
                  <div className={`w-2 h-2 rounded-full ${
                    selectedPeriod === 'week' ? 'bg-green-500' :
                    selectedPeriod === 'month' ? 'bg-blue-500' :
                    selectedPeriod === 'quarter' ? 'bg-purple-500' : 'bg-orange-500'
                  }`}></div>
                  <span className="text-xs font-medium text-blue-700 capitalize">
                    {selectedPeriod === 'week' ? 'Week' :
                     selectedPeriod === 'month' ? 'Month' :
                     selectedPeriod === 'quarter' ? 'Quarter' : 'Year'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-2">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-300 cursor-pointer border border-transparent hover:border-gray-200"
                    whileHover={{
                      x: 3,
                      scale: 1.01,
                      boxShadow: "0 2px 4px -1px rgba(0, 0, 0, 0.1)"
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Activity: ${activity.title} by ${activity.user}, ${activity.time}, status: ${activity.status}`}
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                        {activity.icon}
                      </div>
                      <div className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border-2 border-white ${
                        activity.status === 'pending' ? 'bg-yellow-400' :
                        activity.status === 'completed' ? 'bg-green-400' :
                        activity.status === 'approved' ? 'bg-blue-400' :
                        'bg-gray-400'
                      }`}></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 group-hover:text-blue-700 transition-colors text-sm line-clamp-1">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-600 flex items-center gap-2 mt-1">
                        <span className="font-medium">by {activity.user}</span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span className="flex items-center gap-1 font-medium">
                          <FaClock className="text-xs" />
                          {activity.time}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-1 rounded-full text-[0.6rem] font-semibold ${
                        activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                        activity.status === 'completed' ? 'bg-green-100 text-green-800 border border-green-200' :
                        activity.status === 'approved' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                        'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 pt-3 border-t border-gray-100"
              >
                <button className="w-full text-center text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors py-1">
                  View All Activities →
                </button>
              </motion.div>
            </div>
          </motion.div>

          {/* Urgent Tasks */}




        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-6 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-600 rounded-full"></div>
            <h2 className="text-lg font-bold text-gray-800" id="quick-actions-heading">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {quickActions.map((action, index) => (
                <motion.button
                key={action.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                whileHover={{ y: -2 }}
                className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                aria-label={`${action.title}: ${action.description}`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {action.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-800 text-sm">
                      {action.title}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {action.description}
                    </p>
                  </div>
                </div>
              </motion.button>
              ))}
            </div>
          </div>
        </motion.div>


      </div>
    </div>
  );
};

export default StaffDashboard;
