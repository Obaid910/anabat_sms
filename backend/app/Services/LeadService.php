<?php

namespace App\Services;

use App\Models\Lead;
use App\Models\LeadFollowup;
use App\Models\LeadStatusHistory;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class LeadService
{
    /**
     * Get all leads with filters and pagination.
     */
    public function getAllLeads(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Lead::with(['branch', 'assignedTo', 'followups']);

        // Filter by branch
        if (isset($filters['branch_id'])) {
            $query->where('branch_id', $filters['branch_id']);
        }

        // Filter by status
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Filter by priority
        if (isset($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }

        // Filter by source
        if (isset($filters['source'])) {
            $query->where('source', $filters['source']);
        }

        // Filter by assigned user
        if (isset($filters['assigned_to'])) {
            $query->where('assigned_to', $filters['assigned_to']);
        }

        // Filter by date range
        if (isset($filters['from_date'])) {
            $query->whereDate('created_at', '>=', $filters['from_date']);
        }
        if (isset($filters['to_date'])) {
            $query->whereDate('created_at', '<=', $filters['to_date']);
        }

        // Search
        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('parent_name', 'like', "%{$search}%");
            });
        }

        // Active leads only
        if (isset($filters['active_only']) && $filters['active_only']) {
            $query->active();
        }

        // Needs follow-up
        if (isset($filters['needs_followup']) && $filters['needs_followup']) {
            $query->needsFollowUpToday();
        }

        // Sorting
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);

        return $query->paginate($perPage);
    }

    /**
     * Get a lead by ID.
     */
    public function getLeadById(int $id): ?Lead
    {
        return Lead::with(['branch', 'assignedTo', 'followups.user', 'statusHistory.changedBy'])
                   ->find($id);
    }

    /**
     * Create a new lead.
     */
    public function createLead(array $data): Lead
    {
        DB::beginTransaction();
        try {
            $lead = Lead::create($data);

            // Record initial status
            LeadStatusHistory::recordChange(
                $lead->id,
                '',
                $lead->status,
                auth()->id(),
                'Lead created'
            );

            // Create initial followup if assigned
            if (isset($data['assigned_to']) && isset($data['next_follow_up_date'])) {
                $this->scheduleFollowup($lead->id, [
                    'type' => LeadFollowup::TYPE_PHONE_CALL,
                    'scheduled_at' => $data['next_follow_up_date'],
                    'notes' => 'Initial follow-up',
                ]);
            }

            DB::commit();
            return $lead->fresh(['branch', 'assignedTo']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to create lead: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Update a lead.
     */
    public function updateLead(int $id, array $data): Lead
    {
        DB::beginTransaction();
        try {
            $lead = Lead::findOrFail($id);
            $oldStatus = $lead->status;

            $lead->update($data);

            // Record status change if status was updated
            if (isset($data['status']) && $data['status'] !== $oldStatus) {
                LeadStatusHistory::recordChange(
                    $lead->id,
                    $oldStatus,
                    $data['status'],
                    auth()->id(),
                    $data['status_change_reason'] ?? null
                );
            }

            DB::commit();
            return $lead->fresh(['branch', 'assignedTo']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to update lead: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Delete a lead.
     */
    public function deleteLead(int $id): bool
    {
        $lead = Lead::findOrFail($id);
        return $lead->delete();
    }

    /**
     * Change lead status.
     */
    public function changeStatus(int $id, string $newStatus, string $reason = null): Lead
    {
        DB::beginTransaction();
        try {
            $lead = Lead::findOrFail($id);
            $oldStatus = $lead->status;

            $lead->update(['status' => $newStatus]);

            LeadStatusHistory::recordChange(
                $lead->id,
                $oldStatus,
                $newStatus,
                auth()->id(),
                $reason
            );

            DB::commit();
            return $lead->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to change lead status: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Assign lead to a user.
     */
    public function assignLead(int $leadId, int $userId): Lead
    {
        $lead = Lead::findOrFail($leadId);
        $lead->update(['assigned_to' => $userId]);
        
        return $lead->fresh(['assignedTo']);
    }

    /**
     * Schedule a followup.
     */
    public function scheduleFollowup(int $leadId, array $data): LeadFollowup
    {
        $data['lead_id'] = $leadId;
        $data['user_id'] = $data['user_id'] ?? auth()->id();
        $data['status'] = LeadFollowup::STATUS_SCHEDULED;

        $followup = LeadFollowup::create($data);

        // Update lead's next follow-up date
        if (isset($data['scheduled_at'])) {
            Lead::where('id', $leadId)->update([
                'next_follow_up_date' => $data['scheduled_at']
            ]);
        }

        return $followup;
    }

    /**
     * Complete a followup.
     */
    public function completeFollowup(int $followupId, array $data): LeadFollowup
    {
        $followup = LeadFollowup::findOrFail($followupId);
        
        $followup->update([
            'status' => LeadFollowup::STATUS_COMPLETED,
            'completed_at' => now(),
            'outcome' => $data['outcome'] ?? null,
            'next_action' => $data['next_action'] ?? null,
            'next_follow_up_date' => $data['next_follow_up_date'] ?? null,
        ]);

        // Update lead's next follow-up date
        if (isset($data['next_follow_up_date'])) {
            $followup->lead->update([
                'next_follow_up_date' => $data['next_follow_up_date']
            ]);
        }

        return $followup->fresh();
    }

    /**
     * Convert lead to student.
     */
    public function convertToStudent(int $leadId, array $studentData): User
    {
        DB::beginTransaction();
        try {
            $lead = Lead::findOrFail($leadId);

            // Create student user
            $student = User::create([
                'branch_id' => $lead->branch_id,
                'name' => $lead->full_name,
                'email' => $studentData['email'] ?? $lead->email,
                'phone' => $lead->phone,
                'password' => bcrypt($studentData['password'] ?? 'student123'),
                'status' => 'active',
                // Add other student-specific fields
            ]);

            // Assign student role
            $student->assignRole('Student');

            // Update lead
            $lead->update([
                'status' => Lead::STATUS_ENROLLED,
                'converted_to_student_id' => $student->id,
                'converted_at' => now(),
            ]);

            // Record status change
            LeadStatusHistory::recordChange(
                $lead->id,
                $lead->status,
                Lead::STATUS_ENROLLED,
                auth()->id(),
                'Converted to student'
            );

            DB::commit();
            return $student;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to convert lead to student: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get leads that need follow-up today.
     */
    public function getLeadsNeedingFollowup(): Collection
    {
        return Lead::needsFollowUpToday()
                   ->with(['branch', 'assignedTo'])
                   ->get();
    }

    /**
     * Get lead analytics.
     */
    public function getAnalytics(array $filters = []): array
    {
        $query = Lead::query();

        if (isset($filters['branch_id'])) {
            $query->where('branch_id', $filters['branch_id']);
        }

        if (isset($filters['from_date'])) {
            $query->whereDate('created_at', '>=', $filters['from_date']);
        }

        if (isset($filters['to_date'])) {
            $query->whereDate('created_at', '<=', $filters['to_date']);
        }

        return [
            'total_leads' => (clone $query)->count(),
            'active_leads' => (clone $query)->active()->count(),
            'converted_leads' => (clone $query)->converted()->count(),
            'leads_by_status' => (clone $query)->select('status', DB::raw('count(*) as count'))
                                                ->groupBy('status')
                                                ->pluck('count', 'status')
                                                ->toArray(),
            'leads_by_source' => (clone $query)->select('source', DB::raw('count(*) as count'))
                                                ->groupBy('source')
                                                ->pluck('count', 'source')
                                                ->toArray(),
            'leads_by_priority' => (clone $query)->select('priority', DB::raw('count(*) as count'))
                                                  ->groupBy('priority')
                                                  ->pluck('count', 'priority')
                                                  ->toArray(),
            'conversion_rate' => $this->calculateConversionRate($query),
            'needs_followup' => Lead::needsFollowUpToday()->count(),
        ];
    }

    /**
     * Calculate conversion rate.
     */
    private function calculateConversionRate($query): float
    {
        $total = (clone $query)->count();
        if ($total === 0) {
            return 0;
        }

        $converted = (clone $query)->converted()->count();
        return round(($converted / $total) * 100, 2);
    }

    /**
     * Import leads from array.
     */
    public function importLeads(array $leadsData, int $branchId): array
    {
        $imported = 0;
        $failed = 0;
        $errors = [];

        DB::beginTransaction();
        try {
            foreach ($leadsData as $index => $data) {
                try {
                    $data['branch_id'] = $branchId;
                    $this->createLead($data);
                    $imported++;
                } catch (\Exception $e) {
                    $failed++;
                    $errors[] = "Row " . ($index + 1) . ": " . $e->getMessage();
                }
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return [
            'imported' => $imported,
            'failed' => $failed,
            'errors' => $errors,
        ];
    }

    /**
     * Export leads to array.
     */
    public function exportLeads(array $filters = []): Collection
    {
        $query = Lead::with(['branch', 'assignedTo']);

        if (isset($filters['branch_id'])) {
            $query->where('branch_id', $filters['branch_id']);
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['from_date'])) {
            $query->whereDate('created_at', '>=', $filters['from_date']);
        }

        if (isset($filters['to_date'])) {
            $query->whereDate('created_at', '<=', $filters['to_date']);
        }

        return $query->get();
    }
}
