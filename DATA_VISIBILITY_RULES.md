# Data Visibility Rules 🔒

## Overview

The system now implements strict data visibility rules to ensure users only see data relevant to their branch and role.

## Branch Data Visibility

### **Super Admin** 👑
- ✅ Can view **all branches**
- ✅ Can view details of **any branch**
- ✅ Can see statistics for **all branches**
- ✅ Can manage settings for **any branch**

### **Branch Admin** 👤
- ✅ Can view **only their own branch** (where `user.branch_id == branch.id`)
- ✅ Can view details of **only their own branch**
- ✅ Can see statistics for **only their own branch**
- ✅ Can manage settings for **only their own branch**
- ❌ Cannot see other branches in the list
- ❌ Cannot view details of other branches

### **Other Staff** (Teacher, Accountant, Data Operator) 👥
- ✅ Can view **only their own branch** (where `user.branch_id == branch.id`)
- ✅ Can view details of **only their own branch**
- ❌ Cannot see other branches
- ❌ Cannot manage any branch settings

### **Users Without Branch Assignment** ⚠️
- ❌ Cannot see any branches
- Returns empty list with message: "No branch assigned to your account."

## Implementation Details

### 1. **List Branches** (`GET /api/branches`)

**BranchController.php**:
```php
public function index(Request $request): JsonResponse
{
    $user = auth()->user();
    
    // Super Admin can see all branches
    if ($user->hasRole('Super Admin')) {
        $branches = $this->branchService->getAllBranches($filters);
    } else {
        // Branch Admin and other staff can only see their own branch
        if ($user->branch_id) {
            $filters['branch_id'] = $user->branch_id;
            $branches = $this->branchService->getAllBranches($filters);
        } else {
            // User has no branch assigned
            return response()->json([
                'success' => true,
                'data' => [],
                'message' => 'No branch assigned to your account.',
            ]);
        }
    }
    
    return response()->json([
        'success' => true,
        'data' => $branches,
    ]);
}
```

### 2. **View Branch Details** (`GET /api/branches/{id}`)

**BranchController.php**:
```php
public function show(int $id): JsonResponse
{
    $user = auth()->user();
    
    // Non-Super Admin users can only view their own branch
    if (!$user->hasRole('Super Admin') && $user->branch_id != $id) {
        return response()->json([
            'success' => false,
            'message' => 'You can only view your own branch details.',
        ], 403);
    }
    
    $branch = $this->branchService->getBranchById($id);
    // ... return branch data
}
```

### 3. **Branch Service Filter**

**BranchService.php**:
```php
public function getAllBranches(array $filters = []): Collection
{
    $query = Branch::query();

    // Filter by specific branch ID (for Branch Admin and staff)
    if (isset($filters['branch_id'])) {
        $query->where('id', $filters['branch_id']);
    }
    
    // ... other filters
    
    return $query->get();
}
```

## API Response Examples

### Super Admin - List Branches
```bash
GET /api/branches
Authorization: Bearer {super-admin-token}
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Main Branch",
      "code": "MAIN",
      ...
    },
    {
      "id": 2,
      "name": "North Branch",
      "code": "NORTH",
      ...
    },
    {
      "id": 3,
      "name": "South Branch",
      "code": "SOUTH",
      ...
    }
  ]
}
```

### Branch Admin - List Branches
```bash
GET /api/branches
Authorization: Bearer {branch-admin-token}
# User has branch_id = 2
```

