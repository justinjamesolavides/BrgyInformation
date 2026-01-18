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
        <div className="flex min-h-screen bg-white dark:bg-neutral-900">
          {/* Persistent Sidebar */}
          <Sidebar />
          
          {/* Main Content Area */}
          <div className="ml-64 flex-1">
            {children}
          </div>
        </div>
      )}
    </AdminAuthGuard>
  );
}
