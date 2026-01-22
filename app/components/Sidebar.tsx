import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FaTachometerAlt, FaUsers, FaFileAlt, FaCog, FaHome, FaBullhorn, FaUserCog, FaPlus } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navigationItems = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: <FaTachometerAlt />
    },
    {
      href: "/admin/residents",
      label: "Residents",
      icon: <FaUsers />
    },
    {
      href: "/admin/households",
      label: "Households",
      icon: <FaHome />
    },
    {
      href: "/admin/announcements",
      label: "Announcements",
      icon: <FaBullhorn />
    },

    {
      href: "/admin/users",
      label: "User Management",
      icon: <FaUserCog />
    },
    {
      href: "/admin/reports",
      label: "Reports",
      icon: <FaFileAlt />
    },
    {
      href: "/admin/settings",
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
    <div className="h-full w-full flex flex-col bg-white">

      {/* Logo Section */}
      <div className="sidebar-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Barangay</h1>
            <p className="text-xs text-gray-500">Management System</p>
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav flex-1">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-nav-item ${
                isActive(item.href) ? 'active bg-blue-50 text-blue-700 font-semibold' : ''
              }`}
            >
              <div className="flex-shrink-0">
                {item.icon}
              </div>
              <span>{item.label}</span>
              {isActive(item.href) && (
                <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Admin Panel v1.0
        </div>
      </div>

    </div>
  );
};

export default Sidebar;
