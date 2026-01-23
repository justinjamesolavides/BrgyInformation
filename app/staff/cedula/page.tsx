"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaIdCard, FaUser, FaCalendar, FaMoneyBill, FaCheck, FaTimes } from "react-icons/fa";

const CedulaProcessing: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    address: "",
    birthDate: "",
    civilStatus: "",
    gender: "",
    profession: "",
    income: "",
    tin: ""
  });

  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setProcessing(false);
      alert("Cedula processed successfully!");
      setStep(1);
      setFormData({
        firstName: "",
        lastName: "",
        middleName: "",
        address: "",
        birthDate: "",
        civilStatus: "",
        gender: "",
        profession: "",
        income: "",
        tin: ""
      });
    }, 2000);
  };

  const calculateTax = () => {
    const income = parseFloat(formData.income) || 0;
    if (income <= 5000) return 50;
    if (income <= 10000) return 100;
    if (income <= 20000) return 200;
    if (income <= 30000) return 300;
    if (income <= 40000) return 400;
    if (income <= 50000) return 500;
    return 600;
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
            <h1 className="text-2xl font-bold text-gray-900">Cedula Processing</h1>
            <p className="text-gray-600">Community Tax Certificate issuance</p>
          </div>
        </div>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-center gap-4">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                num <= step 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {num < step ? <FaCheck className="text-xs" /> : num}
              </div>
              {num < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  num < step ? 'bg-green-500' : 'bg-gray-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-2 text-sm text-gray-600">
          {step === 1 && "Personal Information"}
          {step === 2 && "Tax Calculation"}
          {step === 3 && "Confirmation"}
        </div>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
      >
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Middle Name
                </label>
                <input
                  type="text"
                  name="middleName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.middleName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Complete Address *
              </label>
              <input
                type="text"
                name="address"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="birthDate"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Civil Status *
                </label>
                <select
                  name="civilStatus"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.civilStatus}
                  onChange={handleInputChange}
                >
                  <option value="">Select Status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="widowed">Widowed</option>
                  <option value="separated">Separated</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <select
                  name="gender"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profession/Business *
                </label>
                <input
                  type="text"
                  name="profession"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.profession}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gross Income (Annual) *
                </label>
                <input
                  type="number"
                  name="income"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.income}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TIN (Optional)
                </label>
                <input
                  type="text"
                  name="tin"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.tin}
                  onChange={handleInputChange}
                  placeholder="XXX-XXX-XXX-XXX"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Tax Calculation</h2>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-800 mb-2">Tax Computation</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Gross Annual Income:</span>
                  <span className="font-medium">₱{parseFloat(formData.income || "0").toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Basic Community Tax:</span>
                  <span className="font-medium">₱5.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Additional Tax (₱1.00 per ₱1,000):</span>
                  <span className="font-medium">₱{(Math.floor(parseFloat(formData.income || "0") / 1000)).toLocaleString()}</span>
                </div>
                <div className="border-t border-green-200 pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount Due:</span>
                    <span className="text-green-700">₱{calculateTax().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">Payment Instructions</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Proceed to cashier for payment</li>
                <li>• Present valid ID for verification</li>
                <li>• Payment can be made in cash or bank transfer</li>
                <li>• Certificate will be issued upon payment confirmation</li>
              </ul>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <FaIdCard className="text-green-600 text-2xl" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Confirm Cedula Details</h2>
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-medium">Name:</span> {formData.firstName} {formData.middleName} {formData.lastName}</div>
                <div><span className="font-medium">Address:</span> {formData.address}</div>
                <div><span className="font-medium">Profession:</span> {formData.profession}</div>
                <div><span className="font-medium">Income:</span> ₱{parseFloat(formData.income || "0").toLocaleString()}</div>
                <div><span className="font-medium">Tax Due:</span> ₱{calculateTax().toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FaCheck className="text-sm" />
                  Issue Cedula
                </>
              )}
            </button>
          )}
        </div>
      </motion.form>
    </div>
  );
};

export default CedulaProcessing;