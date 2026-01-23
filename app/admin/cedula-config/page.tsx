"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaIdCard, FaSave, FaHistory, FaCalculator } from "react-icons/fa";

const CedulaConfiguration: React.FC = () => {
  const [config, setConfig] = useState({
    basicTax: 5,
    additionalTaxRate: 1, // per 1000 pesos
    seniorCitizenDiscount: true,
    pwdDiscount: true,
    studentDiscount: false,
    minimumIncomeThreshold: 5000,
    active: true
  });

  const [taxBrackets, setTaxBrackets] = useState([
    { min: 0, max: 5000, rate: 5 },
    { min: 5001, max: 10000, rate: 10 },
    { min: 10001, max: 20000, rate: 20 },
    { min: 20001, max: 30000, rate: 30 },
    { min: 30001, max: 40000, rate: 40 },
    { min: 40001, max: 50000, rate: 50 },
    { min: 50001, max: 100000, rate: 60 }
  ]);

  const [saving, setSaving] = useState(false);

  const handleConfigChange = (field: string, value: any) => {
    setConfig({
      ...config,
      [field]: value
    });
  };

  const handleBracketChange = (index: number, field: string, value: any) => {
    const newBrackets = [...taxBrackets];
    newBrackets[index] = { ...newBrackets[index], [field]: value };
    setTaxBrackets(newBrackets);
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      alert("Cedula configuration saved successfully!");
    }, 1500);
  };

  const addTaxBracket = () => {
    const lastBracket = taxBrackets[taxBrackets.length - 1];
    setTaxBrackets([
      ...taxBrackets,
      {
        min: lastBracket.max + 1,
        max: lastBracket.max + 10000,
        rate: lastBracket.rate + 10
      }
    ]);
  };

  const removeTaxBracket = (index: number) => {
    if (taxBrackets.length > 1) {
      setTaxBrackets(taxBrackets.filter((_, i) => i !== index));
    }
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
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <FaIdCard className="text-green-600 text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cedula Configuration</h1>
            <p className="text-gray-600">Manage community tax certificate settings</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FaIdCard className="text-green-500" />
            General Settings
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Basic Community Tax (₱)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={config.basicTax}
                onChange={(e) => handleConfigChange('basicTax', parseFloat(e.target.value))}
              />
              <p className="text-xs text-gray-500 mt-1">Fixed amount charged to all taxpayers</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Tax Rate (₱ per ₱1,000 income)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={config.additionalTaxRate}
                onChange={(e) => handleConfigChange('additionalTaxRate', parseFloat(e.target.value))}
              />
              <p className="text-xs text-gray-500 mt-1">Variable tax based on gross annual income</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Income Threshold (₱)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={config.minimumIncomeThreshold}
                onChange={(e) => handleConfigChange('minimumIncomeThreshold', parseInt(e.target.value))}
              />
              <p className="text-xs text-gray-500 mt-1">Income level below which no additional tax is charged</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">Discount Eligibility</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.seniorCitizenDiscount}
                    onChange={(e) => handleConfigChange('seniorCitizenDiscount', e.target.checked)}
                    className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Senior Citizen Discount (20%)</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.pwdDiscount}
                    onChange={(e) => handleConfigChange('pwdDiscount', e.target.checked)}
                    className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">PWD Discount (20%)</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.studentDiscount}
                    onChange={(e) => handleConfigChange('studentDiscount', e.target.checked)}
                    className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Student Discount (10%)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.active}
                  onChange={(e) => handleConfigChange('active', e.target.checked)}
                  className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Enable Cedula Processing</span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Tax Brackets */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaCalculator className="text-blue-500" />
              Tax Brackets
            </h2>
            <button
              onClick={addTaxBracket}
              className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 text-sm"
            >
              Add Bracket
            </button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {taxBrackets.map((bracket, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Min Income (₱)</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                      value={bracket.min}
                      onChange={(e) => handleBracketChange(index, 'min', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Max Income (₱)</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                      value={bracket.max}
                      onChange={(e) => handleBracketChange(index, 'max', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Tax Rate (₱)</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                      value={bracket.rate}
                      onChange={(e) => handleBracketChange(index, 'rate', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeTaxBracket(index)}
                  className="text-red-600 hover:text-red-800 text-xs"
                >
                  Remove Bracket
                </button>
              </div>
            ))}
          </div>

          {/* Preview Calculator */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
              <FaCalculator className="text-sm" />
              Tax Calculator Preview
            </h3>
            <div className="text-sm text-blue-700 space-y-1">
              <div className="flex justify-between">
                <span>Basic Tax:</span>
                <span className="font-medium">₱{config.basicTax}</span>
              </div>
              <div className="flex justify-between">
                <span>Additional Tax Rate:</span>
                <span className="font-medium">₱{config.additionalTaxRate} per ₱1,000</span>
              </div>
              <div className="border-t border-blue-200 pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Example (₱25,000 income):</span>
                  <span>₱{config.basicTax + Math.floor(25000 / 1000) * config.additionalTaxRate}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 flex justify-end"
      >
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            <>
              <FaSave className="text-sm" />
              Save Configuration
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default CedulaConfiguration;