import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Mock database reference - in production, this would be imported from a database module
// For now, we'll access the mock data from the main route
const getMockResidents = () => {
  // This is a simplified approach - in production, use a proper database
  return [
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
};

// GET /api/residents/[id] - Get a specific resident
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid resident ID' },
        { status: 400 }
      );
    }

    const residents = getMockResidents();
    const resident = residents.find(r => r.id === id);

    if (!resident) {
      return NextResponse.json(
        { error: 'Resident not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: resident
    });

  } catch (error) {
    console.error('Error fetching resident:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resident' },
      { status: 500 }
    );
  }
}

// PUT /api/residents/[id] - Update a resident
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid resident ID' },
        { status: 400 }
      );
    }

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
    const residents = getMockResidents();
    const residentIndex = residents.findIndex(r => r.id === id);

    if (residentIndex === -1) {
      return NextResponse.json(
        { error: 'Resident not found' },
        { status: 404 }
      );
    }

    // Update resident (in production, this would update the database)
    const updatedResident = {
      ...residents[residentIndex],
      ...body,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    // In a real implementation, you would update the database here
    // For this demo, we'll just return success

    return NextResponse.json({
      success: true,
      data: updatedResident,
      message: 'Resident updated successfully'
    });

  } catch (error) {
    console.error('Error updating resident:', error);
    return NextResponse.json(
      { error: 'Failed to update resident' },
      { status: 500 }
    );
  }
}

// DELETE /api/residents/[id] - Delete a resident
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid resident ID' },
        { status: 400 }
      );
    }

    // Check authentication
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const residents = getMockResidents();
    const resident = residents.find(r => r.id === id);

    if (!resident) {
      return NextResponse.json(
        { error: 'Resident not found' },
        { status: 404 }
      );
    }

    // In a real implementation, you would delete from the database here
    // For this demo, we'll just return success

    return NextResponse.json({
      success: true,
      message: 'Resident deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting resident:', error);
    return NextResponse.json(
      { error: 'Failed to delete resident' },
      { status: 500 }
    );
  }
}