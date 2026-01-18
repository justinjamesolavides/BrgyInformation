"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUserCog, FaPlus, FaSearch, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import Link from "next/link";
import ViewUserModal from "./components/ViewUserModal";
import EditUserModal from "./components/EditUserModal";
import DeleteUserModal from "./components/DeleteUserModal";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'staff';
  status: 'active' | 'inactive';
  createdAt: string;
}

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // Modal states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, filterRole]);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterRole !== 'all') params.append('role', filterRole);

      const response = await fetch(`/api/users?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setUsers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  // Modal handlers
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleUserUpdated = (updatedUser: User) => {
    setUsers(prev => prev.map(user =>
      user.id === updatedUser.id ? updatedUser : user
    ));
  };

  const handleUserDeleted = (userId: number) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const closeAllModals = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-2xl flex items-center justify-center shadow-lg">
            <FaUserCog className="text-purple-600 dark:text-purple-400 text-2xl" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-white font-display">
              User Management
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-lg">
              Manage admin and staff accounts
            </p>
          </div>
        </div>

        <Link href="/admin/users/add">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-medium"
          >
            <FaPlus className="text-sm" />
            Add User
          </motion.button>
        </Link>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card mb-6"
      >
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400">
                <FaSearch className="text-lg" />
              </div>
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-12 pr-4 py-4 text-base w-full"
              />
            </div>

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="input-field px-4 py-4 pr-10 appearance-none cursor-pointer bg-neutral-50 dark:bg-neutral-800"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Users List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600 dark:text-neutral-400">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 dark:text-white">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 dark:text-white">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 dark:text-white">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 dark:text-white">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 dark:text-white">Created</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-neutral-900 dark:text-white">
                        {user.firstName} {user.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleViewUser(user)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="View User Details"
                        >
                          <FaEye className="text-sm" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <FaEdit className="text-sm" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteUser(user)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <FaTrash className="text-sm" />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <div className="p-8 text-center">
                <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaUserCog className="text-neutral-400 dark:text-neutral-500 text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">No users found</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                  {searchTerm || filterRole !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Get started by adding your first user."}
                </p>
                <Link href="/admin/users/add">
                  <button className="btn-primary">
                    <FaPlus className="text-sm mr-2" />
                    Add First User
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Modals */}
        <ViewUserModal
          isOpen={isViewModalOpen}
          onClose={closeAllModals}
          user={selectedUser}
        />

        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={closeAllModals}
          user={selectedUser}
          onUserUpdated={handleUserUpdated}
        />

        <DeleteUserModal
          isOpen={isDeleteModalOpen}
          onClose={closeAllModals}
          user={selectedUser}
          onUserDeleted={handleUserDeleted}
        />
      </motion.div>
    </div>
  );
};

export default AdminUsersPage;