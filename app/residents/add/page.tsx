"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import { motion } from "framer-motion";
import {
  FaUserPlus,
  FaArrowLeft,
  FaSave,
  FaIdCard,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationTriangle
} from "react-icons/fa";
import Link from "next/link";

const AddResidentPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    phone: "",
    address: "",
    barangayId: "",
    dateOfBirth: "",
    gender: "",
    civilStatus: "",
    occupation: "",
    emergencyContact: "",
    emergencyPhone: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/residents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.fields) {
          // Field-specific errors
          const fieldErrors: {[key: string]: string} = {};
          data.fields.forEach((field: string) => {
            fieldErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: data.error || 'Failed to create resident' });
        }
        return;
      }

      // Success
      setSuccess(true);

      // Redirect after showing success message
      setTimeout(() => {
        router.push('/residents');
      }, 2000);

    } catch (error: any) {
      console.error('Error creating resident:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
        <div className="flex min-h-screen bg-white dark:bg-neutral-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 flex-1 p-6 md:p-8 lg:p-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-6 mb-10"
        >
          <Link href="/residents">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-white dark:bg-neutral-800 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all duration-200 shadow-sm border border-neutral-200 dark:border-neutral-700"
            >
              <FaArrowLeft className="text-neutral-600 dark:text-neutral-400 text-lg" />
            </motion.button>
          </Link>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FaUserPlus className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-neutral-900 dark:text-white font-display leading-tight">
                Add New Resident
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-lg">
                Register a new resident in the barangay system
              </p>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-neutral-900 rounded-3xl shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden"
        >
          <div className="p-8 lg:p-10">
            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl flex items-center gap-4 shadow-sm"
              >
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-2xl flex items-center justify-center">
                  <FaCheckCircle className="text-green-600 dark:text-green-400 text-xl" />
                </div>
                <div>
                  <p className="text-green-800 dark:text-green-200 font-bold text-lg">Resident Added Successfully!</p>
                  <p className="text-green-700 dark:text-green-300 text-sm mt-1">Redirecting to residents list...</p>
                </div>
              </motion.div>
            )}

            {/* General Error */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl flex items-center gap-4 shadow-sm"
              >
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-2xl flex items-center justify-center">
                  <FaExclamationTriangle className="text-red-600 dark:text-red-400 text-xl" />
                </div>
                <span className="text-red-800 dark:text-red-200 font-semibold">{errors.general}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/30">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
                    <FaIdCard className="text-blue-600 dark:text-blue-400 text-lg" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                    Basic Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3 flex items-center gap-2">
                      First Name
                      <span className="text-red-500 text-lg">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 text-base border-2 rounded-xl bg-white dark:bg-neutral-800 transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 ${
                        errors.firstName
                          ? 'border-red-300 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-200'
                          : 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500'
                      }`}
                      placeholder="Enter first name"
                      required
                      disabled={isLoading || success}
                    />
                    {errors.firstName && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2"
                      >
                        <FaExclamationTriangle className="text-sm" />
                        {errors.firstName}
                      </motion.p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-base border-2 border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-500 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      placeholder="Enter middle name (optional)"
                      disabled={isLoading || success}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3 flex items-center gap-2">
                      Last Name
                      <span className="text-red-500 text-lg">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-base border-2 border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-500 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      placeholder="Enter last name"
                      required
                      disabled={isLoading || success}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-2xl p-6 border border-green-100 dark:border-green-800/30">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center">
                    <FaPhone className="text-green-600 dark:text-green-400 text-lg" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                    Contact Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3 flex items-center gap-2">
                      Email Address
                      <span className="text-red-500 text-lg">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-base border-2 border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-500 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                      placeholder="resident@example.com"
                      required
                      disabled={isLoading || success}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3 flex items-center gap-2">
                      Phone Number
                      <span className="text-red-500 text-lg">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-base border-2 border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-500 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                      placeholder="+63 917 123 4567"
                      required
                      disabled={isLoading || success}
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-gradient-to-br from-red-50/50 to-pink-50/50 dark:from-red-900/10 dark:to-pink-900/10 rounded-2xl p-6 border border-red-100 dark:border-red-800/30">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-xl flex items-center justify-center">
                    <FaMapMarkerAlt className="text-red-600 dark:text-red-400 text-lg" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                    Address Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3 flex items-center gap-2">
                      Complete Address
                      <span className="text-red-500 text-lg">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-base border-2 border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-500 focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                      placeholder="123 Main Street, Barangay Central, City, Province"
                      required
                      disabled={isLoading || success}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
                      Barangay ID
                    </label>
                    <input
                      type="text"
                      name="barangayId"
                      value={formData.barangayId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-base border-2 border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-500 focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                      placeholder="BRGY-0001"
                      disabled={isLoading || success}
                    />
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      Auto-generated if left empty
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-gradient-to-br from-purple-50/50 to-violet-50/50 dark:from-purple-900/10 dark:to-violet-900/10 rounded-2xl p-6 border border-purple-100 dark:border-purple-800/30">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/40 rounded-xl flex items-center justify-center">
                    <FaCalendarAlt className="text-purple-600 dark:text-purple-400 text-lg" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                    Personal Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3 flex items-center gap-2">
                      Date of Birth
                      <span className="text-red-500 text-lg">*</span>
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-base border-2 border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-500 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                      required
                      disabled={isLoading || success}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3 flex items-center gap-2">
                      Gender
                      <span className="text-red-500 text-lg">*</span>
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-base border-2 border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-500 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                      required
                      disabled={isLoading || success}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">👨 Male</option>
                      <option value="female">👩 Female</option>
                      <option value="other">🧑 Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
                      Civil Status
                    </label>
                    <select
                      name="civilStatus"
                      value={formData.civilStatus}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-base border-2 border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-500 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                      disabled={isLoading || success}
                    >
                      <option value="">Select Status</option>
                      <option value="single">💍 Single</option>
                      <option value="married">💒 Married</option>
                      <option value="widowed">🌹 Widowed</option>
                      <option value="divorced">📝 Divorced</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
                      Occupation
                    </label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-base border-2 border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-500 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                      placeholder="e.g., Teacher, Engineer, Student"
                      disabled={isLoading || success}
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-gradient-to-br from-orange-50/50 to-amber-50/50 dark:from-orange-900/10 dark:to-amber-900/10 rounded-2xl p-6 border border-orange-100 dark:border-orange-800/30">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/40 rounded-xl flex items-center justify-center">
                    <FaUserPlus className="text-orange-600 dark:text-orange-400 text-lg" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                    Emergency Contact
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
                      Emergency Contact Name
                    </label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-base border-2 border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-500 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                      placeholder="Full name of emergency contact"
                      disabled={isLoading || success}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
                      Emergency Contact Phone
                    </label>
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-base border-2 border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-500 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                      placeholder="+63 917 123 4567"
                      disabled={isLoading || success}
                    />
                  </div>
                </div>

                <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800/30">
                  <p className="text-sm text-orange-800 dark:text-orange-200 font-medium">
                    ℹ️ Emergency contact information helps barangay officials reach family members during emergencies.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-8 border-t border-neutral-200 dark:border-neutral-700">
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <Link href="/residents">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      disabled={isLoading || success}
                      className="w-full sm:w-auto px-8 py-4 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white border-2 border-neutral-300 dark:border-neutral-600 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </motion.button>
                  </Link>

                  <motion.button
                    whileHover={{ scale: isLoading || success ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading || success ? 1 : 0.98 }}
                    type="submit"
                    disabled={isLoading || success}
                    className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl ${
                      isLoading || success
                        ? 'bg-neutral-400 cursor-not-allowed shadow-neutral-200'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="text-lg">Saving Resident...</span>
                      </>
                    ) : success ? (
                      <>
                        <FaCheckCircle className="text-xl" />
                        <span className="text-lg">Resident Saved!</span>
                      </>
                    ) : (
                      <>
                        <FaSave className="text-lg" />
                        <span className="text-lg">Save Resident</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddResidentPage;