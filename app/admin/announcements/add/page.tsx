"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaBullhorn, FaArrowLeft, FaSave, FaCalendarAlt, FaUsers, FaExclamationTriangle, FaInfoCircle, FaClock, FaPaperclip } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AddAnnouncementPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    announcementType: "general" as "news" | "event" | "emergency" | "general" | "meeting",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    targetAudience: "all" as "all" | "residents" | "staff" | "officials",
    isPublished: false,
    expiresAt: "",
    attachments: [] as File[]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFormData(prev => ({
        ...prev,
        attachments: Array.from(files)
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) return "Title is required";
    if (!formData.content.trim()) return "Content is required";
    if (!["news", "event", "emergency", "general", "meeting"].includes(formData.announcementType)) return "Invalid announcement type";
    if (!["low", "medium", "high", "urgent"].includes(formData.priority)) return "Invalid priority level";
    if (!["all", "residents", "staff", "officials"].includes(formData.targetAudience)) return "Invalid target audience";

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const announcementData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        announcementType: formData.announcementType,
        priority: formData.priority,
        targetAudience: formData.targetAudience,
        isPublished: formData.isPublished,
        expiresAt: formData.expiresAt || null,
        attachments: formData.attachments.map(file => ({
          name: file.name,
          url: URL.createObjectURL(file), // In production, upload to storage
          size: file.size,
          type: file.type
        }))
      };

      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(announcementData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create announcement');
      }

      setSuccess(true);

      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/announcements');
      }, 2000);

    } catch (err: any) {
      console.error('Error creating announcement:', err);
      setError(err.message || 'Failed to create announcement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'emergency': return <FaExclamationTriangle className="text-red-500" />;
      case 'event': return <FaCalendarAlt className="text-blue-500" />;
      case 'meeting': return <FaUsers className="text-purple-500" />;
      case 'news': return <FaInfoCircle className="text-green-500" />;
      default: return <FaBullhorn className="text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  if (success) {
    return (
      <div className="p-6 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-6 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center shadow-lg">
              <FaBullhorn className="text-green-600 dark:text-green-400 text-2xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-neutral-900 dark:text-white font-display">
                Announcement Created Successfully
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-lg">
                The new announcement has been added to the system.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card text-center py-16"
        >
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaBullhorn className="text-green-500 text-3xl" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
            Announcement Added Successfully!
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
            "{formData.title}" has been created and {formData.isPublished ? 'published' : 'saved as draft'}.
            {formData.isPublished && ' It is now visible to the selected audience.'}
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8">
            Redirecting to announcements...
          </p>
          <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-4">
          <Link href="/admin/announcements">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-white dark:bg-neutral-800 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all duration-200 shadow-sm border border-neutral-200 dark:border-neutral-700"
            >
              <FaArrowLeft className="text-neutral-600 dark:text-neutral-400 text-lg" />
            </motion.button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-white font-display">
              Create New Announcement
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-lg">
              Create and publish announcements for barangay residents and staff
            </p>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">!</span>
                </div>
                <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Basic Information */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center">
                <FaBullhorn className="text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Announcement Details
              </h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter announcement title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={6}
                  className="input-field resize-none"
                  placeholder="Enter announcement content..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Classification */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                  <FaInfoCircle className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Type & Priority
                </h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Announcement Type *
                  </label>
                  <div className="relative">
                    <select
                      name="announcementType"
                      value={formData.announcementType}
                      onChange={handleInputChange}
                      className="input-field pr-10 appearance-none cursor-pointer"
                      required
                    >
                      <option value="general">General Announcement</option>
                      <option value="news">News Update</option>
                      <option value="event">Event Notice</option>
                      <option value="meeting">Meeting Notice</option>
                      <option value="emergency">Emergency Alert</option>
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {getTypeIcon(formData.announcementType)}
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      {formData.announcementType.charAt(0).toUpperCase() + formData.announcementType.slice(1)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Priority Level *
                  </label>
                  <div className="relative">
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="input-field pr-10 appearance-none cursor-pointer"
                      required
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                      <option value="urgent">Urgent</option>
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(formData.priority)}`}>
                      {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)} Priority
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                  <FaUsers className="text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Target Audience
                </h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Audience *
                  </label>
                  <div className="relative">
                    <select
                      name="targetAudience"
                      value={formData.targetAudience}
                      onChange={handleInputChange}
                      className="input-field pr-10 appearance-none cursor-pointer"
                      required
                    >
                      <option value="all">All Residents & Staff</option>
                      <option value="residents">Residents Only</option>
                      <option value="staff">Staff Only</option>
                      <option value="officials">Officials Only</option>
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Expiration Date (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400">
                      <FaClock className="text-sm" />
                    </div>
                    <input
                      type="datetime-local"
                      name="expiresAt"
                      value={formData.expiresAt}
                      onChange={handleInputChange}
                      className="input-field pl-12"
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Leave empty for no expiration
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Publishing Options */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                <FaSave className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Publishing Options
              </h3>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-neutral-900 dark:text-white">Publish Immediately</h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Make this announcement visible to the selected audience right away
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleCheckboxChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Attachments (Optional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  <div className="input-field flex items-center justify-center py-8 border-2 border-dashed border-neutral-300 dark:border-neutral-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer">
                    <div className="text-center">
                      <FaPaperclip className="text-neutral-400 text-2xl mx-auto mb-2" />
                      <p className="text-neutral-600 dark:text-neutral-400">
                        {formData.attachments.length > 0
                          ? `${formData.attachments.length} file(s) selected`
                          : "Click to attach files or drag and drop"
                        }
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        Images, PDF, DOC files up to 10MB each
                      </p>
                    </div>
                  </div>
                </div>
                {formData.attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                        <FaPaperclip className="text-neutral-500 text-sm" />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300 flex-1">
                          {file.name}
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <Link href="/admin/announcements">
              <button
                type="button"
                className="btn-secondary"
              >
                Cancel
              </button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2 flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Announcement...
                </>
              ) : (
                <>
                  <FaSave className="text-sm" />
                  {formData.isPublished ? 'Publish Announcement' : 'Save as Draft'}
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddAnnouncementPage;