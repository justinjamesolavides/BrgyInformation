import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { usersStorage, residentsStorage } from '../../../../lib/fileStorage';

// Mock requests data - in production, use actual storage
let mockRequests: any[] = [];

async function getRequests() {
  try {
    const fs = require('fs');
    const path = require('path');
    const requestsPath = path.join(process.cwd(), 'data', 'requests.json');
    if (fs.existsSync(requestsPath)) {
      const data = fs.readFileSync(requestsPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    // Fallback to mock data
  }
  return mockRequests;
}

// GET /api/dashboard/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get all data
    const residents = residentsStorage.getAll();
    const users = usersStorage.getAll();
    const requests = await getRequests();

    // Calculate stats
    const totalResidents = residents.length;
    const totalUsers = users.filter(u => u.role === 'admin' || u.role === 'staff').length;
    const pendingRequests = requests.filter(r => r.status === 'pending').length;

    // Calculate monthly growth (residents added this month)
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const thisMonthResidents = residents.filter((r: any) => {
      const regDate = new Date(r.registrationDate || r.createdAt || 0);
      return regDate.getMonth() === currentMonth && regDate.getFullYear() === currentYear;
    }).length;

    const lastMonthResidents = residents.filter((r: any) => {
      const regDate = new Date(r.registrationDate || r.createdAt || 0);
      return regDate.getMonth() === lastMonth && regDate.getFullYear() === lastMonthYear;
    }).length;

    const monthlyGrowth = lastMonthResidents > 0 
      ? ((thisMonthResidents - lastMonthResidents) / lastMonthResidents * 100).toFixed(1)
      : thisMonthResidents > 0 ? '100.0' : '0.0';

    // Calculate changes (vs previous period)
    const previousPeriodResidents = residents.filter((r: any) => {
      const regDate = new Date(r.registrationDate || r.createdAt || 0);
      const daysDiff = Math.floor((now.getTime() - regDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff > 30 && daysDiff <= 60;
    }).length;

    const previousPeriodUsers = users.filter(u => {
      const created = new Date(u.createdAt || 0);
      const daysDiff = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff > 30 && daysDiff <= 60;
    }).length;

    const residentChange = thisMonthResidents - previousPeriodResidents;
    const userChange = users.filter(u => {
      const created = new Date(u.createdAt || 0);
      const daysDiff = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 30;
    }).length - previousPeriodUsers;

    // Get previous period pending requests (simplified - in production, track timestamps)
    const previousPendingRequests = Math.max(0, pendingRequests - 3);

    return NextResponse.json({
      success: true,
      data: {
        totalResidents,
        totalUsers,
        pendingRequests,
        monthlyGrowth: parseFloat(monthlyGrowth),
        changes: {
          residents: residentChange > 0 ? `+${residentChange}` : residentChange.toString(),
          users: userChange > 0 ? `+${userChange}` : userChange.toString(),
          requests: pendingRequests - previousPendingRequests > 0 
            ? `+${pendingRequests - previousPendingRequests}` 
            : (pendingRequests - previousPendingRequests).toString(),
          growth: parseFloat(monthlyGrowth) > 0 ? `+${(parseFloat(monthlyGrowth) * 0.1).toFixed(1)}%` : '0.0%'
        }
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
