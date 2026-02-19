<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\LeadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LeadController extends Controller
{
    protected LeadService $leadService;

    public function __construct(LeadService $leadService)
    {
        $this->leadService = $leadService;
    }

    /**
     * Display a listing of leads.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $filters = [
                'branch_id' => $request->query('branch_id'),
                'status' => $request->query('status'),
                'priority' => $request->query('priority'),
                'source' => $request->query('source'),
                'assigned_to' => $request->query('assigned_to'),
                'from_date' => $request->query('from_date'),
                'to_date' => $request->query('to_date'),
                'search' => $request->query('search'),
                'active_only' => $request->query('active_only'),
                'needs_followup' => $request->query('needs_followup'),
                'sort_by' => $request->query('sort_by'),
                'sort_order' => $request->query('sort_order'),
            ];

            $perPage = $request->query('per_page', 15);
            $leads = $this->leadService->getAllLeads($filters, $perPage);

            return response()->json([
                'success' => true,
                'data' => $leads,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve leads.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created lead.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'branch_id' => 'required|exists:branches,id',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'alternate_phone' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:255',
            'grade_applying_for' => 'nullable|string|max:255',
            'previous_school' => 'nullable|string|max:255',
            'academic_year' => 'nullable|string|max:255',
            'parent_name' => 'required|string|max:255',
            'parent_phone' => 'required|string|max:20',
            'parent_email' => 'nullable|email|max:255',
            'parent_occupation' => 'nullable|string|max:255',
            'relationship' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:255',
            'referral_name' => 'nullable|string|max:255',
            'status' => 'nullable|string',
            'priority' => 'nullable|in:low,medium,high',
            'next_follow_up_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
            'estimated_fee' => 'nullable|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $lead = $this->leadService->createLead($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Lead created successfully.',
                'data' => $lead,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create lead.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified lead.
     */
    public function show(int $id): JsonResponse
    {
        try {
            $lead = $this->leadService->getLeadById($id);

            if (!$lead) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lead not found.',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $lead,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve lead.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified lead.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'alternate_phone' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:255',
            'grade_applying_for' => 'nullable|string|max:255',
            'previous_school' => 'nullable|string|max:255',
            'academic_year' => 'nullable|string|max:255',
            'parent_name' => 'sometimes|required|string|max:255',
            'parent_phone' => 'sometimes|required|string|max:20',
            'parent_email' => 'nullable|email|max:255',
            'parent_occupation' => 'nullable|string|max:255',
            'relationship' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:255',
            'referral_name' => 'nullable|string|max:255',
            'status' => 'nullable|string',
            'priority' => 'nullable|in:low,medium,high',
            'next_follow_up_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
            'estimated_fee' => 'nullable|numeric',
            'status_change_reason' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $lead = $this->leadService->updateLead($id, $validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Lead updated successfully.',
                'data' => $lead,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update lead.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified lead.
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $this->leadService->deleteLead($id);

            return response()->json([
                'success' => true,
                'message' => 'Lead deleted successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete lead.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Change lead status.
     */
    public function changeStatus(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|string',
            'reason' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $lead = $this->leadService->changeStatus(
                $id,
                $request->status,
                $request->reason
            );

            return response()->json([
                'success' => true,
                'message' => 'Lead status updated successfully.',
                'data' => $lead,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update lead status.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Assign lead to a user.
     */
    public function assign(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $lead = $this->leadService->assignLead($id, $request->user_id);

            return response()->json([
                'success' => true,
                'message' => 'Lead assigned successfully.',
                'data' => $lead,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to assign lead.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Schedule a followup.
     */
    public function scheduleFollowup(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|string',
            'scheduled_at' => 'required|date',
            'notes' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $followup = $this->leadService->scheduleFollowup($id, $validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Follow-up scheduled successfully.',
                'data' => $followup,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to schedule follow-up.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Complete a followup.
     */
    public function completeFollowup(Request $request, int $leadId, int $followupId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'outcome' => 'nullable|string',
            'next_action' => 'nullable|string',
            'next_follow_up_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $followup = $this->leadService->completeFollowup($followupId, $validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Follow-up completed successfully.',
                'data' => $followup,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to complete follow-up.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Convert lead to student.
     */
    public function convertToStudent(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'nullable|email|unique:users,email',
            'password' => 'nullable|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $student = $this->leadService->convertToStudent($id, $validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Lead converted to student successfully.',
                'data' => $student,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to convert lead to student.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get leads needing follow-up.
     */
    public function needsFollowup(): JsonResponse
    {
        try {
            $leads = $this->leadService->getLeadsNeedingFollowup();

            return response()->json([
                'success' => true,
                'data' => $leads,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve leads.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get lead analytics.
     */
    public function analytics(Request $request): JsonResponse
    {
        try {
            $filters = [
                'branch_id' => $request->query('branch_id'),
                'from_date' => $request->query('from_date'),
                'to_date' => $request->query('to_date'),
            ];

            $analytics = $this->leadService->getAnalytics($filters);

            return response()->json([
                'success' => true,
                'data' => $analytics,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve analytics.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Import leads.
     */
    public function import(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'branch_id' => 'required|exists:branches,id',
            'leads' => 'required|array',
            'leads.*.first_name' => 'required|string',
            'leads.*.last_name' => 'required|string',
            'leads.*.phone' => 'required|string',
            'leads.*.parent_name' => 'required|string',
            'leads.*.parent_phone' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $result = $this->leadService->importLeads(
                $request->leads,
                $request->branch_id
            );

            return response()->json([
                'success' => true,
                'message' => 'Import completed.',
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to import leads.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Export leads.
     */
    public function export(Request $request): JsonResponse
    {
        try {
            $filters = [
                'branch_id' => $request->query('branch_id'),
                'status' => $request->query('status'),
                'from_date' => $request->query('from_date'),
                'to_date' => $request->query('to_date'),
            ];

            $leads = $this->leadService->exportLeads($filters);

            return response()->json([
                'success' => true,
                'data' => $leads,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to export leads.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
