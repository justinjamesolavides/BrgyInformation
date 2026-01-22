import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Notification storage
let notifications: any[] = [];

// Initialize notifications from file if exists
async function getNotifications() {
  try {
    const fs = require('fs');
    const path = require('path');
    const notifPath = path.join(process.cwd(), 'data', 'notifications.json');
    if (fs.existsSync(notifPath)) {
      const data = fs.readFileSync(notifPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    // Fallback to in-memory
  }
  return notifications;
}

// Save notifications to file
async function saveNotifications(notifs: any[]) {
  try {
    const fs = require('fs');
    const path = require('path');
    const notifPath = path.join(process.cwd(), 'data', 'notifications.json');
    const dir = path.dirname(notifPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(notifPath, JSON.stringify(notifs, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving notifications:', error);
  }
}

// GET /api/dashboard/notifications - Get notifications
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

    const notifs = await getNotifications();
    
    // Sort by timestamp (newest first)
    const sortedNotifs = notifs.sort((a, b) => {
      const dateA = new Date(a.timestamp || a.createdAt || 0);
      const dateB = new Date(b.timestamp || b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    });

    const unreadCount = sortedNotifs.filter(n => !n.read).length;

    return NextResponse.json({
      success: true,
      data: {
        notifications: sortedNotifs,
        unreadCount
      }
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// POST /api/dashboard/notifications - Create a new notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const notifs = await getNotifications();
    
    const newNotification = {
      id: notifs.length > 0 ? Math.max(...notifs.map((n: any) => n.id || 0)) + 1 : 1,
      type: body.type || 'info',
      title: body.title || 'Notification',
      message: body.message || '',
      read: false,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      ...body
    };

    notifs.push(newNotification);
    await saveNotifications(notifs);

    return NextResponse.json({
      success: true,
      data: newNotification
    });

  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

// PUT /api/dashboard/notifications/[id] - Mark notification as read
export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, read } = body;

    const notifs = await getNotifications();
    const index = notifs.findIndex((n: any) => n.id === id || n.id === parseInt(id));

    if (index === -1) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    notifs[index].read = read !== undefined ? read : true;
    notifs[index].updatedAt = new Date().toISOString();
    await saveNotifications(notifs);

    return NextResponse.json({
      success: true,
      data: notifs[index]
    });

  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}
