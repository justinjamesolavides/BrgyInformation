import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { usersStorage } from '../../../../lib/fileStorage';

// Activity log storage
let activityLog: any[] = [];

// Initialize activity log from file if exists
async function getActivityLog() {
  try {
    const fs = require('fs');
    const path = require('path');
    const logPath = path.join(process.cwd(), 'data', 'activities.json');
    if (fs.existsSync(logPath)) {
      const data = fs.readFileSync(logPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    // Fallback to in-memory
  }
  return activityLog;
}

// Save activity log to file
async function saveActivityLog(log: any[]) {
  try {
    const fs = require('fs');
    const path = require('path');
    const logPath = path.join(process.cwd(), 'data', 'activities.json');
    const dir = path.dirname(logPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(logPath, JSON.stringify(log, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving activity log:', error);
  }
}

// GET /api/dashboard/activities - Get recent activities
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

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month';
    const limit = parseInt(searchParams.get('limit') || '10');

    const log = await getActivityLog();

    // Filter by period
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const filteredActivities = log
      .filter((activity: any) => {
        const activityDate = new Date(activity.timestamp || activity.createdAt || 0);
        return activityDate >= startDate;
      })
      .sort((a: any, b: any) => {
        const dateA = new Date(a.timestamp || a.createdAt || 0);
        const dateB = new Date(b.timestamp || b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, limit);

    // Format activities for frontend
    const formattedActivities = filteredActivities.map((activity: any) => {
      const timestamp = new Date(activity.timestamp || activity.createdAt || Date.now());
      const timeDiff = now.getTime() - timestamp.getTime();
      const minutes = Math.floor(timeDiff / (1000 * 60));
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      let timeAgo = '';
      if (minutes < 1) {
        timeAgo = 'Just now';
      } else if (minutes < 60) {
        timeAgo = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      } else if (hours < 24) {
        timeAgo = `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else {
        timeAgo = `${days} day${days > 1 ? 's' : ''} ago`;
      }

      return {
        id: activity.id || Math.random(),
        type: activity.type || 'system',
        title: activity.title || activity.message || 'Activity',
        user: activity.user || activity.userName || 'System',
        time: timeAgo,
        status: activity.status || 'completed',
        icon: activity.icon || null,
        timestamp: timestamp.toISOString()
      };
    });

    // If no activities, return some default ones
    if (formattedActivities.length === 0) {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    return NextResponse.json({
      success: true,
      data: formattedActivities
    });

  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}

// POST /api/dashboard/activities - Create a new activity (called by other APIs)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const log = await getActivityLog();
    
    const newActivity = {
      id: log.length > 0 ? Math.max(...log.map((a: any) => a.id || 0)) + 1 : 1,
      type: body.type || 'system',
      title: body.title || body.message || 'Activity',
      user: body.user || body.userName || 'System',
      status: body.status || 'completed',
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      ...body
    };

    log.push(newActivity);
    await saveActivityLog(log);

    return NextResponse.json({
      success: true,
      data: newActivity
    });

  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { error: 'Failed to create activity' },
      { status: 500 }
    );
  }
}
