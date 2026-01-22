"use client";

import React, { useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import NotificationPanel from "../components/NotificationPanel";
import { motion } from "framer-motion";
import { useNotifications } from "../components/NotificationProvider";
import {
  FaUser,
  FaBell,
  FaShieldAlt,
  FaPalette,
  FaGlobe,
  FaDatabase,
  FaKey,
  FaSave,
  FaEye,
  FaEyeSlash,
  FaToggleOn,
  FaToggleOff,
  FaCamera,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
  FaUnlock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCog
} from "react-icons/fa";

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const { addNotification } = useNotifications();

  // Mock user data - in real app this would come from API
  const [userData, setUserData] = useState({
    firstName: "Juan",
    lastName: "Dela Cruz",
    email: "juan@example.com",
    phone: "+63 917 123 4567",
    address: "123 Main St, Barangay Central",
    avatar: "JD"
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    newRequests: true,
    requestUpdates: true,
    systemAlerts: true,
    weeklyReports: true,
    monthlyReports: false
  });

  const [systemSettings, setSystemSettings] = useState({
    language: "en",
    timezone: "Asia/Manila",
    dateFormat: "MM/DD/YYYY",
    theme: "auto",
    autoSave: true,
    showWelcome: true,
    enableAnalytics: false,
    debugMode: false
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "security", label: "Security", icon: <FaShieldAlt /> },
    { id: "notifications", label: "Notifications", icon: <FaBell /> },
    { id: "appearance", label: "Appearance", icon: <FaPalette /> },
    { id: "system", label: "System", icon: <FaCog /> }
  ];

  const handleSaveProfile = () => {
    // In real app, this would make an API call
    addNotification('success', 'Profile Updated', 'Your profile has been successfully updated.');
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addNotification('error', 'Password Mismatch', 'New password and confirmation do not match.');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      addNotification('error', 'Weak Password', 'Password must be at least 8 characters long.');
      return;
    }

    // In real app, this would make an API call
    addNotification('success', 'Password Changed', 'Your password has been successfully changed.');
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleSaveNotifications = () => {
    // In real app, this would make an API call
    addNotification('success', 'Settings Saved', 'Notification preferences have been updated.');
  };

  const handleSaveSystem = () => {
    // In real app, this would make an API call
    addNotification('success', 'Settings Saved', 'System settings have been updated.');
  };

  const handleAvatarChange = () => {
    // In real app, this would open file picker
    addNotification('info', 'Feature Coming Soon', 'Avatar upload feature will be available soon.');
  };

  const renderProfileTab = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Personal Information</h3>

        {/* Avatar Section */}
        <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-100 dark:border-gray-700">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md">
              {userData.avatar}
            </div>
            <button
              onClick={handleAvatarChange}
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
            >
              <FaCamera className="text-sm" />
            </button>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Profile Picture</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
              Upload a new profile picture. JPG, GIF or PNG. Max size 5MB.
            </p>
          </div>
        </div>

        {/* Personal Info Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              First Name
            </label>
            <input
              type="text"
              value={userData.firstName}
              onChange={(e) => setUserData({...userData, firstName: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Last Name
            </label>
            <input
              type="text"
              value={userData.lastName}
              onChange={(e) => setUserData({...userData, lastName: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Email Address
            </label>
            <input
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({...userData, email: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Phone Number
            </label>
            <input
              type="tel"
              value={userData.phone}
              onChange={(e) => setUserData({...userData, phone: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Address
            </label>
            <textarea
              value={userData.address}
              onChange={(e) => setUserData({...userData, address: e.target.value})}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none transition-colors"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end pt-6 border-t border-gray-100 dark:border-gray-700">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveProfile}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
          >
            <FaSave className="text-sm" />
            Save Changes
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  const renderSecurityTab = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Change Password</h3>

        <div className="space-y-6 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                {showCurrentPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                {showNewPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                {showConfirmPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end pt-6 border-t border-gray-100 dark:border-gray-700">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleChangePassword}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
          >
            <FaKey className="text-sm" />
            Change Password
          </motion.button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Two-Factor Authentication</h3>

        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border border-blue-100 dark:border-blue-800/50">
          <div className="mb-4 md:mb-0">
            <h4 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">Enable 2FA</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
              Add an extra layer of security to your account by requiring a second form of authentication.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md flex items-center gap-2 font-medium"
          >
            <FaShieldAlt className="text-sm" />
            Setup 2FA
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  const renderNotificationsTab = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Notification Preferences</h3>
  
        <div className="space-y-8">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-5">Communication Channels</h4>
            <div className="space-y-4">
              {[ 
                { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive push notifications in browser' },
                { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive notifications via SMS' }
              ].map((item) => (
                <div key={item.key} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600 hover:border-gray-200 dark:hover:border-gray-500 transition-colors">
                  <div className="mb-3 sm:mb-0">
                    <h5 className="font-medium text-gray-800 dark:text-white mb-1">{item.label}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotificationSettings({
                      ...notificationSettings,
                      [item.key]: !notificationSettings[item.key as keyof typeof notificationSettings]
                    })}
                    className="text-3xl"
                  >
                    {notificationSettings[item.key as keyof typeof notificationSettings] ?
                      <FaToggleOn className="text-blue-600" /> :
                      <FaToggleOff className="text-gray-400" />
                    }
                  </button>
                </div>
              ))}
            </div>
          </div>
  
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-5">Notification Types</h4>
            <div className="space-y-4">
              {[ 
                { key: 'newRequests', label: 'New Requests', desc: 'When new requests are submitted' },
                { key: 'requestUpdates', label: 'Request Updates', desc: 'When request status changes' },
                { key: 'systemAlerts', label: 'System Alerts', desc: 'Important system notifications' },
                { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Weekly summary reports' },
                { key: 'monthlyReports', label: 'Monthly Reports', desc: 'Monthly detailed reports' }
              ].map((item) => (
                <div key={item.key} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600 hover:border-gray-200 dark:hover:border-gray-500 transition-colors">
                  <div className="mb-3 sm:mb-0">
                    <h5 className="font-medium text-gray-800 dark:text-white mb-1">{item.label}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotificationSettings({
                      ...notificationSettings,
                      [item.key]: !notificationSettings[item.key as keyof typeof notificationSettings]
                    })}
                    className="text-3xl"
                  >
                    {notificationSettings[item.key as keyof typeof notificationSettings] ?
                      <FaToggleOn className="text-blue-600" /> :
                      <FaToggleOff className="text-gray-400" />
                    }
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
  
        <div className="mt-8 flex justify-end pt-6 border-t border-gray-100 dark:border-gray-700">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveNotifications}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
          >
            <FaSave className="text-sm" />
            Save Preferences
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  const renderAppearanceTab = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Theme Settings</h3>
  
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Theme Preference
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[ 
                { value: 'light', label: 'Light', icon: '☀️' },
                { value: 'dark', label: 'Dark', icon: '🌙' },
                { value: 'auto', label: 'Auto', icon: '🌓' }
              ].map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => setSystemSettings({...systemSettings, theme: theme.value})}
                  className={`p-6 border-2 rounded-xl text-center transition-all flex flex-col items-center ${
                    systemSettings.theme === theme.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-sm'
                  }`}
                >
                  <div className="text-4xl mb-3">{theme.icon}</div>
                  <div className="text-sm font-medium text-gray-800 dark:text-white">{theme.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderSystemTab = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Regional Settings</h3>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Language
            </label>
            <select
              value={systemSettings.language}
              onChange={(e) => setSystemSettings({...systemSettings, language: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            >
              <option value="en">English</option>
              <option value="tl">Filipino</option>
              <option value="es">Spanish</option>
            </select>
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Timezone
            </label>
            <select
              value={systemSettings.timezone}
              onChange={(e) => setSystemSettings({...systemSettings, timezone: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            >
              <option value="Asia/Manila">Asia/Manila (GMT+8)</option>
              <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Date Format
            </label>
            <select
              value={systemSettings.dateFormat}
              onChange={(e) => setSystemSettings({...systemSettings, dateFormat: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>
  
      <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">System Preferences</h3>
  
        <div className="space-y-4">
          {[ 
            { key: 'autoSave', label: 'Auto-save forms', desc: 'Automatically save form data as you type' },
            { key: 'showWelcome', label: 'Show welcome screen', desc: 'Display welcome message on login' },
            { key: 'enableAnalytics', label: 'Enable analytics', desc: 'Help improve the system with usage data' },
            { key: 'debugMode', label: 'Debug mode', desc: 'Show additional debugging information' }
          ].map((item) => (
            <div key={item.key} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600 hover:border-gray-200 dark:hover:border-gray-500 transition-colors">
              <div className="mb-3 sm:mb-0">
                <h5 className="font-medium text-gray-800 dark:text-white mb-1">{item.label}</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
              <button
                onClick={() => setSystemSettings({
                  ...systemSettings,
                  [item.key]: !systemSettings[item.key as keyof typeof systemSettings]
                })}
                className="text-3xl"
              >
                {systemSettings[item.key as keyof typeof systemSettings] ?
                  <FaToggleOn className="text-blue-600" /> :
                  <FaToggleOff className="text-gray-400" />
                }
              </button>
            </div>
          ))}
        </div>
  
        <div className="mt-8 flex justify-end pt-6 border-t border-gray-100 dark:border-gray-700">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveSystem}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
          >
            <FaSave className="text-sm" />
            Save Settings
          </motion.button>
        </div>
      </div>
  
      <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Data Management</h3>
  
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-100 dark:border-green-800/50">
            <div className="mb-4 sm:mb-0">
              <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Export Data</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
                Download all your data in a portable format.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md flex items-center gap-2 font-medium"
            >
              <FaDatabase className="text-sm" />
              Export
            </motion.button>
          </div>
  
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-xl border border-red-100 dark:border-red-800/50">
            <div className="mb-4 sm:mb-0">
              <h4 className="font-semibold text-red-800 dark:text-red-200 mb-1">Delete Account</h4>
              <p className="text-sm text-red-600 dark:text-red-400 max-w-md">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-5 py-3 rounded-lg hover:from-red-700 hover:to-rose-700 transition-all shadow-md flex items-center gap-2 font-medium"
            >
              <FaExclamationTriangle className="text-sm" />
              Delete
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-neutral-900">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 flex-1 p-6 md:p-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your account settings and preferences
          </p>
        </motion.div>

        {/* Settings Tabs */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-72 flex-shrink-0"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-lg text-left transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500 shadow-sm'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span className="font-medium text-base">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Tab Content */}
          <div className="flex-1 min-h-[600px]">
            {activeTab === "profile" && renderProfileTab()}
            {activeTab === "security" && renderSecurityTab()}
            {activeTab === "notifications" && renderNotificationsTab()}
            {activeTab === "appearance" && renderAppearanceTab()}
            {activeTab === "system" && renderSystemTab()}
          </div>

        </div>

      </div>
    </div>
  );
};

export default SettingsPage;