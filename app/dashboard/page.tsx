import React from "react";
import Sidebar from "../components/Sidebar";

const Dashboard: React.FC = () => {
  return (
    <div className="flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 p-6 w-full bg-gray-100 min-h-screen">

        <h1 className="text-3xl font-bold mb-6">
          Barangay Dashboard
        </h1>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2>Total Residents</h2>
            <p className="text-3xl font-bold">1,200</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2>Registered Users</h2>
            <p className="text-3xl font-bold">350</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2>Pending Requests</h2>
            <p className="text-3xl font-bold">15</p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
