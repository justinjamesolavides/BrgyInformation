import { NextRequest } from 'next/server';
import notificationService from '../../../lib/notificationService';

// Simple in-memory storage for last check times (in production, use Redis or database)
const lastCheckTimes = new Map<number, number>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get('userId') || '0');
    const lastCheck = parseInt(searchParams.get('lastCheck') || '0');
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Get user's notifications
    const userNotifications = notificationService.getUserNotifications(userId);
    
    // Filter notifications newer than last check
    const newNotifications = userNotifications.filter(notification => {
      const notificationTime = new Date(notification.timestamp).getTime();
      return notificationTime > lastCheck;
    });
    
    // Update last check time
    lastCheckTimes.set(userId, Date.now());
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        notifications: newNotifications,
        lastCheck: Date.now()
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('Polling API Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch notifications', 
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}