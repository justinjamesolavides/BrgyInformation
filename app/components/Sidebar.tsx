import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FaTachometerAlt, FaUsers, FaFileAlt, FaCog } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navigationItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <FaTachometerAlt />
    },
    {
      href: "/residents",
      label: "Residents",
      icon: <FaUsers />
    },
    {
      href: "/reports",
      label: "Reports",
      icon: <FaFileAlt />
    },
    {
      href: "/settings",
      label: "Settings",
      icon: <FaCog />
    }
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="h-screen w-64 bg-white dark:bg-gray-900 text-gray-900 dark:text-white fixed border-r border-gray-200 dark:border-gray-700">

      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">Brgy System</span>
          <ThemeToggle />
        </div>
      </div>

      {/* Menu */}
      <nav className="mt-6 flex flex-col">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              isActive(item.href) ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              {item.label}
            </div>
          </Link>
        ))}
      </nav>

    </div>
  );
};

export default Sidebar;
