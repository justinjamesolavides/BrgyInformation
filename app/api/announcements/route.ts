import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Mock database - in production, replace with actual database connection
let mockAnnouncements = [
  {
    id: 1,
    title: "Barangay General Assembly",
    content: "Join us for our monthly barangay general assembly this Saturday at 9:00 AM in the barangay hall. We will discuss upcoming projects and community concerns.",
    announcementType: "meeting",
    priority: "high",
    targetAudience: "all",
    postedBy: { id: 1, name: "Admin User" },
    isPublished: true,
    publishedAt: "2024-01-15T08:00:00Z",
    expiresAt: "2024-01-20T23:59:59Z",
    attachments: [],
    createdAt: "2024-01-14T10:00:00Z"
  },
  {
    id: 2,
    title: "COVID-19 Vaccination Schedule",
    content: "Free COVID-19 booster shots are now available at the barangay health center. Walk-ins welcome. Please bring valid ID.",
    announcementType: "emergency",
    priority: "urgent",
    targetAudience: "residents",
    postedBy: { id: 2, name: "Staff User" },
    isPublished: true,
    publishedAt: "2024-01-16T09:00:00Z",
    expiresAt: "2024-01-25T23:59:59Z",
    attachments: [],
    createdAt: "2024-01-16T08:30:00Z"
  },
  {
    id: 3,
    title: "New Barangay Ordinance",
    content: "A new ordinance regarding waste management has been approved. Please review the attached document for details.",
    announcementType: "general",
    priority: "medium",
    targetAudience: "all",
    postedBy: { id: 1, name: "Admin User" },
    isPublished: false,
    publishedAt: null,
    expiresAt: null,
    attachments: [{ name: "ordinance.pdf", url: "/files/ordinance.pdf" }],
    createdAt: "2024-01-17T14:20:00Z"
  }
];

// GET /api/announcements - Get all announcements
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const audience = searchParams.get('audience');
    const published = searchParams.get('published');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    let filteredAnnouncements = [...mockAnnouncements];

    // Apply type filter
    if (type && type !== 'all') {
      filteredAnnouncements = filteredAnnouncements.filter(announcement =>
        announcement.announcementType === type
      );
    }

    // Apply audience filter
    if (audience && audience !== 'all') {
      filteredAnnouncements = filteredAnnouncements.filter(announcement =>
        announcement.targetAudience === audience
      );
    }

    // Apply published filter
    if (published !== null) {
      const isPublished = published === 'true';
      filteredAnnouncements = filteredAnnouncements.filter(announcement =>
        announcement.isPublished === isPublished
      );
    }

    // Sort by published date (newest first)
    filteredAnnouncements.sort((a, b) => {
      const dateA = a.publishedAt || a.createdAt;
      const dateB = b.publishedAt || b.createdAt;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

    // Apply pagination
    const total = filteredAnnouncements.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAnnouncements = filteredAnnouncements.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedAnnouncements,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}

// POST /api/announcements - Create a new announcement
export async function POST(request: NextRequest) {
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

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'content', 'announcementType'];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          fields: missingFields
        },
        { status: 400 }
      );
    }

    // Create new announcement
    const newAnnouncement = {
      id: Math.max(...mockAnnouncements.map(a => a.id), 0) + 1,
      title: body.title,
      content: body.content,
      announcementType: body.announcementType,
      priority: body.priority || 'medium',
      targetAudience: body.targetAudience || 'all',
      postedBy: body.postedBy || { id: 1, name: "Admin User" },
      isPublished: body.isPublished || false,
      publishedAt: body.isPublished ? new Date().toISOString() : null,
      expiresAt: body.expiresAt || null,
      attachments: body.attachments || [],
      createdAt: new Date().toISOString()
    };

    // Add to mock database
    mockAnnouncements.push(newAnnouncement);

    return NextResponse.json({
      success: true,
      data: newAnnouncement,
      message: 'Announcement created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json(
      { error: 'Failed to create announcement' },
      { status: 500 }
    );
  }
}