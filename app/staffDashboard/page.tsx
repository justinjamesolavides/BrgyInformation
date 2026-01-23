"use client";

import React, { useState, useRef } from "react";
import StaffSidebar from "../components/StaffSidebar";
import NotificationPanel from "../components/NotificationPanel";
import { motion } from "framer-motion";
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
  FaTachometerAlt
} from "react-icons/fa";

const StaffDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
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
    <div className="flex min-h-screen bg-white dark:bg-neutral-900">

      {/* Sidebar */}
      <StaffSidebar />

      {/* Main Content */}
      <div className="ml-64 flex-1 p-4 md:p-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                <FaTachometerAlt className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Staff Dashboard
                </h1>
                <p className="text-gray-700 dark:text-gray-300 mt-1">
                  Welcome back! Here's your barangay overview.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white dark:bg-neutral-800 px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
              <FaCalendarAlt className="text-neutral-500 dark:text-neutral-400" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-900 dark:text-white cursor-pointer transition-colors w-full lg:w-auto focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded px-3 py-2"
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl shadow-sm transition-all flex items-center gap-3 relative group"
              >
                <FaBell className="text-sm" />
                <span className="hidden md:inline">Notifications</span>
                {/* Notification badge */}
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              title: "Total Residents",
              value: stats.totalResidents.toLocaleString(),
              change: "+5.2%",
              changeType: "positive" as const,
              icon: <FaUsers className="text-blue-500" />,
              bgColor: "bg-blue-50 dark:bg-blue-900/20",
              iconBg: "bg-blue-100 dark:bg-blue-900/40"
            },
            {
              title: "Pending Requests",
              value: stats.pendingRequests.toString(),
              change: "+12.3%",
              changeType: "positive" as const,
              icon: <FaClock className="text-yellow-500" />,
              bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
              iconBg: "bg-yellow-100 dark:bg-yellow-900/40"
            },
            {
              title: "Approved This Month",
              value: stats.approvedRequests.toString(),
              change: "+8.7%",
              changeType: "positive" as const,
              icon: <FaCheckCircle className="text-green-500" />,
              bgColor: "bg-green-50 dark:bg-green-900/20",
              iconBg: "bg-green-100 dark:bg-green-900/40"
            },
            {
              title: "Processing Rate",
              value: "94.2%",
              change: "+2.1%",
              changeType: "positive" as const,
              icon: <FaChartLine className="text-purple-500" />,
              bgColor: "bg-purple-50 dark:bg-purple-900/20",
              iconBg: "bg-purple-100 dark:bg-purple-900/40"
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.1, duration: 0.3 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="card card-interactive"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {stat.title}
                  </p>
                  <motion.p
                    key={`${selectedPeriod}-${stat.title}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
                    className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                  >
                    {stat.value}
                  </motion.p>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    stat.changeType === 'positive'
                      ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                      : 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300'
                  }`}>
                    <FaChartLine className="text-xs" />
                    {stat.change} from last month
                  </div>
                </div>
                <div className={`p-4 rounded-xl ${stat.iconBg} group-hover:scale-110 transition-transform duration-200`}>
                  {stat.icon}
                </div>
              </div>

              {/* Progress bar for visual appeal */}
              <div className="mt-4">
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-1.5">
                  <motion.div
                    className={`h-1.5 rounded-full ${
                      stat.title.includes('Processing') ? 'bg-purple-500' :
                      stat.title.includes('Approved') ? 'bg-green-500' :
                      stat.title.includes('Pending') ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(parseFloat(stat.change.replace('%', '').replace('+', '')), 100)}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">Recent Activities</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Latest updates from the barangay system</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Live</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all duration-200 cursor-pointer group"
                    whileHover={{ x: 4 }}
                  >
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {activity.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">by {activity.user}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          activity.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                          activity.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                          activity.status === 'approved' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                          'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
                        }`}>
                          {activity.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                        <FaClock className="text-xs" />
                        {activity.time}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 text-blue-600 hover:text-blue-700 font-medium py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                View All Activities
              </motion.button>
            </div>
          </motion.div>

          {/* Urgent Tasks */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <FaExclamationTriangle className="text-red-500" />
                Urgent Tasks
              </h3>
              <p className="text-sm text-gray-600 mt-1">Tasks requiring immediate attention</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {urgentTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-800 text-base">{task.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">by {task.requester}</span>
                      <span className="text-red-600 font-medium">{task.deadline}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className={`group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg`}
                >
                  {/* Background pattern */}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Content */}
                  <div className="relative flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                      {action.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-bold text-sm">{action.title}</div>
                      <div className="text-xs opacity-90 group-hover:opacity-100 transition-opacity">
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

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">System Status</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-medium text-gray-800">Request Processing</p>
                <p className="text-sm text-gray-600">Operational</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-medium text-gray-800">Database</p>
                <p className="text-sm text-gray-600">99.9% uptime</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-medium text-gray-800">Backup</p>
                <p className="text-sm text-gray-600">In progress</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-medium text-gray-800">API Services</p>
                <p className="text-sm text-gray-600">All systems green</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default StaffDashboard;
