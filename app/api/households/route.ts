import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Mock database - in production, replace with actual database connection
let mockHouseholds = [
  {
    id: 1,
    householdId: "HH-001",
    headOfHousehold: {
      id: 1,
      name: "Juan Dela Cruz",
      relationship: "head"
    },
    address: "123 Main St, Barangay Central",
    contactNumber: "+63 917 123 4567",
    householdType: "nuclear",
    economicStatus: "middle",
    totalMembers: 4,
    members: [
      { id: 1, name: "Juan Dela Cruz", relationship: "head", age: 45 },
      { id: 2, name: "Maria Dela Cruz", relationship: "spouse", age: 42 },
      { id: 3, name: "Pedro Dela Cruz Jr.", relationship: "child", age: 18 },
      { id: 4, name: "Ana Dela Cruz", relationship: "child", age: 15 }
    ],
    barangayId: "BRGY-001",
    status: "active",
    createdAt: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    householdId: "HH-002",
    headOfHousehold: {
      id: 5,
      name: "Carlos Mendoza",
      relationship: "head"
    },
    address: "654 Maple Dr, Barangay West",
    contactNumber: "+63 921 567 8901",
    householdType: "extended",
    economicStatus: "high",
    totalMembers: 6,
    members: [
      { id: 5, name: "Carlos Mendoza", relationship: "head", age: 52 },
      { id: 6, name: "Elena Mendoza", relationship: "spouse", age: 50 },
      { id: 7, name: "Miguel Mendoza", relationship: "child", age: 25 },
      { id: 8, name: "Rosa Mendoza", relationship: "child", age: 22 },
      { id: 9, name: "Antonio Mendoza Sr.", relationship: "parent", age: 78 },
      { id: 10, name: "Carmen Mendoza", relationship: "parent", age: 75 }
    ],
    barangayId: "BRGY-002",
    status: "active",
    createdAt: "2024-02-20T14:30:00Z"
  }
];

// Helper function to generate next household ID
function generateHouseholdId(): string {
  const existingIds = mockHouseholds
    .map(h => h.householdId)
    .filter(id => id && id.startsWith('HH-'))
    .map(id => parseInt(id.replace('HH-', '')))
    .filter(num => !isNaN(num));

  const nextNum = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
  return `HH-${nextNum.toString().padStart(3, '0')}`;
}

// GET /api/households - Get all households with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    let filteredHouseholds = [...mockHouseholds];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredHouseholds = filteredHouseholds.filter(household =>
        household.householdId.toLowerCase().includes(searchLower) ||
        household.address.toLowerCase().includes(searchLower) ||
        household.headOfHousehold.name.toLowerCase().includes(searchLower) ||
        household.members.some(member =>
          member.name.toLowerCase().includes(searchLower)
        )
      );
    }

    // Apply status filter
    if (status && status !== 'all') {
      filteredHouseholds = filteredHouseholds.filter(household => household.status === status);
    }

    // Apply type filter
    if (type && type !== 'all') {
      filteredHouseholds = filteredHouseholds.filter(household => household.householdType === type);
    }

    // Apply pagination
    const total = filteredHouseholds.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedHouseholds = filteredHouseholds.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedHouseholds,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching households:', error);
    return NextResponse.json(
      { error: 'Failed to fetch households' },
      { status: 500 }
    );
  }
}

// POST /api/households - Create a new household
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
    const requiredFields = ['address', 'headOfHousehold'];
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

    // Create new household
    const newHousehold = {
      id: Math.max(...mockHouseholds.map(h => h.id), 0) + 1,
      householdId: body.householdId || generateHouseholdId(),
      headOfHousehold: body.headOfHousehold,
      address: body.address,
      contactNumber: body.contactNumber || null,
      householdType: body.householdType || 'nuclear',
      economicStatus: body.economicStatus || 'middle',
      totalMembers: body.members ? body.members.length : 1,
      members: body.members || [body.headOfHousehold],
      barangayId: body.barangayId || 'BRGY-001',
      status: 'active',
      createdAt: new Date().toISOString()
    };

    // Add to mock database
    mockHouseholds.push(newHousehold);

    return NextResponse.json({
      success: true,
      data: newHousehold,
      message: 'Household created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating household:', error);
    return NextResponse.json(
      { error: 'Failed to create household' },
      { status: 500 }
    );
  }
}