"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import NotificationPanel from "../../components/NotificationPanel";
import { FaUsers, FaBell, FaEye, FaClock, FaCalendarAlt, FaFileSignature, FaUserPlus, FaCheckCircle, FaFileAlt, FaChartLine, FaCog, FaClipboardList, FaArrowUp, FaArrowDown, FaSignOutAlt } from "react-icons/fa";

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Fetch user data
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data.user);
        }
      })
      .catch(err => console.error('Failed to fetch user:', err));
  }, []);
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      router.push('/login');
    }
  };

  // Mock unread notifications count
  const unreadCount = 3;

  // Mock data for different periods - in real app this would come from API
  const getPeriodData = (period: string) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    switch (period) {
      case 'week':
        return {
          stats: {
            totalResidents: 1247,
            registeredUsers: 42,
            pendingRequests: 8,
            monthlyGrowth: 3.2
          },
          activities: [
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
              title: "Weekly Report Generated",
              user: "System",
              time: "2 hours ago",
              status: "completed",
              icon: <FaFileAlt className="text-purple-500" />
            }
          ]
        };

      case 'month':
        return {
          stats: {
            totalResidents: 1247,
            registeredUsers: 387,
            pendingRequests: 23,
            monthlyGrowth: 12.5
          },
          activities: [
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
              type: "request",
              title: "Business Permit Application",
              user: "Ana Reyes",
              time: "3 hours ago",
              status: "pending",
              icon: <FaClipboardList className="text-yellow-500" />
            },
            {
              id: 5,
              type: "system",
              title: "Monthly Census Update",
              user: "System",
              time: "1 day ago",
              status: "completed",
              icon: <FaChartLine className="text-purple-500" />
            }
          ]
        };

      case 'quarter':
        return {
          stats: {
            totalResidents: 1247,
            registeredUsers: 892,
            pendingRequests: 45,
            monthlyGrowth: 28.7
          },
          activities: [
            {
              id: 1,
              type: "request",
              title: "Quarterly Tax Assessment",
              user: "Barangay Treasurer",
              time: "2 days ago",
              status: "completed",
              icon: <FaFileAlt className="text-purple-500" />
            },
            {
              id: 2,
              type: "user",
              title: "Bulk Resident Import",
              user: "Admin",
              time: "1 week ago",
              status: "completed",
              icon: <FaUsers className="text-blue-500" />
            },
            {
              id: 3,
              type: "system",
              title: "Quarterly Report Generated",
              user: "System",
              time: "2 weeks ago",
              status: "completed",
              icon: <FaChartLine className="text-green-500" />
            },
            {
              id: 4,
              type: "request",
              title: "Community Development Grant",
              user: "Barangay Captain",
              time: "3 weeks ago",
              status: "approved",
              icon: <FaCheckCircle className="text-green-500" />
            }
          ]
        };

      case 'year':
        return {
          stats: {
            totalResidents: 1247,
            registeredUsers: 2156,
            pendingRequests: 67,
            monthlyGrowth: 45.3
          },
          activities: [
            {
              id: 1,
              type: "system",
              title: "Annual Census Completed",
              user: "System",
              time: "1 month ago",
              status: "completed",
              icon: <FaUsers className="text-blue-500" />
            },
            {
              id: 2,
              type: "request",
              title: "Year-End Financial Report",
              user: "Barangay Treasurer",
              time: "2 months ago",
              status: "completed",
              icon: <FaFileAlt className="text-purple-500" />
            },
            {
              id: 3,
              type: "system",
              title: "Annual Budget Approved",
              user: "Barangay Council",
              time: "3 months ago",
              status: "approved",
              icon: <FaCheckCircle className="text-green-500" />
            },
            {
              id: 4,
              type: "user",
              title: "New Barangay Officials Elected",
              user: "COMELEC",
              time: "6 months ago",
              status: "completed",
              icon: <FaUserPlus className="text-green-500" />
            }
          ]
        };

      default:
        return {
          stats: {
            totalResidents: 1247,
            registeredUsers: 387,
            pendingRequests: 23,
            monthlyGrowth: 12.5
          },
          activities: []
        };
    }
  };

  const periodData = getPeriodData(selectedPeriod);
  const { stats, activities: recentActivities } = periodData;

  const quickActions = [
    {
      title: "Add Resident",
      description: "Register new barangay resident",
      icon: <FaUserPlus className="text-2xl text-white" />,
      color: "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700",
      path: "/residents/add"
    },
    {
      title: "New Request",
      description: "Create certificate request",
      icon: <FaFileAlt className="text-2xl text-white" />,
      color: "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700",
      path: "/requests/new"
    },
    {
      title: "View Reports",
      description: "Generate barangay reports",
      icon: <FaChartLine className="text-2xl text-white" />,
      color: "bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700",
      path: "/reports"
    },
    {
      title: "Settings",
      description: "System configuration",
      icon: <FaCog className="text-2xl text-white" />,
      color: "bg-gradient-to-r from-slate-500 to-gray-600 hover:from-slate-600 hover:to-gray-700",
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

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 mobile-spacing transition-all duration-300 bg-white dark:bg-neutral-900 min-h-screen">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 lg:mb-10 gap-4 lg:gap-6">
          <div className="flex-1 w-full lg:w-auto">
            <div className="flex items-center gap-3 lg:gap-4 mb-3">
              <div className="w-1.5 h-8 lg:h-10 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-600 rounded-full shadow-sm"></div>
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent leading-tight">
                Barangay Dashboard
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <p className="text-gray-600 dark:text-gray-400 text-base lg:text-xl font-medium leading-relaxed">
                Welcome back, {user.name}!
              </p>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium"
              >
                <FaSignOutAlt className="text-xs" />
                Logout
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-3 w-full lg:w-auto justify-between lg:justify-start">
            <motion.div
              className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 lg:px-4 py-2 lg:py-3 rounded-xl border border-white/20 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 flex-1 lg:flex-none"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaCalendarAlt className="text-blue-500 dark:text-blue-400 text-sm lg:text-base" />
              <select
                value={selectedPeriod}
                onChange={(e) => {
                  setIsLoading(true);
                  setSelectedPeriod(e.target.value);
                  // Simulate loading delay
                  setTimeout(() => setIsLoading(false), 800);
                }}
                disabled={isLoading}
                className="bg-transparent border-none outline-none text-xs lg:text-sm font-medium text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors disabled:opacity-50 w-full lg:w-auto focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded"
                aria-label="Select time period"
              >
                <option value="week">📅 This Week</option>
                <option value="month">📆 This Month</option>
                <option value="quarter">📊 This Quarter</option>
                <option value="year">📈 This Year</option>
              </select>
            </motion.div>

            <div className="relative">
              <motion.button
                ref={notificationButtonRef}
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 relative shadow-lg hover:shadow-xl overflow-hidden focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
                whileHover={{
                  scale: 1.05,
                  rotate: [0, -1, 1, 0],
                  boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.4), 0 10px 10px -5px rgba(59, 130, 246, 0.2)"
                }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 4px 6px -1px rgba(59, 130, 246, 0.3)",
                    "0 10px 15px -3px rgba(59, 130, 246, 0.2)",
                    "0 4px 6px -1px rgba(59, 130, 246, 0.3)"
                  ]
                }}
                transition={{
                  boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 0.3 }
                }}
                aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : '(no unread)'}`}
                aria-expanded={isNotificationOpen}
                aria-haspopup="dialog"
              >
                {/* Animated background effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <FaBell className="text-sm" />
                <span className="hidden lg:inline font-medium">Notifications</span>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                  {unreadCount}
                </span>
              </motion.button>

              <NotificationPanel
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
                triggerRef={notificationButtonRef}
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedPeriod}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8"
          >
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 4 }).map((_, index) => (
                <motion.div
                  key={`skeleton-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/30 dark:border-gray-700/60 overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="loading-skeleton-text h-4 w-24 mb-2"></div>
                      <div className="loading-skeleton-text h-8 w-16 mb-2"></div>
                      <div className="loading-skeleton-text h-3 w-20"></div>
                    </div>
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-2xl loading-skeleton"></div>
                  </div>
                </motion.div>
              ))
            ) : (
              // Actual stats cards
              [
                {
                  title: "Total Residents",
                  value: stats.totalResidents.toLocaleString(),
                  icon: <FaUsers className="text-blue-600" />,
                  bgGradient: "from-blue-500 via-blue-600 to-indigo-600",
                  bgLight: "bg-blue-50/80 dark:bg-blue-900/30",
                  trend: "+12%",
                  trendColor: "text-emerald-600 dark:text-emerald-400"
                },
                {
                  title: "Registered Users",
                  value: stats.registeredUsers.toLocaleString(),
                  icon: <FaUserPlus className="text-emerald-600" />,
                  bgGradient: "from-emerald-500 via-green-500 to-teal-600",
                  bgLight: "bg-emerald-50/80 dark:bg-emerald-900/30",
                  trend: "+8%",
                  trendColor: "text-emerald-600 dark:text-emerald-400"
                },
                {
                  title: "Pending Requests",
                  value: stats.pendingRequests.toString(),
                  icon: <FaClipboardList className="text-amber-600" />,
                  bgGradient: "from-amber-500 via-orange-500 to-red-500",
                  bgLight: "bg-amber-50/80 dark:bg-amber-900/30",
                  trend: "+3",
                  trendColor: "text-orange-600 dark:text-orange-400"
                },
                {
                  title: "Monthly Growth",
                  value: `${stats.monthlyGrowth}%`,
                  icon: <FaChartLine className="text-purple-600" />,
                  bgGradient: "from-purple-500 via-violet-500 to-indigo-600",
                  bgLight: "bg-purple-50/80 dark:bg-purple-900/30",
                  trend: "+2.1%",
                  trendColor: "text-emerald-600 dark:text-emerald-400"
                }
              ].map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ y: -4, scale: 1.03 }}
                  className="group relative overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/30 dark:border-gray-700/60 hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
                >
                  {/* Background gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-8 transition-opacity duration-300`}></div>

                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">{stat.title}</p>
                      <motion.p
                        key={`${selectedPeriod}-${stat.title}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
                        className="text-4xl font-black text-gray-900 dark:text-white mb-3 leading-none"
                      >
                        {stat.value}
                      </motion.p>
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1 text-sm font-bold ${stat.trendColor} px-2 py-1 rounded-full bg-white/60 dark:bg-black/30 backdrop-blur-sm shadow-sm`}>
                          <FaArrowUp className="text-xs" />
                          {stat.trend}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">vs last period</span>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full bg-gradient-to-r ${stat.bgGradient}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(parseFloat(stat.trend.replace('%', '').replace('+', '')), 100)}%` }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                    <div className={`p-4 rounded-2xl ${stat.bgLight} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg`}>
                      {stat.icon}
                    </div>
                  </div>

                  {/* Mini chart visualization */}
                  <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                    <div className="flex items-end gap-0.5 h-8">
                      {[0.4, 0.7, 0.5, 0.8, 0.6, 0.9].map((height, i) => (
                        <motion.div
                          key={i}
                          className={`w-1 bg-gradient-to-t ${stat.bgGradient} rounded-sm`}
                          initial={{ height: 0 }}
                          animate={{ height: `${height * 100}%` }}
                          transition={{ delay: 0.7 + index * 0.1 + i * 0.05, duration: 0.4 }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/10 to-transparent rounded-full translate-y-8 -translate-x-8"></div>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="mb-8 lg:mb-10"
        >
          <div className="flex items-center gap-3 lg:gap-4 mb-6 lg:mb-8">
            <div className="w-1.5 h-8 lg:h-10 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-600 rounded-full shadow-sm"></div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white" id="quick-actions-heading">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  boxShadow: [
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                  ]
                }}
                transition={{
                  delay: 0.5 + index * 0.1,
                  duration: 0.3,
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                whileTap={{ scale: 0.98 }}
                className={`group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl border border-white/20 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 ${action.color} hover:shadow-2xl`}
                aria-label={`${action.title}: ${action.description}`}
              >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10 flex items-center gap-4">
                  <div className="p-3 bg-white/80 dark:bg-gray-700/80 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    {action.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800 dark:text-white group-hover:text-white transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-white/80 transition-colors">
                      {action.description}
                    </p>
                  </div>
                </div>

                {/* Hover effect line */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-white/50 group-hover:w-full transition-all duration-300"></div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Activities */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`activities-${selectedPeriod}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/60 p-6 overflow-hidden relative"
          >

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 gap-3 lg:gap-4">
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="w-1.5 h-8 lg:h-10 bg-gradient-to-b from-purple-500 via-pink-500 to-red-500 rounded-full shadow-sm"></div>
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white" id="recent-activities-heading">Recent Activities</h3>
                </div>
                <div className="flex items-center gap-2 lg:gap-3 px-4 lg:px-5 py-2 lg:py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full border border-blue-100 dark:border-blue-800/50 shadow-sm">
                  <div className={`w-3 lg:w-4 h-3 lg:h-4 rounded-full ${
                    selectedPeriod === 'week' ? 'bg-green-500' :
                    selectedPeriod === 'month' ? 'bg-blue-500' :
                    selectedPeriod === 'quarter' ? 'bg-purple-500' : 'bg-orange-500'
                  } animate-pulse shadow-lg`}></div>
                  <span className="text-sm lg:text-base font-bold text-blue-700 dark:text-blue-300 capitalize tracking-wide">
                    {selectedPeriod === 'week' ? 'This Week' :
                     selectedPeriod === 'month' ? 'This Month' :
                     selectedPeriod === 'quarter' ? 'This Quarter' : 'This Year'}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {isLoading ? (
                    // Loading skeletons for activities
                    Array.from({ length: 4 }).map((_, index) => (
                      <motion.div
                        key={`activity-skeleton-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="flex items-center gap-4 p-4 rounded-xl border border-transparent"
                      >
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl loading-skeleton"></div>
                        <div className="flex-1 min-w-0">
                          <div className="loading-skeleton-text h-5 w-48 mb-2"></div>
                          <div className="loading-skeleton-text h-4 w-32"></div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="loading-skeleton-text h-6 w-20 rounded-full"></div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    recentActivities.map((activity, index) => (
                    <motion.div
                      key={`${selectedPeriod}-${activity.id}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className="group flex items-center gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 dark:hover:from-blue-900/10 dark:hover:to-indigo-900/10 transition-all duration-300 cursor-pointer border border-transparent hover:border-blue-100/50 dark:hover:border-blue-800/30 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-blue-50/30 dark:focus:bg-blue-900/20"
                      whileHover={{
                        x: 6,
                        scale: 1.01,
                        boxShadow: "0 4px 12px -2px rgba(59, 130, 246, 0.15)"
                      }}
                      whileTap={{ scale: 0.99 }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Activity: ${activity.title} by ${activity.user}, ${activity.time}, status: ${activity.status}`}
                    >
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                          {activity.icon}
                        </div>
                        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                          activity.status === 'pending' ? 'bg-yellow-400' :
                          activity.status === 'completed' ? 'bg-green-400' :
                          activity.status === 'approved' ? 'bg-blue-400' :
                          'bg-gray-400'
                        }`}></div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors line-clamp-1 text-lg">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-3 mt-1">
                          <span className="font-medium">by {activity.user}</span>
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                          <span className="flex items-center gap-1.5 font-medium">
                            <FaClock className="text-xs" />
                            {activity.time}
                          </span>
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                          activity.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800/50' :
                          activity.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800/50' :
                          activity.status === 'approved' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50' :
                          'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700/50'
                        }`}>
                          {activity.status}
                        </span>
                      </div>
                    </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {recentActivities.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaClock className="text-2xl text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-semibold text-lg">No activities for the selected period</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 font-medium">Activities will appear here as they happen</p>
                </motion.div>
              )}

              {recentActivities.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700/50"
                >
                  <button className="w-full text-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors py-2">
                    View All Activities →
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    
  );
};

export default AdminDashboard;