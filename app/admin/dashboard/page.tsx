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
  
  // Real-time data state
  const [stats, setStats] = useState({
    totalResidents: 0,
    registeredUsers: 0,
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
          registeredUsers: data.data.totalUsers,
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
              icon = <FaFileSignature className="text-blue-500" />;
              break;
            case 'user':
            case 'resident':
              icon = <FaUserPlus className="text-green-500" />;
              break;
            case 'approval':
              icon = <FaCheckCircle className="text-green-500" />;
              break;
            case 'system':
              icon = <FaFileAlt className="text-purple-500" />;
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
      title: "Add Resident",
      description: "Register new barangay resident",
      icon: <FaUserPlus className="text-2xl text-white" />,
      color: "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700",
      path: "/admin/residents"
    },

    {
      title: "View Reports",
      description: "Generate barangay reports",
      icon: <FaChartLine className="text-2xl text-white" />,
      color: "bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700",
      path: "/admin/reports"
    },
    {
      title: "Settings",
      description: "System configuration",
      icon: <FaCog className="text-2xl text-white" />,
      color: "bg-gradient-to-r from-slate-500 to-gray-600 hover:from-slate-600 hover:to-gray-700",
      path: "/admin/settings"
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
    <div className="p-4 md:p-6 bg-white min-h-screen">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex-1 w-full md:w-auto">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1.5 h-6 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-600 rounded-full"></div>
              <h1 className="text-xl font-semibold text-gray-900">
                Barangay Dashboard
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <p className="text-gray-700 text-sm font-medium">
                Welcome back, {user.name}!
              </p>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-xs font-medium border border-red-200"
              >
                <FaSignOutAlt className="text-xs" />
                Logout
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
            <motion.div
              className="flex items-center gap-1.5 bg-white px-2.5 py-2 rounded-lg border border-gray-300 shadow-sm transition-all duration-300 flex-1 md:flex-none"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaCalendarAlt className="text-blue-500 text-xs" />
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
        </div>

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
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 4 }).map((_, index) => (
                <motion.div
                  key={`skeleton-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="h-3 w-20 bg-gray-200 rounded mb-2"></div>
                      <div className="h-5 w-12 bg-gray-200 rounded mb-2"></div>
                      <div className="h-2 w-16 bg-gray-200 rounded"></div>
                    </div>
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  </div>
                </motion.div>
              ))
            ) : (
              // Actual stats cards
              [
                {
                  title: "Total Residents",
                  value: stats.totalResidents.toLocaleString(),
                  icon: <FaUsers className="text-blue-500" />,
                  color: "blue"
                },
                {
                  title: "Registered Users",
                  value: stats.registeredUsers.toLocaleString(),
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
                  title: "Monthly Growth",
                  value: `${stats.monthlyGrowth.toFixed(1)}%`,
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
              ))
            )}
          </motion.div>
        </AnimatePresence>

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
                onClick={() => router.push(action.path)}
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
        </motion.div>

        {/* Recent Activities */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`activities-${selectedPeriod}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 overflow-hidden relative"
          >

            <div className="relative z-10">
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

              <div className="space-y-2">
                <AnimatePresence>
                  {isLoading ? (
                    // Loading skeletons for activities
                    Array.from({ length: 4 }).map((_, index) => (
                      <motion.div
                        key={`activity-skeleton-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="flex items-center gap-3 p-3 rounded-lg border border-transparent"
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded-lg"></div>
                        <div className="flex-1 min-w-0">
                          <div className="h-4 w-32 bg-gray-200 rounded mb-1"></div>
                          <div className="h-3 w-24 bg-gray-200 rounded"></div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
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
                    ))
                  )}
                </AnimatePresence>
              </div>

              {recentActivities.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaClock className="text-xl text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium text-sm">No activities for the selected period</p>
                  <p className="text-xs text-gray-500 mt-1">Activities will appear here as they happen</p>
                </motion.div>
              )}

              {recentActivities.length > 0 && (
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
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    
  );
};

export default AdminDashboard;