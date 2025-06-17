<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class LogRequestMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $ipAddress = $request->header('CF-Connecting-IP');

        $user = Auth::user();

        if ($user) {
            Log::channel('request_logs')->info('User ' . $user->steamid . ' - Balance before operation: ' . $user->balance . ', Bonus balance: ' . $user->bonus_balance);
        } else {
            Log::channel('request_logs')->info('Unauthorized request from IP: ' . $ipAddress . ' to ' . $request->fullUrl());
        }

        if ($request->isMethod('GET')) {
            Log::channel('request_logs')->info('GET request from IP: ' . $ipAddress . ' to ' . $request->fullUrl());
            Log::channel('request_logs')->info('Request data: ' . json_encode($request->all()));
        }
        if ($request->isMethod('DELETE')) {
            Log::channel('request_logs')->info('DELETE request from IP: ' . $ipAddress . ' to ' . $request->fullUrl());
            Log::channel('request_logs')->info('Request data: ' . json_encode($request->all()));
        }

        if ($request->isMethod('POST')) {
            Log::channel('request_logs')->info('POST request from IP: ' . $ipAddress . ' to ' . $request->fullUrl());
            Log::channel('request_logs')->info('Request data: ' . json_encode($request->all()));
        }

        $response = $next($request);

        if ($user) {
            Log::channel('request_logs')->info('User ' . $user->steamid . ' - Balance after operation: ' . $user->balance . ', Bonus balance: ' . $user->bonus_balance);
        }

        return $response;
    }
}
