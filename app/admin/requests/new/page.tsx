"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../components/Sidebar";
import { motion } from "framer-motion";
import {
  FaFileAlt,
  FaArrowLeft,
  FaSave,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaCheckCircle
} from "react-icons/fa";
import Link from "next/link";

const NewRequestPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    type: "clearance",
    requesterName: "",
    requesterEmail: "",
    requesterPhone: "",
    requesterAddress: "",
    purpose: "",
    priority: "medium",
    notes: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.requesterName.trim()) {
      newErrors.requesterName = "Requester name is required";
    }
    if (!formData.requesterEmail.trim()) {
      newErrors.requesterEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.requesterEmail)) {
      newErrors.requesterEmail = "Please enter a valid email";
    }
    if (!formData.requesterPhone.trim()) {
      newErrors.requesterPhone = "Phone number is required";
    }
    if (!formData.requesterAddress.trim()) {
      newErrors.requesterAddress = "Address is required";
    }
    if (!formData.purpose.trim()) {
      newErrors.purpose = "Purpose is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: formData.type,
          title: `${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} Request`,
          requesterName: formData.requesterName,
          requesterEmail: formData.requesterEmail,
          requesterPhone: formData.requesterPhone,
          requesterAddress: formData.requesterAddress,
          purpose: formData.purpose,
          priority: formData.priority,
          notes: formData.notes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create request');
      }

      const result = await response.json();
      
      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/requests");
      }, 2000);
    } catch (error: any) {
      console.error('Error creating request:', error);
      setErrors({ general: error.message || "Failed to create request. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen bg-white dark:bg-neutral-900">
        <Sidebar />
        <div className="ml-64 flex-1 p-6 md:p-8 lg:p-10 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-green-600 dark:text-green-400 text-4xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Request Created Successfully!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your request has been submitted and is now pending review.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Redirecting to pending requests...
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-neutral-900">
      <Sidebar />

      <div className="ml-64 flex-1 p-6 md:p-8 lg:p-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-6 mb-10"
        >
          <Link href="/admin/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-white dark:bg-neutral-800 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all duration-200 shadow-sm border border-neutral-200 dark:border-neutral-700"
            >
              <FaArrowLeft className="text-neutral-600 dark:text-neutral-400 text-lg" />
            </motion.button>
          </Link>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FaFileAlt className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-neutral-900 dark:text-white font-display leading-tight">
                New Request
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-lg">
                Create a new certificate or permit request
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-8"
        >
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3"
            >
              <FaExclamationTriangle className="text-red-500 text-lg" />
              <span className="text-red-700 dark:text-red-300">{errors.general}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Request Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="clearance">Barangay Clearance</option>
                  <option value="permit">Business Permit</option>
                  <option value="certificate">Certificate of Indigency</option>
                  <option value="residency">Certificate of Residency</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Requester Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="requesterName"
                  value={formData.requesterName}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 border rounded-xl bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.requesterName ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-neutral-600'
                  }`}
                  placeholder="Enter requester's full name"
                />
              </div>
              {errors.requesterName && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.requesterName}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="requesterEmail"
                    value={formData.requesterEmail}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      errors.requesterEmail ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-neutral-600'
                    }`}
                    placeholder="requester@example.com"
                  />
                </div>
                {errors.requesterEmail && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.requesterEmail}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="requesterPhone"
                    value={formData.requesterPhone}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      errors.requesterPhone ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-neutral-600'
                    }`}
                    placeholder="+63 917 123 4567"
                  />
                </div>
                {errors.requesterPhone && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.requesterPhone}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-4 top-4 text-gray-400" />
                <textarea
                  name="requesterAddress"
                  value={formData.requesterAddress}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full pl-12 pr-4 py-3 border rounded-xl bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.requesterAddress ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-neutral-600'
                  }`}
                  placeholder="Enter complete address"
                />
              </div>
              {errors.requesterAddress && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.requesterAddress}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Purpose <span className="text-red-500">*</span>
              </label>
              <textarea
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  errors.purpose ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-neutral-600'
                }`}
                placeholder="Describe the purpose of this request..."
              />
              {errors.purpose && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.purpose}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Any additional information or special requirements..."
              />
            </div>

            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-neutral-700">
              <Link href="/admin/dashboard" className="flex-1">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className="w-full px-6 py-4 bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded-xl hover:bg-gray-200 dark:hover:bg-neutral-600 transition-all duration-200 font-semibold"
                >
                  Cancel
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Request...
                  </>
                ) : (
                  <>
                    <FaSave className="text-sm" />
                    Create Request
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default NewRequestPage;
