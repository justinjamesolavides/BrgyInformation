"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCertificate, FaUser, FaBuilding, FaFileAlt, FaCheck, FaTimes } from "react-icons/fa";

const BarangayClearance: React.FC = () => {
  const [clearanceType, setClearanceType] = useState<"residency" | "business" | "employment">("residency");
  const [formData, setFormData] = useState({
    purpose: "",
    firstName: "",
    lastName: "",
    middleName: "",
    address: "",
    contactNumber: "",
    companyName: "",
    companyAddress: "",
    position: ""
  });
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [fees, setFees] = useState({
    residency: 50,
    business: 100,
    employment: 75
  });
  const [loading, setLoading] = useState(true);

  // Fetch current fees
  useEffect(() => {
    const fetchFees = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/clearance-fees');
        const data = await response.json();
        
        if (data.success) {
          setFees(data.data.fees);
        }
      } catch (err) {
        console.error('Error fetching fees:', err);
        // Keep default fees if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      alert(`${clearanceType === 'residency' ? 'Residency' : clearanceType === 'business' ? 'Business' : 'Employment'} Clearance issued successfully!`);
      setStep(1);
      setFormData({
        purpose: "",
        firstName: "",
        lastName: "",
        middleName: "",
        address: "",
        contactNumber: "",
        companyName: "",
        companyAddress: "",
        position: ""
      });
    }, 2000);
  };

  const getFee = () => {
    return fees[clearanceType] || 50;
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
            <h1 className="text-2xl font-bold text-gray-900">Barangay Clearance</h1>
            <p className="text-gray-600">Issue residency, business, or employment clearance</p>
          </div>
        </div>
      </motion.div>

      {/* Clearance Type Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Clearance Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { 
              type: "residency", 
              title: "Residency Clearance", 
              desc: "For proof of residence",
              icon: <FaUser className="text-blue-500" />
            },
            { 
              type: "business", 
              title: "Business Clearance", 
              desc: "For business operations",
              icon: <FaBuilding className="text-green-500" />
            },
            { 
              type: "employment", 
              title: "Employment Clearance", 
              desc: "For job applications",
              icon: <FaFileAlt className="text-purple-500" />
            }
          ].map((item) => (
            <button
              key={item.type}
              onClick={() => setClearanceType(item.type as any)}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                clearanceType === item.type
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Fee: ₱{getFee()}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex items-center justify-center gap-4">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                num <= step 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {num < step ? <FaCheck className="text-xs" /> : num}
              </div>
              {num < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  num < step ? 'bg-blue-500' : 'bg-gray-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-2 text-sm text-gray-600">
          {step === 1 && "Personal Details"}
          {step === 2 && "Purpose & Requirements"}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number *
              </label>
              <input
                type="tel"
                name="contactNumber"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.contactNumber}
                onChange={handleInputChange}
                placeholder="+63 XXX XXX XXXX"
              />
            </div>

            {clearanceType === "business" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.companyName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Address *
                  </label>
                  <input
                    type="text"
                    name="companyAddress"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.companyAddress}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}

            {clearanceType === "employment" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position/Job Title *
                </label>
                <input
                  type="text"
                  name="position"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.position}
                  onChange={handleInputChange}
                />
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Purpose & Requirements</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purpose of Clearance *
              </label>
              <textarea
                name="purpose"
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.purpose}
                onChange={handleInputChange}
                placeholder="Please specify the purpose for requesting this clearance..."
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">Required Documents</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Valid government-issued ID</li>
                <li>• Proof of residence (if applicable)</li>
                {clearanceType === "business" && <li>• Business registration documents</li>}
                {clearanceType === "employment" && <li>• Employment contract or offer letter</li>}
                <li>• Payment of processing fee: ₱{getFee()}</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-800 mb-2">Processing Information</h3>
              <div className="text-sm text-green-700 space-y-1">
                <div className="flex justify-between">
                  <span>Processing Time:</span>
                  <span className="font-medium">1-2 hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Fee:</span>
                  <span className="font-medium">₱{getFee()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Validity:</span>
                  <span className="font-medium">6 months</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <FaCertificate className="text-blue-600 text-2xl" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Confirm Clearance Details</h2>
            
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Type:</span> {clearanceType.charAt(0).toUpperCase() + clearanceType.slice(1)} Clearance</div>
                <div><span className="font-medium">Name:</span> {formData.firstName} {formData.middleName} {formData.lastName}</div>
                <div><span className="font-medium">Address:</span> {formData.address}</div>
                <div><span className="font-medium">Contact:</span> {formData.contactNumber}</div>
                {clearanceType === "business" && (
                  <>
                    <div><span className="font-medium">Company:</span> {formData.companyName}</div>
                    <div><span className="font-medium">Company Address:</span> {formData.companyAddress}</div>
                  </>
                )}
                {clearanceType === "employment" && (
                  <div><span className="font-medium">Position:</span> {formData.position}</div>
                )}
                <div><span className="font-medium">Purpose:</span> {formData.purpose}</div>
                <div><span className="font-medium">Fee:</span> ₱{getFee()}</div>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FaCheck className="text-sm" />
                  Issue Clearance
                </>
              )}
            </button>
          )}
        </div>
      </motion.form>
    </div>
  );
};

export default BarangayClearance;