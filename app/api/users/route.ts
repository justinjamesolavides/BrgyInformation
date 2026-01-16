import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { usersStorage } from '../../../lib/fileStorage';

// Initialize with default users if storage is empty or missing passwords
const initializeDefaultUsers = () => {
  const existingUsers = usersStorage.getAll();

  // Check if default users exist and have passwords
  const adminUser = existingUsers.find(u => u.email === 'admin@brgy.com');
  const staffUser = existingUsers.find(u => u.email === 'staff@brgy.com');

  // Add admin user if missing or missing password
  if (!adminUser || !adminUser.password) {
    if (adminUser) {
      // Update existing admin user to add password
      usersStorage.update(adminUser.id, { password: "demo123" });
    } else {
      // Create new admin user
      usersStorage.create({
        firstName: "Admin",
        lastName: "User",
        email: "admin@brgy.com",
        phone: "+63 917 123 4567",
        password: "demo123",
        role: "admin",
        status: "active",
        barangayId: "BRGY-001"
      });
    }
  }

  // Add staff user if missing or missing password
  if (!staffUser || !staffUser.password) {
    if (staffUser) {
      // Update existing staff user to add password
      usersStorage.update(staffUser.id, { password: "staff123" });
    } else {
      // Create new staff user
      usersStorage.create({
        firstName: "Staff",
        lastName: "User",
        email: "staff@brgy.com",
        phone: "+63 918 234 5678",
        password: "staff123",
        role: "staff",
        status: "active",
        barangayId: "BRGY-001"
      });
    }
  }
};

// Initialize default users on module load
initializeDefaultUsers();

// GET /api/users - Get all users with optional filtering
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
    const search = searchParams.get('search');
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    let allUsers = usersStorage.getAll();
    let filteredUsers = [...allUsers];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchLower)
      );
    }

    // Apply role filter
    if (role && role !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }

    // Apply status filter
    if (status && status !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.status === status);
    }

    // Apply pagination
    const total = filteredUsers.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedUsers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
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

    // Check if user is admin (only admins can create users)
    const sessionData = global.sessionStore?.get(sessionToken);
    if (!sessionData || sessionData.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'role', 'password'];
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
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['admin', 'staff'].includes(body.role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be admin or staff' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (body.password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = usersStorage.findByEmail(body.email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = usersStorage.create({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone || null,
      password: body.password, // Store password for authentication
      role: body.role,
      status: 'active',
      barangayId: body.barangayId || 'BRGY-001'
    });

    return NextResponse.json({
      success: true,
      data: {
        ...newUser,
        password: undefined // Don't return password
      },
      message: 'User created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}