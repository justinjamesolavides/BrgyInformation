"use client";

import React, { useState } from "react";
import ThemeToggle from "../../components/ThemeToggle";
import { motion } from "framer-motion";
import { useLanguage } from "../../../contexts/LanguageContext";
import {
  FaCog,
  FaUser,
  FaBell,
  FaShieldAlt,
  FaKey,
  FaLanguage,
  FaSave,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

const StaffSettingsContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  
  // Profile settings state
  const [profileData, setProfileData] = useState({
    firstName: "Staff",
    lastName: "Member",
    email: "staff@brgy.com",
    phone: "+63 917 123 4567"
  });
  
  // Notification settings state
  const [notifications, setNotifications] = useState({
    newRequests: true,
    urgentTasks: true,
    systemUpdates: false,
    weeklyReports: true
  });
  
  // Security settings state
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  // Preferences settings state
  const [preferences, setPreferences] = useState({
    theme: "light",
    defaultView: "overview"
  });
  
  // Helper functions
  const saveProfileChanges = () => {
    console.log('Saving profile changes:', profileData);
    // In a real app, this would make an API call
    alert('Profile changes saved successfully!');
  };
  
  const updatePassword = () => {
    if (!securityData.currentPassword) {
      alert('Please enter your current password');
      return;
    }
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    if (securityData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }
    console.log('Updating password');
    // In a real app, this would make an API call
    alert('Password updated successfully!');
    setSecurityData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const tabs = [
    { id: "profile", label: t('settings.profile'), icon: <FaUser className="text-lg" /> },
    { id: "notifications", label: t('settings.notifications'), icon: <FaBell className="text-lg" /> },
    { id: "security", label: t('settings.security'), icon: <FaShieldAlt className="text-lg" /> },
    { id: "preferences", label: t('settings.preferences'), icon: <FaCog className="text-lg" /> }
  ];

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
      >
          <div className="flex-1 w-full md:w-auto">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm">
                <FaCog className="text-blue-600 text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Staff Settings
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Manage your account and preferences
                </p>
              </div>
            </div>
          </div>
        </motion.div>
    
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm sticky top-6">
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                        activeTab === tab.id
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent hover:border-gray-200"
                      }`}
                    >
                      {tab.icon}
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </motion.div>
    
          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="p-6">
                {/* Profile Settings */}
                {activeTab === "profile" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm">
                        <FaUser className="text-blue-600 text-xl" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Profile Settings</h2>
                        <p className="text-gray-600">Manage your personal information</p>
                      </div>
                    </div>
                
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                          className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                          placeholder="Enter your first name"
                        />
                      </div>
                
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                          className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                          placeholder="Enter your last name"
                        />
                      </div>
                
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                          placeholder="Enter your email"
                        />
                      </div>
                
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                
                    <div className="pt-6 border-t border-gray-200">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={saveProfileChanges}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
                      >
                        <FaSave className="text-sm" />
                        Save Changes
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Notification Settings */}
                {activeTab === "notifications" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center shadow-sm">
                        <FaBell className="text-green-600 text-xl" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Notification Settings</h2>
                        <p className="text-gray-600">Configure how you receive notifications</p>
                      </div>
                    </div>
                
                    <div className="space-y-4">
                      {[
                        {
                          id: 'newRequests',
                          title: 'New Requests',
                          description: 'Get notified when new requests are submitted',
                          enabled: true
                        },
                        {
                          id: 'urgentTasks',
                          title: 'Urgent Tasks',
                          description: 'Receive alerts for urgent tasks requiring immediate attention',
                          enabled: true
                        },
                        {
                          id: 'systemUpdates',
                          title: 'System Updates',
                          description: 'Stay informed about system maintenance and updates',
                          enabled: false
                        },
                        {
                          id: 'weeklyReports',
                          title: 'Weekly Reports',
                          description: 'Get summary reports of weekly activities',
                          enabled: true
                        }
                      ].map((setting, index) => (
                        <motion.div
                          key={setting.title}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-5 rounded-xl border border-gray-200 bg-white hover:shadow-sm transition-all"
                        >
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg mb-1">{setting.title}</h3>
                            <p className="text-gray-600">{setting.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications[setting.id as keyof typeof notifications]}
                              onChange={(e) => setNotifications({
                                ...notifications,
                                [setting.id]: e.target.checked
                              })}
                              className="sr-only peer"
                            />
                            <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Security Settings */}
                {activeTab === "security" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center shadow-sm">
                        <FaShieldAlt className="text-red-600 text-xl" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
                        <p className="text-gray-600">Manage your account security</p>
                      </div>
                    </div>
                
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={securityData.currentPassword}
                            onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                            className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all pr-12"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>
                
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={securityData.newPassword}
                          onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                          className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                          placeholder="Enter new password"
                        />
                      </div>
                
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={securityData.confirmPassword}
                          onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                          className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                          placeholder="Confirm new password"
                        />
                      </div>
                
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                        <div className="flex items-start gap-3">
                          <FaShieldAlt className="text-amber-600 mt-1 text-lg" />
                          <div>
                            <h4 className="font-semibold text-amber-800 mb-2">Password Requirements</h4>
                            <ul className="text-amber-700 space-y-1">
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                At least 8 characters long
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                Include uppercase and lowercase letters
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                Contain at least one number
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                Include special characters (!@#$%^&*)
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={updatePassword}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
                      >
                        <FaKey className="text-sm" />
                        Update Password
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Preferences */}
                {activeTab === "preferences" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center shadow-sm">
                        <FaCog className="text-purple-600 text-xl" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Preferences</h2>
                        <p className="text-gray-600">Customize your experience</p>
                      </div>
                    </div>
                
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Theme
                        </label>
                        <div className="flex items-center gap-4">
                          <ThemeToggle />
                          <span className="text-gray-600">
                            Toggle between light and dark mode
                          </span>
                        </div>
                      </div>
                
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Language
                        </label>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FaLanguage className="text-blue-600 text-lg" />
                          </div>
                          <select 
                            className="w-full max-w-xs px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as 'en' | 'tl')}
                          >
                            <option value="en">English</option>
                            <option value="tl">Filipino (Tagalog)</option>
                          </select>
                        </div>
                      </div>
                
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Default Dashboard View
                        </label>
                        <select 
                          className="w-full max-w-xs px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                          value={preferences.defaultView}
                          onChange={(e) => setPreferences({...preferences, defaultView: e.target.value})}
                        >
                          <option value="overview">Overview</option>
                          <option value="requests">Requests</option>
                          <option value="residents">Residents</option>
                        </select>
                      </div>
                    </div>
                
                    {/* Staff Notice */}
                    <div className="mt-8 p-5 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <FaCog className="text-blue-600 mt-1 text-lg" />
                        <div>
                          <h4 className="font-semibold text-blue-800 mb-1">Staff Account Limitations</h4>
                          <p className="text-blue-700">
                            Some settings may be restricted for staff accounts. Contact your administrator for advanced configuration options.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
      </div>
    </div>
  );
};

const StaffSettingsPage: React.FC = () => {
  return <StaffSettingsContent />;
};

export default StaffSettingsPage;