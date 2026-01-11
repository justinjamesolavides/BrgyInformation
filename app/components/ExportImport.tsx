"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaUpload, FaFileCsv, FaFileExcel, FaFilePdf, FaSpinner } from 'react-icons/fa';
import { useNotifications } from './NotificationProvider';

interface ExportImportProps {
  data: any[];
  filename: string;
  onImport?: (data: any[]) => void;
  columns?: string[];
  exportFormats?: ('csv' | 'excel' | 'pdf')[];
}

const ExportImport: React.FC<ExportImportProps> = ({
  data,
  filename,
  onImport,
  columns,
  exportFormats = ['csv', 'excel']
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addNotification } = useNotifications();

  const exportToCSV = () => {
    try {
      const headers = columns || Object.keys(data[0] || {});
      const csvContent = [
        headers.join(','),
        ...data.map(row =>
          headers.map(header => {
            const value = row[header];
            // Escape commas and quotes in CSV
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value || '';
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.csv`;
      link.click();

      addNotification('success', 'Export Successful', 'Data exported to CSV successfully');
    } catch (error) {
      addNotification('error', 'Export Failed', 'Failed to export data');
    }
  };

  const exportToExcel = () => {
    try {
      // For demo purposes, we'll export as CSV since Excel export requires additional libraries
      // In a real app, you'd use a library like xlsx or exceljs
      exportToCSV();
      addNotification('info', 'Excel Export', 'Excel export simulated as CSV. Install excel export library for full functionality.');
    } catch (error) {
      addNotification('error', 'Export Failed', 'Failed to export data');
    }
  };

  const exportToPDF = () => {
    try {
      // For demo purposes, we'll show a notification
      // In a real app, you'd use a library like jsPDF or react-pdf
      addNotification('info', 'PDF Export', 'PDF export feature coming soon. Use CSV export for now.');
    } catch (error) {
      addNotification('error', 'Export Failed', 'Failed to export data');
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      addNotification('error', 'Invalid File', 'Please select a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());

        const importedData = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.replace(/"/g, '').trim());
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          return row;
        });

        onImport?.(importedData);
        addNotification('success', 'Import Successful', `Imported ${importedData.length} records successfully`);

        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        addNotification('error', 'Import Failed', 'Failed to parse CSV file');
      }
    };

    reader.readAsText(file);
  };

  const handleExport = (format: string) => {
    switch (format) {
      case 'csv':
        exportToCSV();
        break;
      case 'excel':
        exportToExcel();
        break;
      case 'pdf':
        exportToPDF();
        break;
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {/* Export Buttons */}
      {exportFormats.map((format) => (
        <motion.button
          key={format}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleExport(format)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          {format === 'csv' && <FaFileCsv />}
          {format === 'excel' && <FaFileExcel />}
          {format === 'pdf' && <FaFilePdf />}
          Export {format.toUpperCase()}
        </motion.button>
      ))}

      {/* Import Button */}
      {onImport && (
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleImport}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <FaUpload />
            Import CSV
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default ExportImport;