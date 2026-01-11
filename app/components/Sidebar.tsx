import Link from "next/link";
import React from "react";
import ThemeToggle from "./ThemeToggle";

const Sidebar: React.FC = () => {
  return (
    <div className="h-screen w-64 bg-gray-900 text-white fixed">

      {/* Logo */}
      <div className="p-6 border-b border-gray-700 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">Brgy System</span>
          <ThemeToggle />
        </div>
      </div>

      {/* Menu */}
      <nav className="mt-6 flex flex-col">

        <Link
          href="/dashboard"
          className="px-6 py-3 hover:bg-gray-700"
        >
          Dashboard
        </Link>

        <Link
          href="/users"
          className="px-6 py-3 hover:bg-gray-700"
        >
          Users
        </Link>

        <Link
          href="/reports"
          className="px-6 py-3 hover:bg-gray-700"
        >
          Reports
        </Link>

        <Link
          href="/settings"
          className="px-6 py-3 hover:bg-gray-700"
        >
          Settings
        </Link>

      </nav>

    </div>
  );
};

export default Sidebar;
