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
    <div className="p-4 md:p-6 bg-white">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shadow-sm">
                  <FaBullhorn className="text-orange-600 text-xl" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Announcements Management
                  </h1>
                  <p className="text-gray-600 text-sm mt-1">
                    Create and manage barangay announcements and news
                  </p>
                </div>
              </div>

              <div className="ml-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/admin/announcements/add')}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-sm font-medium"
                >
                  <FaPlus className="text-xs" />
                  New
                </motion.button>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
            >
              {[
                {
                  title: "Total Announcements",
                  value: announcements.length.toString(),
                  icon: <FaBullhorn className="text-orange-500" />,
                  color: "orange"
                },
                {
                  title: "Published",
                  value: announcements.filter(a => a.isPublished).length.toString(),
                  icon: <FaCheckCircle className="text-green-500" />,
                  color: "green"
                },
                {
                  title: "Emergency Alerts",
                  value: announcements.filter(a => a.announcementType === 'emergency').length.toString(),
                  icon: <FaExclamationTriangle className="text-red-500" />,
                  color: "red"
                },
                {
                  title: "Events",
                  value: announcements.filter(a => a.announcementType === 'event').length.toString(),
                  icon: <FaCalendarAlt className="text-blue-500" />,
                  color: "blue"
                }
              ].map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                        {stat.title}
                      </p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {stat.value}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
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
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaSearch className="text-sm" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search announcements by title or content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                  <div className="relative">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition w-full md:w-32"
                    >
                      <option value="all">All Types</option>
                      <option value="news">News</option>
                      <option value="event">Events</option>
                      <option value="emergency">Emergency</option>
                      <option value="meeting">Meetings</option>
                      <option value="general">General</option>
                    </select>
                    <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                      <FaFilter className="text-xs" />
                    </div>
                  </div>

                  <div className="relative">
                    <select
                      value={filterAudience}
                      onChange={(e) => setFilterAudience(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition w-full md:w-36"
                    >
                      <option value="all">All Audience</option>
                      <option value="all">Everyone</option>
                      <option value="residents">Residents</option>
                      <option value="staff">Staff</option>
                      <option value="officials">Officials</option>
                    </select>
                    <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                      <FaFilter className="text-xs" />
                    </div>
                  </div>

                  <div className="relative">
                    <select
                      value={filterPublished}
                      onChange={(e) => setFilterPublished(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition w-full md:w-32"
                    >
                      <option value="all">All Status</option>
                      <option value="true">Published</option>
                      <option value="false">Draft</option>
                    </select>
                    <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                      <FaFilter className="text-xs" />
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
                      whileHover={{ y: -2 }}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
                    >
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                              {getTypeIcon(announcement.announcementType)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                                {announcement.title}
                              </h3>
                              <p className="text-gray-600 text-xs">
                                By {announcement.postedBy.name} • {new Date(announcement.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-1">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                              title="View Details"
                            >
                              <FaEye className="text-gray-600 text-xs" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                              title="Edit Announcement"
                            >
                              <FaEdit className="text-gray-600 text-xs" />
                            </motion.button>
                          </div>
                        </div>

                        <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                          {announcement.content}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-3">
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getTypeColor(announcement.announcementType)}`}>
                            {announcement.announcementType}
                          </span>
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getPriorityColor(announcement.priority)}`}>
                            {announcement.priority}
                          </span>
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getAudienceColor(announcement.targetAudience)}`}>
                            {announcement.targetAudience}
                          </span>
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getPublishedColor(announcement.isPublished)}`}>
                            {announcement.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>

                        {announcement.attachments.length > 0 && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <FaDownload className="text-xs" />
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
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaBullhorn className="text-gray-400 text-xl" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">No announcements found</h3>
                    <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto">
                      {searchTerm || filterType !== "all" || filterAudience !== "all" || filterPublished !== "all"
                        ? "Try adjusting your search or filter criteria to find what you're looking for."
                        : "Get started by creating your first announcement."}
                    </p>
                    <button
                      onClick={() => router.push('/admin/announcements/add')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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
                className="text-center py-12"
              >
                <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-600 text-sm">Loading announcements...</p>
              </motion.div>
            )}

            {/* Error State */}
            {error && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center py-12"
              >
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaExclamationTriangle className="text-red-500 text-lg" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Error Loading Announcements</h3>
                <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto">{error}</p>
                <button
                  onClick={fetchAnnouncements}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Try Again
                </button>
              </motion.div>
            )}
          </div>
    
  );
};

export default AdminAnnouncementsPage;