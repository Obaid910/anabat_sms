<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Symfony\Component\HttpFoundation\Response;

class SetBranchContext
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->branch_id) {
            // Set the current branch in config for easy access throughout the application
            Config::set('app.current_branch_id', $user->branch_id);
            
            // You can also set it in the request for convenience
            $request->merge(['current_branch_id' => $user->branch_id]);
        }

        return $next($request);
    }
}
