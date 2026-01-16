"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaCog, FaUser, FaShieldAlt, FaDatabase, FaBell } from "react-icons/fa";

const AdminSettingsPage: React.FC = () => {
  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-6 mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg">
            <FaCog className="text-gray-600 dark:text-gray-400 text-2xl" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-white font-display">
              Admin Settings
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-lg">
              System configuration and administrative controls
            </p>
          </div>
        </div>
      </motion.div>

      {/* Settings Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {[
          {
            title: "Profile Settings",
            description: "Update admin profile and account information",
            icon: <FaUser className="text-blue-500" />,
            color: "bg-blue-50 dark:bg-blue-900/20"
          },
          {
            title: "Security Settings",
            description: "Manage passwords, authentication, and access controls",
            icon: <FaShieldAlt className="text-green-500" />,
            color: "bg-green-50 dark:bg-green-900/20"
          },
          {
            title: "System Configuration",
            description: "Database settings, backup configuration, and maintenance",
            icon: <FaDatabase className="text-purple-500" />,
            color: "bg-purple-50 dark:bg-purple-900/20"
          },
          {
            title: "Notification Settings",
            description: "Configure system alerts and notification preferences",
            icon: <FaBell className="text-orange-500" />,
            color: "bg-orange-50 dark:bg-orange-900/20"
          }
        ].map((setting, index) => (
          <motion.div
            key={setting.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            whileHover={{ y: -4 }}
            className="card card-interactive group"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${setting.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  {setting.icon}
                </div>
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                {setting.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
                {setting.description}
              </p>
              <button className="w-full btn-secondary justify-center">
                Configure
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 card"
      >
        <div className="p-6">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
            System Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-green-900 dark:text-green-300">Database</p>
                <p className="text-sm text-green-700 dark:text-green-400">Operational</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-green-900 dark:text-green-300">API Services</p>
                <p className="text-sm text-green-700 dark:text-green-400">Running</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="font-medium text-yellow-900 dark:text-yellow-300">Backups</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">Last: 2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSettingsPage;