import React from "react";
import StaffSidebar from "../components/StaffSidebar";

const StaffDashboard: React.FC = () => {
  return (
    <div className="flex">

      {/* Sidebar */}
      <StaffSidebar />

      {/* Main Content */}
      <div className="ml-64 p-6 w-full bg-gray-100 min-h-screen">

        {/* Header */}
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          Staff Dashboard
        </h1>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">
              Total Residents
            </h2>
            <p className="text-3xl font-bold text-blue-600 mt-2">1,200</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">
              Pending Requests
            </h2>
            <p className="text-3xl font-bold text-red-600 mt-2">15</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">
              Approved Requests
            </h2>
            <p className="text-3xl font-bold text-green-600 mt-2">50</p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default StaffDashboard;
