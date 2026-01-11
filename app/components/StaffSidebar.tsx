import Link from "next/link";
import React from "react";
import ThemeToggle from "./ThemeToggle";

const StaffSidebar: React.FC = () => {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white fixed">

      {/* Logo */}
      <div className="p-6 border-b border-gray-700 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">Brgy System (Staff)</span>
          <ThemeToggle />
        </div>
      </div>

      {/* Menu */}
      <nav className="mt-6 flex flex-col">

        <Link href="/staff" className="px-6 py-3 hover:bg-gray-700">
          Dashboard
        </Link>

        <Link href="/staff/residents" className="px-6 py-3 hover:bg-gray-700">
          Residents
        </Link>

        <Link href="/staff/requests" className="px-6 py-3 hover:bg-gray-700">
          Requests
        </Link>

        <Link href="/staff/announcements" className="px-6 py-3 hover:bg-gray-700">
          Announcements
        </Link>

        <Link href="/staff/profile" className="px-6 py-3 hover:bg-gray-700">
          Profile
        </Link>

        <Link href="/logout" className="px-6 py-3 hover:bg-gray-700">
          Logout
        </Link>

      </nav>
    </div>
  );
};

export default StaffSidebar;
