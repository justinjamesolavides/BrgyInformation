import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Mock database - in production, replace with actual database connection
let mockResidents = [
  {
    id: 1,
    firstName: "Juan",
    lastName: "Dela Cruz",
    middleName: "Santos",
    email: "juan@example.com",
    phone: "+63 917 123 4567",
    address: "123 Main St, Barangay Central",
    barangayId: "BRGY-001",
    dateOfBirth: "1985-03-15",
    gender: "male" as const,
    civilStatus: "married" as const,
    occupation: "Teacher",
    emergencyContact: "Maria Dela Cruz",
    emergencyPhone: "+63 918 234 5678",
    status: "active" as const,
    registrationDate: "2024-01-15T10:00:00Z",
    avatar: "JD"
  },
  {
    id: 2,
    firstName: "Maria",
    lastName: "Santos",
    middleName: null,
    email: "maria@example.com",
    phone: "+63 918 234 5678",
    address: "456 Oak Ave, Barangay North",
    barangayId: "BRGY-002",
    dateOfBirth: "1990-07-22",
    gender: "female" as const,
    civilStatus: "single" as const,
    occupation: "Nurse",
    emergencyContact: "Juan Santos",
    emergencyPhone: "+63 917 123 4567",
    status: "active" as const,
    registrationDate: "2024-02-20T14:30:00Z",
    avatar: "MS"
  },
  {
    id: 3,
    firstName: "Pedro",
    lastName: "Garcia",
    middleName: "Reyes",
    email: "pedro@example.com",
    phone: "+63 919 345 6789",
    address: "789 Pine Rd, Barangay South",
    barangayId: "BRGY-003",
    dateOfBirth: "1978-11-08",
    gender: "male" as const,
    civilStatus: "married" as const,
    occupation: "Farmer",
    emergencyContact: "Rosa Garcia",
    emergencyPhone: "+63 920 456 7890",
    status: "inactive" as const,
    registrationDate: "2024-03-10T09:15:00Z",
    avatar: "PG"
  },
  {
    id: 4,
    firstName: "Ana",
    lastName: "Reyes",
    middleName: null,
    email: "ana@example.com",
    phone: "+63 920 456 7890",
    address: "321 Elm St, Barangay East",
    barangayId: "BRGY-004",
    dateOfBirth: "1995-05-30",
    gender: "female" as const,
    civilStatus: "single" as const,
    occupation: "Student",
    emergencyContact: "Carlos Reyes",
    emergencyPhone: "+63 921 567 8901",
    status: "active" as const,
    registrationDate: "2024-04-05T16:45:00Z",
    avatar: "AR"
  },
  {
    id: 5,
    firstName: "Carlos",
    lastName: "Mendoza",
    middleName: null,
    email: "carlos@example.com",
    phone: "+63 921 567 8901",
    address: "654 Maple Dr, Barangay West",
    barangayId: "BRGY-005",
    dateOfBirth: "1982-09-12",
    gender: "male" as const,
    civilStatus: "married" as const,
    occupation: "Driver",
    emergencyContact: "Elena Mendoza",
    emergencyPhone: "+63 922 678 9012",
    status: "active" as const,
    registrationDate: "2024-05-12T11:20:00Z",
    avatar: "CM"
  }
];

// Helper function to generate next ID
function getNextId(): number {
  const maxId = Math.max(...mockResidents.map(r => r.id), 0);
  return maxId + 1;
}

// Helper function to generate barangay ID
function generateBarangayId(): string {
  const existingIds = mockResidents
    .map(r => r.barangayId)
    .filter(id => id && id.startsWith('BRGY-'))
    .map(id => parseInt(id.replace('BRGY-', '')))
    .filter(num => !isNaN(num));

  const nextNum = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
  return `BRGY-${nextNum.toString().padStart(3, '0')}`;
}

// GET /api/residents - Get all residents with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const gender = searchParams.get('gender');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    let filteredResidents = [...mockResidents];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredResidents = filteredResidents.filter(resident =>
        resident.firstName.toLowerCase().includes(searchLower) ||
        resident.lastName.toLowerCase().includes(searchLower) ||
        resident.email.toLowerCase().includes(searchLower) ||
        resident.barangayId?.toLowerCase().includes(searchLower) ||
        resident.phone.includes(searchLower)
      );
    }

    // Apply status filter
    if (status && status !== 'all') {
      filteredResidents = filteredResidents.filter(resident => resident.status === status);
    }

    // Apply gender filter
    if (gender && gender !== 'all') {
      filteredResidents = filteredResidents.filter(resident => resident.gender === gender);
    }

    // Apply pagination
    const total = filteredResidents.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResidents = filteredResidents.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedResidents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching residents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch residents' },
      { status: 500 }
    );
  }
}

// POST /api/residents - Create a new resident
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
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'dateOfBirth', 'gender'];
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

    // Check if email already exists
    const existingEmail = mockResidents.find(r => r.email === body.email);
    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }

    // Generate avatar from first and last name initials
    const avatar = `${body.firstName.charAt(0)}${body.lastName.charAt(0)}`.toUpperCase();

    // Create new resident
    const newResident = {
      id: getNextId(),
      firstName: body.firstName,
      lastName: body.lastName,
      middleName: body.middleName || null,
      email: body.email,
      phone: body.phone,
      address: body.address,
      barangayId: body.barangayId || generateBarangayId(),
      dateOfBirth: body.dateOfBirth,
      gender: body.gender,
      civilStatus: body.civilStatus || null,
      occupation: body.occupation || null,
      emergencyContact: body.emergencyContact || null,
      emergencyPhone: body.emergencyPhone || null,
      status: 'active' as const,
      registrationDate: new Date().toISOString(),
      avatar
    };

    // Add to mock database
    mockResidents.push(newResident);

    return NextResponse.json({
      success: true,
      data: newResident,
      message: 'Resident created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating resident:', error);
    return NextResponse.json(
      { error: 'Failed to create resident' },
      { status: 500 }
    );
  }
}