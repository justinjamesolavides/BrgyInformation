"use client";

import React, { useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import NotificationPanel from "../components/NotificationPanel";
import { motion } from "framer-motion";
import { useNotifications } from "../components/NotificationProvider";
import {
  FaUsers,
  FaFileAlt,
  FaClipboardList,
  FaChartLine,
  FaBell,
  FaPlus,
  FaEye,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaUserPlus,
  FaFileSignature,
  FaCog
} from "react-icons/fa";

const Dashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const { addNotification } = useNotifications();

  // Mock data - in real app this would come from API
  const stats = {
    totalResidents: 1247,
    registeredUsers: 387,
    pendingRequests: 23,
    monthlyGrowth: 12.5
  };

  const recentActivities = [
    {
      id: 1,
      type: "request",
      title: "New Barangay Clearance Request",
      user: "Juan Dela Cruz",
      time: "2 minutes ago",
      status: "pending",
      icon: <FaFileSignature className="text-blue-500" />
    },
    {
      id: 2,
      type: "user",
      title: "New Resident Registration",
      user: "Maria Santos",
      time: "15 minutes ago",
      status: "completed",
      icon: <FaUserPlus className="text-green-500" />
    },
    {
      id: 3,
      type: "request",
      title: "Certificate of Indigency Approved",
      user: "Pedro Garcia",
      time: "1 hour ago",
      status: "approved",
      icon: <FaCheckCircle className="text-green-500" />
    },
    {
      id: 4,
      type: "system",
      title: "Monthly Report Generated",
      user: "System",
      time: "2 hours ago",
      status: "completed",
      icon: <FaFileAlt className="text-purple-500" />
    }
  ];

  const quickActions = [
    {
      title: "Add Resident",
      description: "Register new barangay resident",
      icon: <FaUserPlus className="text-2xl" />,
      color: "bg-blue-500 hover:bg-blue-600",
      path: "/residents/add"
    },
    {
      title: "New Request",
      description: "Create certificate request",
      icon: <FaFileAlt className="text-2xl" />,
      color: "bg-green-500 hover:bg-green-600",
      path: "/requests/new"
    },
    {
      title: "View Reports",
      description: "Generate barangay reports",
      icon: <FaChartLine className="text-2xl" />,
      color: "bg-purple-500 hover:bg-purple-600",
      path: "/reports"
    },
    {
      title: "Settings",
      description: "System configuration",
      icon: <FaCog className="text-2xl" />,
      color: "bg-gray-500 hover:bg-gray-600",
      path: "/settings"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "text-yellow-600 bg-yellow-100";
      case "approved": return "text-green-600 bg-green-100";
      case "completed": return "text-blue-600 bg-blue-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 flex-1 p-6 bg-gray-50 dark:bg-gray-900">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              Barangay Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Welcome back! Here's what's happening in your barangay.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <FaCalendarAlt className="text-gray-500" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-transparent border-none outline-none text-sm"
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
                  3
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
              change: "+8.2%",
              changeType: "positive",
              icon: <FaUsers className="text-blue-500" />,
              bgColor: "bg-blue-50"
            },
            {
              title: "Registered Users",
              value: stats.registeredUsers.toLocaleString(),
              change: "+12.5%",
              changeType: "positive",
              icon: <FaUserPlus className="text-green-500" />,
              bgColor: "bg-green-50"
            },
            {
              title: "Pending Requests",
              value: stats.pendingRequests.toString(),
              change: "-3.1%",
              changeType: "negative",
              icon: <FaClipboardList className="text-yellow-500" />,
              bgColor: "bg-yellow-50"
            },
            {
              title: "Monthly Growth",
              value: `${stats.monthlyGrowth}%`,
              change: "+2.4%",
              changeType: "positive",
              icon: <FaChartLine className="text-purple-500" />,
              bgColor: "bg-purple-50"
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
                  <div className={`text-xs mt-2 flex items-center gap-1 ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <FaChartLine className="text-xs" />
                    {stat.change} from last month
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
              <p className="text-sm text-gray-600 mt-1">Latest updates from your barangay system</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-800">{activity.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">by {activity.user}</p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                        <FaClock />
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

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
              <p className="text-sm text-gray-600 mt-1">Common tasks and shortcuts</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 gap-3">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-lg text-white text-left transition-all ${action.color}`}
                  >
                    <div className="flex items-center gap-3">
                      {action.icon}
                      <div>
                        <div className="font-medium">{action.title}</div>
                        <div className="text-sm opacity-90">{action.description}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

        </div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">System Status</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-800">Database</p>
                <p className="text-sm text-gray-600">Operational</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-800">API Services</p>
                <p className="text-sm text-gray-600">99.9% uptime</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-800">Backup</p>
                <p className="text-sm text-gray-600">Last backup: 2h ago</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Dashboard;
