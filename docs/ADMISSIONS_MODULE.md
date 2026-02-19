# Admissions Module (Lead Management) 📋

## Overview

The Admissions Module is a comprehensive lead management system for tracking prospective students from initial inquiry through enrollment. It includes lead tracking, follow-up management, status workflows, analytics, and conversion to student records.

## Features

✅ **Lead Management** - Complete CRUD operations for leads  
✅ **Status Workflow** - Track leads through 9 different statuses  
✅ **Follow-up System** - Schedule and track follow-ups with reminders  
✅ **Lead Assignment** - Assign leads to specific staff members  
✅ **Status History** - Complete audit trail of status changes  
✅ **Lead Conversion** - Convert qualified leads to students  
✅ **Analytics Dashboard** - Comprehensive lead analytics and reports  
✅ **Import/Export** - Bulk import and export functionality  
✅ **Advanced Filtering** - Search and filter by multiple criteria  
✅ **Branch Isolation** - Leads scoped to specific branches  

## Database Structure

### Tables Created

1. **`leads`** - Main lead information
2. **`lead_followups`** - Follow-up activities and schedules
3. **`lead_status_history`** - Audit trail of status changes

### Lead Statuses

| Status | Description |
|--------|-------------|
| `new` | Newly created lead |
| `contacted` | Initial contact made |
| `qualified` | Lead qualified for admission |
| `visit_scheduled` | Campus visit scheduled |
| `visited` | Campus visit completed |
| `application_submitted` | Application form submitted |
| `enrolled` | Successfully enrolled as student |
| `not_interested` | Lead not interested |
| `lost` | Lead lost to competitor or other reasons |

### Lead Sources

- `website` - Online inquiry
- `referral` - Referred by existing student/parent
- `walk-in` - Direct visit to campus
- `phone` - Phone inquiry
- `social_media` - Social media channels
- `advertisement` - Marketing campaigns

### Follow-up Types

- `phone_call` - Phone conversation
- `email` - Email communication
- `sms` - SMS message
- `whatsapp` - WhatsApp message
- `in_person` - Face-to-face meeting
- `video_call` - Video conference
- `other` - Other communication methods

## API Endpoints

### Lead CRUD Operations

#### List Leads
```
GET /api/leads
```

**Query Parameters:**
- `branch_id` - Filter by branch
- `status` - Filter by status
- `priority` - Filter by priority (low, medium, high)
- `source` - Filter by source
- `assigned_to` - Filter by assigned user
- `from_date` - Filter from date
- `to_date` - Filter to date
- `search` - Search in name, email, phone
- `active_only` - Show only active leads
- `needs_followup` - Show leads needing follow-up
- `sort_by` - Sort field
- `sort_order` - Sort order (asc/desc)
- `per_page` - Results per page (default: 15)

**Response:**
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "branch_id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "full_name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "status": "contacted",
        "priority": "high",
        "source": "website",
        "grade_applying_for": "Grade 5",
        "parent_name": "Jane Doe",
        "parent_phone": "+1234567891",
        "assigned_to": 2,
        "next_follow_up_date": "2026-01-20",
        "created_at": "2026-01-19T10:00:00Z",
        "branch": {
          "id": 1,
          "name": "Main Branch"
        },
        "assignedTo": {
          "id": 2,
          "name": "Admin User"
        }
      }
    ],
    "total": 50,
    "per_page": 15
  }
}
```

#### Create Lead
```
POST /api/leads
```

**Request Body:**
```json
{
  "branch_id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "alternate_phone": "+1234567891",
  "date_of_birth": "2015-05-15",
  "gender": "male",
  "address": "123 Main St",
  "city": "Karachi",
  "state": "Sindh",
  "postal_code": "75500",
  "country": "Pakistan",
  "grade_applying_for": "Grade 5",
  "previous_school": "ABC School",
  "academic_year": "2026-2027",
  "parent_name": "Jane Doe",
  "parent_phone": "+1234567891",
  "parent_email": "jane@example.com",
  "parent_occupation": "Engineer",
  "relationship": "parent",
  "source": "website",
  "referral_name": null,
  "status": "new",
  "priority": "medium",
  "next_follow_up_date": "2026-01-20",
  "notes": "Interested in science program",
  "assigned_to": 2,
  "estimated_fee": 50000.00
}
```

#### Get Lead Details
```
GET /api/leads/{id}
```

**Response:** Includes lead data with relationships (branch, assignedTo, followups, statusHistory)

#### Update Lead
```
PUT /api/leads/{id}
```

**Request Body:** Same as create (all fields optional)

#### Delete Lead
```
DELETE /api/leads/{id}
```

### Lead Status Management

#### Change Status
```
PATCH /api/leads/{id}/status
```

**Request Body:**
```json
{
  "status": "contacted",
  "reason": "Called and spoke with parent"
}
```

### Lead Assignment

#### Assign Lead
```
POST /api/leads/{id}/assign
```

**Request Body:**
```json
{
  "user_id": 2
}
```

### Follow-up Management

#### Schedule Follow-up
```
POST /api/leads/{id}/followup
```

**Request Body:**
```json
{
  "type": "phone_call",
  "scheduled_at": "2026-01-20 10:00:00",
  "notes": "Follow up on campus visit"
}
```

#### Complete Follow-up
```
PATCH /api/leads/{id}/followup/{followupId}
```

**Request Body:**
```json
{
  "outcome": "Parent interested, will visit campus",
  "next_action": "Schedule campus visit",
  "next_follow_up_date": "2026-01-25"
}
```

### Lead Conversion

#### Convert to Student
```
POST /api/leads/{id}/convert
```

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "student123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lead converted to student successfully.",
  "data": {
    "id": 10,
    "name": "John Doe",
    "email": "student@example.com",
    "branch_id": 1,
    "status": "active"
  }
}
```

