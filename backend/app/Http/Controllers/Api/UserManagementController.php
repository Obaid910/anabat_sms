<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UserManagementController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request)
    {
        $query = User::with(['branch', 'roles']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by branch
        if ($request->has('branch_id')) {
            $query->where('branch_id', $request->branch_id);
        }

        // Filter by role
        if ($request->has('role')) {
            $query->role($request->role);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->get('per_page', 15);
        $users = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
            'branch_id' => 'required|exists:branches,id',
            'status' => 'nullable|in:active,inactive,suspended',
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,name',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'branch_id' => $request->branch_id,
            'status' => $request->status ?? 'active',
        ]);

        // Assign roles
        if ($request->has('roles')) {
            $user->assignRole($request->roles);
        }

        // Log user creation
        $user->logActivity(
            UserActivity::TYPE_PROFILE_UPDATE,
            'User account created by administrator',
            ['created_by' => $request->user()->id],
            $request->ip(),
            $request->userAgent()
        );

        return response()->json([
            'success' => true,
            'message' => 'User created successfully.',
            'data' => $user->load(['branch', 'roles']),
        ], 201);
    }

    /**
     * Display the specified user.
     */
    public function show($id)
    {
        $user = User::with(['branch', 'roles.permissions', 'activities' => function ($query) {
            $query->orderBy('created_at', 'desc')->limit(10);
        }])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $user,
        ]);
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'email', Rule::unique('users')->ignore($id)],
            'phone' => 'nullable|string|max:20',
            'branch_id' => 'sometimes|required|exists:branches,id',
            'status' => 'sometimes|required|in:active,inactive,suspended',
        ]);

        $oldData = $user->only(['name', 'email', 'phone', 'branch_id', 'status']);
        $user->update($request->only(['name', 'email', 'phone', 'branch_id', 'status']));

        // Log user update
        $user->logActivity(
            UserActivity::TYPE_PROFILE_UPDATE,
            'User account updated by administrator',
            [
                'updated_by' => $request->user()->id,
                'old' => $oldData,
                'new' => $user->only(['name', 'email', 'phone', 'branch_id', 'status'])
            ],
            $request->ip(),
            $request->userAgent()
        );

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully.',
            'data' => $user->load(['branch', 'roles']),
        ]);
    }

    /**
     * Remove the specified user.
     */
    public function destroy(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Prevent self-deletion
        if ($user->id === $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot delete your own account.',
            ], 400);
        }

        // Log before deletion
        $user->logActivity(
            UserActivity::TYPE_PROFILE_UPDATE,
            'User account deleted by administrator',
            ['deleted_by' => $request->user()->id],
            $request->ip(),
            $request->userAgent()
        );

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully.',
        ]);
    }

    /**
     * Update user status.
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:active,inactive,suspended',
        ]);

        $user = User::findOrFail($id);
        $oldStatus = $user->status;
        $user->update(['status' => $request->status]);

        // Revoke all tokens if suspended or inactive
        if (in_array($request->status, ['suspended', 'inactive'])) {
            $user->tokens()->delete();
        }

        // Log status change
        $user->logActivity(
            UserActivity::TYPE_STATUS_CHANGE,
            "User status changed from {$oldStatus} to {$request->status}",
            [
                'changed_by' => $request->user()->id,
                'old_status' => $oldStatus,
                'new_status' => $request->status
            ],
            $request->ip(),
            $request->userAgent()
        );

        return response()->json([
            'success' => true,
            'message' => 'User status updated successfully.',
            'data' => $user,
        ]);
    }

    /**
     * Assign roles to user.
     */
    public function assignRoles(Request $request, $id)
    {
        $request->validate([
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,name',
        ]);

        $user = User::findOrFail($id);
        $oldRoles = $user->roles->pluck('name')->toArray();
        
        $user->syncRoles($request->roles);

        // Log role assignment
        $user->logActivity(
            UserActivity::TYPE_ROLE_ASSIGNED,
            'User roles updated',
            [
                'assigned_by' => $request->user()->id,
                'old_roles' => $oldRoles,
                'new_roles' => $request->roles
            ],
            $request->ip(),
            $request->userAgent()
        );

        return response()->json([
            'success' => true,
            'message' => 'Roles assigned successfully.',
            'data' => $user->load('roles'),
        ]);
    }

    /**
     * Assign permissions to user.
     */
    public function assignPermissions(Request $request, $id)
    {
        $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        $user = User::findOrFail($id);
        $oldPermissions = $user->permissions->pluck('name')->toArray();
        
        $user->syncPermissions($request->permissions);

        // Log permission assignment
        $user->logActivity(
            UserActivity::TYPE_PERMISSION_GRANTED,
            'User permissions updated',
            [
                'assigned_by' => $request->user()->id,
                'old_permissions' => $oldPermissions,
                'new_permissions' => $request->permissions
            ],
            $request->ip(),
            $request->userAgent()
        );

        return response()->json([
            'success' => true,
            'message' => 'Permissions assigned successfully.',
            'data' => $user->load('permissions'),
        ]);
    }

    /**
     * Get user activity log.
     */
    public function activityLog(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $perPage = $request->get('per_page', 15);
        
        $activities = $user->activities()
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $activities,
        ]);
    }

    /**
     * Get all roles.
     */
    public function getRoles()
    {
        $roles = Role::with('permissions')->get();

        return response()->json([
            'success' => true,
            'data' => $roles,
        ]);
    }

    /**
     * Get all permissions.
     */
    public function getPermissions()
    {
        $permissions = Permission::all();

        return response()->json([
            'success' => true,
            'data' => $permissions,
        ]);
    }

    /**
     * Reset user password (admin).
     */
    public function resetUserPassword(Request $request, $id)
    {
        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::findOrFail($id);
        $user->update([
            'password' => Hash::make($request->password),
        ]);

        // Revoke all user tokens
        $user->tokens()->delete();

        // Log password reset
        $user->logActivity(
            UserActivity::TYPE_PASSWORD_RESET,
            'Password reset by administrator',
            ['reset_by' => $request->user()->id],
            $request->ip(),
            $request->userAgent()
        );

        return response()->json([
            'success' => true,
            'message' => 'Password reset successfully.',
        ]);
    }

    /**
     * Get active sessions for a user.
     */
    public function getSessions($id)
    {
        $user = User::findOrFail($id);
        $tokens = $user->tokens()->get();

        return response()->json([
            'success' => true,
            'data' => $tokens->map(function ($token) {
                return [
                    'id' => $token->id,
                    'name' => $token->name,
                    'last_used_at' => $token->last_used_at,
                    'created_at' => $token->created_at,
                    'expires_at' => $token->expires_at,
                ];
            }),
        ]);
    }

    /**
     * Revoke a specific session.
     */
    public function revokeSession(Request $request, $id, $tokenId)
    {
        $user = User::findOrFail($id);
        $token = $user->tokens()->where('id', $tokenId)->first();

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Session not found.',
            ], 404);
        }

        $token->delete();

        // Log session revocation
        $user->logActivity(
            UserActivity::TYPE_LOGOUT,
            'Session revoked by administrator',
            [
                'revoked_by' => $request->user()->id,
                'token_id' => $tokenId
            ],
            $request->ip(),
            $request->userAgent()
        );

        return response()->json([
            'success' => true,
            'message' => 'Session revoked successfully.',
        ]);
    }

    /**
     * Revoke all sessions for a user.
     */
    public function revokeAllSessions(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $tokenCount = $user->tokens()->count();
        $user->tokens()->delete();

        // Log all sessions revocation
        $user->logActivity(
            UserActivity::TYPE_LOGOUT,
            'All sessions revoked by administrator',
            [
                'revoked_by' => $request->user()->id,
                'token_count' => $tokenCount
            ],
            $request->ip(),
            $request->userAgent()
        );

        return response()->json([
            'success' => true,
            'message' => 'All sessions revoked successfully.',
        ]);
    }
}
