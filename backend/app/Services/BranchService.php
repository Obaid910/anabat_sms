<?php

namespace App\Services;

use App\Models\Branch;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class BranchService
{
    /**
     * Get all active branches.
     */
    public function getActiveBranches(): Collection
    {
        return Cache::remember('active_branches', 3600, function () {
            return Branch::where('status', 'active')->get();
        });
    }

    /**
     * Get all branches with optional filters.
     */
    public function getAllBranches(array $filters = []): Collection
    {
        $query = Branch::query();

        // Filter by specific branch ID (for Branch Admin and staff)
        if (isset($filters['branch_id'])) {
            $query->where('id', $filters['branch_id']);
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', "%{$filters['search']}%")
                  ->orWhere('code', 'like', "%{$filters['search']}%");
            });
        }

        return $query->get();
    }

    /**
     * Get a branch by ID.
     */
    public function getBranchById(int $id): ?Branch
    {
        return Branch::find($id);
    }

    /**
     * Get a branch by code.
     */
    public function getBranchByCode(string $code): ?Branch
    {
        return Branch::where('code', $code)->first();
    }

    /**
     * Create a new branch.
     */
    public function createBranch(array $data): Branch
    {
        DB::beginTransaction();
        try {
            $branch = Branch::create([
                'name' => $data['name'],
                'code' => $data['code'],
                'address' => $data['address'] ?? null,
                'contact_info' => $data['contact_info'] ?? null,
                'status' => $data['status'] ?? 'active',
            ]);

            // Set default settings if provided
            if (isset($data['settings']) && is_array($data['settings'])) {
                foreach ($data['settings'] as $key => $value) {
                    $branch->setSetting($key, $value);
                }
            }

            DB::commit();
            $this->clearCache();

            return $branch->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update an existing branch.
     */
    public function updateBranch(int $id, array $data): Branch
    {
        DB::beginTransaction();
        try {
            $branch = Branch::findOrFail($id);

            $branch->update([
                'name' => $data['name'] ?? $branch->name,
                'code' => $data['code'] ?? $branch->code,
                'address' => $data['address'] ?? $branch->address,
                'contact_info' => $data['contact_info'] ?? $branch->contact_info,
                'status' => $data['status'] ?? $branch->status,
            ]);

            // Update settings if provided
            if (isset($data['settings']) && is_array($data['settings'])) {
                foreach ($data['settings'] as $key => $value) {
                    $branch->setSetting($key, $value);
                }
            }

            DB::commit();
            $this->clearCache();

            return $branch->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete a branch (soft delete).
     */
    public function deleteBranch(int $id): bool
    {
        DB::beginTransaction();
        try {
            $branch = Branch::findOrFail($id);

            // Check if branch has users
            if ($branch->users()->count() > 0) {
                throw new \Exception('Cannot delete branch with associated users.');
            }

            $branch->delete();

            DB::commit();
            $this->clearCache();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Activate a branch.
     */
    public function activateBranch(int $id): Branch
    {
        $branch = Branch::findOrFail($id);
        $branch->update(['status' => 'active']);
        $this->clearCache();

        return $branch;
    }

    /**
     * Deactivate a branch.
     */
    public function deactivateBranch(int $id): Branch
    {
        $branch = Branch::findOrFail($id);
        $branch->update(['status' => 'inactive']);
        $this->clearCache();

        return $branch;
    }

    /**
     * Get branch settings.
     */
    public function getBranchSettings(int $branchId): array
    {
        $branch = Branch::findOrFail($branchId);
        $settings = [];

        foreach ($branch->settings as $setting) {
            $settings[$setting->setting_key] = $setting->setting_value;
        }

        return $settings;
    }

    /**
     * Update branch settings.
     */
    public function updateBranchSettings(int $branchId, array $settings): void
    {
        $branch = Branch::findOrFail($branchId);

        foreach ($settings as $key => $value) {
            $branch->setSetting($key, $value);
        }

        $this->clearCache();
    }

    /**
     * Clear branch-related cache.
     */
    protected function clearCache(): void
    {
        Cache::forget('active_branches');
    }

    /**
     * Get branch statistics.
     */
    public function getBranchStatistics(int $branchId): array
    {
        $branch = Branch::findOrFail($branchId);

        return [
            'total_users' => $branch->users()->count(),
            'active_users' => $branch->users()->where('status', 'active')->count(),
            'inactive_users' => $branch->users()->where('status', 'inactive')->count(),
        ];
    }
}
