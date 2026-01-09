import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Barangay Dashboard
        </h1>
        <p className="text-gray-600">
          Overview of barangay information
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">
            Total Residents
          </h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            1,200
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">
            Registered Users
          </h2>
          <p className="text-3xl font-bold text-green-600 mt-2">
            350
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">
            Pending Requests
          </h2>
          <p className="text-3xl font-bold text-red-600 mt-2">
            15
          </p>
        </div>

      </div>

      {/* Recent Activity */}
      <div className="bg-white mt-8 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Recent Activity
        </h2>

        <ul className="space-y-3 text-gray-700">
          <li className="border-b pb-2">
            Juan Dela Cruz registered
          </li>
          <li className="border-b pb-2">
            Maria requested barangay clearance
          </li>
          <li>
            Admin approved a request
          </li>
        </ul>
      </div>

    </div>
  );
};

export default Dashboard;
