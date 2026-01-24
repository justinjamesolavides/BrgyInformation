"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../../contexts/LanguageContext";
import {
  FaFileAlt,
  FaChartLine,
  FaDownload,
  FaCalendarAlt,
  FaEye,
  FaUsers,
  FaClipboardList,
  FaCheckCircle,
  FaTimes,
  FaInfoCircle,
  FaChartBar,
  FaTable
} from "react-icons/fa";

interface Report {
  id: number;
  title: string;
  description: string;
  type: string;
  generatedDate: string;
  period: string;
  status: 'available' | 'generating' | 'error';
  downloadUrl?: string;
  data?: any; // Report data for viewing
}

const StaffReportsContent: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { t } = useLanguage();

  // Mock data with detailed report information
  const [reports] = useState<Report[]>([
    {
      id: 1,
      title: "Monthly Resident Report",
      description: "Comprehensive overview of resident registrations and activities",
      type: "residents",
      generatedDate: "2024-01-15",
      period: "January 2024",
      status: "available",
      downloadUrl: "#"
    },
    {
      id: 2,
      title: "Request Processing Summary",
      description: "Analysis of request approvals, rejections, and processing times",
      type: "requests",
      generatedDate: "2024-01-15",
      period: "January 2024",
      status: "available",
      downloadUrl: "#"
    },
    {
      id: 3,
      title: "Barangay Clearance Statistics",
      description: "Monthly statistics for barangay clearance requests",
      type: "clearances",
      generatedDate: "2024-01-14",
      period: "January 2024",
      status: "available",
      downloadUrl: "#"
    },
    {
      id: 4,
      title: "Population Demographics",
      description: "Age, gender, and civil status distribution",
      type: "demographics",
      generatedDate: "2024-01-10",
      period: "Q4 2023",
      status: "available",
      downloadUrl: "#",
      data: {
        summary: "Age, gender, and civil status distribution for Q4 2023.",
        statistics: {
          totalPopulation: 1247,
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
    }
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'residents': return <FaUsers className="text-blue-500" />;
      case 'requests': return <FaClipboardList className="text-green-500" />;
      case 'clearances': return <FaCheckCircle className="text-purple-500" />;
      case 'demographics': return <FaChartLine className="text-orange-500" />;
      default: return <FaFileAlt className="text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'residents': return 'bg-blue-100 text-blue-800';
      case 'requests': return 'bg-green-100 text-green-800';
      case 'clearances': return 'bg-purple-100 text-purple-800';
      case 'demographics': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'generating': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedReport(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const downloadReportCSV = (report: Report) => {
    // Create CSV content
    let csvContent = '';
    
    // Report metadata
    csvContent += `Report Title,${report.title}\n`;
    csvContent += `Report Type,${report.type}\n`;
    csvContent += `Period,${report.period}\n`;
    csvContent += `Generated Date,${formatDate(report.generatedDate)}\n`;
    csvContent += `Status,${report.status}\n\n`;
    
    // Summary
    if (report.data?.summary) {
      csvContent += `Summary,${report.data.summary.replace(/,/g, ';')}\n\n`;
    }
    
    // Statistics
    if (report.data?.statistics) {
      csvContent += 'Statistics,\n';
      Object.entries(report.data.statistics).forEach(([key, value]) => {
        if (typeof value !== 'object') {
          csvContent += `${key},${value}\n`;
        }
      });
      csvContent += '\n';
    }
    
    // Demographics data
    if (report.data?.demographics) {
      csvContent += 'Demographics,Count,Percentage\n';
      report.data.demographics.forEach((item: any) => {
        csvContent += `${item.category},${item.count},${item.percentage}%\n`;
      });
      csvContent += '\n';
    }
    
    // Request types data
    if (report.data?.requestTypes) {
      csvContent += 'Request Type,Total,Approved,Rejected,Pending\n';
      report.data.requestTypes.forEach((item: any) => {
        csvContent += `${item.type},${item.count},${item.approved},${item.rejected},${item.pending}\n`;
      });
      csvContent += '\n';
    }
    
    // Age groups data
    if (report.data?.ageGroups) {
      csvContent += 'Age Range,Male,Female,Total\n';
      report.data.ageGroups.forEach((item: any) => {
        csvContent += `${item.range},${item.male},${item.female},${item.total}\n`;
      });
      csvContent += '\n';
    }
    
    // Convert to Blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${report.title.replace(/[^a-zA-Z0-9]/g, '_')}_${report.period.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-6 bg-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
      >
        <div className="flex-1 w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm">
              <FaFileAlt className="text-blue-600 text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {t('reports.title')}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {t('reports.subtitle')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-lg border border-gray-200">
            <FaCalendarAlt className="text-gray-500 text-sm" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-white text-sm font-medium text-gray-900 cursor-pointer transition-colors w-full focus:outline-none focus:ring-1 focus:ring-blue-500 rounded py-1"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
      </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        >
          {[
            {
              title: t('reports.totalReports'),
              value: reports.length.toString(),
              icon: <FaFileAlt className="text-blue-500" />,
              bgColor: "bg-blue-50"
            },
            {
              title: t('reports.available'),
              value: reports.filter(r => r.status === 'available').length.toString(),
              icon: <FaDownload className="text-green-500" />,
              bgColor: "bg-green-50"
            },
            {
              title: t('reports.thisMonth'),
              value: reports.filter(r => r.period.includes('January')).length.toString(),
              icon: <FaCalendarAlt className="text-purple-500" />,
              bgColor: "bg-purple-50"
            },
            {
              title: t('reports.generating'),
              value: reports.filter(r => r.status === 'generating').length.toString(),
              icon: <FaChartLine className="text-orange-500" />,
              bgColor: "bg-orange-50"
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.1, duration: 0.3 }}
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
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Reports Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {reports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ y: -2 }}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="p-4 bg-blue-500 text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center">
                    {getTypeIcon(report.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-white truncate">
                      {report.title}
                    </h3>
                    <p className="text-blue-100 text-xs">{report.period}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-gray-700 mb-3 text-xs">
                  {report.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-0.5 text-[0.6rem] font-medium rounded ${getTypeColor(report.type)}`}>
                    {report.type}
                  </span>
                  <span className={`px-2 py-0.5 text-[0.6rem] font-medium rounded ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>

                <div className="text-[0.6rem] text-gray-500 mb-4">
                  {t('reports.generated')}: {new Date(report.generatedDate).toLocaleDateString()}
                </div>

                {/* Staff Actions */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleViewReport(report)}
                    className="flex-1 py-2 px-3 text-xs font-medium rounded-lg transition-all duration-200 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <FaEye className="text-xs" />
                      {t('reports.viewReport')}
                    </div>
                  </motion.button>

                  {report.status === 'available' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => downloadReportCSV(report)}
                      className="px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-green-200 cursor-pointer flex items-center gap-1"
                    >
                      <FaDownload className="text-xs" />
                      {t('reports.download')}
                    </motion.button>
                  )}
                </div>

                {/* Staff Notice */}
                <div className="mt-3 p-2 bg-yellow-50 rounded-lg border border-yellow-200 mt-3">
                  <p className="text-[0.6rem] text-yellow-800">
                    📊 {t('reports.staffNotice')}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm p-4"
        >
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">{t('reports.generateNew')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  title: t('reports.residentSummary'),
                  description: t('reports.residentSummaryDesc'),
                  icon: <FaUsers className="text-blue-500" />,
                  color: "bg-blue-500 hover:bg-blue-600"
                },
                {
                  title: t('reports.requestAnalytics'),
                  description: t('reports.requestAnalyticsDesc'),
                  icon: <FaClipboardList className="text-green-500" />,
                  color: "bg-green-500 hover:bg-green-600"
                },
                {
                  title: t('reports.clearanceReport'),
                  description: t('reports.clearanceReportDesc'),
                  icon: <FaCheckCircle className="text-purple-500" />,
                  color: "bg-purple-500 hover:bg-purple-600"
                }
              ].map((action, index) => (
                <motion.button
                  key={action.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`bg-gray-50 hover:bg-gray-100 text-gray-800 p-3 rounded-lg transition-all duration-200 border border-gray-200 text-left`}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="p-1.5 bg-gray-200 rounded">
                      {action.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-xs">{action.title}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    {action.description}
                  </div>
                </motion.button>
              ))}
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
                      <p className="text-blue-100 text-sm">{selectedReport.period}</p>
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
                    {selectedReport.data.demographics && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FaTable className="text-purple-500" />
                          <h3 className="font-semibold text-gray-900">Demographics</h3>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="text-left p-3 font-medium text-gray-700">Category</th>
                                <th className="text-right p-3 font-medium text-gray-700">Count</th>
                                <th className="text-right p-3 font-medium text-gray-700">Percentage</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedReport.data.demographics.map((item: any, index: number) => (
                                <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                                  <td className="p-3 text-gray-700">{item.category}</td>
                                  <td className="p-3 text-right text-gray-900 font-medium">{item.count.toLocaleString()}</td>
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
                          <FaTable className="text-orange-500" />
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

                    {selectedReport.data.ageGroups && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FaTable className="text-indigo-500" />
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
                  </div>
                )}

                {/* Report Metadata */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium text-gray-700">Generated Date:</span>
                      <span className="ml-2">{formatDate(selectedReport.generatedDate)}</span>
                    </div>
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
                      <span className="font-medium text-gray-700">Period:</span>
                      <span className="ml-2">{selectedReport.period}</span>
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
                {selectedReport.status === 'available' && (
                  <button
                    onClick={() => downloadReportCSV(selectedReport)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <FaDownload className="text-sm" />
                    {t('reports.downloadReport')}
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

const StaffReportsPage: React.FC = () => {
  return <StaffReportsContent />;
};

export default StaffReportsPage;