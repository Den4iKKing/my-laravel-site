<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;
class LogPostRequestMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $ipAddress = $request->header('CF-Connecting-IP');

        if ($request->isMethod('POST')) {
            Log::channel('post_requests')->info('POST request from IP: ' . $ipAddress . ' to ' . $request->fullUrl());
            Log::channel('post_requests')->info('Request data: ' . json_encode($request->all()));
        }

        return $next($request);
    }
}
