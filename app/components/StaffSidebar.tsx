"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaTachometerAlt,
  FaUsers,
  FaClipboardList,
  FaBullhorn,
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaHome,
  FaBell,
  FaPlus,
  FaFileAlt
} from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  description?: string;
}

const StaffSidebar: React.FC = () => {
  const pathname = usePathname();
  const [pendingRequests] = useState(23);
  const [urgentTasks] = useState(3);

  const navigationItems: NavItem[] = [
    {
      href: "/staffDashboard",
      label: "Dashboard",
      icon: <FaTachometerAlt className="text-lg" />,
      description: "Overview & Analytics"
    },
    {
      href: "/staff/residents",
      label: "Residents",
      icon: <FaUsers className="text-lg" />,
      description: "View Residents"
    },
    {
      href: "/staff/requests",
      label: "Requests",
      icon: <FaClipboardList className="text-lg" />,
      badge: pendingRequests,
      description: "Process Requests"
    },
    {
      href: "/staff/reports",
      label: "Reports",
      icon: <FaFileAlt className="text-lg" />,
      description: "View Reports"
    },
    {
      href: "/staff/settings",
      label: "Settings",
      icon: <FaCog className="text-lg" />,
      description: "Account Settings"
    }
  ];

  const quickActions = [
    {
      title: "Add Resident",
      icon: <FaPlus className="text-sm" />,
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => console.log("Add resident")
    },
    {
      title: "New Request",
      icon: <FaFileAlt className="text-sm" />,
      color: "bg-green-500 hover:bg-green-600",
      action: () => console.log("New request")
    },
    {
      title: "Urgent Tasks",
      icon: <FaExclamationTriangle className="text-sm" />,
      color: "bg-red-500 hover:bg-red-600",
      badge: urgentTasks,
      action: () => console.log("View urgent tasks")
    }
  ];

  const isActive = (href: string) => {
    if (href === "/staffDashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="h-screen w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 fixed flex flex-col">

      {/* Logo */}
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-700 transition-colors">
              <FaHome className="text-white text-lg" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-neutral-900 dark:text-white">
                Staff Portal
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Barangay Management
              </p>
            </div>
          </Link>
          <ThemeToggle />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Pending</p>
                <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{pendingRequests}</p>
              </div>
              <FaClock className="text-blue-500 text-lg" />
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-red-600 dark:text-red-400 font-medium">Urgent</p>
                <p className="text-lg font-bold text-red-700 dark:text-red-300">{urgentTasks}</p>
              </div>
              <FaExclamationTriangle className="text-red-500 text-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {navigationItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm"
                    : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                {/* Active indicator */}
                {isActive(item.href) && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}

                {/* Icon */}
                <div className={`flex-shrink-0 ${
                  isActive(item.href)
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-neutral-500 dark:text-neutral-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                }`}>
                  {item.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${
                      isActive(item.href) ? "text-blue-900 dark:text-blue-100" : ""
                    }`}>
                      {item.label}
                    </span>

                    {/* Badge */}
                    {item.badge && (
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-bold rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {item.description}
                  </p>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/10 transition-opacity" />
              </Link>
            </motion.div>
          ))}
        </div>
      </nav>

      {/* Quick Actions */}
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
          <FaPlus className="text-neutral-500" />
          Quick Actions
        </h3>
        <div className="space-y-2">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.action}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-white transition-all duration-200 ${action.color} group`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                  {action.icon}
                </div>
                <span className="font-medium text-sm">{action.title}</span>
              </div>
              {action.badge && (
                <span className="px-2 py-1 bg-white/20 text-white text-xs font-bold rounded-full">
                  {action.badge}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <FaUser className="text-blue-600 dark:text-blue-400 text-sm" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
              Staff Member
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
              staff@brgy.com
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-3 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
            <FaCog className="text-xs" />
            Account Settings
          </button>

          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
            <FaBell className="text-xs" />
            Notification Settings
          </button>

          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
            <FaSignOutAlt className="text-xs" />
            Sign Out
          </button>
        </div>
      </div>

    </div>
  );
};

export default StaffSidebar;
