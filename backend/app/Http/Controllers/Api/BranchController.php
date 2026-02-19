<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBranchRequest;
use App\Http\Requests\UpdateBranchRequest;
use App\Services\BranchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    protected BranchService $branchService;

    public function __construct(BranchService $branchService)
    {
        $this->branchService = $branchService;
    }

    /**
     * Display a listing of branches.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = auth()->user();
            
            // Only Super Admin and Branch Admin can view branches
            if (!$user->hasAnyRole(['Super Admin', 'Branch Admin'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'You do not have permission to view branches.',
                ], 403);
            }
            
            $filters = [
                'status' => $request->query('status'),
                'search' => $request->query('search'),
            ];

            // Super Admin can see all branches
            if ($user->hasRole('Super Admin')) {
                $branches = $this->branchService->getAllBranches($filters);
            } else {
                // Branch Admin can only see their own branch
                if ($user->branch_id) {
                    $filters['branch_id'] = $user->branch_id;
                    $branches = $this->branchService->getAllBranches($filters);
                } else {
                    // Branch Admin has no branch assigned
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
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve branches.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get only active branches.
     */
    public function active(): JsonResponse
    {
        try {
            $branches = $this->branchService->getActiveBranches();

            return response()->json([
                'success' => true,
                'data' => $branches,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve active branches.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created branch.
     */
    public function store(StoreBranchRequest $request): JsonResponse
    {
        try {
            $branch = $this->branchService->createBranch($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Branch created successfully.',
                'data' => $branch,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create branch.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified branch.
     */
    public function show(int $id): JsonResponse
    {
        try {
            $user = auth()->user();
            
            // Only Super Admin and Branch Admin can view branch details
            if (!$user->hasAnyRole(['Super Admin', 'Branch Admin'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'You do not have permission to view branch details.',
                ], 403);
            }
            
            // Branch Admin can only view their own branch
            if ($user->hasRole('Branch Admin') && $user->branch_id != $id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You can only view your own branch details.',
                ], 403);
            }
            
            $branch = $this->branchService->getBranchById($id);

            if (!$branch) {
                return response()->json([
                    'success' => false,
                    'message' => 'Branch not found.',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $branch->load('settings'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve branch.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified branch.
     */
    public function update(UpdateBranchRequest $request, int $id): JsonResponse
    {
        try {
            $branch = $this->branchService->updateBranch($id, $request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Branch updated successfully.',
                'data' => $branch,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update branch.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified branch.
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            // Only Super Admin can delete branches
            if (!auth()->user()->hasRole('Super Admin')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Only Super Admin can delete branches.',
                ], 403);
            }
            
            $this->branchService->deleteBranch($id);

            return response()->json([
                'success' => true,
                'message' => 'Branch deleted successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete branch.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Activate a branch.
     */
    public function activate(int $id): JsonResponse
    {
        try {
            $user = auth()->user();
            
            // Only Super Admin or Branch Admin of this branch can activate
            if (!$user->hasRole('Super Admin') && $user->branch_id != $id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You can only activate your own branch.',
                ], 403);
            }
            
            $branch = $this->branchService->activateBranch($id);

            return response()->json([
                'success' => true,
                'message' => 'Branch activated successfully.',
                'data' => $branch,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to activate branch.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Deactivate a branch.
     */
    public function deactivate(int $id): JsonResponse
    {
        try {
            $user = auth()->user();
            
            // Only Super Admin or Branch Admin of this branch can deactivate
            if (!$user->hasRole('Super Admin') && $user->branch_id != $id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You can only deactivate your own branch.',
                ], 403);
            }
            
            $branch = $this->branchService->deactivateBranch($id);

            return response()->json([
                'success' => true,
                'message' => 'Branch deactivated successfully.',
                'data' => $branch,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to deactivate branch.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get branch settings.
     */
    public function settings(int $id): JsonResponse
    {
        try {
            $settings = $this->branchService->getBranchSettings($id);

            return response()->json([
                'success' => true,
                'data' => $settings,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve branch settings.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update branch settings.
     */
    public function updateSettings(Request $request, int $id): JsonResponse
    {
        try {
            $request->validate([
                'settings' => ['required', 'array'],
            ]);

            $this->branchService->updateBranchSettings($id, $request->input('settings'));

            return response()->json([
                'success' => true,
                'message' => 'Branch settings updated successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update branch settings.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get branch statistics.
     */
    public function statistics(int $id): JsonResponse
    {
        try {
            $statistics = $this->branchService->getBranchStatistics($id);

            return response()->json([
                'success' => true,
                'data' => $statistics,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve branch statistics.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