### Analytics & Reports

#### Get Analytics
```
GET /api/leads/analytics?branch_id=1&from_date=2026-01-01&to_date=2026-01-31
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_leads": 150,
    "active_leads": 120,
    "converted_leads": 30,
    "leads_by_status": {
      "new": 20,
      "contacted": 40,
      "qualified": 25,
      "visit_scheduled": 15,
      "visited": 10,
      "application_submitted": 8,
      "enrolled": 30,
      "not_interested": 12,
      "lost": 10
    },
    "leads_by_source": {
      "website": 60,
      "referral": 40,
      "walk-in": 30,
      "phone": 20
    },
    "leads_by_priority": {
      "high": 50,
      "medium": 70,
      "low": 30
    },
    "conversion_rate": 20.00,
    "needs_followup": 15
  }
}
```

#### Get Leads Needing Follow-up
```
GET /api/leads/needs-followup
```

### Import/Export

#### Import Leads
```
POST /api/leads/import
```

**Request Body:**
```json
{
  "branch_id": 1,
  "leads": [
    {
      "first_name": "John",
      "last_name": "Doe",
      "phone": "+1234567890",
      "parent_name": "Jane Doe",
      "parent_phone": "+1234567891"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Import completed.",
  "data": {
    "imported": 45,
    "failed": 5,
    "errors": [
      "Row 3: Phone number already exists",
      "Row 7: Invalid email format"
    ]
  }
}
```

#### Export Leads
```
GET /api/leads/export?branch_id=1&status=contacted
```

## Models

### Lead Model

**Location:** `app/Models/Lead.php`

**Key Methods:**
- `isConverted()` - Check if lead is converted to student
- `needsFollowUp()` - Check if lead needs follow-up
- `scopeNeedsFollowUpToday()` - Get leads needing follow-up today
- `scopeActive()` - Get active leads
- `scopeConverted()` - Get converted leads
- `scopeForBranch()` - Filter by branch
- `scopeAssignedTo()` - Filter by assigned user

**Relationships:**
- `branch()` - Belongs to Branch
- `assignedTo()` - Belongs to User
- `convertedToStudent()` - Belongs to User
- `followups()` - Has many LeadFollowup
- `statusHistory()` - Has many LeadStatusHistory

### LeadFollowup Model

**Location:** `app/Models/LeadFollowup.php`

**Key Methods:**
- `markAsCompleted()` - Mark follow-up as completed
- `scopeScheduled()` - Get scheduled follow-ups
- `scopeOverdue()` - Get overdue follow-ups
- `scopeToday()` - Get today's follow-ups

### LeadStatusHistory Model

**Location:** `app/Models/LeadStatusHistory.php`

**Key Methods:**
- `recordChange()` - Record a status change

## Service Layer

### LeadService

**Location:** `app/Services/LeadService.php`

**Methods:**
- `getAllLeads()` - Get paginated leads with filters
- `getLeadById()` - Get single lead with relationships
- `createLead()` - Create new lead
- `updateLead()` - Update lead
- `deleteLead()` - Delete lead
- `changeStatus()` - Change lead status
- `assignLead()` - Assign lead to user
- `scheduleFollowup()` - Schedule follow-up
- `completeFollowup()` - Complete follow-up
- `convertToStudent()` - Convert lead to student
- `getLeadsNeedingFollowup()` - Get leads needing follow-up
- `getAnalytics()` - Get lead analytics
- `importLeads()` - Bulk import leads
- `exportLeads()` - Export leads

## Usage Examples

### Create a New Lead

```php
use App\Services\LeadService;

$leadService = new LeadService();

$lead = $leadService->createLead([
    'branch_id' => 1,
    'first_name' => 'John',
    'last_name' => 'Doe',
    'phone' => '+1234567890',
    'parent_name' => 'Jane Doe',
    'parent_phone' => '+1234567891',
    'source' => 'website',
    'assigned_to' => 2,
]);
```

### Schedule Follow-up

```php
$followup = $leadService->scheduleFollowup($leadId, [
    'type' => 'phone_call',
    'scheduled_at' => '2026-01-20 10:00:00',
    'notes' => 'Follow up on campus visit',
]);
```

### Convert Lead to Student

```php
$student = $leadService->convertToStudent($leadId, [
    'email' => 'student@example.com',
    'password' => 'student123',
]);
```

### Get Analytics

```php
$analytics = $leadService->getAnalytics([
    'branch_id' => 1,
    'from_date' => '2026-01-01',
    'to_date' => '2026-01-31',
]);
```

## Frontend Integration

### Required Frontend Components

1. **Lead List Page** - Display all leads with filters
2. **Lead Form** - Create/edit lead
3. **Lead Details Page** - View lead details, follow-ups, history
4. **Follow-up Calendar** - View scheduled follow-ups
5. **Analytics Dashboard** - Display lead metrics
6. **Import/Export Interface** - Bulk operations

### Sample API Calls (JavaScript)

```javascript
// Get leads
const response = await fetch('/api/leads?status=contacted&per_page=20', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// Create lead
const newLead = await fetch('/api/leads', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    branch_id: 1,
    first_name: 'John',
    last_name: 'Doe',
    phone: '+1234567890',
    parent_name: 'Jane Doe',
    parent_phone: '+1234567891'
  })
});

// Schedule follow-up
const followup = await fetch(`/api/leads/${leadId}/followup`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    type: 'phone_call',
    scheduled_at: '2026-01-20 10:00:00',
    notes: 'Follow up call'
  })
});
```

## Testing

### Run Migrations

```bash
cd backend
php artisan migrate
```

### Test API Endpoints

```bash
# Create a lead
curl -X POST http://localhost:8000/api/leads \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "branch_id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "parent_name": "Jane Doe",
    "parent_phone": "+1234567891"
  }'

# Get leads
curl http://localhost:8000/api/leads?status=new \
  -H "Authorization: Bearer {token}"

# Get analytics
curl http://localhost:8000/api/leads/analytics?branch_id=1 \
  -H "Authorization: Bearer {token}"
```

## Best Practices

1. **Always assign leads** - Ensure leads are assigned to staff for follow-up
2. **Set follow-up dates** - Schedule next follow-up when creating/updating leads
3. **Track status changes** - Use status change reasons for audit trail
4. **Regular follow-ups** - Check needs-followup endpoint daily
5. **Use analytics** - Monitor conversion rates and lead sources
6. **Clean data** - Validate phone numbers and emails
7. **Branch isolation** - Always filter by branch for non-admin users

## Security & Permissions

- All lead routes require authentication
- Branch-level data isolation (users see only their branch leads)
- Role-based access for sensitive operations (delete, convert)
- Status history provides audit trail

## Future Enhancements

- [ ] Email templates for automated follow-ups
- [ ] SMS integration for reminders
- [ ] WhatsApp integration
- [ ] Lead scoring system
- [ ] Automated lead assignment rules
- [ ] Integration with marketing platforms
- [ ] Parent portal for application tracking
- [ ] Document upload for applications
- [ ] Payment integration for application fees
- [ ] Advanced reporting and forecasting

## Summary

The Admissions Module provides a complete lead management solution with:
- ✅ 3 database tables
- ✅ 3 models with relationships
- ✅ 1 comprehensive service class
- ✅ 14 API endpoints
- ✅ Status workflow management
- ✅ Follow-up system
- ✅ Lead conversion
- ✅ Analytics and reporting
- ✅ Import/export functionality

The module is production-ready and fully integrated with the branch management system! 🎉

