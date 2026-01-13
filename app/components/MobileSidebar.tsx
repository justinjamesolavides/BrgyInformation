"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import Sidebar from './Sidebar';

const MobileSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile menu button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 touch-manipulation touch-target"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open navigation menu"
      >
        <FaBars className="text-neutral-600 dark:text-neutral-300 text-lg" />
      </motion.button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mobile-overlay md:hidden touch-manipulation"
            onClick={() => setIsOpen(false)}
            role="button"
            tabIndex={-1}
            aria-label="Close navigation menu"
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <motion.div
        className="mobile-sidebar md:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] touch-manipulation"
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.3
        }}
      >
        <Sidebar />
        <motion.button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-3 bg-neutral-100 dark:bg-neutral-700 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors touch-manipulation touch-target"
          aria-label="Close navigation menu"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaTimes className="text-lg" />
        </motion.button>
      </motion.div>
    </>
  );
};

export default MobileSidebar;