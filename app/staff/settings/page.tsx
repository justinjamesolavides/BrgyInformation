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

  const tabs = [
    { id: "profile", label: t('settings.profile'), icon: <FaUser className="text-lg" /> },
    { id: "notifications", label: t('settings.notifications'), icon: <FaBell className="text-lg" /> },
    { id: "security", label: t('settings.security'), icon: <FaShieldAlt className="text-lg" /> },
    { id: "preferences", label: t('settings.preferences'), icon: <FaCog className="text-lg" /> }
  ];

  return (
    <div className="p-4 md:p-6 bg-white">
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
                <h1 className="text-xl font-semibold text-gray-900">
                  {t('settings.title')}
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  {t('settings.subtitle')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm sticky top-6">
              <div className="p-4">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Settings</h3>
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      {tab.icon}
                      <span className="text-sm font-medium">{tab.label}</span>
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
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-4">
                {/* Profile Settings */}
                {activeTab === "profile" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm">
                        <FaUser className="text-blue-600 text-lg" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">{t('settings.profileTitle')}</h2>
                        <p className="text-gray-600 text-sm">{t('settings.profileSubtitle')}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                          {t('settings.firstName')}
                        </label>
                        <input
                          type="text"
                          defaultValue="Staff"
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          placeholder="Enter your first name"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                          {t('settings.lastName')}
                        </label>
                        <input
                          type="text"
                          defaultValue="Member"
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          placeholder="Enter your last name"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                          {t('settings.email')}
                        </label>
                        <input
                          type="email"
                          defaultValue="staff@brgy.com"
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          placeholder="Enter your email"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                          {t('settings.phone')}
                        </label>
                        <input
                          type="tel"
                          defaultValue="+63 917 123 4567"
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-1.5 text-sm"
                      >
                        <FaSave className="text-xs" />
                        {t('settings.saveChanges')}
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
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center">
                        <FaBell className="text-green-600 dark:text-green-400 text-2xl" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{t('settings.notificationTitle')}</h2>
                        <p className="text-neutral-600 dark:text-neutral-400">{t('settings.notificationSubtitle')}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        {
                          title: t('settings.newRequests'),
                          description: t('settings.newRequestsDesc'),
                          enabled: true
                        },
                        {
                          title: t('settings.urgentTasks'),
                          description: t('settings.urgentTasksDesc'),
                          enabled: true
                        },
                        {
                          title: t('settings.systemUpdates'),
                          description: t('settings.systemUpdatesDesc'),
                          enabled: false
                        },
                        {
                          title: t('settings.weeklyReports'),
                          description: t('settings.weeklyReportsDesc'),
                          enabled: true
                        }
                      ].map((setting, index) => (
                        <motion.div
                          key={setting.title}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50"
                        >
                          <div className="flex-1">
                            <h3 className="font-medium text-neutral-900 dark:text-white">{setting.title}</h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">{setting.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              defaultChecked={setting.enabled}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
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
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-2xl flex items-center justify-center">
                        <FaShieldAlt className="text-red-600 dark:text-red-400 text-2xl" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{t('settings.securityTitle')}</h2>
                        <p className="text-neutral-600 dark:text-neutral-400">{t('settings.securitySubtitle')}</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          {t('settings.currentPassword')}
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="input-field w-full pr-12"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          {t('settings.newPassword')}
                        </label>
                        <input
                          type="password"
                          className="input-field w-full"
                          placeholder="Enter new password"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          {t('settings.confirmPassword')}
                        </label>
                        <input
                          type="password"
                          className="input-field w-full"
                          placeholder="Confirm new password"
                        />
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-start gap-3">
                          <FaShieldAlt className="text-yellow-600 dark:text-yellow-400 mt-1" />
                          <div>
                            <h4 className="font-medium text-yellow-800 dark:text-yellow-200">{t('settings.passwordRequirements')}</h4>
                            <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-1 space-y-1">
                              <li>• {t('settings.passwordReq1')}</li>
                              <li>• {t('settings.passwordReq2')}</li>
                              <li>• {t('settings.passwordReq3')}</li>
                              <li>• {t('settings.passwordReq4')}</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2"
                      >
                        <FaKey className="text-sm" />
                        {t('settings.updatePassword')}
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
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-2xl flex items-center justify-center">
                        <FaCog className="text-purple-600 dark:text-purple-400 text-2xl" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{t('settings.preferencesTitle')}</h2>
                        <p className="text-neutral-600 dark:text-neutral-400">{t('settings.preferencesSubtitle')}</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                          {t('settings.theme')}
                        </label>
                        <div className="flex items-center gap-4">
                          <ThemeToggle />
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {t('settings.toggleTheme')}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                          {t('settings.language')}
                        </label>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <FaLanguage className="text-blue-600 dark:text-blue-400 text-sm" />
                          </div>
                          <select 
                            className="input-field flex-1 max-w-xs"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as 'en' | 'tl')}
                          >
                            <option value="en">English</option>
                            <option value="tl">Filipino (Tagalog)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                          {t('settings.defaultView')}
                        </label>
                        <select className="input-field max-w-xs">
                          <option value="overview">{t('settings.overview')}</option>
                          <option value="requests">{t('settings.requests')}</option>
                          <option value="residents">{t('settings.residents')}</option>
                        </select>
                      </div>
                    </div>

                    {/* Staff Notice */}
                    <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-3">
                        <FaCog className="text-blue-600 dark:text-blue-400 mt-1" />
                        <div>
                          <h4 className="font-medium text-blue-800 dark:text-blue-200">{t('settings.staffNotice')}</h4>
                          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                            {t('settings.staffNoticeDesc')}
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