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
      path: "/staff/residents"
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
    <div className="p-4 md:p-6 bg-white min-h-screen">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm">
                <FaTachometerAlt className="text-blue-600 text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Staff Dashboard
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Welcome back, {user.name}! Here's your barangay overview.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-xs font-medium border border-red-200"
            >
              <FaSignOutAlt className="text-xs" />
              Logout
            </motion.button>

            <div className="relative">
              <motion.button
                ref={notificationButtonRef}
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1.5 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : '(no unread)'}`}
                aria-expanded={isNotificationOpen}
                aria-haspopup="dialog"
              >
                <FaBell className="text-xs" />
                <span className="hidden md:inline text-xs font-medium">Notifications</span>
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[0.6rem] rounded-full h-4 w-4 flex items-center justify-center font-bold">
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
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-6 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-600 rounded-full"></div>
            <h2 className="text-lg font-bold text-gray-800" id="quick-actions-heading">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                onClick={() => router.push(action.path)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
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
                      activity.status === 'approved' ? 'bg-green-400' :
                      activity.status === 'rejected' ? 'bg-red-400' :
                      activity.status === 'completed' ? 'bg-blue-400' :
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
                      activity.status === 'approved' ? 'bg-green-100 text-green-800 border border-green-200' :
                      activity.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                      activity.status === 'completed' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                      'bg-gray-100 text-gray-800 border border-gray-200'
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
                <button className="w-full text-center text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors py-1">
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