<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class BranchAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // If user is not authenticated, let auth middleware handle it
        if (!$user) {
            return $next($request);
        }

        // Super admin can access all branches
        if ($user->hasRole('super_admin')) {
            return $next($request);
        }

        // Get branch ID from request (header, query, or route parameter)
        $requestedBranchId = $this->getBranchIdFromRequest($request);

        // If no branch ID is requested, allow the request
        if (!$requestedBranchId) {
            return $next($request);
        }

        // Check if user belongs to the requested branch
        if ($user->branch_id != $requestedBranchId) {
            return response()->json([
                'message' => 'You do not have access to this branch.',
            ], 403);
        }

        return $next($request);
    }

    /**
     * Get branch ID from request.
     */
    protected function getBranchIdFromRequest(Request $request): ?int
    {
        // Check header first
        if ($request->header('X-Branch-Id')) {
            return (int) $request->header('X-Branch-Id');
        }

        // Check query parameter
        if ($request->query('branch_id')) {
            return (int) $request->query('branch_id');
        }

        // Check route parameter
        if ($request->route('branch_id')) {
            return (int) $request->route('branch_id');
        }

        if ($request->route('branch')) {
            return (int) $request->route('branch');
        }

        return null;
    }
}
