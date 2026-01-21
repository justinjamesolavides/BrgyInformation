"use client";

import React from "react";
import StaffAuthGuard from "../components/StaffAuthGuard";
import StaffSidebar from "../components/StaffSidebar";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StaffAuthGuard requireStaff={true}>
      {(user) => (
        <div className="flex min-h-screen bg-white">
          {/* Modern Sidebar */}
          <div className="sidebar fixed left-0 top-0 h-full w-64 z-30">
            <StaffSidebar />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 ml-64">
            <div className="page-container">
              {children}
            </div>
          </div>
        </div>
      )}
    </StaffAuthGuard>
  );
}
