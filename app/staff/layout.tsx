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
        <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-900">
          {/* Persistent Sidebar */}
          <StaffSidebar />
          
          {/* Main Content Area */}
          <div className="ml-64 flex-1">
            {children}
          </div>
        </div>
      )}
    </StaffAuthGuard>
  );
}
