"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaHome,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaDollarSign,
  FaCheckCircle,
  FaExclamationTriangle
} from "react-icons/fa";

interface AddHouseholdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHouseholdAdded: (household: any) => void;
}

const AddHouseholdModal: React.FC<AddHouseholdModalProps> = ({
  isOpen,
  onClose,
  onHouseholdAdded
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    householdId: '',
    headOfHouseholdName: '',
    headOfHouseholdRelationship: 'head',
    address: '',
    contactNumber: '',
    householdType: 'nuclear',
    economicStatus: 'middle',
    totalMembers: 1
  });

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.householdId || !formData.headOfHouseholdName || !formData.address) {
        throw new Error('Please fill in all required fields');
      }

      // Create household data
      const householdData = {
        householdId: formData.householdId,
        headOfHousehold: {
          id: Date.now(), // Temporary ID generation
          name: formData.headOfHouseholdName,
          relationship: formData.headOfHouseholdRelationship
        },
        address: formData.address,
        contactNumber: formData.contactNumber || undefined,
        householdType: formData.householdType,
        economicStatus: formData.economicStatus,
        totalMembers: formData.totalMembers,
        members: [{
          id: Date.now(),
          name: formData.headOfHouseholdName,
          relationship: formData.headOfHouseholdRelationship,
          age: 30 // Default age
        }],
        barangayId: 'BRGY-001',
        status: 'active' as const,
        createdAt: new Date().toISOString()
      };

      const response = await fetch('/api/households', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(householdData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create household');
      }

      const newHousehold = await response.json();
      onHouseholdAdded(newHousehold.data || newHousehold);
      onClose();
      setFormData({
        householdId: '',
        headOfHouseholdName: '',
        headOfHouseholdRelationship: 'head',
        address: '',
        contactNumber: '',
        householdType: 'nuclear',
        economicStatus: 'middle',
        totalMembers: 1
      });
    } catch (err: any) {
      console.error('Error creating household:', err);
      setError(err.message || 'Failed to create household. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      householdId: '',
      headOfHouseholdName: '',
      headOfHouseholdRelationship: 'head',
      address: '',
      contactNumber: '',
      householdType: 'nuclear',
      economicStatus: 'middle',
      totalMembers: 1
    });
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  try {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <FaHome className="text-white text-lg" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Add New Household</h2>
                      <p className="text-blue-100 text-sm">Create a new household record</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClose}
                    className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <FaTimes className="text-white text-sm" />
                  </motion.button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-xl"
                  >
                    <div className="flex items-start gap-3">
                      <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-red-800 mb-1">
                          Error Creating Household
                        </h4>
                        <p className="text-sm text-red-700">
                          {error}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FaHome className="text-blue-600" />
                    Basic Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Household ID *
                      </label>
                      <input
                        type="text"
                        value={formData.householdId}
                        onChange={(e) => setFormData(prev => ({ ...prev, householdId: e.target.value }))}
                        className="input-field w-full"
                        placeholder="e.g., HH-001"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Household Type
                      </label>
                      <select
                        value={formData.householdType}
                        onChange={(e) => setFormData(prev => ({ ...prev, householdType: e.target.value }))}
                        className="input-field w-full bg-gray-50 border-gray-200 cursor-pointer"
                      >
                        <option value="nuclear">Nuclear Family</option>
                        <option value="extended">Extended Family</option>
                        <option value="single_parent">Single Parent</option>
                        <option value="blended">Blended Family</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Head of Household */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FaUser className="text-green-600" />
                    Head of Household
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.headOfHouseholdName}
                        onChange={(e) => setFormData(prev => ({ ...prev, headOfHouseholdName: e.target.value }))}
                        className="input-field w-full"
                        placeholder="Enter full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relationship
                      </label>
                      <select
                        value={formData.headOfHouseholdRelationship}
                        onChange={(e) => setFormData(prev => ({ ...prev, headOfHouseholdRelationship: e.target.value }))}
                        className="input-field w-full bg-gray-50 border-gray-200 cursor-pointer"
                      >
                        <option value="head">Head</option>
                        <option value="spouse">Spouse</option>
                        <option value="parent">Parent</option>
                        <option value="guardian">Guardian</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contact & Address */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-red-600" />
                    Address & Contact
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        className="input-field w-full"
                        rows={3}
                        placeholder="Enter complete address"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <FaPhone className="text-green-600 text-xs" />
                          Contact Number
                        </label>
                        <input
                          type="tel"
                          value={formData.contactNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                          className="input-field w-full"
                          placeholder="+63 9XX XXX XXXX"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <FaDollarSign className="text-orange-600 text-xs" />
                          Economic Status
                        </label>
                        <select
                          value={formData.economicStatus}
                          onChange={(e) => setFormData(prev => ({ ...prev, economicStatus: e.target.value }))}
                          className="input-field w-full bg-gray-50 border-gray-200 cursor-pointer"
                        >
                          <option value="low">Low Income</option>
                          <option value="middle">Middle Income</option>
                          <option value="high">High Income</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Household Size */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FaCheckCircle className="text-purple-600" />
                    Household Details
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Members
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={formData.totalMembers}
                      onChange={(e) => setFormData(prev => ({ ...prev, totalMembers: parseInt(e.target.value) || 1 }))}
                      className="input-field w-full max-w-xs"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Number of people living in this household
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold"
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <FaHome className="text-sm" />
                        Create Household
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  } catch (renderError) {
    // Fallback UI in case of rendering errors
    console.warn('AddHouseholdModal render error:', renderError);
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-red-500 text-2xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 mb-4">
            Unable to display the add household form. Please try again.
          </p>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
};

export default AddHouseholdModal;