**Response** (Only their branch):
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "name": "North Branch",
      "code": "NORTH",
      ...
    }
  ]
}
```

### Branch Admin - Try to View Another Branch
```bash
GET /api/branches/3
Authorization: Bearer {branch-admin-token}
# User has branch_id = 2, trying to view branch 3
```

**Response**:
```json
{
  "success": false,
  "message": "You can only view your own branch details."
}
```

### User Without Branch - List Branches
```bash
GET /api/branches
Authorization: Bearer {user-token}
# User has branch_id = null
```

**Response**:
```json
{
  "success": true,
  "data": [],
  "message": "No branch assigned to your account."
}
```

## Data Scope Summary

| Action | Super Admin | Branch Admin | Other Staff | No Branch |
|--------|-------------|--------------|-------------|-----------|
| List all branches | ✅ All | ✅ Own only | ✅ Own only | ❌ None |
| View branch details | ✅ Any | ✅ Own only | ✅ Own only | ❌ None |
| Create branch | ✅ Yes | ❌ No | ❌ No | ❌ No |
| Edit branch | ✅ Any | ✅ Own only | ❌ No | ❌ No |
| Delete branch | ✅ Any | ❌ No | ❌ No | ❌ No |
| Activate/Deactivate | ✅ Any | ✅ Own only | ❌ No | ❌ No |
| View settings | ✅ Any | ✅ Own only | ✅ Own only | ❌ None |
| Update settings | ✅ Any | ✅ Own only | ❌ No | ❌ No |

## Security Benefits

✅ **Data Isolation** - Users can't access other branches' data  
✅ **Privacy** - Branch-specific information stays within the branch  
✅ **Compliance** - Meets data access control requirements  
✅ **Multi-tenancy** - Each branch operates independently  
✅ **Audit Trail** - Clear access patterns for compliance  

## Frontend Impact

The frontend will automatically show the appropriate data based on the API response:

### For Super Admin:
- Branch dropdown shows all branches
- Can switch between branches
- Can create new branches

### For Branch Admin/Staff:
- Branch dropdown shows only their branch (or is hidden)
- Cannot switch branches
- Cannot create new branches
- All data automatically scoped to their branch

## Testing Scenarios

### Test 1: Super Admin Views All Branches
```bash
# Login as Super Admin
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@anabatsms.com","password":"password"}'

# Get all branches
curl http://localhost:8000/api/branches \
  -H "Authorization: Bearer {token}"

# Expected: All branches returned
```

### Test 2: Branch Admin Views Only Their Branch
```bash
# Login as Branch Admin (branch_id = 1)
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"branchadmin@example.com","password":"password"}'

# Get branches
curl http://localhost:8000/api/branches \
  -H "Authorization: Bearer {token}"

# Expected: Only branch with id=1 returned
```

### Test 3: Branch Admin Tries to View Another Branch
```bash
# Login as Branch Admin (branch_id = 1)
# Try to view branch 2
curl http://localhost:8000/api/branches/2 \
  -H "Authorization: Bearer {token}"

# Expected: 403 Forbidden - "You can only view your own branch details."
```

### Test 4: User Without Branch
```bash
# Login as user with no branch_id
curl http://localhost:8000/api/branches \
  -H "Authorization: Bearer {token}"

# Expected: Empty array with message "No branch assigned to your account."
```

## Important Notes

1. **Branch Assignment**: Always assign a `branch_id` to users when creating them (except Super Admin)
2. **Null Checks**: The system handles users without branch assignment gracefully
3. **Cascading Rules**: Data visibility applies to all related data (students, fees, etc.)
4. **Future Scope**: This pattern should be applied to all other modules (students, attendance, etc.)

## Related Files

- `app/Http/Controllers/Api/BranchController.php` - Main authorization logic
- `app/Services/BranchService.php` - Data filtering
- `app/Http/Requests/StoreBranchRequest.php` - Create authorization
- `app/Http/Requests/UpdateBranchRequest.php` - Update authorization

## Next Steps

Apply the same data visibility pattern to:
- [ ] Students (students should be scoped to branch)
- [ ] Attendance (attendance records scoped to branch)
- [ ] Fees (fee records scoped to branch)
- [ ] Exams (exams scoped to branch)
- [ ] Staff/Employees (staff scoped to branch)
- [ ] Reports (reports scoped to branch)

This ensures complete data isolation across the entire system! 🔒
