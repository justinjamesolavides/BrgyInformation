"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import NotificationPanel from "../../components/NotificationPanel";
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
  FaTachometerAlt,
  FaSignOutAlt
} from "react-icons/fa";

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

const StaffDashboardContent: React.FC<{ user: User }> = ({ user }) => {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);

  // Real-time data state
  const [stats, setStats] = useState({
    totalResidents: 0,
    totalUsers: 0,
    pendingRequests: 0,
    monthlyGrowth: 0
  });
  const [trends, setTrends] = useState({
    residents: "+0",
    users: "+0",
    requests: "+0",
    growth: "+0.0%"
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      router.push('/login');
    }
  };

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      const data = await response.json();
      if (data.success && data.data) {
        setStats({
          totalResidents: data.data.totalResidents,
          totalUsers: data.data.totalUsers,
          pendingRequests: data.data.pendingRequests,
          monthlyGrowth: data.data.monthlyGrowth
        });
        if (data.data.changes) {
          setTrends({
            residents: data.data.changes.residents || "+0",
            users: data.data.changes.users || "+0",
            requests: data.data.changes.requests || "+0",
            growth: data.data.changes.growth || "+0.0%"
          });
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Fetch recent activities
  const fetchActivities = async () => {
    try {
      const response = await fetch(`/api/dashboard/activities?period=${selectedPeriod}&limit=10`);
      const data = await response.json();
      if (data.success && data.data) {
        // Map activities to include icons
        const activitiesWithIcons = data.data.map((activity: any) => {
          let icon;
          switch (activity.type) {
            case 'request':
              icon = <FaFileAlt className="text-blue-500" />;
              break;
            case 'approval':
              icon = <FaCheckCircle className="text-green-500" />;
              break;
            case 'rejection':
              icon = <FaTimesCircle className="text-red-500" />;
              break;
            case 'system':
              icon = <FaChartLine className="text-purple-500" />;
              break;
            default:
              icon = <FaClipboardList className="text-yellow-500" />;
          }
          return { ...activity, icon };
        });
        setRecentActivities(activitiesWithIcons);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  // Fetch notifications count
  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/dashboard/notifications');
      const data = await response.json();
      if (data.success && data.data) {
        setUnreadCount(data.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchStats();
    fetchActivities();
    fetchNotifications();
  }, []);

  // Poll for updates every 2 seconds for instant updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats();
      fetchActivities();
      fetchNotifications();
    }, 2000); // Update every 2 seconds for faster response

    return () => clearInterval(interval);
  }, [selectedPeriod]);

  // Refetch activities when period changes
  useEffect(() => {
    fetchActivities();
  }, [selectedPeriod]);

  const quickActions = [
    {
      title: "View Requests",
      description: "Review pending applications",
      icon: <FaClipboardList className="text-2xl" />,
      color: "bg-blue-500 hover:bg-blue-600",
      path: "/staff/requests"
    },
    {
      title: "Process Documents",
      description: "Handle document approvals",
      icon: <FaFileAlt className="text-2xl" />,
      color: "bg-green-500 hover:bg-green-600",
      path: "/staff/documents"
    },
    {
      title: "View Reports",
      description: "Generate staff reports",
      icon: <FaChartLine className="text-2xl" />,
      color: "bg-purple-500 hover:bg-purple-600",
      path: "/staff/reports"
    },
    {
      title: "Settings",
      description: "Staff preferences",
      icon: <FaCog className="text-2xl" />,
      color: "bg-gray-500 hover:bg-gray-600",
      path: "/staff/settings"
    }
  ];

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
    <div className="p-4 md:p-6 mobile-spacing bg-white dark:bg-neutral-900 min-h-screen">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                <FaTachometerAlt className="text-green-600 dark:text-green-400 text-xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white font-display">
                  Staff Dashboard
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  Welcome back, {user.name}! Here's your overview for today.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <FaSignOutAlt className="text-sm" />
              Logout
            </motion.button>

            <div className="relative">
              <motion.button
                ref={notificationButtonRef}
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition-all flex items-center gap-2 relative shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaBell className="text-sm" />
                <span className="hidden md:inline">Notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
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
              value: stats.totalResidents.toString(),
              icon: <FaUsers className="text-blue-500" />,
              bgColor: "bg-blue-50 dark:bg-blue-900/20",
              iconBg: "bg-blue-100 dark:bg-blue-900/40",
              change: trends.residents,
              changeType: trends.residents.startsWith('+') ? "positive" as const : "neutral" as const
            },
            {
              title: "Total Users",
              value: stats.totalUsers.toString(),
              icon: <FaUserCheck className="text-green-500" />,
              bgColor: "bg-green-50 dark:bg-green-900/20",
              iconBg: "bg-green-100 dark:bg-green-900/40",
              change: trends.users,
              changeType: trends.users.startsWith('+') ? "positive" as const : "neutral" as const
            },
            {
              title: "Pending Requests",
              value: stats.pendingRequests.toString(),
              icon: <FaClipboardList className="text-yellow-500" />,
              bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
              iconBg: "bg-yellow-100 dark:bg-yellow-900/40",
              change: trends.requests,
              changeType: "neutral" as const
            },
            {
              title: "Monthly Growth",
              value: `${stats.monthlyGrowth.toFixed(1)}%`,
              icon: <FaChartLine className="text-purple-500" />,
              bgColor: "bg-purple-50 dark:bg-purple-900/20",
              iconBg: "bg-purple-100 dark:bg-purple-900/40",
              change: trends.growth,
              changeType: "positive" as const
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
                  <div className="flex items-baseline gap-2 mb-2">
                    <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                      {stat.value}
                    </p>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      stat.changeType === 'positive'
                        ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                        : 'bg-neutral-100 dark:bg-neutral-900/30 text-neutral-700 dark:text-neutral-300'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-4 rounded-xl ${stat.iconBg} group-hover:scale-110 transition-transform duration-200`}>
                  {stat.icon}
                </div>
              </div>

              {/* Mini chart visualization */}
              <div className="mt-4">
                <div className="flex items-end gap-1 h-8">
                  {[0.3, 0.5, 0.7, 0.4, 0.8, 0.6, 0.9].map((height, i) => (
                    <motion.div
                      key={i}
                      className={`flex-1 rounded-sm ${
                        stat.title.includes('Residents') ? 'bg-blue-400' :
                        stat.title.includes('Users') ? 'bg-green-400' :
                        stat.title.includes('Pending') ? 'bg-yellow-400' : 'bg-purple-400'
                      }`}
                      initial={{ height: 0 }}
                      animate={{ height: `${height * 100}%` }}
                      transition={{ delay: 0.5 + index * 0.1 + i * 0.05, duration: 0.4 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`group relative overflow-hidden bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm p-6 rounded-2xl border border-neutral-200 dark:border-neutral-700 hover:shadow-xl transition-all duration-300 ${action.color} hover:shadow-2xl`}
              >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10 flex items-center gap-4">
                  <div className="p-3 bg-white/80 dark:bg-neutral-700/80 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    {action.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-neutral-900 dark:text-white group-hover:text-white transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-white/80 transition-colors">
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 p-6 overflow-hidden relative"
        >
          {/* Background decoration */}

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Recent Activities</h3>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-full border border-green-100 dark:border-green-800/50">
                <div className={`w-3 h-3 rounded-full ${
                  selectedPeriod === 'week' ? 'bg-green-500' :
                  selectedPeriod === 'month' ? 'bg-blue-500' :
                  selectedPeriod === 'quarter' ? 'bg-purple-500' : 'bg-orange-500'
                } animate-pulse shadow-lg`}></div>
                <span className="text-sm font-semibold text-green-700 dark:text-green-300 capitalize">
                  {selectedPeriod === 'week' ? 'This Week' :
                   selectedPeriod === 'month' ? 'This Month' :
                   selectedPeriod === 'quarter' ? 'This Quarter' : 'This Year'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="group flex items-center gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-green-50/50 hover:to-blue-50/50 dark:hover:from-green-900/10 dark:hover:to-blue-900/10 transition-all duration-300 cursor-pointer border border-transparent hover:border-green-100 dark:hover:border-green-800/30"
                  whileHover={{ x: 6, scale: 1.01 }}
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/50 dark:to-blue-900/50 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                      {activity.icon}
                    </div>
                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-neutral-800 ${
                      activity.status === 'pending' ? 'bg-yellow-400' :
                      activity.status === 'approved' ? 'bg-green-400' :
                      activity.status === 'rejected' ? 'bg-red-400' :
                      activity.status === 'completed' ? 'bg-blue-400' :
                      'bg-gray-400'
                    }`}></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-neutral-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors line-clamp-1">
                      {activity.title}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                      <span>by {activity.user}</span>
                      <span className="w-1 h-1 bg-neutral-400 rounded-full"></span>
                      <span className="flex items-center gap-1">
                        <FaClock className="text-xs" />
                        {activity.time}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                      activity.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800/50' :
                      activity.status === 'approved' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800/50' :
                      activity.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800/50' :
                      activity.status === 'completed' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50' :
                      'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700/50'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {recentActivities.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-700/50"
              >
                <button className="w-full text-center text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors py-2">
                  View All Activities →
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
    </div>
  );
};

const StaffDashboard: React.FC = () => {
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

  return <StaffDashboardContent user={user} />;
};

export default StaffDashboard;