import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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

// GET /api/requests/[id] - Get a specific request
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid request ID' },
        { status: 400 }
      );
    }

    const requests: any[] = await getRequests();
    const requestItem = requests.find((r: any) => r.id === id);

    if (!requestItem) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: requestItem
    });

  } catch (error) {
    console.error('Error fetching request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch request' },
      { status: 500 }
    );
  }
}

// PUT /api/requests/[id] - Update a request (approve/reject)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid request ID' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.status || !['pending', 'approved', 'rejected'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Valid status is required (pending, approved, rejected)' },
        { status: 400 }
      );
    }

    const allRequests: any[] = await getRequests();
    const requestIndex = allRequests.findIndex((r: any) => r.id === id);

    if (requestIndex === -1) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      );
    }

    // Update the request
    const updatedRequest = {
      ...allRequests[requestIndex],
      status: body.status,
      updatedAt: new Date().toISOString()
    };

    allRequests[requestIndex] = updatedRequest;
    await saveRequests(allRequests);

    return NextResponse.json({
      success: true,
      data: updatedRequest
    });

  } catch (error) {
    console.error('Error updating request:', error);
    return NextResponse.json(
      { error: 'Failed to update request' },
      { status: 500 }
    );
  }
}

// DELETE /api/requests/[id] - Delete a request
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid request ID' },
        { status: 400 }
      );
    }

    const allRequests: any[] = await getRequests();
    const filteredRequests = allRequests.filter((r: any) => r.id !== id);

    if (filteredRequests.length === allRequests.length) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      );
    }

    await saveRequests(filteredRequests);

    return NextResponse.json({
      success: true,
      message: 'Request deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting request:', error);
    return NextResponse.json(
      { error: 'Failed to delete request' },
      { status: 500 }
    );
  }
}