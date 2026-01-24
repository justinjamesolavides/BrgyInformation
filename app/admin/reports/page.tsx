"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaFileAlt, 
  FaDownload, 
  FaChartBar, 
  FaCalendarAlt, 
  FaFilter, 
  FaSearch, 
  FaUsers, 
  FaHome, 
  FaBell, 
  FaClipboardList,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaCheckCircle,
  FaDatabase,
  FaTimes,
  FaInfoCircle,
  FaTable
} from "react-icons/fa";

const AdminReportsPage: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Mock data for reports
  const [reports] = useState([
    {
      id: 1,
      title: "Monthly Resident Report",
      description: "Comprehensive resident statistics and demographics for January 2024",
      type: "residents",
      date: "2024-01-25",
      status: "completed",
      downloads: 24,
      size: "2.4 MB",
      data: {
        summary: "Comprehensive resident statistics and demographics for January 2024.",
        statistics: {
          totalResidents: 1247,
          genderDistribution: {
            male: 612,
            female: 635
          },
          civilStatus: {
            single: 523,
            married: 489,
            widowed: 156,
            separated: 79
          }
        },
        ageGroups: [
          { range: "0-17 years", male: 124, female: 110, total: 234 },
          { range: "18-35 years", male: 228, female: 228, total: 456 },
          { range: "36-60 years", male: 192, female: 197, total: 389 },
          { range: "60+ years", male: 68, female: 100, total: 168 }
        ],
        householdData: {
          averageHouseholdSize: 4.2,
          totalHouseholds: 297,
          housingTypes: {
            owned: 189,
            rented: 78,
            informal: 30
          }
        }
      }
    },
    {
      id: 2,
      title: "Household Composition Analysis",
      description: "Detailed breakdown of household structures and living arrangements",
      type: "households",
      date: "2024-01-24",
      status: "completed",
      downloads: 18,
      size: "1.8 MB",
      data: {
        summary: "Detailed breakdown of household structures and living arrangements.",
        statistics: {
          totalHouseholds: 297,
          averageSize: 4.2,
          ownerOccupied: 189,
          renterOccupied: 78,
          informalSettlers: 30
        },
        housingTypes: [
          { type: "Owned", count: 189, percentage: 63.6 },
          { type: "Rented", count: 78, percentage: 26.3 },
          { type: "Informal Settler", count: 30, percentage: 10.1 }
        ],
        householdSizes: [
          { size: "1-2 members", count: 45, percentage: 15.2 },
          { size: "3-4 members", count: 156, percentage: 52.5 },
          { size: "5-6 members", count: 72, percentage: 24.2 },
          { size: "7+ members", count: 24, percentage: 8.1 }
        ]
      }
    },
    {
      id: 3,
      title: "Community Announcement Metrics",
      description: "Reach and engagement analysis for recent barangay announcements",
      type: "announcements",
      date: "2024-01-23",
      status: "completed",
      downloads: 32,
      size: "3.1 MB",
      data: {
        summary: "Reach and engagement analysis for recent barangay announcements.",
        statistics: {
          totalAnnouncements: 24,
          reachRate: 78,
          engagementRate: 42,
          averageViews: 342
        },
        engagementMetrics: [
          { platform: "SMS", reach: 1247, engagement: 320 },
          { platform: "Bulletin Board", reach: 892, engagement: 156 },
          { platform: "Social Media", reach: 634, engagement: 267 }
        ],
        topAnnouncements: [
          { title: "Barangay Cleanup Drive", views: 420, engagement: 89 },
          { title: "Health Seminar", views: 386, engagement: 74 },
          { title: "Vaccination Schedule", views: 354, engagement: 62 }
        ]
      }
    },
    {
      id: 4,
      title: "Service Request Trends",
      description: "Analysis of request patterns, processing times, and resolution rates",
      type: "requests",
      date: "2024-01-22",
      status: "completed",
      downloads: 15,
      size: "2.7 MB",
      data: {
        summary: "Analysis of request patterns, processing times, and resolution rates.",
        statistics: {
          totalRequests: 342,
          approved: 289,
          rejected: 23,
          pending: 30,
          avgProcessingTime: 2.5
        },
        requestTypes: [
          { type: "Barangay Clearance", count: 142, approved: 130, rejected: 8, pending: 4 },
          { type: "Indigency Certificate", count: 87, approved: 78, rejected: 5, pending: 4 },
          { type: "Business Permit", count: 65, approved: 54, rejected: 8, pending: 3 },
          { type: "Others", count: 48, approved: 27, rejected: 2, pending: 19 }
        ],
        resolutionRates: [
          { timeframe: "Same Day", rate: 32 },
          { timeframe: "1-2 Days", rate: 45 },
          { timeframe: "3-5 Days", rate: 18 },
          { timeframe: "Over 5 Days", rate: 5 }
        ]
      }
    },
    {
      id: 5,
      title: "Barangay Clearance Statistics",
      description: "Monthly summary of issued clearances and processing efficiency",
      type: "clearances",
      date: "2024-01-21",
      status: "completed",
      downloads: 42,
      size: "1.9 MB",
      data: {
        summary: "Monthly summary of issued clearances and processing efficiency.",
        statistics: {
          totalClearances: 142,
          issued: 130,
          pending: 8,
          rejected: 4,
          avgProcessingDays: 1.8
        },
        clearanceTypes: [
          { type: "Barangay Clearance", count: 87, issued: 82, pending: 3, rejected: 2 },
          { type: "Indigency Certificate", count: 34, issued: 31, pending: 2, rejected: 1 },
          { type: "Good Moral", count: 21, issued: 17, pending: 3, rejected: 1 }
        ],
        processingEfficiency: [
          { metric: "On Time", rate: 89 },
          { metric: "Delayed", rate: 8 },
          { metric: "Urgent", rate: 3 }
        ]
      }
    },
    {
      id: 6,
      title: "Population Demographics Report",
      description: "Quarterly demographic analysis including age, gender, and civil status",
      type: "demographics",
      date: "2024-01-20",
      status: "completed",
      downloads: 28,
      size: "3.5 MB",
      data: {
        summary: "Quarterly demographic analysis including age, gender, and civil status.",
        statistics: {
          totalPopulation: 1247,
          growthRate: 2.3,
          density: 842,
          dependencyRatio: 42
        },
        ageGroups: [
          { range: "0-14 years", count: 312, percentage: 25.0 },
          { range: "15-64 years", count: 789, percentage: 63.3 },
          { range: "65+ years", count: 146, percentage: 11.7 }
        ],
        genderDistribution: [
          { gender: "Male", count: 612, percentage: 49.1 },
          { gender: "Female", count: 635, percentage: 50.9 }
        ],
        employment: {
          employed: 564,
          unemployed: 89,
          students: 321,
          retired: 156
        }
      }
    },
    {
      id: 7,
      title: "Emergency Contact Directory",
      description: "Updated emergency contact information for all registered residents",
      type: "emergency",
      date: "2024-01-19",
      status: "processing",
      downloads: 0,
      size: "0 KB",
      data: {
        summary: "Updated emergency contact information for all registered residents."
      }
    },
    {
      id: 8,
      title: "Annual Financial Summary",
      description: "Comprehensive financial report covering barangay expenditures and revenues",
      type: "financial",
      date: "2024-01-18",
      status: "scheduled",
      downloads: 0,
      size: "0 KB",
      data: {
        summary: "Comprehensive financial report covering barangay expenditures and revenues."
      }
    }
  ]);

  // Filter and sort reports
  const filteredReports = reports
    .filter(report => {
      const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           report.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || report.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === 'downloads') {
        comparison = a.downloads - b.downloads;
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReports = filteredReports.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'residents': return <FaUsers className="text-blue-500" />;
      case 'households': return <FaHome className="text-green-500" />;
      case 'announcements': return <FaBell className="text-purple-500" />;
      case 'requests': return <FaClipboardList className="text-orange-500" />;
      case 'clearances': return <FaFileAlt className="text-indigo-500" />;
      case 'demographics': return <FaChartBar className="text-pink-500" />;
      case 'emergency': return <FaBell className="text-red-500" />;
      case 'financial': return <FaChartBar className="text-yellow-500" />;
      default: return <FaFileAlt className="text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'residents': return 'bg-blue-100 text-blue-800';
      case 'households': return 'bg-green-100 text-green-800';
      case 'announcements': return 'bg-purple-100 text-purple-800';
      case 'requests': return 'bg-orange-100 text-orange-800';
      case 'clearances': return 'bg-indigo-100 text-indigo-800';
      case 'demographics': return 'bg-pink-100 text-pink-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'financial': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewReport = (report: any) => {
    setSelectedReport(report);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedReport(null);
  };

  const downloadReportCSV = (report: any) => {
    // Create CSV content
    let csvContent = '';
    
    // Report metadata
    csvContent += `Report Title,${report.title}\n`;
    csvContent += `Report Type,${report.type}\n`;
    csvContent += `Date,${report.date}\n`;
    csvContent += `Status,${report.status}\n`;
    csvContent += `Downloads,${report.downloads}\n`;
    csvContent += `Size,${report.size}\n\n`;
    
    // Summary
    if (report.data?.summary) {
      csvContent += `Summary,${report.data.summary.replace(/,/g, ';')}\n\n`;
    }
    
    // Statistics
    if (report.data?.statistics) {
      csvContent += 'Statistics,Value\n';
      Object.entries(report.data.statistics).forEach(([key, value]) => {
        if (typeof value !== 'object') {
          csvContent += `${key.replace(/([A-Z])/g, ' $1').trim()},${value}\n`;
        }
      });
      csvContent += '\n';
    }
    
    // Additional data based on report type
    if (report.data?.ageGroups) {
      csvContent += 'Age Range,Male,Female,Total\n';
      report.data.ageGroups.forEach((item: any) => {
        csvContent += `${item.range},${item.male},${item.female},${item.total}\n`;
      });
      csvContent += '\n';
    }
    
    if (report.data?.housingTypes) {
      csvContent += 'Housing Type,Count,Percentage\n';
      report.data.housingTypes.forEach((item: any) => {
        csvContent += `${item.type},${item.count},${item.percentage}%\n`;
      });
      csvContent += '\n';
    }
    
    if (report.data?.requestTypes) {
      csvContent += 'Request Type,Total,Approved,Rejected,Pending\n';
      report.data.requestTypes.forEach((item: any) => {
        csvContent += `${item.type},${item.count},${item.approved},${item.rejected},${item.pending}\n`;
      });
      csvContent += '\n';
    }
    
    // Convert to Blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${report.title.replace(/[^a-zA-Z0-9]/g, '_')}_${report.date.replace(/-/g, '')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateSampleReport = () => {
    setIsGenerating(true);
    
    // Simulate report generation delay
    setTimeout(() => {
      // Create enhanced sample CSV data
      const csvContent = `Name,Age,Gender,Civil Status,Address,Contact Number,Occupation,Date Registered,Barangay Zone
John Doe,35,Male,Married,123 Main St,+63 917 123 4567,Teacher,2024-01-15,Zone 1
Jane Smith,28,Female,Single,456 Oak Ave,+63 918 234 5678,Nurse,2024-01-16,Zone 2
Robert Johnson,42,Male,Married,789 Pine Rd,+63 919 345 6789,Engineer,2024-01-17,Zone 1
Maria Garcia,31,Female,Single,321 Elm St,+63 920 456 7890,Doctor,2024-01-18,Zone 3
Carlos Santos,38,Male,Married,654 Maple Dr,+63 921 567 8901,Business Owner,2024-01-19,Zone 2
Ana Reyes,26,Female,Single,987 Cedar Ln,+63 922 678 9012,Software Developer,2024-01-20,Zone 1
Michael Brown,45,Male,Married,147 Birch Blvd,+63 923 789 0123,Accountant,2024-01-21,Zone 3
Lisa Wilson,33,Female,Divorced,258 Spruce Way,+63 924 890 1234,Lawyer,2024-01-22,Zone 2`;

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `barangay_enhanced_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <FaChartBar className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Reports & Analytics
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Comprehensive barangay reporting and data insights
            </p>
          </div>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64 transition-colors"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-colors"
          >
            <option value="all">All Types</option>
            <option value="residents">Residents</option>
            <option value="households">Households</option>
            <option value="announcements">Announcements</option>
            <option value="requests">Requests</option>
            <option value="clearances">Clearances</option>
            <option value="demographics">Demographics</option>
            <option value="emergency">Emergency</option>
            <option value="financial">Financial</option>
          </select>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {[
          {
            title: "Total Reports",
            value: reports.length.toString(),
            change: "+12%",
            icon: <FaFileAlt className="text-blue-500" />,
            color: "from-blue-500 to-blue-600"
          },
          {
            title: "Completed",
            value: reports.filter(r => r.status === 'completed').length.toString(),
            change: "+8%",
            icon: <FaFileAlt className="text-green-500" />,
            color: "from-green-500 to-green-600"
          },
          {
            title: "Total Downloads",
            value: reports.reduce((sum, r) => sum + r.downloads, 0).toString(),
            change: "+24%",
            icon: <FaDownload className="text-purple-500" />,
            color: "from-purple-500 to-purple-600"
          },
          {
            title: "Avg. Size",
            value: "2.4 MB",
            change: "-5%",
            icon: <FaChartBar className="text-orange-500" />,
            color: "from-orange-500 to-orange-600"
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            whileHover={{ y: -3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100">
                {stat.icon}
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Enhanced Reports Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6"
      >
        {/* Table Header */}
        <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Showing {paginatedReports.length} of {filteredReports.length} reports</span>
            </div>
          </div>
        </div>
        
        {/* Sortable Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center gap-2">
                    Report Title
                    {sortBy === 'title' && (
                      sortOrder === 'asc' ? <FaSortUp className="text-blue-500" /> : <FaSortDown className="text-blue-500" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-2">
                    Date
                    {sortBy === 'date' && (
                      sortOrder === 'asc' ? <FaSortUp className="text-blue-500" /> : <FaSortDown className="text-blue-500" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('downloads')}
                >
                  <div className="flex items-center gap-2">
                    Downloads
                    {sortBy === 'downloads' && (
                      sortOrder === 'asc' ? <FaSortUp className="text-blue-500" /> : <FaSortDown className="text-blue-500" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedReports.map((report, index) => (
                <motion.tr 
                  key={report.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gray-100">
                        {getTypeIcon(report.type)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{report.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{report.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(report.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.downloads}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleViewReport(report)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                        disabled={report.status !== 'completed'}
                      >
                        <FaEye className="text-sm" />
                      </button>
                      <button 
                        onClick={() => downloadReportCSV(report)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={report.status !== 'completed'}
                      >
                        <FaDownload className="text-sm" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredReports.length)} of {filteredReports.length} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaChevronLeft className="text-sm" />
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === i + 1 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaChevronRight className="text-sm" />
              </button>
            </div>
          </div>
        )}
      </motion.div>


      {/* Enhanced Empty State / Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm p-8 text-center"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <FaChartBar className="text-white text-xl" />
        </div>
        <h3 className="font-bold text-gray-900 text-lg mb-2">
          Generate Your First Report
        </h3>
        <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
          Start exploring barangay data with our comprehensive reporting tools. Download a sample report to see the data format and structure.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            onClick={generateSampleReport}
            disabled={isGenerating}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-400 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating Sample...
              </>
            ) : (
              <>
                <FaDownload className="text-sm" />
                Generate Sample Report
              </>
            )}
          </button>
          
          <button className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg text-sm font-medium transition-colors border border-gray-300 flex items-center gap-2 shadow-sm hover:shadow-md">
            <FaFileAlt className="text-sm" />
            View Report Templates
          </button>
        </div>
        
        {/* Quick Tips */}
        <div className="mt-6 pt-6 border-t border-blue-200">
          <h4 className="font-semibold text-gray-800 text-sm mb-3">Quick Tips</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Use filters to narrow down reports</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Click column headers to sort data</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Download completed reports instantly</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Report View Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeViewModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-lg">
                      {getTypeIcon(selectedReport.type)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{selectedReport.title}</h2>
                      <p className="text-blue-100 text-sm">
                        {new Date(selectedReport.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeViewModal}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                {/* Report Summary */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <FaInfoCircle className="text-blue-500" />
                    <h3 className="font-semibold text-gray-900">Report Summary</h3>
                  </div>
                  <p className="text-gray-700 text-sm bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {selectedReport.data?.summary || selectedReport.description}
                  </p>
                </div>

                {/* Key Statistics */}
                {selectedReport.data?.statistics && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <FaChartBar className="text-green-500" />
                      <h3 className="font-semibold text-gray-900">Key Statistics</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Object.entries(selectedReport.data.statistics)
                        .filter(([key, value]) => typeof value !== 'object')
                        .map(([key, value]) => (
                          <div key={key} className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {typeof value === 'number' ? value.toLocaleString() : String(value)}
                            </div>
                            <div className="text-xs text-gray-600 mt-1 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )}

                {/* Data Tables */}
                {selectedReport.data && (
                  <div className="space-y-6">
                    {selectedReport.data.ageGroups && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FaTable className="text-purple-500" />
                          <h3 className="font-semibold text-gray-900">Age Group Distribution</h3>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="text-left p-3 font-medium text-gray-700">Age Range</th>
                                <th className="text-right p-3 font-medium text-gray-700">Male</th>
                                <th className="text-right p-3 font-medium text-gray-700">Female</th>
                                <th className="text-right p-3 font-medium text-gray-700">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedReport.data.ageGroups.map((item: any, index: number) => (
                                <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                                  <td className="p-3 text-gray-700">{item.range}</td>
                                  <td className="p-3 text-right text-blue-600">{item.male.toLocaleString()}</td>
                                  <td className="p-3 text-right text-pink-600">{item.female.toLocaleString()}</td>
                                  <td className="p-3 text-right text-gray-900 font-medium">{item.total.toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {selectedReport.data.housingTypes && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FaTable className="text-orange-500" />
                          <h3 className="font-semibold text-gray-900">Housing Types</h3>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="text-left p-3 font-medium text-gray-700">Type</th>
                                <th className="text-right p-3 font-medium text-gray-700">Count</th>
                                <th className="text-right p-3 font-medium text-gray-700">Percentage</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedReport.data.housingTypes.map((item: any, index: number) => (
                                <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                                  <td className="p-3 text-gray-700">{item.type}</td>
                                  <td className="p-3 text-right text-gray-900 font-medium">{item.count}</td>
                                  <td className="p-3 text-right text-gray-600">{item.percentage}%</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {selectedReport.data.requestTypes && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FaTable className="text-indigo-500" />
                          <h3 className="font-semibold text-gray-900">Request Types Breakdown</h3>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="text-left p-3 font-medium text-gray-700">Request Type</th>
                                <th className="text-right p-3 font-medium text-gray-700">Total</th>
                                <th className="text-right p-3 font-medium text-gray-700">Approved</th>
                                <th className="text-right p-3 font-medium text-gray-700">Rejected</th>
                                <th className="text-right p-3 font-medium text-gray-700">Pending</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedReport.data.requestTypes.map((item: any, index: number) => (
                                <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                                  <td className="p-3 text-gray-700">{item.type}</td>
                                  <td className="p-3 text-right text-gray-900 font-medium">{item.count}</td>
                                  <td className="p-3 text-right text-green-600">{item.approved}</td>
                                  <td className="p-3 text-right text-red-600">{item.rejected}</td>
                                  <td className="p-3 text-right text-yellow-600">{item.pending}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Report Metadata */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedReport.status)}`}>
                        {selectedReport.status}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Report Type:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedReport.type)}`}>
                        {selectedReport.type}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Date:</span>
                      <span className="ml-2">
                        {new Date(selectedReport.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Downloads:</span>
                      <span className="ml-2">{selectedReport.downloads}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={closeViewModal}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                {selectedReport.status === 'completed' && (
                  <button
                    onClick={() => downloadReportCSV(selectedReport)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <FaDownload className="text-sm" />
                    Download Report
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminReportsPage;