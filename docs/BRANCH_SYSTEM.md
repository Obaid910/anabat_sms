# Multi-Branch Configuration System

## Overview

The Anabat School Management System now includes a comprehensive multi-branch configuration system that allows managing multiple school branches with independent settings and data isolation.

## Features

- ✅ Branch CRUD operations (Create, Read, Update, Delete)
- ✅ Branch-specific settings management
- ✅ Branch status management (Active/Inactive)
- ✅ Branch data isolation with middleware
- ✅ Branch context management
- ✅ Branch statistics and analytics
- ✅ User-branch associations
- ✅ Branch selector UI component

## Backend Implementation

### Database Structure

#### Branches Table
- `id`: Primary key
- `name`: Branch name
- `code`: Unique branch code
- `address`: Branch address
- `contact_info`: JSON field for contact details (phone, email, fax, website)
- `status`: Enum (active, inactive)
- `timestamps`: Created and updated timestamps
- `deleted_at`: Soft delete timestamp

#### Branch Settings Table
- `id`: Primary key
- `branch_id`: Foreign key to branches table
- `setting_key`: Setting name
- `setting_value`: Setting value
- `timestamps`: Created and updated timestamps
- Unique constraint on (branch_id, setting_key)

### Models

#### Branch Model (`app/Models/Branch.php`)
- Relationships:
  - `users()`: Has many users
  - `settings()`: Has many branch settings
- Methods:
  - `isActive()`: Check if branch is active
  - `getSetting($key, $default)`: Get a specific setting
  - `setSetting($key, $value)`: Set a specific setting

#### BranchSetting Model (`app/Models/BranchSetting.php`)
- Relationships:
  - `branch()`: Belongs to branch

### Services

#### BranchService (`app/Services/BranchService.php`)
Provides business logic for branch management:
- `getActiveBranches()`: Get all active branches (cached)
- `getAllBranches($filters)`: Get all branches with optional filters
- `getBranchById($id)`: Get branch by ID
- `getBranchByCode($code)`: Get branch by code
- `createBranch($data)`: Create new branch
- `updateBranch($id, $data)`: Update existing branch
- `deleteBranch($id)`: Soft delete branch
- `activateBranch($id)`: Activate a branch
- `deactivateBranch($id)`: Deactivate a branch
- `getBranchSettings($branchId)`: Get branch settings
- `updateBranchSettings($branchId, $settings)`: Update branch settings
- `getBranchStatistics($branchId)`: Get branch statistics

### Middleware

#### BranchAccess (`app/Http/Middleware/BranchAccess.php`)
Controls access to branch-specific data:
- Super admins can access all branches
- Regular users can only access their assigned branch
- Checks branch ID from headers, query params, or route parameters

#### SetBranchContext (`app/Http/Middleware/SetBranchContext.php`)
Sets the current branch context:
- Adds branch ID to config and request
- Makes branch context available throughout the application

### API Endpoints

All endpoints require authentication (`auth:sanctum` middleware).

#### Branch Management
```
GET    /api/branches              - List all branches
GET    /api/branches/active       - List active branches only
POST   /api/branches              - Create new branch (super_admin only)
GET    /api/branches/{id}         - Get branch details
PUT    /api/branches/{id}         - Update branch (super_admin only)
DELETE /api/branches/{id}         - Delete branch (super_admin only)
POST   /api/branches/{id}/activate   - Activate branch (super_admin only)
POST   /api/branches/{id}/deactivate - Deactivate branch (super_admin only)
```

#### Branch Settings
```
GET    /api/branches/{id}/settings - Get branch settings
PUT    /api/branches/{id}/settings - Update branch settings
```

#### Branch Statistics
```
GET    /api/branches/{id}/statistics - Get branch statistics
```

### Request Validation

#### StoreBranchRequest
Validates branch creation:
- `name`: Required, string, max 255 characters
- `code`: Required, unique, alphanumeric with dashes/underscores
- `address`: Optional, string, max 500 characters
- `contact_info`: Optional, array with phone, email, fax, website
- `status`: Optional, enum (active, inactive)
- `settings`: Optional, array

#### UpdateBranchRequest
Validates branch updates (similar to StoreBranchRequest but with 'sometimes' rules)

## Frontend Implementation

### Services

#### branchService (`src/services/branchService.js`)
API client for branch operations:
- `getAllBranches(filters)`
- `getActiveBranches()`
- `getBranchById(id)`
- `createBranch(data)`
- `updateBranch(id, data)`
- `deleteBranch(id)`
- `activateBranch(id)`
- `deactivateBranch(id)`
- `getBranchSettings(id)`
- `updateBranchSettings(id, settings)`
- `getBranchStatistics(id)`

### Components

#### BranchSelector (`src/components/common/BranchSelector.jsx`)
Dropdown component for selecting branches:
- Props:
  - `value`: Current selected branch ID
  - `onChange`: Callback when selection changes
  - `disabled`: Disable the selector
  - `showAllOption`: Show "All Branches" option
- Features:
  - Loads active branches automatically
  - Shows branch name and code
  - Material-UI styled

#### BranchManagement (`src/pages/admin/BranchManagement.jsx`)
Full CRUD interface for branch management:
- DataGrid with all branches
- Add/Edit dialog
- Delete confirmation
- Activate/Deactivate toggle
- Search and filter capabilities

#### BranchSettings (`src/components/admin/BranchSettings.jsx`)
Branch-specific settings management:
- Academic year
- Timezone
- Currency
- Date/Time formats
- Max students per class
- Online payment toggle
- SMS notifications toggle

#### BranchStatistics (`src/components/admin/BranchStatistics.jsx`)
Visual statistics for a branch:
- Total users
- Active users
- Inactive users

### Utilities

#### branchContext (`src/utils/branchContext.js`)
Manages current branch context in localStorage:
- `setBranchId(id)`: Set current branch
- `getBranchId()`: Get current branch
- `clearBranch()`: Clear branch context
- `hasBranch()`: Check if branch is set

### API Integration

The API service automatically includes branch context in request headers:
- Header: `X-Branch-Id`
- Value: Current branch ID from localStorage

## Usage Examples

### Backend

#### Creating a Branch
```php
use App\Services\BranchService;

$branchService = new BranchService();
$branch = $branchService->createBranch([
    'name' => 'New Branch',
    'code' => 'NEW',
    'address' => '123 Street',
    'contact_info' => [
        'phone' => '+1234567890',
        'email' => 'new@example.com',
    ],
    'settings' => [
        'academic_year' => '2024-2025',
        'timezone' => 'UTC',
    ],
]);
```

#### Getting Branch Settings
```php
$settings = $branchService->getBranchSettings($branchId);
$academicYear = $settings['academic_year'] ?? null;
```

#### Using Branch Middleware
```php
// In routes/api.php
Route::middleware(['auth:sanctum', 'branch.access'])->group(function () {
    // Protected routes that respect branch access
});
```

### Frontend

#### Using BranchSelector
```jsx
import BranchSelector from './components/common/BranchSelector';

function MyComponent() {
  const [selectedBranch, setSelectedBranch] = useState(null);

  return (
    <BranchSelector
      value={selectedBranch}
      onChange={setSelectedBranch}
      showAllOption={true}
    />
  );
}
```

#### Setting Branch Context
```javascript
import branchContext from './utils/branchContext';

// Set branch context
branchContext.setBranchId(1);

// Get current branch
const branchId = branchContext.getBranchId();

// Clear branch context
branchContext.clearBranch();
```

## Database Seeding

The system includes a comprehensive seeder that creates three sample branches:

1. **Main Branch** (MAIN)
   - Full contact information
   - All features enabled
   - 30 students per class

2. **Secondary Branch** (SEC)
   - Full contact information
   - Online payment disabled
   - 25 students per class

3. **North Branch** (NORTH)
   - Basic contact information
   - SMS notifications disabled
   - 35 students per class

Run seeder:
```bash
php artisan db:seed --class=BranchSeeder
```

## Security Considerations

1. **Access Control**: Branch access is enforced via middleware
2. **Super Admin**: Only super admins can create/modify branches
3. **Data Isolation**: Users can only access data from their assigned branch
4. **Validation**: All inputs are validated before processing
5. **Soft Deletes**: Branches are soft-deleted to maintain data integrity

## Testing

### Manual Testing

1. **Create Branch**:
   ```bash
   curl -X POST http://localhost:8000/api/branches \
     -H "Authorization: Bearer {token}" \
     -H "Content-Type: application/json" \
     -d '{"name":"Test Branch","code":"TEST","status":"active"}'
   ```

2. **Get Branches**:
   ```bash
   curl http://localhost:8000/api/branches \
     -H "Authorization: Bearer {token}"
   ```

3. **Update Settings**:
   ```bash
   curl -X PUT http://localhost:8000/api/branches/1/settings \
     -H "Authorization: Bearer {token}" \
     -H "Content-Type: application/json" \
     -d '{"settings":{"academic_year":"2024-2025"}}'
   ```

## Future Enhancements

- [ ] Branch-specific themes and branding
- [ ] Branch performance analytics
- [ ] Branch comparison reports
- [ ] Branch data export/import
- [ ] Branch cloning functionality
- [ ] Multi-branch reporting dashboard
- [ ] Branch-specific permissions
- [ ] Branch hierarchy (parent-child branches)

## Troubleshooting

### Issue: Branch selector not loading
**Solution**: Check API connection and authentication token

### Issue: Access denied to branch
**Solution**: Verify user's branch_id matches requested branch or user has super_admin role

### Issue: Settings not saving
**Solution**: Check validation rules and ensure proper JSON format

## Support

For issues or questions, please refer to the main project documentation or contact the development team.
