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
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Personal Information</h3>

        {/* Avatar Section */}
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {userData.avatar}
            </div>
            <button
              onClick={handleAvatarChange}
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              <FaCamera className="text-sm" />
            </button>
          </div>
          <div>
            <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">Profile Picture</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Upload a new profile picture</p>
          </div>
        </div>

        {/* Personal Info Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={userData.firstName}
              onChange={(e) => setUserData({...userData, firstName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={userData.lastName}
              onChange={(e) => setUserData({...userData, lastName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({...userData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={userData.phone}
              onChange={(e) => setUserData({...userData, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address
            </label>
            <textarea
              value={userData.address}
              onChange={(e) => setUserData({...userData, address: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveProfile}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
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
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Change Password</h3>

        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleChangePassword}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <FaKey className="text-sm" />
            Change Password
          </motion.button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Two-Factor Authentication</h3>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-800 dark:text-gray-200">Enable 2FA</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security to your account</p>
          </div>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2">
            <FaShieldAlt className="text-sm" />
            Setup 2FA
          </button>
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
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Notification Preferences</h3>

        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Communication Channels</h4>
            <div className="space-y-4">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive push notifications in browser' },
                { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive notifications via SMS' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h5 className="font-medium text-gray-800 dark:text-gray-200">{item.label}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotificationSettings({
                      ...notificationSettings,
                      [item.key]: !notificationSettings[item.key as keyof typeof notificationSettings]
                    })}
                    className="text-2xl"
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
            <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Notification Types</h4>
            <div className="space-y-4">
              {[
                { key: 'newRequests', label: 'New Requests', desc: 'When new requests are submitted' },
                { key: 'requestUpdates', label: 'Request Updates', desc: 'When request status changes' },
                { key: 'systemAlerts', label: 'System Alerts', desc: 'Important system notifications' },
                { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Weekly summary reports' },
                { key: 'monthlyReports', label: 'Monthly Reports', desc: 'Monthly detailed reports' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h5 className="font-medium text-gray-800 dark:text-gray-200">{item.label}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotificationSettings({
                      ...notificationSettings,
                      [item.key]: !notificationSettings[item.key as keyof typeof notificationSettings]
                    })}
                    className="text-2xl"
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

        <div className="mt-6 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveNotifications}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
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
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Theme Settings</h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Theme Preference
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'light', label: 'Light', icon: '☀️' },
                { value: 'dark', label: 'Dark', icon: '🌙' },
                { value: 'auto', label: 'Auto', icon: '🌓' }
              ].map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => setSystemSettings({...systemSettings, theme: theme.value})}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    systemSettings.theme === theme.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="text-2xl mb-2">{theme.icon}</div>
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{theme.label}</div>
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
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Regional Settings</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Language
            </label>
            <select
              value={systemSettings.language}
              onChange={(e) => setSystemSettings({...systemSettings, language: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="en">English</option>
              <option value="tl">Filipino</option>
              <option value="es">Spanish</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Timezone
            </label>
            <select
              value={systemSettings.timezone}
              onChange={(e) => setSystemSettings({...systemSettings, timezone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="Asia/Manila">Asia/Manila (GMT+8)</option>
              <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date Format
            </label>
            <select
              value={systemSettings.dateFormat}
              onChange={(e) => setSystemSettings({...systemSettings, dateFormat: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">System Preferences</h3>

        <div className="space-y-4">
          {[
            { key: 'autoSave', label: 'Auto-save forms', desc: 'Automatically save form data as you type' },
            { key: 'showWelcome', label: 'Show welcome screen', desc: 'Display welcome message on login' },
            { key: 'enableAnalytics', label: 'Enable analytics', desc: 'Help improve the system with usage data' },
            { key: 'debugMode', label: 'Debug mode', desc: 'Show additional debugging information' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h5 className="font-medium text-gray-800 dark:text-gray-200">{item.label}</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
              <button
                onClick={() => setSystemSettings({
                  ...systemSettings,
                  [item.key]: !systemSettings[item.key as keyof typeof systemSettings]
                })}
                className="text-2xl"
              >
                {systemSettings[item.key as keyof typeof systemSettings] ?
                  <FaToggleOn className="text-blue-600" /> :
                  <FaToggleOff className="text-gray-400" />
                }
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveSystem}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FaSave className="text-sm" />
            Save Settings
          </motion.button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Data Management</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-200">Export Data</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Download all your data</p>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
              <FaDatabase className="text-sm" />
              Export
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div>
              <h4 className="font-medium text-red-800 dark:text-red-200">Delete Account</h4>
              <p className="text-sm text-red-600 dark:text-red-400">Permanently delete your account and all data</p>
            </div>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
              <FaExclamationTriangle className="text-sm" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 flex-1 p-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your account settings and preferences
          </p>
        </motion.div>

        {/* Settings Tabs */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-64"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-4 border-blue-500'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
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