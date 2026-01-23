"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaBullhorn,
  FaSearch,
  FaFilter,
  FaEye,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaDownload,
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle
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

const StaffAnnouncementsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
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
      // Staff can see all published announcements
      params.append('published', 'true');

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
  }, [searchTerm, filterType]);

  const getAnnouncementTypeIcon = (type: string) => {
    switch (type) {
      case 'news': return <FaBullhorn className="text-blue-500" />;
      case 'event': return <FaCalendarAlt className="text-green-500" />;
      case 'emergency': return <FaExclamationTriangle className="text-red-500" />;
      case 'meeting': return <FaUser className="text-purple-500" />;
      default: return <FaBullhorn className="text-gray-500" />;
    }
  };

  const getAnnouncementTypeColor = (type: string) => {
    switch (type) {
      case 'news': return 'bg-blue-100 text-blue-800';
      case 'event': return 'bg-green-100 text-green-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'meeting': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center shadow-sm">
            <FaBullhorn className="text-rose-600 text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Announcements
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Stay updated with barangay news and announcements
            </p>
          </div>
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
            icon: <FaBullhorn className="text-rose-500" />,
            bgColor: "bg-rose-50",
            iconBg: "bg-rose-100"
          },
          {
            title: "This Week",
            value: announcements.filter(a => {
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return new Date(a.publishedAt || a.createdAt) > weekAgo;
            }).length.toString(),
            icon: <FaCalendarAlt className="text-blue-500" />,
            bgColor: "bg-blue-50",
            iconBg: "bg-blue-100"
          },
          {
            title: "Urgent",
            value: announcements.filter(a => a.priority === 'urgent').length.toString(),
            icon: <FaExclamationTriangle className="text-red-500" />,
            bgColor: "bg-red-50",
            iconBg: "bg-red-100"
          },
          {
            title: "Events",
            value: announcements.filter(a => a.announcementType === 'event').length.toString(),
            icon: <FaCalendarAlt className="text-green-500" />,
            bgColor: "bg-green-50",
            iconBg: "bg-green-100"
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
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${stat.iconBg}`}>
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
        <div>
          <div className="flex flex-col md:flex-row gap-3">
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
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 pr-8 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="all">All Types</option>
                  <option value="news">News</option>
                  <option value="event">Event</option>
                  <option value="emergency">Emergency</option>
                  <option value="meeting">Meeting</option>
                  <option value="general">General</option>
                </select>
                <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  <FaFilter className="text-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Loading announcements...</p>
        </motion.div>
      )}

      {/* Error State */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FaExclamationTriangle className="text-red-500 text-lg" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Error Loading Announcements</h3>
          <p className="text-gray-600 mb-4 max-w-md mx-auto text-sm">{error}</p>
          <button
            onClick={fetchAnnouncements}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Try Again
          </button>
        </motion.div>
      )}

      {/* Announcements List */}
      {!loading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          {announcements.length > 0 ? (
            announcements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
              >
                <div>
                  <div className="flex items-start gap-3">
                    {/* Announcement Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getAnnouncementTypeIcon(announcement.announcementType)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-gray-900 mb-1">
                            {announcement.title}
                          </h3>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            <span className={`px-2 py-0.5 text-[0.6rem] font-medium rounded ${getAnnouncementTypeColor(announcement.announcementType)}`}>
                              {announcement.announcementType}
                            </span>
                            <span className={`px-2 py-0.5 text-[0.6rem] font-medium rounded border ${getPriorityColor(announcement.priority)}`}>
                              {announcement.priority}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-1 ml-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            title="View Details"
                          >
                            <FaEye className="text-gray-600 text-xs" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Announcement Content Preview */}
                      <p className="text-gray-600 mb-3 text-sm line-clamp-2">
                        {announcement.content}
                      </p>

                      {/* Metadata */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <FaUser className="text-xs" />
                          <span>Posted by {announcement.postedBy.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FaClock className="text-xs" />
                          <span>
                            {announcement.publishedAt
                              ? `Published ${formatDate(announcement.publishedAt)}`
                              : `Created ${formatDate(announcement.createdAt)}`
                            }
                          </span>
                        </div>
                        {announcement.expiresAt && (
                          <div className="flex items-center gap-1.5">
                            <FaCalendarAlt className="text-xs" />
                            <span>Expires {formatDate(announcement.expiresAt)}</span>
                          </div>
                        )}
                        {announcement.attachments.length > 0 && (
                          <div className="flex items-center gap-1.5">
                            <FaDownload className="text-xs" />
                            <span>{announcement.attachments.length} attachment{announcement.attachments.length > 1 ? 's' : ''}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
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
                <FaBullhorn className="text-gray-400 text-lg" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No announcements found</h3>
              <p className="text-gray-600 mb-3 max-w-md mx-auto text-sm">
                {searchTerm || filterType !== "all"
                  ? "Try adjusting your search or filter criteria to find what you're looking for."
                  : "No announcements available at this time."}
              </p>
              {(searchTerm || filterType !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterType('all');
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg text-xs font-medium"
                >
                  Clear all filters
                </button>
              )}
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default StaffAnnouncementsPage;