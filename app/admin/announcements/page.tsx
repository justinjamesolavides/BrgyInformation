"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaBullhorn,
  FaPlus,
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrash,
  FaEye,
  FaCalendarAlt,
  FaUser,
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle,
  FaDownload
} from "react-icons/fa";

interface Announcement {
  id: number;
  title: string;
  content: string;
  announcementType: 'news' | 'event' | 'emergency' | 'general' | 'meeting';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetAudience: 'all' | 'residents' | 'staff' | 'officials';
  postedBy: {
    id: number;
    name: string;
  };
  isPublished: boolean;
  publishedAt: string | null;
  expiresAt: string | null;
  attachments: Array<{
    name: string;
    url: string;
  }>;
  createdAt: string;
}

const AdminAnnouncementsPage: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterAudience, setFilterAudience] = useState("all");
  const [filterPublished, setFilterPublished] = useState("all");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch announcements from API
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterType !== 'all') params.append('type', filterType);
      if (filterAudience !== 'all') params.append('audience', filterAudience);
      if (filterPublished !== 'all') params.append('published', filterPublished);

      const response = await fetch(`/api/announcements?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch announcements');
      }

      setAnnouncements(data.data || []);
    } catch (err: any) {
      console.error('Error fetching announcements:', err);
      setError(err.message || 'Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  // Refetch when filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchAnnouncements();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, filterType, filterAudience, filterPublished]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'emergency': return <FaExclamationTriangle className="text-red-500" />;
      case 'event': return <FaCalendarAlt className="text-blue-500" />;
      case 'meeting': return <FaUser className="text-purple-500" />;
      case 'news': return <FaInfoCircle className="text-green-500" />;
      default: return <FaBullhorn className="text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'event': return 'bg-blue-100 text-blue-800';
      case 'meeting': return 'bg-purple-100 text-purple-800';
      case 'news': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAudienceColor = (audience: string) => {
    switch (audience) {
      case 'all': return 'bg-blue-100 text-blue-800';
      case 'residents': return 'bg-green-100 text-green-800';
      case 'staff': return 'bg-purple-100 text-purple-800';
      case 'officials': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPublishedColor = (isPublished: boolean) => {
    return isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="p-6 md:p-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-6 mb-8"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaBullhorn className="text-orange-600 dark:text-orange-400 text-2xl" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-neutral-900 dark:text-white font-display">
                    Announcements Management
                  </h1>
                  <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-lg">
                    Create and manage barangay announcements and news
                  </p>
                </div>
              </div>

              <div className="ml-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/admin/announcements/add')}
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-medium"
                >
                  <FaPlus className="text-sm" />
                  New Announcement
                </motion.button>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              {[
                {
                  title: "Total Announcements",
                  value: announcements.length.toString(),
                  icon: <FaBullhorn className="text-orange-500" />,
                  bgColor: "bg-orange-50 dark:bg-orange-900/20",
                  iconBg: "bg-orange-100 dark:bg-orange-900/40",
                  change: "+3",
                  changeType: "positive" as const
                },
                {
                  title: "Published",
                  value: announcements.filter(a => a.isPublished).length.toString(),
                  icon: <FaCheckCircle className="text-green-500" />,
                  bgColor: "bg-green-50 dark:bg-green-900/20",
                  iconBg: "bg-green-100 dark:bg-green-900/40",
                  change: "+2",
                  changeType: "positive" as const
                },
                {
                  title: "Emergency Alerts",
                  value: announcements.filter(a => a.announcementType === 'emergency').length.toString(),
                  icon: <FaExclamationTriangle className="text-red-500" />,
                  bgColor: "bg-red-50 dark:bg-red-900/20",
                  iconBg: "bg-red-100 dark:bg-red-900/40",
                  change: "+1",
                  changeType: "positive" as const
                },
                {
                  title: "Events",
                  value: announcements.filter(a => a.announcementType === 'event').length.toString(),
                  icon: <FaCalendarAlt className="text-blue-500" />,
                  bgColor: "bg-blue-50 dark:bg-blue-900/20",
                  iconBg: "bg-blue-100 dark:bg-blue-900/40",
                  change: "+1",
                  changeType: "positive" as const
                }
              ].map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="card card-interactive"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                        {stat.title}
                      </p>
                      <div className="flex items-baseline gap-2 mb-2">
                        <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                          {stat.value}
                        </p>
                        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                          stat.changeType === 'positive'
                            ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                            : 'bg-neutral-100 dark:bg-neutral-900/30 text-neutral-700 dark:text-neutral-300'
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className={`p-4 rounded-xl ${stat.iconBg} group-hover:scale-110 transition-transform duration-200`}>
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
              className="card mb-6"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search Input */}
                  <div className="flex-1 relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400">
                      <FaSearch className="text-lg" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search announcements by title or content..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input-field pl-12 pr-4 py-4 text-base w-full"
                    />
                  </div>

                  {/* Filters */}
                  <div className="flex gap-3">
                    <div className="relative">
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="input-field px-4 py-4 pr-10 appearance-none cursor-pointer bg-neutral-50 dark:bg-neutral-800"
                      >
                        <option value="all">All Types</option>
                        <option value="news">News</option>
                        <option value="event">Events</option>
                        <option value="emergency">Emergency</option>
                        <option value="meeting">Meetings</option>
                        <option value="general">General</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none">
                        <FaFilter className="text-sm" />
                      </div>
                    </div>

                    <div className="relative">
                      <select
                        value={filterAudience}
                        onChange={(e) => setFilterAudience(e.target.value)}
                        className="input-field px-4 py-4 pr-10 appearance-none cursor-pointer bg-neutral-50 dark:bg-neutral-800"
                      >
                        <option value="all">All Audience</option>
                        <option value="all">Everyone</option>
                        <option value="residents">Residents</option>
                        <option value="staff">Staff</option>
                        <option value="officials">Officials</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none">
                        <FaFilter className="text-sm" />
                      </div>
                    </div>

                    <div className="relative">
                      <select
                        value={filterPublished}
                        onChange={(e) => setFilterPublished(e.target.value)}
                        className="input-field px-4 py-4 pr-10 appearance-none cursor-pointer bg-neutral-50 dark:bg-neutral-800"
                      >
                        <option value="all">All Status</option>
                        <option value="true">Published</option>
                        <option value="false">Draft</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none">
                        <FaFilter className="text-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Announcements List */}
            {!loading && !error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                {announcements.length > 0 ? (
                  announcements.map((announcement, index) => (
                    <motion.div
                      key={announcement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      whileHover={{ x: 4 }}
                      className="card card-interactive"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center">
                              {getTypeIcon(announcement.announcementType)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1 truncate">
                                {announcement.title}
                              </h3>
                              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                                By {announcement.postedBy.name} • {new Date(announcement.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                              title="View Details"
                            >
                              <FaEye className="text-neutral-600 dark:text-neutral-400" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                              title="Edit Announcement"
                            >
                              <FaEdit className="text-neutral-600 dark:text-neutral-400" />
                            </motion.button>
                          </div>
                        </div>

                        <p className="text-neutral-700 dark:text-neutral-300 mb-4 line-clamp-2">
                          {announcement.content}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(announcement.announcementType)}`}>
                            {announcement.announcementType}
                          </span>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(announcement.priority)}`}>
                            {announcement.priority} priority
                          </span>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getAudienceColor(announcement.targetAudience)}`}>
                            {announcement.targetAudience}
                          </span>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getPublishedColor(announcement.isPublished)}`}>
                            {announcement.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>

                        {announcement.attachments.length > 0 && (
                          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                            <FaDownload className="text-sm" />
                            <span>{announcement.attachments.length} attachment{announcement.attachments.length > 1 ? 's' : ''}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                  >
                    <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaBullhorn className="text-neutral-400 dark:text-neutral-500 text-3xl" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">No announcements found</h3>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
                      {searchTerm || filterType !== "all" || filterAudience !== "all" || filterPublished !== "all"
                        ? "Try adjusting your search or filter criteria to find what you're looking for."
                        : "Get started by creating your first announcement."}
                    </p>
                    <button
                      onClick={() => router.push('/admin/announcements/add')}
                      className="btn-primary"
                    >
                      Create First Announcement
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Loading State */}
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center py-16"
              >
                <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-neutral-600 dark:text-neutral-400">Loading announcements...</p>
              </motion.div>
            )}

            {/* Error State */}
            {error && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center py-16"
              >
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaExclamationTriangle className="text-red-500 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Error Loading Announcements</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">{error}</p>
                <button
                  onClick={fetchAnnouncements}
                  className="btn-primary"
                >
                  Try Again
                </button>
              </motion.div>
            )}
          </div>
    
  );
};

export default AdminAnnouncementsPage;