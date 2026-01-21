"use client";

import React from "react";
import AdminAuthGuard from "../components/AdminAuthGuard";
import Sidebar from "../components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard requireAdmin={true}>
      {(user) => (
        <div className="flex min-h-screen bg-white">
          {/* Modern Sidebar */}
          <div className="sidebar fixed left-0 top-0 h-full w-64 z-30">
            <Sidebar />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 ml-64">
            <div className="page-container">
              {children}
            </div>
          </div>
        </div>
      )}
    </AdminAuthGuard>
  );
}
