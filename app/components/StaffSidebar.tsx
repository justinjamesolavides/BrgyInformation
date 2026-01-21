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
      href: "/staff/dashboard",
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
      href: "/staff/households",
      label: "Households",
      icon: <FaHome className="text-lg" />,
      description: "View Households"
    },
    {
      href: "/staff/announcements",
      label: "Announcements",
      icon: <FaBullhorn className="text-lg" />,
      description: "View Updates"
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
    <div className="h-full w-full flex flex-col bg-white">

      {/* Logo Section */}
      <div className="sidebar-header flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center group-hover:bg-green-700 transition-colors">
            <FaHome className="text-white text-sm" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Staff Portal</h1>
            <p className="text-xs text-gray-500">Barangay Management</p>
          </div>
        </Link>
        <ThemeToggle />
      </div>

      {/* Quick Stats */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Pending</p>
                <p className="text-lg font-bold text-blue-700">{pendingRequests}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaClock className="text-blue-600 text-sm" />
              </div>
            </div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg border border-red-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-red-600 font-medium uppercase tracking-wide">Urgent</p>
                <p className="text-lg font-bold text-red-700">{urgentTasks}</p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <FaExclamationTriangle className="text-red-600 text-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav flex-1">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-nav-item ${
                isActive(item.href) ? 'active' : ''
              }`}
            >
              <div className="flex-shrink-0">
                {item.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {item.description}
                </p>
              </div>

              {isActive(item.href) && (
                <div className="ml-auto w-1.5 h-1.5 bg-green-600 rounded-full"></div>
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* Quick Actions */}
      <div className="px-4 py-3 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <FaPlus className="text-gray-500" />
          Quick Actions
        </h3>
        <div className="space-y-2">
          {quickActions.map((action) => (
            <button
              key={action.title}
              onClick={action.action}
              className={`w-full flex items-center justify-between p-3 rounded-lg text-white transition-all duration-200 ${action.color} hover:shadow-md`}
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white/20 rounded-md">
                  {action.icon}
                </div>
                <span className="font-medium text-sm">{action.title}</span>
              </div>
              {action.badge && (
                <span className="px-2 py-1 bg-white/20 text-white text-xs font-semibold rounded-full">
                  {action.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* User Section */}
      <div className="px-4 py-3 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
          <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
            <FaUser className="text-green-600 text-sm" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              Staff Member
            </p>
            <p className="text-xs text-gray-500 truncate">
              staff@brgy.com
            </p>
          </div>
        </div>

        <div className="mt-3 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
            <FaCog className="text-xs" />
            Account Settings
          </button>

          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
            <FaBell className="text-xs" />
            Notification Settings
          </button>

          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <FaSignOutAlt className="text-xs" />
            Sign Out
          </button>
        </div>
      </div>

    </div>
  );
};

export default StaffSidebar;
