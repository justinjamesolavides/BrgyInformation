"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaCog, FaUser, FaShieldAlt, FaDatabase, FaBell } from "react-icons/fa";

const AdminSettingsPage: React.FC = () => {
  return (
    <div className="p-4 md:p-6 bg-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center shadow-sm">
            <FaCog className="text-gray-600 text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Admin Settings
            </h1>
            <p className="text-gray-600 text-sm mt-1">
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
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {[
          {
            title: "Profile Settings",
            description: "Update admin profile and account information",
            icon: <FaUser className="text-blue-500" />,
            color: "blue"
          },
          {
            title: "Security Settings",
            description: "Manage passwords, authentication, and access controls",
            icon: <FaShieldAlt className="text-green-500" />,
            color: "green"
          },
          {
            title: "System Configuration",
            description: "Database settings, backup configuration, and maintenance",
            icon: <FaDatabase className="text-purple-500" />,
            color: "purple"
          },
          {
            title: "Notification Settings",
            description: "Configure system alerts and notification preferences",
            icon: <FaBell className="text-orange-500" />,
            color: "orange"
          }
        ].map((setting, index) => (
          <motion.div
            key={setting.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            whileHover={{ y: -2 }}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                  {setting.icon}
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                {setting.title}
              </h3>
              <p className="text-gray-600 text-xs mb-3">
                {setting.description}
              </p>
              <div className="w-full bg-gray-100 text-gray-500 rounded-lg py-1.5 text-xs font-medium">
                Configure
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm p-4"
      >
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-3">
            System Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-green-900 text-sm">Database</p>
                <p className="text-xs text-green-700">Operational</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-green-900 text-sm">API Services</p>
                <p className="text-xs text-green-700">Running</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="font-medium text-yellow-900 text-sm">Backups</p>
                <p className="text-xs text-yellow-700">Last: 2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSettingsPage;