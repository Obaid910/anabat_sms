# Branch System Setup Guide

## Quick Setup

Follow these steps to set up the multi-branch configuration system in your Anabat SMS installation.

## Prerequisites

- Laravel backend is installed and configured
- React frontend is installed and configured
- Database is set up and migrations are ready
- Spatie Laravel Permission package is installed

## Backend Setup

### Step 1: Run Migrations

The branch migrations should already exist. Run them:

```bash
cd backend
php artisan migrate
```

This will create:
- `branches` table
- `branch_settings` table

### Step 2: Seed Sample Data

Seed the database with sample branches:

```bash
php artisan db:seed --class=BranchSeeder
```

This creates three sample branches:
- Main Branch (MAIN)
- Secondary Branch (SEC)
- North Branch (NORTH)

### Step 3: Register Middleware

The middleware is already registered in `app/Http/Kernel.php`:
- `branch.access` - Controls branch access
- `branch.context` - Sets branch context

### Step 4: Verify Routes

Check that branch routes are registered in `routes/api.php`:

```bash
php artisan route:list | grep branch
```

You should see routes like:
- GET /api/branches
- POST /api/branches
- GET /api/branches/{branch}
- etc.

### Step 5: Test API Endpoints

Test the branch API (replace {token} with a valid auth token):

```bash
# Get all branches
curl http://localhost:8000/api/branches \
  -H "Authorization: Bearer {token}"

# Get active branches
curl http://localhost:8000/api/branches/active \
  -H "Authorization: Bearer {token}"
```

## Frontend Setup

### Step 1: Verify Dependencies

Ensure all required packages are installed:

```bash
cd frontend
npm install
```

Required packages (should already be in package.json):
- @mui/material
- @mui/icons-material
- @mui/x-data-grid
- axios
- react-router-dom

### Step 2: Configure API URL

Set the API URL in `.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

### Step 3: Import Components

The following components are now available:

**Common Components:**
- `src/components/common/BranchSelector.jsx`

**Admin Components:**
- `src/pages/admin/BranchManagement.jsx`
- `src/components/admin/BranchSettings.jsx`
- `src/components/admin/BranchStatistics.jsx`

**Services:**
- `src/services/branchService.js`

**Utilities:**
- `src/utils/branchContext.js`

### Step 4: Add Routes

Add branch management routes to your router (example):

```jsx
// In your App.jsx or router configuration
import BranchManagement from './pages/admin/BranchManagement';

// Inside your routes
<Route path="/admin/branches" element={<BranchManagement />} />
```

### Step 5: Test Frontend

Start the development server:

```bash
npm run dev
```

Navigate to the branch management page and verify:
- Branches are loaded
- You can create/edit/delete branches
- Branch selector works

## Integration with Existing Features

### Adding Branch Context to Existing Components

1. **Import the branch context utility:**
```javascript
import branchContext from '../utils/branchContext';
```

2. **Get current branch:**
```javascript
const currentBranchId = branchContext.getBranchId();
```

3. **Set branch context (e.g., after user login):**
```javascript
// After successful login
const user = response.data.user;
if (user.branch_id) {
  branchContext.setBranchId(user.branch_id);
}
```

### Adding Branch Selector to Forms

```jsx
import BranchSelector from './components/common/BranchSelector';

function MyForm() {
  const [formData, setFormData] = useState({
    branch_id: null,
    // other fields
  });

  return (
    <form>
      <BranchSelector
        value={formData.branch_id}
        onChange={(branchId) => setFormData({...formData, branch_id: branchId})}
      />
      {/* other form fields */}
    </form>
  );
}
```

### Protecting Routes with Branch Access

In `routes/api.php`:

```php
// Routes that require branch access control
Route::middleware(['auth:sanctum', 'branch.access'])->group(function () {
    Route::get('/students', [StudentController::class, 'index']);
    Route::get('/teachers', [TeacherController::class, 'index']);
    // other branch-specific routes
});

// Routes that need branch context but no access control
Route::middleware(['auth:sanctum', 'branch.context'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
});
```

## User Assignment to Branches

### Assigning Users to Branches

When creating or updating users, assign them to a branch:

```php
$user = User::create([
    'name' => 'John Doe',
    'email' => 'john@example.com',
    'password' => Hash::make('password'),
    'branch_id' => 1, // Assign to branch
    'status' => 'active',
]);
```

### Checking User's Branch

```php
$user = auth()->user();
$branchId = $user->branch_id;
$branch = $user->branch; // Relationship
```

## Common Configurations

### Branch Settings Examples

Common settings you might want to configure per branch:

```php
$branch->setSetting('academic_year', '2024-2025');
$branch->setSetting('timezone', 'America/New_York');
$branch->setSetting('currency', 'USD');
$branch->setSetting('date_format', 'Y-m-d');
$branch->setSetting('time_format', 'H:i:s');
$branch->setSetting('max_students_per_class', '30');
$branch->setSetting('enable_online_payment', 'true');
$branch->setSetting('enable_sms_notifications', 'true');
$branch->setSetting('school_start_time', '08:00');
$branch->setSetting('school_end_time', '15:00');
$branch->setSetting('language', 'en');
```

### Retrieving Settings

```php
$academicYear = $branch->getSetting('academic_year', '2024-2025');
$timezone = $branch->getSetting('timezone', 'UTC');
```

## Verification Checklist

- [ ] Migrations ran successfully
- [ ] Sample branches created
- [ ] API endpoints respond correctly
- [ ] Branch selector loads branches
- [ ] Can create new branch
- [ ] Can edit existing branch
- [ ] Can delete branch
- [ ] Can activate/deactivate branch
- [ ] Branch settings save correctly
- [ ] Branch statistics display correctly
- [ ] Branch context is set in API headers
- [ ] Users are assigned to branches

## Troubleshooting

### Backend Issues

**Problem**: Migrations fail
```bash
# Solution: Reset and re-run migrations
php artisan migrate:fresh --seed
```

**Problem**: Routes not found
```bash
# Solution: Clear route cache
php artisan route:clear
php artisan route:cache
```

**Problem**: Permission denied errors
```bash
# Solution: Ensure user has super_admin role
php artisan tinker
>>> $user = User::find(1);
>>> $user->assignRole('super_admin');
```

### Frontend Issues

**Problem**: Components not found
```bash
# Solution: Verify file paths and restart dev server
npm run dev
```

**Problem**: API calls fail
```bash
# Solution: Check VITE_API_URL in .env
# Ensure backend is running
# Check browser console for CORS errors
```

**Problem**: Branch selector empty
```bash
# Solution: 
# 1. Check if branches exist in database
# 2. Verify authentication token is valid
# 3. Check browser network tab for API errors
```

## Next Steps

After setting up the branch system:

1. **Customize branch settings** based on your school's needs
2. **Integrate branch filtering** into existing features (students, teachers, classes)
3. **Add branch-specific reports** and analytics
4. **Configure branch permissions** for different user roles
5. **Test multi-branch workflows** thoroughly

## Support

For additional help:
- Check the main documentation: `docs/BRANCH_SYSTEM.md`
- Review the code comments in the implementation files
- Contact the development team

## Additional Resources

- Laravel Documentation: https://laravel.com/docs
- Material-UI Documentation: https://mui.com/
- Spatie Permissions: https://spatie.be/docs/laravel-permission
