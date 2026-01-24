"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../../contexts/LanguageContext";
import {
  FaUsers,
  FaPlus,
  FaSearch,
  FaFilter,
  FaEdit,
  FaEye,
  FaHome,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaDownload
} from "react-icons/fa";

interface Resident {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  barangayId: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  civilStatus: 'single' | 'married' | 'widowed' | 'divorced';
  occupation: string;
  status: 'active' | 'inactive';
  avatar: string;
  // Extended details for view modal
  emergencyContact?: string;
  emergencyContactName?: string;
  registrationDate?: string;
  lastUpdated?: string;
  notes?: string;
}

const StaffResidentsContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [residents, setResidents] = useState<Resident[]>([]);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { t } = useLanguage();
  
  // Fetch residents from API with periodic updates
  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const response = await fetch('/api/residents');
        const data = await response.json();
        if (data.success && data.data) {
          setResidents(addExtendedData(data.data));
        }
      } catch (error) {
        console.error('Error fetching residents:', error);
      }
    };

    // Initial fetch
    fetchResidents();
    
    // For demo purposes, add extended data to residents
    const addExtendedData = (residentsData: Resident[]) => {
      return residentsData.map(resident => ({
        ...resident,
        emergencyContact: '+63 917 123 4567',
        emergencyContactName: 'Juan Dela Cruz',
        registrationDate: '2023-01-15',
        lastUpdated: '2024-01-20',
        notes: 'Long-term resident, active community participant.'
      }));
    };
    
    // Set up polling for updates every 5 seconds
    const intervalId = setInterval(fetchResidents, 5000);
    
    // Cleanup function
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const filteredResidents = residents.filter(resident => {
    const fullName = `${resident.firstName} ${resident.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) ||
           resident.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           resident.barangayId.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getGenderColor = (gender: string) => {
    switch (gender) {
      case 'male': return 'bg-blue-100 text-blue-800';
      case 'female': return 'bg-pink-100 text-pink-800';
      default: return 'bg-purple-100 text-purple-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const handleViewDetails = (resident: Resident) => {
    setSelectedResident(resident);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedResident(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
                <FaUsers className="text-blue-600 text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {t('residents.title')}
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  {t('residents.subtitle')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg transition-all flex items-center gap-2 font-medium"
            >
              <FaDownload className="text-sm" />
              {t('residents.exportData')}
            </motion.button>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6"
        >
          <div>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaSearch className="text-sm" />
                </div>
                <input
                  type="text"
                  placeholder={t('residents.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Residents Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {filteredResidents.map((resident, index) => (
            <motion.div
              key={resident.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ y: -2 }}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Header */}
              <div className="p-4 bg-white border-b border-gray-100 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-800 font-bold text-lg">
                    {resident.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {resident.firstName} {resident.lastName}
                    </h3>
                    <p className="text-gray-500 text-xs">{resident.barangayId}</p>
                    <p className="text-gray-600 text-xs mt-1">
                      Age: {calculateAge(resident.dateOfBirth)} • {resident.occupation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2.5 text-sm">
                    <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                      <FaEnvelope className="text-gray-500 text-xs" />
                    </div>
                    <span className="text-gray-700 font-medium truncate text-xs">{resident.email}</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-sm">
                    <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                      <FaPhone className="text-gray-500 text-xs" />
                    </div>
                    <span className="text-gray-700 font-medium text-xs">{resident.phone}</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-sm">
                    <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                      <FaMapMarkerAlt className="text-gray-500 text-xs" />
                    </div>
                    <span className="text-gray-700 font-medium truncate text-xs">{resident.address}</span>
                  </div>
                </div>

                {/* Status Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className={`px-2 py-0.5 text-[0.6rem] font-medium rounded-full bg-gray-100 text-gray-800`}>
                    {resident.gender === 'male' ? '👨' : resident.gender === 'female' ? '👩' : '🧑'} {resident.gender}
                  </span>
                  <span className={`px-2 py-0.5 text-[0.6rem] font-medium rounded-full bg-gray-100 text-gray-800`}>
                    {resident.civilStatus}
                  </span>
                  <span className={`px-2 py-0.5 text-[0.6rem] font-medium rounded-full ${getStatusColor(resident.status)}`}>
                    {resident.status === 'active' ? '✅' : '⏸️'} {resident.status}
                  </span>
                </div>

                {/* Staff Actions - Limited permissions */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleViewDetails(resident)}
                    className="flex-1 py-2 px-3 text-xs font-medium rounded-lg transition-all duration-200 bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 cursor-pointer"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <FaEye className="text-xs" />
                      {t('residents.viewDetails')}
                    </div>
                  </motion.button>
                </div>

                <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-[0.6rem] text-blue-800">
                    🔒 {t('residents.staffNotice')}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredResidents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-gray-400 text-lg" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {t('residents.noResidentsFound')}
            </h3>
            <p className="text-gray-600 text-sm max-w-md mx-auto">
              {searchTerm ? t('residents.adjustSearch') : t('residents.noResidentsAvailable')}
            </p>
          </motion.div>
      )}

      {/* Resident Details Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedResident && (
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
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center text-2xl font-bold">
                      {selectedResident.avatar}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        {selectedResident.firstName} {selectedResident.lastName}
                      </h2>
                      <p className="text-blue-100 text-sm">{selectedResident.barangayId}</p>
                    </div>
                  </div>
                  <button
                    onClick={closeViewModal}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                      {t('residents.personalInfo')}
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {t('residents.fullName')}
                        </label>
                        <p className="text-gray-900 font-medium">
                          {selectedResident.firstName} {selectedResident.lastName}
                        </p>
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {t('residents.age')}
                        </label>
                        <p className="text-gray-900">
                          {calculateAge(selectedResident.dateOfBirth)} years old
                        </p>
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {t('residents.gender')}
                        </label>
                        <p className="text-gray-900 capitalize">
                          {selectedResident.gender}
                        </p>
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {t('residents.civilStatus')}
                        </label>
                        <p className="text-gray-900 capitalize">
                          {selectedResident.civilStatus}
                        </p>
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {t('residents.occupation')}
                        </label>
                        <p className="text-gray-900">
                          {selectedResident.occupation}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                      {t('residents.contactInfo')}
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <FaEnvelope className="text-blue-600 text-sm" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                            {t('residents.email')}
                          </label>
                          <p className="text-gray-900 break-all">
                            {selectedResident.email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <FaPhone className="text-green-600 text-sm" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                            {t('residents.phone')}
                          </label>
                          <p className="text-gray-900">
                            {selectedResident.phone}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <FaMapMarkerAlt className="text-purple-600 text-sm" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                            {t('residents.address')}
                          </label>
                          <p className="text-gray-900">
                            {selectedResident.address}
                          </p>
                        </div>
                      </div>
                      
                      {selectedResident.emergencyContact && (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                            <FaPhone className="text-red-600 text-sm" />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                              {t('residents.emergencyContact')}
                            </label>
                            <p className="text-gray-900 text-sm mb-1">
                              {selectedResident.emergencyContactName}
                            </p>
                            <p className="text-gray-700 text-sm">
                              {selectedResident.emergencyContact}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {t('residents.additionalInfo')}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">{t('residents.registrationDate')}:</span>
                      <span className="ml-2 text-gray-900">
                        {selectedResident.registrationDate ? formatDate(selectedResident.registrationDate) : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">{t('residents.lastUpdated')}:</span>
                      <span className="ml-2 text-gray-900">
                        {selectedResident.lastUpdated ? formatDate(selectedResident.lastUpdated) : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">{t('residents.status')}:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedResident.status)}`}>
                        {selectedResident.status}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">{t('residents.barangayId')}:</span>
                      <span className="ml-2 text-gray-900 font-mono">
                        {selectedResident.barangayId}
                      </span>
                    </div>
                  </div>
                  
                  {selectedResident.notes && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-700 mb-2">{t('residents.notes')}:</h4>
                      <p className="text-gray-700 text-sm">{selectedResident.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={closeViewModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {t('residents.close')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StaffResidentsPage: React.FC = () => {
  return <StaffResidentsContent />;
};

export default StaffResidentsPage;