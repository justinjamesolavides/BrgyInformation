"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const DashboardRedirect: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();

        if (data.authenticated) {
          // Redirect based on user role
          if (data.user.role === 'admin') {
            router.push('/admin/dashboard');
          } else if (data.user.role === 'staff') {
            router.push('/staff/dashboard');
          } else {
            // Default fallback
            router.push('/admin/dashboard');
          }
        } else {
          // Not authenticated, redirect to login
          router.push('/login');
        }
      } catch (error) {
        console.error('Role check failed:', error);
        router.push('/login');
      }
    };

    checkUserRole();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
};

export default DashboardRedirect;