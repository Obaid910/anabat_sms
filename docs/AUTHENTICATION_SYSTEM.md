# Authentication and User Management System

## Overview

The Anabat School Management System features a comprehensive authentication and user management system with role-based access control (RBAC), activity logging, session management, and password reset functionality.

## Features

### Authentication
- ✅ Login with email and password
- ✅ Remember me functionality (30-day vs 24-hour sessions)
- ✅ Password reset flow (forgot password + reset)
- ✅ Change password for authenticated users
- ✅ Token-based authentication (Laravel Sanctum)
- ✅ Token expiration management
- ✅ Multi-device session support

### User Management
- ✅ User CRUD operations
- ✅ User status management (active, inactive, suspended)
- ✅ Role and permission assignment
- ✅ User search and filtering
- ✅ Branch assignment
- ✅ Profile management
- ✅ Password reset by administrators

### Activity Logging
- ✅ Comprehensive activity tracking
- ✅ Login/logout logging
- ✅ Failed login attempts
- ✅ Password changes
- ✅ Profile updates
- ✅ Role/permission changes
- ✅ IP address and user agent tracking

### Session Management
- ✅ View active sessions
- ✅ Revoke specific sessions
- ✅ Revoke all sessions
- ✅ Session expiration tracking

## Backend Implementation

### Database Structure

#### Users Table
```sql
- id: Primary key
- branch_id: Foreign key to branches (nullable)
- name: User's full name
- email: Unique email address
- phone: Phone number (nullable)
- email_verified_at: Email verification timestamp
- password: Hashed password
- status: Enum (active, inactive, suspended)
- remember_token: Remember me token
- timestamps: created_at, updated_at
- deleted_at: Soft delete timestamp
```

#### User Activities Table
```sql
- id: Primary key
- user_id: Foreign key to users
- activity_type: Type of activity
- ip_address: IP address (nullable)
- user_agent: Browser/device info (nullable)
- description: Activity description
- metadata: JSON field for additional data
- created_at: Activity timestamp
```

### Models

#### User Model
**Location**: `app/Models/User.php`

**Key Methods**:
- `isActive()`: Check if user is active
- `isSuspended()`: Check if user is suspended
- `logActivity()`: Log user activity

**Relationships**:
- `branch()`: Belongs to branch
- `activities()`: Has many user activities
- `roles()`: Many-to-many with roles (Spatie)
- `permissions()`: Many-to-many with permissions (Spatie)

#### UserActivity Model
**Location**: `app/Models/UserActivity.php`

**Activity Types**:
- `TYPE_LOGIN`: User login
- `TYPE_LOGOUT`: User logout
- `TYPE_PASSWORD_RESET`: Password reset
- `TYPE_PASSWORD_CHANGE`: Password change
- `TYPE_PROFILE_UPDATE`: Profile update
- `TYPE_EMAIL_CHANGE`: Email change
- `TYPE_STATUS_CHANGE`: Status change
- `TYPE_ROLE_ASSIGNED`: Role assigned
- `TYPE_ROLE_REMOVED`: Role removed
- `TYPE_PERMISSION_GRANTED`: Permission granted
- `TYPE_PERMISSION_REVOKED`: Permission revoked
- `TYPE_FAILED_LOGIN`: Failed login attempt
- `TYPE_ACCOUNT_LOCKED`: Account locked
- `TYPE_ACCOUNT_UNLOCKED`: Account unlocked

### Controllers

#### AuthController
**Location**: `app/Http/Controllers/Api/AuthController.php`

**Endpoints**:

1. **Login**
   - `POST /api/login`
   - Body: `{ email, password, remember_me }`
   - Returns: User data + token + expiration

2. **Logout**
   - `POST /api/logout`
   - Headers: `Authorization: Bearer {token}`
   - Revokes current token

3. **Get Current User**
   - `GET /api/me`
   - Headers: `Authorization: Bearer {token}`
   - Returns: User with branch, roles, permissions

4. **Refresh Token**
   - `POST /api/refresh`
   - Headers: `Authorization: Bearer {token}`
   - Returns: New token

5. **Forgot Password**
   - `POST /api/forgot-password`
   - Body: `{ email }`
   - Sends password reset link

6. **Reset Password**
   - `POST /api/reset-password`
   - Body: `{ token, email, password, password_confirmation }`
   - Resets password

7. **Change Password**
   - `POST /api/change-password`
   - Body: `{ current_password, password, password_confirmation }`
   - Changes password for authenticated user

8. **Update Profile**
   - `PUT /api/profile`
   - Body: `{ name, email, phone }`
   - Updates user profile

9. **Activity Log**
   - `GET /api/activity-log`
   - Query: `?per_page=15`
   - Returns: Paginated activity log

#### UserManagementController
**Location**: `app/Http/Controllers/Api/UserManagementController.php`

**Endpoints** (All require `super_admin` or `admin` role):

1. **List Users**
   - `GET /api/users`
   - Query params: `status`, `branch_id`, `role`, `search`, `sort_by`, `sort_order`, `per_page`
   - Returns: Paginated users

2. **Create User**
   - `POST /api/users`
   - Body: `{ name, email, password, password_confirmation, phone, branch_id, status, roles }`
   - Returns: Created user

3. **Get User**
   - `GET /api/users/{id}`
   - Returns: User with branch, roles, permissions, recent activities

4. **Update User**
   - `PUT /api/users/{id}`
   - Body: `{ name, email, phone, branch_id, status }`
   - Returns: Updated user

5. **Delete User**
   - `DELETE /api/users/{id}`
   - Soft deletes user

6. **Update Status**
   - `PATCH /api/users/{id}/status`
   - Body: `{ status }`
   - Updates user status

7. **Assign Roles**
   - `POST /api/users/{id}/roles`
   - Body: `{ roles: [] }`
   - Assigns roles to user

8. **Assign Permissions**
   - `POST /api/users/{id}/permissions`
   - Body: `{ permissions: [] }`
   - Assigns permissions to user

9. **Get Activity Log**
   - `GET /api/users/{id}/activity-log`
   - Returns: User's activity log

10. **Reset User Password**
    - `POST /api/users/{id}/reset-password`
    - Body: `{ password, password_confirmation }`
    - Resets user password (admin)

11. **Get Sessions**
    - `GET /api/users/{id}/sessions`
    - Returns: Active sessions

12. **Revoke Session**
    - `DELETE /api/users/{id}/sessions/{token}`
    - Revokes specific session

13. **Revoke All Sessions**
    - `DELETE /api/users/{id}/sessions`
    - Revokes all user sessions

14. **Get Roles**
    - `GET /api/users/roles`
    - Returns: All roles with permissions

15. **Get Permissions**
    - `GET /api/users/permissions`
    - Returns: All permissions

## Frontend Implementation

### Services

#### authService
**Location**: `src/services/authService.js`

**Methods**:
- `login(credentials)`: Login user
- `logout()`: Logout user
- `getCurrentUser()`: Get current user
- `refreshToken()`: Refresh auth token
- `forgotPassword(email)`: Request password reset
- `resetPassword(data)`: Reset password
- `changePassword(current, new, confirmation)`: Change password
- `updateProfile(data)`: Update user profile
- `getActivityLog(perPage)`: Get activity log
- `getToken()`: Get stored token
- `getUser()`: Get stored user
- `isAuthenticated()`: Check if authenticated

#### userService
**Location**: `src/services/userService.js`

**Methods**:
- `getAllUsers(filters)`: Get all users with filters
- `getUserById(id)`: Get user by ID
- `createUser(userData)`: Create new user
- `updateUser(id, userData)`: Update user
- `deleteUser(id)`: Delete user
- `updateUserStatus(id, status)`: Update user status
- `assignRoles(id, roles)`: Assign roles
- `assignPermissions(id, permissions)`: Assign permissions
- `getUserActivityLog(id, perPage)`: Get user activity log
- `resetUserPassword(id, password, confirmation)`: Reset password (admin)
- `getUserSessions(id)`: Get user sessions
- `revokeSession(userId, tokenId)`: Revoke session
- `revokeAllSessions(userId)`: Revoke all sessions
- `getRoles()`: Get all roles
- `getPermissions()`: Get all permissions

### Components

#### Login Page
**Location**: `src/pages/auth/Login.jsx`

**Features**:
- Email/password login
- Remember me checkbox
- Forgot password link
- Form validation
- Error handling

#### Forgot Password Page
**Location**: `src/pages/auth/ForgotPassword.jsx`

**Features**:
- Email input
- Send reset link
- Success/error messages
- Back to login link

#### Reset Password Page
**Location**: `src/pages/auth/ResetPassword.jsx`

**Features**:
- Token validation
- New password input
- Password confirmation
- Success/error handling

#### User Profile Page
**Location**: `src/pages/profile/UserProfile.jsx`

**Features**:
- Three tabs: Profile, Security, Activity Log
- Profile editing (name, email, phone)
- Password change
- Activity log viewing
- User avatar
- Role display

#### User Management Page
**Location**: `src/pages/admin/UserManagement.jsx`

**Features**:
- DataGrid with all users
- Search and filters (status, branch, role)
- Create/edit user dialog
- Role assignment dialog
- Status management (activate/suspend)
- Delete user
- Pagination

## Usage Examples

### Backend

#### Logging User Activity
```php
use App\Models\UserActivity;

$user->logActivity(
    UserActivity::TYPE_LOGIN,
    'User logged in successfully',
    ['remember_me' => true],
    $request->ip(),
    $request->userAgent()
);
```

#### Checking User Status
```php
if ($user->isSuspended()) {
    return response()->json([
        'message' => 'Account suspended'
    ], 403);
}

if (!$user->isActive()) {
    return response()->json([
        'message' => 'Account not active'
    ], 403);
}
```

#### Token Expiration
```php
// 24-hour token
$token = $user->createToken('auth_token', ['*'], now()->addHours(24));

// 30-day token (remember me)
$token = $user->createToken('auth_token', ['*'], now()->addDays(30));
```

### Frontend

#### Login with Remember Me
```javascript
import authService from './services/authService';

const handleLogin = async () => {
  try {
    const response = await authService.login({
      email: 'user@example.com',
      password: 'password',
      remember_me: true
    });
    console.log('Logged in:', response.data.user);
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

#### Update Profile
```javascript
const handleUpdateProfile = async () => {
  try {
    await authService.updateProfile({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890'
    });
    console.log('Profile updated');
  } catch (error) {
    console.error('Update failed:', error);
  }
};
```

#### Manage User (Admin)
```javascript
import userService from './services/userService';

// Create user
const newUser = await userService.createUser({
  name: 'Jane Doe',
  email: 'jane@example.com',
  password: 'password123',
  password_confirmation: 'password123',
  branch_id: 1,
  status: 'active',
  roles: ['teacher']
});

// Assign roles
await userService.assignRoles(userId, ['admin', 'teacher']);

// Update status
await userService.updateUserStatus(userId, 'suspended');

// Revoke all sessions
await userService.revokeAllSessions(userId);
```

## Security Features

### Password Security
- Minimum 8 characters
- Hashed using bcrypt
- Password confirmation required
- Current password required for changes

### Token Security
- Bearer token authentication
- Token expiration (24 hours or 30 days)
- Token revocation on password change
- Multiple device support

### Activity Logging
- All authentication events logged
- IP address tracking
- User agent tracking
- Failed login attempts tracked

### Account Protection
- Account suspension capability
- Session management
- Password reset with tokens
- Email verification support

## Testing

### Manual Testing

#### Test Login
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password","remember_me":true}'
```

#### Test Password Reset
```bash
# Request reset
curl -X POST http://localhost:8000/api/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# Reset password
curl -X POST http://localhost:8000/api/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token":"reset-token",
    "email":"user@example.com",
    "password":"newpassword",
    "password_confirmation":"newpassword"
  }'
```

#### Test User Management
```bash
# Get users (requires admin token)
curl http://localhost:8000/api/users \
  -H "Authorization: Bearer {admin-token}"

# Create user
curl -X POST http://localhost:8000/api/users \
  -H "Authorization: Bearer {admin-token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"New User",
    "email":"newuser@example.com",
    "password":"password123",
    "password_confirmation":"password123",
    "branch_id":1,
    "roles":["teacher"]
  }'
```

## Troubleshooting

### Issue: Token expired
**Solution**: Call refresh endpoint or re-login

### Issue: Cannot reset password
**Solution**: Check email configuration in `.env`

### Issue: Activity log not recording
**Solution**: Ensure `user_activities` table exists and migrations ran

### Issue: Roles not working
**Solution**: Run `php artisan permission:cache-reset`

## Future Enhancements

- [ ] Two-factor authentication (2FA)
- [ ] Social login (Google, Facebook)
- [ ] Email verification
- [ ] Account lockout after failed attempts
- [ ] Password strength meter
- [ ] Security questions
- [ ] Login notifications
- [ ] Geolocation tracking
- [ ] Device fingerprinting
- [ ] OAuth2 support

## Support

For issues or questions, refer to:
- Main documentation: `docs/`
- Laravel Sanctum docs: https://laravel.com/docs/sanctum
- Spatie Permission docs: https://spatie.be/docs/laravel-permission
