"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimesCircle, FaTimes, FaTrash, FaCheck } from 'react-icons/fa';
import { useNotifications } from './NotificationProvider';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose, triggerRef }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const { notifications, removeNotification } = useNotifications();

  // Mock notifications for demo - in real app this would come from API
  const [allNotifications] = useState([
    {
      id: '1',
      type: 'info' as const,
      title: 'New Resident Registration',
      message: 'Maria Santos has registered as a new resident.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      read: false
    },
    {
      id: '2',
      type: 'success' as const,
      title: 'Request Approved',
      message: 'Barangay Clearance for Juan Dela Cruz has been approved.',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      read: false
    },
    {
      id: '3',
      type: 'warning' as const,
      title: 'Document Review Required',
      message: 'Business Permit application needs additional documents.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: true
    },
    {
      id: '4',
      type: 'error' as const,
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur tonight from 2-4 AM.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      read: true
    }
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'error':
        return <FaTimesCircle className="text-red-500" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500" />;
      case 'info':
      default:
        return <FaInfoCircle className="text-blue-500" />;
    }
  };

  const getNotificationStyles = (type: string, read: boolean) => {
    const baseStyles = read ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800';
    return `${baseStyles} hover:bg-gray-100 dark:hover:bg-gray-700 border-l-4 ${
      type === 'success' ? 'border-green-500' :
      type === 'error' ? 'border-red-500' :
      type === 'warning' ? 'border-yellow-500' :
      'border-blue-500'
    }`;
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const unreadCount = allNotifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-96 max-w-sm bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden z-50"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <FaBell className="text-xl" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">Notifications</h3>
                  <p className="text-sm text-blue-100">
                    {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-blue-200 hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button className="flex-1 px-4 py-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              <FaCheck className="inline mr-2" />
              Mark All Read
            </button>
            <button className="flex-1 px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-l border-gray-200 dark:border-gray-700">
              <FaTrash className="inline mr-2" />
              Clear All
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {allNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <FaBell className="mx-auto text-3xl mb-3 opacity-50" />
                <p>No notifications yet</p>
                <p className="text-sm mt-1">We'll notify you when there's something new</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {allNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 cursor-pointer transition-colors ${getNotificationStyles(notification.type, notification.read)}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className={`text-sm font-medium truncate ${
                            notification.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'
                          }`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                        <p className={`text-sm mt-1 ${
                          notification.read ? 'text-gray-500 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          {getTimeAgo(notification.timestamp)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // In real app, this would remove the notification
                          console.log('Remove notification:', notification.id);
                        }}
                        className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {allNotifications.length > 0 && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
              <button className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors">
                View All Notifications
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;