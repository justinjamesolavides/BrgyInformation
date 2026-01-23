"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaCertificate, FaSave, FaHistory, FaEdit } from "react-icons/fa";

const ClearanceFees: React.FC = () => {
  const [fees, setFees] = useState({
    residency: 50,
    business: 100,
    employment: 75,
    indigency: 25,
    certification: 30,
    seniorCitizen: 10,
    pwd: 10
  });

  const [feeHistory, setFeeHistory] = useState([
    { date: "2024-01-15", type: "residency", oldFee: 40, newFee: 50, changedBy: "Admin User" },
    { date: "2024-01-10", type: "business", oldFee: 80, newFee: 100, changedBy: "Admin User" },
    { date: "2023-12-20", type: "employment", oldFee: 60, newFee: 75, changedBy: "Admin User" }
  ]);

  const [editingFee, setEditingFee] = useState<string | null>(null);
  const [tempFee, setTempFee] = useState(0);
  const [saving, setSaving] = useState(false);

  const feeTypes = [
    { key: "residency", name: "Residency Clearance", icon: "🏠" },
    { key: "business", name: "Business Clearance", icon: "🏢" },
    { key: "employment", name: "Employment Clearance", icon: "💼" },
    { key: "indigency", name: "Indigency Certificate", icon: "📄" },
    { key: "certification", name: "Other Certifications", icon: "📝" },
    { key: "seniorCitizen", name: "Senior Citizen Discount", icon: "👴" },
    { key: "pwd", name: "PWD Discount", icon: "♿" }
  ];

  const handleEditFee = (key: string, currentFee: number) => {
    setEditingFee(key);
    setTempFee(currentFee);
  };

  const handleSaveFee = (key: string) => {
    setFees({
      ...fees,
      [key]: tempFee
    });
    
    // Add to history
    setFeeHistory([
      {
        date: new Date().toISOString().split('T')[0],
        type: key,
        oldFee: fees[key as keyof typeof fees],
        newFee: tempFee,
        changedBy: "Current Admin"
      },
      ...feeHistory
    ]);
    
    setEditingFee(null);
  };

  const handleCancelEdit = () => {
    setEditingFee(null);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      alert("All fee changes saved successfully!");
    }, 1500);
  };

  const getTypeName = (key: string) => {
    const type = feeTypes.find(t => t.key === key);
    return type ? type.name : key;
  };

  const getTypeIcon = (key: string) => {
    const type = feeTypes.find(t => t.key === key);
    return type ? type.icon : "📄";
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <FaCertificate className="text-blue-600 text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clearance Fees</h1>
            <p className="text-gray-600">Manage processing fees for barangay documents</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Fee Configuration */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Fee Configuration</h2>
            
            <div className="space-y-4">
              {feeTypes.map((type) => (
                <div key={type.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{type.icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-800">{type.name}</h3>
                      <p className="text-sm text-gray-600">
                        Current fee: ₱{fees[type.key as keyof typeof fees]}
                      </p>
                    </div>
                  </div>
                  
                  {editingFee === type.key ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        step="5"
                        className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                        value={tempFee}
                        onChange={(e) => setTempFee(parseInt(e.target.value) || 0)}
                      />
                      <button
                        onClick={() => handleSaveFee(type.key)}
                        className="bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-sm hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEditFee(type.key, fees[type.key as keyof typeof fees])}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <FaEdit className="text-xs" />
                      Edit Fee
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleSaveAll}
                disabled={saving}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <FaSave className="text-sm" />
                    Save All Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Fee History */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <FaHistory className="text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-800">Fee History</h2>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {feeHistory.map((change, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800 text-sm">
                        {getTypeName(change.type)}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {change.date} • {change.changedBy}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-red-600 line-through">
                        ₱{change.oldFee}
                      </div>
                      <div className="text-sm font-semibold text-green-600">
                        ₱{change.newFee}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {feeHistory.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FaHistory className="mx-auto text-2xl mb-2" />
                <p className="text-sm">No fee changes recorded</p>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-3">Quick Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Active Fees:</span>
                <span className="font-medium">{Object.keys(fees).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Fee:</span>
                <span className="font-medium">
                  ₱{(Object.values(fees).reduce((a, b) => a + b, 0) / Object.keys(fees).length).toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Highest Fee:</span>
                <span className="font-medium">₱{Math.max(...Object.values(fees))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lowest Fee:</span>
                <span className="font-medium">₱{Math.min(...Object.values(fees))}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fee Schedule Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8"
      >
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Current Fee Schedule</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {feeTypes.map((type) => (
              <div key={type.key} className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">{type.icon}</div>
                <h3 className="font-medium text-gray-800 text-sm mb-1">{type.name}</h3>
                <div className="text-lg font-bold text-blue-600">
                  ₱{fees[type.key as keyof typeof fees]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ClearanceFees;