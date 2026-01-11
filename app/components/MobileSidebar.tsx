"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import Sidebar from './Sidebar';

const MobileSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      >
        <FaBars className="text-gray-600 dark:text-gray-300" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mobile-overlay md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <div className={`mobile-sidebar md:hidden ${isOpen ? 'open' : ''}`}>
        <Sidebar />
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 bg-gray-700 rounded-lg text-white"
        >
          <FaTimes />
        </button>
      </div>
    </>
  );
};

export default MobileSidebar;