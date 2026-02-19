<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BranchController;
use App\Http\Controllers\Api\LeadController;
use App\Http\Controllers\Api\UserManagementController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Health check endpoint
Route::get('/health', function () {
    return response()->json(['status' => 'healthy'], 200);
});

// Public routes
// Registration is disabled - users should be created by administrators only
// Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Authentication routes
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::get('/activity-log', [AuthController::class, 'activityLog']);

    // User management routes (admin only)
    Route::prefix('users')->middleware('role:Super Admin|Branch Admin')->group(function () {
        Route::get('/', [UserManagementController::class, 'index']);
        Route::post('/', [UserManagementController::class, 'store']);
        Route::get('/roles', [UserManagementController::class, 'getRoles']);
        Route::get('/permissions', [UserManagementController::class, 'getPermissions']);
        Route::get('/{user}', [UserManagementController::class, 'show']);
        Route::put('/{user}', [UserManagementController::class, 'update']);
        Route::delete('/{user}', [UserManagementController::class, 'destroy']);
        Route::patch('/{user}/status', [UserManagementController::class, 'updateStatus']);
        Route::post('/{user}/roles', [UserManagementController::class, 'assignRoles']);
        Route::post('/{user}/permissions', [UserManagementController::class, 'assignPermissions']);
        Route::get('/{user}/activity-log', [UserManagementController::class, 'activityLog']);
        Route::post('/{user}/reset-password', [UserManagementController::class, 'resetUserPassword']);
        Route::get('/{user}/sessions', [UserManagementController::class, 'getSessions']);
        Route::delete('/{user}/sessions/{token}', [UserManagementController::class, 'revokeSession']);
        Route::delete('/{user}/sessions', [UserManagementController::class, 'revokeAllSessions']);
    });

    // Branch management routes (Super Admin and Branch Admin only)
    Route::prefix('branches')->middleware('role:Super Admin|Branch Admin')->group(function () {
        Route::get('/', [BranchController::class, 'index']);
        Route::get('/active', [BranchController::class, 'active']);
        Route::post('/', [BranchController::class, 'store']);
        Route::get('/{branch}', [BranchController::class, 'show']);
        Route::put('/{branch}', [BranchController::class, 'update']);
        Route::delete('/{branch}', [BranchController::class, 'destroy']);
        Route::post('/{branch}/activate', [BranchController::class, 'activate']);
        Route::post('/{branch}/deactivate', [BranchController::class, 'deactivate']);
        Route::get('/{branch}/settings', [BranchController::class, 'settings']);
        Route::put('/{branch}/settings', [BranchController::class, 'updateSettings']);
        Route::get('/{branch}/statistics', [BranchController::class, 'statistics']);
    });

    // Lead management routes
    Route::prefix('leads')->group(function () {
        Route::get('/', [LeadController::class, 'index']);
        Route::post('/', [LeadController::class, 'store']);
        Route::get('/needs-followup', [LeadController::class, 'needsFollowup']);
        Route::get('/analytics', [LeadController::class, 'analytics']);
        Route::post('/import', [LeadController::class, 'import']);
        Route::get('/export', [LeadController::class, 'export']);
        Route::get('/{lead}', [LeadController::class, 'show']);
        Route::put('/{lead}', [LeadController::class, 'update']);
        Route::delete('/{lead}', [LeadController::class, 'destroy']);
        Route::patch('/{lead}/status', [LeadController::class, 'changeStatus']);
        Route::post('/{lead}/assign', [LeadController::class, 'assign']);
        Route::post('/{lead}/followup', [LeadController::class, 'scheduleFollowup']);
        Route::patch('/{lead}/followup/{followup}', [LeadController::class, 'completeFollowup']);
        Route::post('/{lead}/convert', [LeadController::class, 'convertToStudent']);
    });
});
