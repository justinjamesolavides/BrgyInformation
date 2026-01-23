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
      <div className="p-4 md:p-6 bg-white">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shadow-sm">
              <FaBullhorn className="text-green-600 text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Announcement Created Successfully
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                The new announcement has been added to the system.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-gray-200 rounded-lg shadow-sm text-center py-12"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaBullhorn className="text-green-500 text-xl" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">
            Announcement Added Successfully!
          </h3>
          <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto">
            "{formData.title}" has been created and {formData.isPublished ? 'published' : 'saved as draft'}.
            {formData.isPublished && ' It is now visible to the selected audience.'}
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Redirecting to announcements...
          </p>
          <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-6"
      >
        <Link href="/admin/announcements">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 shadow-sm"
          >
            <FaArrowLeft className="text-gray-600 text-sm" />
          </motion.button>
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Create New Announcement
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Create and publish announcements for barangay residents and staff
          </p>
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
              className="p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">!</span>
                </div>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Basic Information */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <FaBullhorn className="text-orange-600 text-sm" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                Announcement Details
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter announcement title"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                  placeholder="Enter announcement content..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Classification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaInfoCircle className="text-blue-600 text-sm" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">
                  Type & Priority
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Announcement Type *
                  </label>
                  <div className="relative">
                    <select
                      name="announcementType"
                      value={formData.announcementType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none bg-white"
                      required
                    >
                      <option value="general">General</option>
                      <option value="news">News</option>
                      <option value="event">Event</option>
                      <option value="meeting">Meeting</option>
                      <option value="emergency">Emergency</option>
                    </select>
                    <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    {getTypeIcon(formData.announcementType)}
                    <span className="text-xs text-gray-600">
                      {formData.announcementType.charAt(0).toUpperCase() + formData.announcementType.slice(1)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Priority Level *
                  </label>
                  <div className="relative">
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none bg-white"
                      required
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                    <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full border ${getPriorityColor(formData.priority)}`}>
                      {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)} Priority
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaUsers className="text-purple-600 text-sm" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">
                  Target Audience
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Audience *
                  </label>
                  <div className="relative">
                    <select
                      name="targetAudience"
                      value={formData.targetAudience}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none bg-white"
                      required
                    >
                      <option value="all">All</option>
                      <option value="residents">Residents</option>
                      <option value="staff">Staff</option>
                      <option value="officials">Officials</option>
                    </select>
                    <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Expiration Date
                  </label>
                  <div className="relative">
                    <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FaClock className="text-xs" />
                    </div>
                    <input
                      type="datetime-local"
                      name="expiresAt"
                      value={formData.expiresAt}
                      onChange={handleInputChange}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty for no expiration
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Publishing Options */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <FaSave className="text-green-600 text-sm" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                Publishing Options
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Publish Immediately</h4>
                  <p className="text-xs text-gray-600">
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
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Attachments
                </label>
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  <div className="w-full p-4 border border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors cursor-pointer text-center">
                    <div className="text-center">
                      <FaPaperclip className="text-gray-400 text-lg mx-auto mb-1" />
                      <p className="text-xs text-gray-600">
                        {formData.attachments.length > 0
                          ? `${formData.attachments.length} file(s) selected`
                          : "Click to attach files"
                        }
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Images, PDF, DOC files
                      </p>
                    </div>
                  </div>
                </div>
                {formData.attachments.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <FaPaperclip className="text-gray-500 text-xs" />
                        <span className="text-xs text-gray-700 flex-1 truncate">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500">
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
          <div className="flex gap-3 pt-4">
            <Link href="/admin/announcements">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-1.5 flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <FaSave className="text-xs" />
                  {formData.isPublished ? 'Publish' : 'Save Draft'}
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