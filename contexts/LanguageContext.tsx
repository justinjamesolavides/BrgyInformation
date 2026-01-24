"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'tl'; // English or Tagalog/Filipino

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations = {
  en: {
    // Settings Page
    'settings.title': 'Staff - Settings',
    'settings.subtitle': 'Manage your account and preferences (Staff Access)',
    'settings.profile': 'Profile',
    'settings.notifications': 'Notifications',
    'settings.security': 'Security',
    'settings.preferences': 'Preferences',
    'settings.profileTitle': 'Profile Settings',
    'settings.profileSubtitle': 'Manage your personal information',
    'settings.firstName': 'First Name',
    'settings.lastName': 'Last Name',
    'settings.email': 'Email Address',
    'settings.phone': 'Phone Number',
    'settings.saveChanges': 'Save Changes',
    'settings.notificationTitle': 'Notification Settings',
    'settings.notificationSubtitle': 'Configure how you receive notifications',
    'settings.newRequests': 'New Requests',
    'settings.newRequestsDesc': 'Get notified when new requests are submitted',
    'settings.urgentTasks': 'Urgent Tasks',
    'settings.urgentTasksDesc': 'Receive alerts for urgent tasks requiring attention',
    'settings.systemUpdates': 'System Updates',
    'settings.systemUpdatesDesc': 'Notifications about system maintenance and updates',
    'settings.weeklyReports': 'Weekly Reports',
    'settings.weeklyReportsDesc': 'Receive weekly summary reports',
    'settings.securityTitle': 'Security Settings',
    'settings.securitySubtitle': 'Manage your account security',
    'settings.currentPassword': 'Current Password',
    'settings.newPassword': 'New Password',
    'settings.confirmPassword': 'Confirm New Password',
    'settings.passwordRequirements': 'Password Requirements',
    'settings.passwordReq1': 'At least 8 characters long',
    'settings.passwordReq2': 'Contains at least one uppercase letter',
    'settings.passwordReq3': 'Contains at least one number',
    'settings.passwordReq4': 'Contains at least one special character',
    'settings.updatePassword': 'Update Password',
    'settings.preferencesTitle': 'Preferences',
    'settings.preferencesSubtitle': 'Customize your experience',
    'settings.theme': 'Theme',
    'settings.toggleTheme': 'Toggle between light and dark mode',
    'settings.language': 'Language',
    'settings.defaultView': 'Default Dashboard View',
    'settings.overview': 'Overview',
    'settings.requests': 'Requests',
    'settings.residents': 'Residents',
    'settings.staffNotice': 'Staff Account Limitations',
    'settings.staffNoticeDesc': 'Some settings may be restricted for staff accounts. Contact your administrator for advanced configuration options.',
    
    // Reports Page
    'reports.title': 'Staff - Reports & Analytics',
    'reports.subtitle': 'Generate and view barangay reports (Staff Access)',
    'reports.totalReports': 'Total Reports',
    'reports.available': 'Available',
    'reports.thisMonth': 'This Month',
    'reports.generating': 'Generating',
    'reports.viewReport': 'View Report',
    'reports.download': 'Download',
    'reports.downloadReport': 'Download Report',
    'reports.generated': 'Generated',
    'reports.staffNotice': 'Staff Access: Can view and download reports. Report generation requires admin approval.',
    'reports.generateNew': 'Generate New Report',
    'reports.residentSummary': 'Resident Summary',
    'reports.residentSummaryDesc': 'Current resident statistics and demographics',
    'reports.requestAnalytics': 'Request Analytics',
    'reports.requestAnalyticsDesc': 'Processing times and approval rates',
    'reports.clearanceReport': 'Clearance Report',
    'reports.clearanceReportDesc': 'Monthly clearance certificate summary',
    
    // Residents Page
    'residents.title': 'Staff - Residents Management',
    'residents.subtitle': 'View and manage resident information (Staff Access)',
    'residents.exportData': 'Export Data',
    'residents.searchPlaceholder': 'Search residents by name, email, or barangay ID...',
    'residents.viewDetails': 'View Details',
    'residents.staffNotice': 'Staff Access: Limited permissions',
    'residents.noResidentsFound': 'No residents found',
    'residents.adjustSearch': 'Try adjusting your search criteria.',
    'residents.noResidentsAvailable': 'No residents available for staff review.',
    'residents.personalInfo': 'Personal Information',
    'residents.contactInfo': 'Contact Information',
    'residents.additionalInfo': 'Additional Information',
    'residents.fullName': 'Full Name',
    'residents.age': 'Age',
    'residents.gender': 'Gender',
    'residents.civilStatus': 'Civil Status',
    'residents.occupation': 'Occupation',
    'residents.email': 'Email',
    'residents.phone': 'Phone',
    'residents.address': 'Address',
    'residents.emergencyContact': 'Emergency Contact',
    'residents.registrationDate': 'Registration Date',
    'residents.lastUpdated': 'Last Updated',
    'residents.status': 'Status',
    'residents.barangayId': 'Barangay ID',
    'residents.notes': 'Notes',
    'residents.close': 'Close',
    
    // Common terms
    'common.settings': 'Settings',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.download': 'Download',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.date': 'Date',
    'common.status': 'Status',
    'common.actions': 'Actions',
    'common.dashboard': 'Dashboard',
    'common.reports': 'Reports',
    'common.residents': 'Residents',
    'common.requests': 'Requests',
    'common.households': 'Households',
    'common.documents': 'Documents',
    'common.users': 'Users',
    'common.announcements': 'Announcements',
    'common.aiAssistant': 'AI Assistant',
    'common.logout': 'Logout'
  },
  tl: {
    // Settings Page
    'settings.title': 'Staff - Mga Setting',
    'settings.subtitle': 'Pamahalaan ang iyong account at mga kagustuhan (Access ng Staff)',
    'settings.profile': 'Profile',
    'settings.notifications': 'Mga Abiso',
    'settings.security': 'Seguridad',
    'settings.preferences': 'Mga Kagustuhan',
    'settings.profileTitle': 'Mga Setting ng Profile',
    'settings.profileSubtitle': 'Pamahalaan ang iyong personal na impormasyon',
    'settings.firstName': 'Pangalan',
    'settings.lastName': 'Apelyido',
    'settings.email': 'Email Address',
    'settings.phone': 'Numero ng Telepono',
    'settings.saveChanges': 'I-save ang mga Pagbabago',
    'settings.notificationTitle': 'Mga Setting ng Abiso',
    'settings.notificationSubtitle': 'I-configure kung paano mo natatanggap ang mga abiso',
    'settings.newRequests': 'Bagong Kahilingan',
    'settings.newRequestsDesc': 'Abisuhan kapag may mga bagong kahilingan na isinumite',
    'settings.urgentTasks': 'Mahahalagang Gawain',
    'settings.urgentTasksDesc': 'Tumanggap ng mga alerto para sa mahahalagang gawain na kailangan ng pansin',
    'settings.systemUpdates': 'Mga Update ng System',
    'settings.systemUpdatesDesc': 'Mga abiso tungkol sa pagmimina at mga update ng system',
    'settings.weeklyReports': 'Lingguhang Ulat',
    'settings.weeklyReportsDesc': 'Tumanggap ng lingguhang buod ng mga ulat',
    'settings.securityTitle': 'Mga Setting ng Seguridad',
    'settings.securitySubtitle': 'Pamahalaan ang seguridad ng iyong account',
    'settings.currentPassword': 'Kasalukuyang Password',
    'settings.newPassword': 'Bagong Password',
    'settings.confirmPassword': 'Kumpirmahin ang Bagong Password',
    'settings.passwordRequirements': 'Mga Kinakailangan sa Password',
    'settings.passwordReq1': 'Hindi bababa sa 8 karakter ang haba',
    'settings.passwordReq2': 'Naglalaman ng hindi bababa sa isang malaking titik',
    'settings.passwordReq3': 'Naglalaman ng hindi bababa sa isang numero',
    'settings.passwordReq4': 'Naglalaman ng hindi bababa sa isang espesyal na karakter',
    'settings.updatePassword': 'I-update ang Password',
    'settings.preferencesTitle': 'Mga Kagustuhan',
    'settings.preferencesSubtitle': 'I-customize ang iyong karanasan',
    'settings.theme': 'Tema',
    'settings.toggleTheme': 'Lumipat sa pagitan ng light at dark mode',
    'settings.language': 'Wika',
    'settings.defaultView': 'Default na View ng Dashboard',
    'settings.overview': 'Pangkalahatang-ideya',
    'settings.requests': 'Mga Kahilingan',
    'settings.residents': 'Mga Residente',
    'settings.staffNotice': 'Mga Limitasyon ng Staff Account',
    'settings.staffNoticeDesc': 'Maaaring pinaghihigpitan ang ilang setting para sa mga staff account. Makipag-ugnayan sa iyong administrator para sa mga opsyon sa advanced na configuration.',
    
    // Reports Page
    'reports.title': 'Staff - Mga Ulat at Analisis',
    'reports.subtitle': 'Bumuo at tingnan ang mga ulat ng barangay (Access ng Staff)',
    'reports.totalReports': 'Kabuuang Mga Ulat',
    'reports.available': 'Available',
    'reports.thisMonth': 'Sa Buwang Ito',
    'reports.generating': 'Bumubuo',
    'reports.viewReport': 'Tingnan ang Ulat',
    'reports.download': 'I-download',
    'reports.downloadReport': 'I-download ang Ulat',
    'reports.generated': 'Binuo',
    'reports.staffNotice': 'Access ng Staff: Maaaring tingnan at i-download ang mga ulat. Ang pagbuo ng ulat ay nangangailangan ng pag-apruba ng admin.',
    'reports.generateNew': 'Bumuo ng Bagong Ulat',
    'reports.residentSummary': 'Buod ng Residente',
    'reports.residentSummaryDesc': 'Kasalukuyang istatistika at demograpiko ng residente',
    'reports.requestAnalytics': 'Analisis ng Kahilingan',
    'reports.requestAnalyticsDesc': 'Oras ng pagproseso at rate ng pag-apruba',
    'reports.clearanceReport': 'Ulat ng Clearance',
    'reports.clearanceReportDesc': 'Buwanang buod ng sertipiko ng clearance',
    
    // Residents Page
    'residents.title': 'Staff - Pamamahala ng mga Residente',
    'residents.subtitle': 'Tingnan at pamahalaan ang impormasyon ng residente (Access ng Staff)',
    'residents.exportData': 'I-export ang Datos',
    'residents.searchPlaceholder': 'Maghanap ng residente sa pangalan, email, o barangay ID...',
    'residents.viewDetails': 'Tingnan ang Detalye',
    'residents.staffNotice': 'Access ng Staff: Limitadong mga pahintulot',
    'residents.noResidentsFound': 'Walang nakitang residente',
    'residents.adjustSearch': 'Subukang baguhin ang iyong pamantayan sa paghahanap.',
    'residents.noResidentsAvailable': 'Walang mga residente na available para sa pagsusuri ng staff.',
    'residents.personalInfo': 'Personal na Impormasyon',
    'residents.contactInfo': 'Impormasyon sa Pakikipag-ugnayan',
    'residents.additionalInfo': 'Karagdagang Impormasyon',
    'residents.fullName': 'Buong Pangalan',
    'residents.age': 'Edad',
    'residents.gender': 'Kasarian',
    'residents.civilStatus': 'Katayuang Sibil',
    'residents.occupation': 'Trabaho',
    'residents.email': 'Email',
    'residents.phone': 'Telepono',
    'residents.address': 'Address',
    'residents.emergencyContact': 'Emergency na Kontak',
    'residents.registrationDate': 'Petsa ng Rehistrasyon',
    'residents.lastUpdated': 'Huling Na-update',
    'residents.status': 'Katayuan',
    'residents.barangayId': 'Barangay ID',
    'residents.notes': 'Mga Tala',
    'residents.close': 'Isara',
    
    // Common terms
    'common.settings': 'Mga Setting',
    'common.save': 'I-save',
    'common.cancel': 'Kanselahin',
    'common.edit': 'I-edit',
    'common.delete': 'Tanggalin',
    'common.view': 'Tingnan',
    'common.download': 'I-download',
    'common.search': 'Maghanap',
    'common.filter': 'Salain',
    'common.sort': 'Ayusin',
    'common.date': 'Petsa',
    'common.status': 'Katayuan',
    'common.actions': 'Mga Aksyon',
    'common.dashboard': 'Dashboard',
    'common.reports': 'Mga Ulat',
    'common.residents': 'Mga Residente',
    'common.requests': 'Mga Kahilingan',
    'common.households': 'Mga Pamilya',
    'common.documents': 'Mga Dokumento',
    'common.users': 'Mga Gumagamit',
    'common.announcements': 'Mga Anunsyo',
    'common.aiAssistant': 'AI Assistant',
    'common.logout': 'Mag-logout'
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  // Load saved language preference from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang && (savedLang === 'en' || savedLang === 'tl')) {
      setLanguageState(savedLang as Language);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferred-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};