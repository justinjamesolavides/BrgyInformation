"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface StaffAuthGuardProps {
  children: (user: User) => React.ReactNode;
  requireStaff?: boolean;
}

const StaffAuthGuard: React.FC<StaffAuthGuardProps> = ({
  children,
  requireStaff = true
}) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();

      if (data.authenticated) {
        if (requireStaff && data.user.role !== 'staff') {
          // If staff access required and user is not staff, redirect to appropriate dashboard
          router.push(data.user.role === 'admin' ? '/admin/dashboard' : '/login');
          return;
        }
        setUser(data.user);
      } else {
        router.push('/login');
        return;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
      return;
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return <>{children(user)}</>;
};

export default StaffAuthGuard;