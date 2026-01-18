"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminAuthGuard from "../components/AdminAuthGuard";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaPlus,
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrash,
  FaEye,
  FaUserCheck,
  FaUserTimes,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaDownload,
  FaUpload,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSave,
  FaShieldAlt,
  FaUser,
  FaKey,
  FaTimes,
  FaIdBadge,
  FaCrown
} from "react-icons/fa";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'admin' | 'staff';
  status: 'active' | 'inactive';
  barangayId: string;
  createdAt: string;
}

const UsersContent: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: ""
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [formSuccess, setFormSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal states
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    status: ""
  });
  const [editErrors, setEditErrors] = useState<{[key: string]: string}>({});
  const [editSuccess, setEditSuccess] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterRole !== 'all') params.append('role', filterRole);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const response = await fetch(`/api/users?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch users');
      }

      setUsers(data.data || []);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Refetch when filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, filterRole, filterStatus]);

  // Form handling
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (formErrors[e.target.name]) {
      setFormErrors(prev => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          role: formData.role,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.fields) {
          const fieldErrors: {[key: string]: string} = {};
          data.fields.forEach((field: string) => {
            fieldErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
          });
          setFormErrors(fieldErrors);
        } else {
          setFormErrors({ general: data.error || 'Failed to create user' });
        }
        return;
      }

      // Success
      setFormSuccess(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        password: "",
        confirmPassword: ""
      });

      // Refresh users list
      fetchUsers();

      // Hide success message after 3 seconds
      setTimeout(() => {
        setFormSuccess(false);
        setShowAddForm(false);
      }, 3000);

    } catch (error: any) {
      console.error('Error creating user:', error);
      setFormErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Stats calculation
  const stats = [
    {
      title: "Total Users",
      value: users.length.toString(),
      icon: <FaUsers className="text-blue-500" />,
      bgColor: "bg-blue-100",
      change: "+2",
      changeType: "positive" as const
    },
    {
      title: "Active Users",
      value: users.filter(u => u.status === 'active').length.toString(),
      icon: <FaUserCheck className="text-green-500" />,
      bgColor: "bg-green-100",
      change: "+1",
      changeType: "positive" as const
    },
    {
      title: "Staff Users",
      value: users.filter(u => u.role === 'staff').length.toString(),
      icon: <FaShieldAlt className="text-purple-500" />,
      bgColor: "bg-purple-100",
      change: "+1",
      changeType: "positive" as const
    },
    {
      title: "Admin Users",
      value: users.filter(u => u.role === 'admin').length.toString(),
      icon: <FaShieldAlt className="text-orange-500" />,
      bgColor: "bg-orange-100",
      change: "+0",
      changeType: "neutral" as const
    }
  ];

  // Use API-filtered data directly
  const filteredUsers = users;

  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length
        ? []
        : filteredUsers.map(user => user.id)
    );
  };

  const handleStatusChange = async (userId: number, newStatus: 'active' | 'inactive') => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        throw new Error('Failed to update user status');
      }
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status.');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user.');
    }
  };

  // Modal handlers
  const handleViewUser = async (userId: number) => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to fetch user details');
        return;
      }

      setSelectedUser(data.data);
      setShowViewModal(true);
    } catch (err: any) {
      console.error('Error fetching user details:', err);
      setError('Failed to load user details');
    }
  };

  const handleEditUser = async (userId: number) => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to fetch user details');
        return;
      }

      const user = data.data;
      setSelectedUser(user);
      setEditFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status
      });
      setEditErrors({});
      setEditSuccess(false);
      setShowEditModal(true);
    } catch (err: any) {
      console.error('Error fetching user details:', err);
      setError('Failed to load user details');
    }
  };

  const handleManageRole = async (userId: number) => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to fetch user details');
        return;
      }

      setSelectedUser(data.data);
      setShowRoleModal(true);
    } catch (err: any) {
      console.error('Error fetching user details:', err);
      setError('Failed to load user details');
    }
  };

  // Form handlers
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (editErrors[e.target.name]) {
      setEditErrors(prev => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validateEditForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!editFormData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!editFormData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!editFormData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(editFormData.email)) newErrors.email = "Invalid email format";
    if (!editFormData.role) newErrors.role = "Role is required";
    if (!editFormData.status) newErrors.status = "Status is required";

    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEditForm() || !selectedUser) {
      return;
    }

    setIsUpdating(true);
    setEditErrors({});

    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.fields) {
          const fieldErrors: {[key: string]: string} = {};
          data.fields.forEach((field: string) => {
            fieldErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
          });
          setEditErrors(fieldErrors);
        } else {
          setEditErrors({ general: data.error || 'Failed to update user' });
        }
        return;
      }

      // Success
      setEditSuccess(true);

      // Refresh users list
      fetchUsers();

      // Hide modal after success
      setTimeout(() => {
        setShowEditModal(false);
        setEditSuccess(false);
      }, 2000);

    } catch (error: any) {
      console.error('Error updating user:', error);
      setEditErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateRole = async (newRole: string) => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update user role');
        return;
      }

      // Success
      fetchUsers();
      setShowRoleModal(false);
      setError(null); // Clear any previous errors

    } catch (error: any) {
      console.error('Error updating user role:', error);
      setError('Failed to update user role');
    }
  };

  const closeModals = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setShowRoleModal(false);
    setSelectedUser(null);
    setEditFormData({
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      status: ""
    });
    setEditErrors({});
    setEditSuccess(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'staff': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
        <div className="flex min-h-screen bg-white dark:bg-neutral-900">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 flex-1 p-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
            <p className="text-gray-600 mt-1">Manage barangay users and their accounts</p>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <FaDownload className="text-sm" />
              Export
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <FaUpload className="text-sm" />
              Import
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FaPlus className="text-sm" />
              {showAddForm ? 'Hide Form' : 'Add User'}
            </motion.button>
          </div>
        </motion.div>

        {/* Add User Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
              {/* Success Message */}
              {formSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3"
                >
                  <FaCheckCircle className="text-green-500 text-lg" />
                  <span className="text-green-800 dark:text-green-200 font-medium">User created successfully!</span>
                </motion.div>
              )}

              {/* Error Messages */}
              {formErrors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3"
                >
                  <FaExclamationTriangle className="text-red-500 text-lg" />
                  <span className="text-red-800 dark:text-red-200 font-medium">{formErrors.general}</span>
                </motion.div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                      disabled={isSubmitting}
                    />
                    {formErrors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                      disabled={isSubmitting}
                    />
                    {formErrors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                      disabled={isSubmitting}
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                    )}
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                      Role *
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.role ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                      disabled={isSubmitting}
                    >
                      <option value="">Select Role</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                    {formErrors.role && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.role}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                      disabled={isSubmitting}
                      minLength={6}
                    />
                    {formErrors.password && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                      disabled={isSubmitting}
                    />
                    {formErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-neutral-700">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setFormData({
                        firstName: "",
                        lastName: "",
                        email: "",
                        role: "",
                        password: "",
                        confirmPassword: ""
                      });
                      setFormErrors({});
                    }}
                    className="px-4 py-2 text-gray-600 dark:text-neutral-400 border border-gray-300 dark:border-neutral-600 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <FaSave className="text-sm" />
                        Create User
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              title: "Total Users",
              value: users.length.toString(),
              icon: <FaUsers className="text-blue-500" />,
              bgColor: "bg-blue-50"
            },
            {
              title: "Active Users",
              value: users.filter(u => u.status === 'active').length.toString(),
              icon: <FaUserCheck className="text-green-500" />,
              bgColor: "bg-green-50"
            },
            {
              title: "Staff Members",
              value: users.filter(u => u.role === 'staff').length.toString(),
              icon: <FaUserTimes className="text-purple-500" />,
              bgColor: "bg-purple-50"
            },
            {
              title: "Residents",
              value: users.filter(u => u.role === 'resident').length.toString(),
              icon: <FaMapMarkerAlt className="text-orange-500" />,
              bgColor: "bg-orange-50"
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              whileHover={{ y: -2 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.phone || 'N/A'}</div>
                      <div className="text-sm text-gray-500">Barangay ID: {user.barangayId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleViewUser(user.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <FaEye />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditUser(user.id)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Edit User"
                        >
                          <FaEdit />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleManageRole(user.id)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Manage Role"
                        >
                          <FaCrown />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete User"
                        >
                          <FaTrash />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <FaUsers className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterRole !== "all" || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by adding your first user."}
              </p>
            </div>
          )}
        </motion.div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 bg-white p-4 rounded-lg shadow-lg border border-gray-200"
          >
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  Activate
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Deactivate
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                >
                  Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

      </div>

      {/* Modals */}
      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">User Details</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-xl" />
                </motion.button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {selectedUser.firstName.charAt(0)}{selectedUser.lastName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h4>
                    <p className="text-gray-600">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Role</label>
                    <div className="flex items-center gap-2 mt-1">
                      {selectedUser.role === 'admin' ? (
                        <FaCrown className="text-yellow-500" />
                      ) : (
                        <FaShieldAlt className="text-purple-500" />
                      )}
                      <span className="text-gray-900 capitalize">{selectedUser.role}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full mt-1 inline-block ${
                      selectedUser.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedUser.status}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900 mt-1">{selectedUser.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Barangay ID</label>
                    <p className="text-gray-900 mt-1">{selectedUser.barangayId}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <p className="text-gray-900 mt-1">
                      {new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Edit User</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-xl" />
                </motion.button>
              </div>

              {editSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
                >
                  <FaCheckCircle className="text-green-500 text-lg" />
                  <span className="text-green-800 font-medium">User updated successfully!</span>
                </motion.div>
              )}

              {editErrors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
                >
                  <FaExclamationTriangle className="text-red-500 text-lg" />
                  <span className="text-red-800 font-medium">{editErrors.general}</span>
                </motion.div>
              )}

              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={editFormData.firstName}
                      onChange={handleEditFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        editErrors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                      disabled={isUpdating}
                    />
                    {editErrors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{editErrors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={editFormData.lastName}
                      onChange={handleEditFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        editErrors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                      disabled={isUpdating}
                    />
                    {editErrors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{editErrors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditFormChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      editErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                    disabled={isUpdating}
                  />
                  {editErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{editErrors.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role *
                    </label>
                    <select
                      name="role"
                      value={editFormData.role}
                      onChange={handleEditFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        editErrors.role ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                      disabled={isUpdating}
                    >
                      <option value="">Select Role</option>
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                    </select>
                    {editErrors.role && (
                      <p className="mt-1 text-sm text-red-600">{editErrors.role}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      name="status"
                      value={editFormData.status}
                      onChange={handleEditFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        editErrors.status ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                      disabled={isUpdating}
                    >
                      <option value="">Select Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    {editErrors.status && (
                      <p className="mt-1 text-sm text-red-600">{editErrors.status}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                  >
                    {isUpdating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <FaSave className="text-sm" />
                        Update User
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Manage Role Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Manage User Role</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-xl" />
                </motion.button>
              </div>

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {selectedUser.firstName.charAt(0)}{selectedUser.lastName.charAt(0)}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h4>
                <p className="text-gray-600 mb-4">Current role: <span className="font-medium capitalize">{selectedUser.role}</span></p>
                <p className="text-sm text-gray-500">Select new role for this user:</p>
              </div>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleUpdateRole('admin')}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    selectedUser.role === 'admin'
                      ? 'border-yellow-300 bg-yellow-50'
                      : 'border-gray-200 hover:border-yellow-300 hover:bg-yellow-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FaCrown className={`text-xl ${selectedUser.role === 'admin' ? 'text-yellow-600' : 'text-yellow-500'}`} />
                    <div>
                      <h5 className="font-medium text-gray-900">Administrator</h5>
                      <p className="text-sm text-gray-600">Full system access and user management</p>
                    </div>
                    {selectedUser.role === 'admin' && (
                      <div className="ml-auto">
                        <FaCheckCircle className="text-yellow-600 text-lg" />
                      </div>
                    )}
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleUpdateRole('staff')}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    selectedUser.role === 'staff'
                      ? 'border-purple-300 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FaShieldAlt className={`text-xl ${selectedUser.role === 'staff' ? 'text-purple-600' : 'text-purple-500'}`} />
                    <div>
                      <h5 className="font-medium text-gray-900">Staff</h5>
                      <p className="text-sm text-gray-600">Limited access for operational tasks</p>
                    </div>
                    {selectedUser.role === 'staff' && (
                      <div className="ml-auto">
                        <FaCheckCircle className="text-purple-600 text-lg" />
                      </div>
                    )}
                  </div>
                </motion.button>
              </div>

              <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const UsersPage: React.FC = () => {
  return (
    <AdminAuthGuard requireAdmin={true}>
      {(user) => <UsersContent />}
    </AdminAuthGuard>
  );
};

export default UsersPage;