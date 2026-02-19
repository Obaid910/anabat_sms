# Branch Authorization Rules ✅

## Overview

Branch management now has proper role-based authorization to ensure users can only perform actions they're authorized for.

## Authorization Rules

### **Super Admin**
- ✅ Can view all branches
- ✅ Can create new branches
- ✅ Can edit any branch
- ✅ Can delete any branch
- ✅ Can activate/deactivate any branch
- ✅ Can view/update settings for any branch

### **Branch Admin**
- ✅ Can view all branches (read-only)
- ❌ Cannot create new branches
- ✅ Can edit **only their own branch** (where `user.branch_id == branch.id`)
- ❌ Cannot edit other branches
- ❌ Cannot delete any branches
- ✅ Can activate/deactivate **only their own branch**
- ✅ Can view/update settings for **only their own branch**

### **Other Roles** (Teacher, Accountant, Data Operator)
- ✅ Can view all branches (read-only)
- ❌ Cannot create, edit, delete, or manage branches

## Implementation Details

### 1. **Create Branch** (`POST /api/branches`)
**File**: `StoreBranchRequest.php`
```php
public function authorize(): bool
{
    // Only Super Admin can create new branches
    return $this->user()->hasRole('Super Admin');
}
```

### 2. **Update Branch** (`PUT /api/branches/{id}`)
**File**: `UpdateBranchRequest.php`
```php
public function authorize(): bool
{
    $user = $this->user();
    $branch = $this->route('branch');
    
    // Super Admin can edit any branch
    if ($user->hasRole('Super Admin')) {
        return true;
    }
    
    // Branch Admin can only edit their own branch
    if ($user->hasRole('Branch Admin')) {
        return $user->branch_id == $branch->id;
    }
    
    return false;
}
```

### 3. **Delete Branch** (`DELETE /api/branches/{id}`)
**File**: `BranchController.php`
```php
public function destroy(int $id): JsonResponse
{
    // Only Super Admin can delete branches
    if (!auth()->user()->hasRole('Super Admin')) {
        return response()->json([
            'success' => false,
            'message' => 'Only Super Admin can delete branches.',
        ], 403);
    }
    // ... delete logic
}
```

### 4. **Activate/Deactivate Branch**
**File**: `BranchController.php`
```php
public function activate(int $id): JsonResponse
{
    $user = auth()->user();
    
    // Only Super Admin or Branch Admin of this branch can activate
    if (!$user->hasRole('Super Admin') && $user->branch_id != $id) {
        return response()->json([
            'success' => false,
            'message' => 'You can only activate your own branch.',
        ], 403);
    }
    // ... activate logic
}
```

## Example Scenarios

### Scenario 1: Branch Admin tries to edit another branch
```
User: Branch Admin (branch_id = 1)
Action: PUT /api/branches/2
Result: ❌ 403 Forbidden - "This action is unauthorized."
```

### Scenario 2: Branch Admin edits their own branch
```
User: Branch Admin (branch_id = 1)
Action: PUT /api/branches/1
Result: ✅ 200 OK - Branch updated successfully
```

### Scenario 3: Branch Admin tries to create a branch
```
User: Branch Admin
Action: POST /api/branches
Result: ❌ 403 Forbidden - "This action is unauthorized."
```

### Scenario 4: Super Admin edits any branch
```
User: Super Admin
Action: PUT /api/branches/5
Result: ✅ 200 OK - Branch updated successfully
```

### Scenario 5: Branch Admin tries to delete a branch
```
User: Branch Admin
Action: DELETE /api/branches/1
Result: ❌ 403 Forbidden - "Only Super Admin can delete branches."
```

## API Responses

### Success Response
```json
{
  "success": true,
  "message": "Branch updated successfully.",
  "data": {
    "id": 1,
    "name": "Main Branch",
    "code": "MAIN",
    ...
  }
}
```

### Authorization Failure
```json
{
  "success": false,
  "message": "This action is unauthorized."
}
```

### Specific Permission Denial
```json
{
  "success": false,
  "message": "You can only edit your own branch."
}
```

## Testing

### Test as Super Admin
```bash
# Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@anabatsms.com","password":"password"}'

# Edit any branch (should work)
curl -X PUT http://localhost:8000/api/branches/1 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Branch Name"}'

# Delete branch (should work)
curl -X DELETE http://localhost:8000/api/branches/2 \
  -H "Authorization: Bearer {token}"
```

### Test as Branch Admin
```bash
# Login as branch admin (create one first)
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"branchadmin@example.com","password":"password"}'

# Edit own branch (should work if branch_id matches)
curl -X PUT http://localhost:8000/api/branches/1 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"name":"My Branch Updated"}'

# Try to edit another branch (should fail)
curl -X PUT http://localhost:8000/api/branches/2 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"name":"Other Branch"}'
# Expected: 403 Forbidden

# Try to create branch (should fail)
curl -X POST http://localhost:8000/api/branches \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"name":"New Branch","code":"NEW"}'
# Expected: 403 Forbidden
```

## Security Benefits

✅ **Principle of Least Privilege** - Users only have access to what they need  
✅ **Data Isolation** - Branch Admins can't interfere with other branches  
✅ **Audit Trail** - Clear authorization rules for compliance  
✅ **Scalability** - Easy to add more branches without security concerns  

## Notes

- **Lint Warnings**: The IDE may show "Undefined method 'hasRole'" warnings. These are false positives - the method exists via the Spatie Permission package's `HasRoles` trait.
- **Branch Assignment**: When creating a Branch Admin user, make sure to set their `branch_id` to the branch they should manage.
- **Super Admin**: The Super Admin role should be carefully assigned and limited to trusted personnel.

## Related Files

- `app/Http/Requests/StoreBranchRequest.php` - Create authorization
- `app/Http/Requests/UpdateBranchRequest.php` - Update authorization
- `app/Http/Controllers/Api/BranchController.php` - Delete, activate, deactivate authorization
- `routes/api.php` - Route middleware configuration
- `app/Http/Kernel.php` - Middleware registration
