# Residents Management System

## Overview

The Residents Management System allows administrators to manage barangay residents through a comprehensive interface with CRUD operations.

## Features

- ✅ **View Residents**: Paginated list with search and filtering
- ✅ **Add Residents**: Comprehensive form with validation
- ✅ **Edit Residents**: Update resident information
- ✅ **Delete Residents**: Remove residents from the system
- ✅ **Search & Filter**: Real-time search and status/gender filtering
- ✅ **Bulk Operations**: Select multiple residents for batch actions
- ✅ **Responsive Design**: Mobile-friendly interface

## Database Schema

### Residents Table

```sql
CREATE TABLE residents (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    barangay_id VARCHAR(50) UNIQUE,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    civil_status VARCHAR(20) CHECK (civil_status IN ('single', 'married', 'widowed', 'divorced')),
    occupation VARCHAR(100),
    emergency_contact VARCHAR(255),
    emergency_phone VARCHAR(20),
    status VARCHAR(10) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### GET /api/residents
Get all residents with optional filtering and pagination.

**Query Parameters:**
- `search`: Search term (name, email, barangay ID)
- `status`: Filter by status (`active`/`inactive`)
- `gender`: Filter by gender (`male`/`female`/`other`)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "pages": 3
  }
}
```

### POST /api/residents
Create a new resident.

**Request Body:**
```json
{
  "firstName": "Juan",
  "lastName": "Dela Cruz",
  "middleName": "Santos",
  "email": "juan@example.com",
  "phone": "+63 917 123 4567",
  "address": "123 Main St, Barangay Central",
  "barangayId": "BRGY-001",
  "dateOfBirth": "1985-03-15",
  "gender": "male",
  "civilStatus": "married",
  "occupation": "Teacher",
  "emergencyContact": "Maria Dela Cruz",
  "emergencyPhone": "+63 918 234 5678"
}
```

### GET /api/residents/[id]
Get a specific resident by ID.

### PUT /api/residents/[id]
Update a resident.

### DELETE /api/residents/[id]
Delete a resident.

## User Flow

1. **Access Residents Page**: Navigate to `/residents`
2. **View Residents**: See paginated list with search and filters
3. **Add Resident**: Click "Add Resident" button
4. **Fill Form**: Complete the comprehensive form with validation
5. **Submit**: Form submits to API with loading states
6. **Success**: Redirect back to residents list
7. **Refresh**: New resident appears in the list immediately

## Form Validation

### Required Fields
- First Name
- Last Name
- Email (valid format)
- Phone Number
- Complete Address
- Date of Birth
- Gender

### Optional Fields
- Middle Name
- Barangay ID (auto-generated if not provided)
- Civil Status
- Occupation
- Emergency Contact Information

## Error Handling

- **Field Validation**: Real-time validation with error messages
- **API Errors**: Network errors, duplicate emails, etc.
- **Loading States**: Visual feedback during operations
- **Success Feedback**: Confirmation messages before redirect

## Authentication

All resident management operations require authentication via session cookies. Unauthenticated users are redirected to the login page.

## Mobile Responsiveness

- **Responsive Grid**: Adapts to screen size
- **Touch-Friendly**: Appropriate touch targets
- **Mobile Forms**: Optimized form layouts
- **Swipe Gestures**: Planned for future enhancement

## Future Enhancements

- [ ] Bulk import/export functionality
- [ ] Advanced filtering options
- [ ] Resident profile pages
- [ ] Activity logging
- [ ] Photo upload for residents
- [ ] Relationship management (family members)
- [ ] Document attachments
- [ ] SMS/email notifications

## Testing

### Manual Testing Steps

1. **Login** as admin user
2. **Navigate** to `/residents`
3. **Test Search**: Search by name, email, barangay ID
4. **Test Filters**: Filter by status and gender
5. **Add Resident**: Click "Add Resident" and fill form
6. **Submit Form**: Verify success message and redirect
7. **Verify Addition**: Check new resident appears in list
8. **Test Pagination**: Add more residents to test pagination

### API Testing

```bash
# Get all residents
curl http://localhost:3000/api/residents

# Create resident
curl -X POST http://localhost:3000/api/residents \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","phone":"+1234567890","address":"Test Address","dateOfBirth":"1990-01-01","gender":"male"}'
```

## Performance Considerations

- **Pagination**: Prevents loading large datasets
- **Debounced Search**: Reduces API calls during typing
- **Optimized Queries**: Database indexes on frequently searched fields
- **Lazy Loading**: Components load only when needed

## Security

- **Input Validation**: Server-side validation
- **SQL Injection Prevention**: Parameterized queries
- **Authentication Required**: All operations protected
- **Rate Limiting**: Planned for production deployment