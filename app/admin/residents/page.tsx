"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaUsers, FaUserPlus, FaSearch } from "react-icons/fa";

const AdminResidentsPage: React.FC = () => {
  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-6 mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center shadow-lg">
            <FaUsers className="text-blue-600 dark:text-blue-400 text-2xl" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-white font-display">
              Resident Management
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-lg">
              Admin access to resident records and management
            </p>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="p-8 text-center">
          <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaUsers className="text-neutral-400 dark:text-neutral-500 text-3xl" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
            Resident Management
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
            Admin panel for managing resident records. This feature is under development.
          </p>
          <div className="flex justify-center gap-4">
            <button className="btn-primary">
              <FaUserPlus className="text-sm mr-2" />
              Add Resident
            </button>
            <button className="btn-secondary">
              <FaSearch className="text-sm mr-2" />
              Search Residents
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminResidentsPage;