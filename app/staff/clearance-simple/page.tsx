"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaCertificate, FaUser, FaBuilding, FaFileAlt, FaCheck, FaTimes, FaPrint, FaSearch } from "react-icons/fa";

const BarangayClearance: React.FC = () => {
  const [clearanceType, setClearanceType] = useState<"residency" | "business" | "employment">("residency");
  const [residentSearch, setResidentSearch] = useState("");
  const [selectedResident, setSelectedResident] = useState<any>(null);
  const [formData, setFormData] = useState({
    purpose: "",
    firstName: "",
    lastName: "",
    middleName: "",
    address: "",
    birthDate: "",
    gender: "",
    civilStatus: "",
    companyName: "",
    companyAddress: "",
    position: ""
  });
  const [step, setStep] = useState(1);
  const printRef = useRef<HTMLDivElement>(null);

  const handleResidentSearch = (search: string) => {
    setResidentSearch(search);
    // Mock resident data for demo
    if (search.length > 2) {
      const mockResidents = [
        {
          id: 1,
          firstName: "Juan",
          lastName: "Dela Cruz",
          middleName: "Santos",
          address: "123 Main St, Barangay San Isidro, Sample City",
          birthDate: "1990-05-15",
          gender: "Male",
          civilStatus: "Married"
        },
        {
          id: 2,
          firstName: "Maria",
          lastName: "Reyes",
          middleName: "Garcia",
          address: "456 Oak St, Barangay San Isidro, Sample City",
          birthDate: "1985-08-22",
          gender: "Female",
          civilStatus: "Single"
        }
      ];
      
      const found = mockResidents.find(r => 
        r.firstName.toLowerCase().includes(search.toLowerCase()) ||
        r.lastName.toLowerCase().includes(search.toLowerCase())
      );
      
      if (found) {
        setSelectedResident(found);
        setFormData({
          ...formData,
          firstName: found.firstName,
          lastName: found.lastName,
          middleName: found.middleName,
          address: found.address,
          birthDate: found.birthDate,
          gender: found.gender,
          civilStatus: found.civilStatus
        });
      }
    }
  };

  const printClearance = () => {
    const printContent = printRef.current;
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  const getFee = () => {
    switch(clearanceType) {
      case "residency": return 50;
      case "business": return 100;
      case "employment": return 75;
      default: return 50;
    }
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return "";
    const age = Math.floor((new Date().getTime() - new Date(birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365));
    return `${age} years old`;
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
            <p className="text-gray-600">Simple 3-step clearance processing</p>
          </div>
        </div>
      </motion.div>

      {/* Step 1: Select Type */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-6 text-center">Select Clearance Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { type: "residency", title: "Residency", desc: "Proof of residence", icon: <FaUser />, fee: 50 },
              { type: "business", title: "Business", desc: "Business operations", icon: <FaBuilding />, fee: 100 },
              { type: "employment", title: "Employment", desc: "Job applications", icon: <FaFileAlt />, fee: 75 }
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => {
                  setClearanceType(item.type as any);
                  setStep(2);
                }}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
              >
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.desc}</p>
                <div className="text-lg font-bold text-blue-600">₱{item.fee}</div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Step 2: Find Resident */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-6 text-center">Find Resident</h2>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="relative mb-4">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search resident by name..."
                value={residentSearch}
                onChange={(e) => handleResidentSearch(e.target.value)}
              />
            </div>
            
            {selectedResident && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border border-green-200 rounded-lg p-4"
              >
                <h3 className="font-medium text-green-800 mb-3">Resident Found ✓</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="font-medium">Name:</span> {selectedResident.firstName} {selectedResident.middleName} {selectedResident.lastName}</div>
                  <div><span className="font-medium">Age:</span> {calculateAge(selectedResident.birthDate)}</div>
                  <div><span className="font-medium">Gender:</span> {selectedResident.gender}</div>
                  <div><span className="font-medium">Civil Status:</span> {selectedResident.civilStatus}</div>
                  <div className="col-span-2"><span className="font-medium">Address:</span> {selectedResident.address}</div>
                </div>
                <button
                  onClick={() => setStep(3)}
                  className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Use This Resident →
                </button>
              </motion.div>
            )}
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              ← Back
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Enter Purpose & Print */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-6 text-center">Complete Clearance</h2>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  value={`${formData.firstName} ${formData.middleName} ${formData.lastName}`}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  value={calculateAge(formData.birthDate)}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  value={formData.gender}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Place of Residence</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  value={formData.address}
                  readOnly
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Purpose *</label>
              <textarea
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.purpose}
                onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                placeholder="Enter the purpose of this clearance..."
              />
            </div>
            
            {clearanceType === "business" && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Address *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.companyAddress}
                    onChange={(e) => setFormData({...formData, companyAddress: e.target.value})}
                  />
                </div>
              </>
            )}
            
            {clearanceType === "employment" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                />
              </div>
            )}
          </div>
          
          {/* Printable Document Preview */}
          <div ref={printRef} className="bg-white p-8 border-2 border-gray-300 rounded-lg mb-6 hidden print:block">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">BARANGAY SAN ISIDRO</h1>
              <p className="text-gray-700">Municipality of Sample City</p>
              <p className="text-gray-700">Province of Sample Province</p>
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-gray-900 border-b-2 border-gray-900 pb-2 inline-block">
                {clearanceType === "residency" && "CERTIFICATE OF RESIDENCY"}
                {clearanceType === "business" && "BUSINESS CLEARANCE"}
                {clearanceType === "employment" && "CERTIFICATE OF EMPLOYMENT"}
              </h2>
            </div>
            
            <div className="mb-8 text-gray-800 leading-relaxed">
              <p className="mb-4">TO WHOM IT MAY CONCERN:</p>
              
              <p className="mb-4 indent-8">
                This is to certify that <span className="font-semibold">
                  {formData.firstName} {formData.middleName} {formData.lastName}
                </span>, {calculateAge(formData.birthDate)}, {formData.gender?.toLowerCase()}, 
                {formData.civilStatus?.toLowerCase()}, Filipino, is a bonafide resident of {formData.address}.
              </p>
              
              {clearanceType === "business" && formData.companyName && (
                <p className="mb-4 indent-8">
                  {formData.firstName} operates a business at {formData.companyName} located at {formData.companyAddress}.
                </p>
              )}
              
              {clearanceType === "employment" && formData.position && (
                <p className="mb-4 indent-8">
                  {formData.firstName} is employed as {formData.position}.
                </p>
              )}
              
              <p className="mb-4 indent-8">
                This certification is issued upon the request of the interested party for whatever legal purpose it may serve, 
                particularly for {formData.purpose || "official transactions"}.
              </p>
              
              <p className="mb-4 indent-8">
                This clearance is issued free from any derogatory record in our barangay files.
              </p>
              
              <p className="mb-4 indent-8">
                Issued this {new Date().getDate()} day of {new Date().toLocaleDateString('en-US', { month: 'long' })}, {new Date().getFullYear()} 
                at Barangay San Isidro, Municipality of Sample City, Province of Sample Province.
              </p>
            </div>
            
            <div className="flex justify-between mt-12">
              <div className="text-center">
                <div className="h-1 border-t border-gray-900 w-48 mx-auto mb-2"></div>
                <p className="font-semibold">BARANGAY CAPTAIN</p>
              </div>
              <div className="text-center">
                <div className="h-1 border-t border-gray-900 w-48 mx-auto mb-2"></div>
                <p className="font-semibold">RESIDENT</p>
              </div>
            </div>
            
            <div className="mt-8 text-xs text-gray-600 text-center">
              <p>Document Fee: ₱{getFee()} | Valid for 6 months</p>
              <p className="mt-1">Reference #: {clearanceType.toUpperCase().slice(0,3)}-{new Date().getFullYear()}-{String(Math.floor(Math.random() * 1000)).padStart(3, '0')}</p>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              ← Back
            </button>
            <div className="flex gap-2">
              <button
                onClick={printClearance}
                disabled={!formData.purpose || (clearanceType === "business" && (!formData.companyName || !formData.companyAddress)) || (clearanceType === "employment" && !formData.position)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FaPrint className="text-sm" />
                Print Clearance
              </button>
              <button
                onClick={() => {
                  setStep(1);
                  setFormData({
                    purpose: "",
                    firstName: "",
                    lastName: "",
                    middleName: "",
                    address: "",
                    birthDate: "",
                    gender: "",
                    civilStatus: "",
                    companyName: "",
                    companyAddress: "",
                    position: ""
                  });
                  setSelectedResident(null);
                  setResidentSearch("");
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                New
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BarangayClearance;