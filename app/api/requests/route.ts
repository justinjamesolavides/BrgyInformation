import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { usersStorage } from '../../../lib/fileStorage';

// Mock requests data - in production, use actual storage
let mockRequests: any[] = [
  {
    id: 1,
    type: 'clearance',
    title: 'Barangay Clearance Certificate',
    description: 'Request for barangay clearance certificate for employment purposes.',
    requesterName: 'Juan Dela Cruz',
    requesterEmail: 'juan@example.com',
    requesterPhone: '+63 917 123 4567',
    requesterAddress: '123 Main St, Barangay Central',
    submittedDate: '2024-01-15T10:30:00',
    priority: 'high',
    status: 'pending',
    documents: ['Valid ID', 'Proof of Residence', 'Application Form'],
    notes: 'Urgent requirement for job application deadline next week.'
  },
  {
    id: 2,
    type: 'permit',
    title: 'Business Permit Application',
    description: 'Application for new business permit for small retail store.',
    requesterName: 'Maria Santos',
    requesterEmail: 'maria@example.com',
    requesterPhone: '+63 918 234 5678',
    requesterAddress: '456 Oak Ave, Barangay North',
    submittedDate: '2024-01-14T14:20:00',
    priority: 'medium',
    status: 'pending',
    documents: ['Business Plan', 'Location Sketch', 'DTI Registration'],
    notes: 'Business location inspection required.'
  }
];

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

async function saveRequests(requests: any[]) {
  try {
    const fs = require('fs');
    const path = require('path');
    const requestsPath = path.join(process.cwd(), 'data', 'requests.json');
    fs.writeFileSync(requestsPath, JSON.stringify(requests, null, 2));
  } catch (error) {
    // Fallback to in-memory storage
    mockRequests = requests;
  }
}

// GET /api/requests - Get all requests with optional filtering
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
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const priority = searchParams.get('priority');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    let allRequests = await getRequests();
    let filteredRequests = [...allRequests];

    // Apply filters
    if (status && status !== 'all') {
      filteredRequests = filteredRequests.filter(request => request.status === status);
    }
    if (type && type !== 'all') {
      filteredRequests = filteredRequests.filter(request => request.type === type);
    }
    if (priority && priority !== 'all') {
      filteredRequests = filteredRequests.filter(request => request.priority === priority);
    }

    // Apply pagination
    const total = filteredRequests.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedRequests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}

// POST /api/requests - Create a new request
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
    const requiredFields = ['type', 'requesterName', 'requesterEmail', 'requesterPhone', 'requesterAddress', 'purpose'];
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.requesterEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create new request
    const allRequests: any[] = await getRequests();
    const newRequest = {
      id: Math.max(...allRequests.map((r: any) => r.id), 0) + 1,
      type: body.type,
      title: body.title || `${body.type.charAt(0).toUpperCase() + body.type.slice(1)} Request`,
      description: body.purpose,
      requesterName: body.requesterName,
      requesterEmail: body.requesterEmail,
      requesterPhone: body.requesterPhone,
      requesterAddress: body.requesterAddress,
      submittedDate: new Date().toISOString(),
      priority: body.priority || 'medium',
      status: 'pending',
      documents: body.documents || [],
      notes: body.notes || '',
      purpose: body.purpose
    };

    const updatedRequests = [...allRequests, newRequest];
    await saveRequests(updatedRequests);

    // Create activity log entry
    try {
      await fetch(new URL('/api/dashboard/activities', request.url), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': request.headers.get('cookie') || ''
        },
        body: JSON.stringify({
          type: 'request',
          title: 'New Request Created',
          user: body.requesterName,
          status: 'completed',
          message: `New ${body.type} request has been submitted by ${body.requesterName}.`
        })
      }).catch(() => {}); // Don't fail if activity log fails
    } catch (error) {
      // Ignore activity log errors
    }

    return NextResponse.json({
      success: true,
      data: newRequest
    });

  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json(
      { error: 'Failed to create request' },
      { status: 500 }
    );
  }
}