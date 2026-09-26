<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        // User is not authenticated
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // User is not approved
        if ($user->status !== 'approved') {
            return response()->json([
                'message' => 'Your account is not approved yet.',
                'status' => $user->status,
            ], 403);
        }
        // Check role
        if (!in_array($user->role, $roles)) {
            return response()->json([
                'message' => 'Forbidden – insufficient permissions'
            ], 403);
        }

        return $next($request);
    }
}
