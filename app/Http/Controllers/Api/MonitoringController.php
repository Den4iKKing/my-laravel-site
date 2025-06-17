<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\items_lib;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;

class MonitoringController extends Controller
{
    private const CACHE_FILE_PATH = 'server_data.json';

    /**
     * Get cached server data (оригинальный роут)
     *
     * @return JsonResponse
     */
    public function getServerCacheData(): JsonResponse
    {
        $cachePath = storage_path('/app/' . self::CACHE_FILE_PATH);

        if (!file_exists($cachePath)) {
            return response()->json([
                'error' => 'Cache file not found. Run: php artisan monitoring:update',
                'data' => []
            ], 404);
        }

        $cacheData = json_decode(file_get_contents($cachePath), true);

        if (!$cacheData) {
            return response()->json([
                'error' => 'Invalid cache data',
                'data' => []
            ], 500);
        }

        return response()->json($cacheData);
    }

    /**
     * Get library items data (оригинальный роут)
     *
     * @return Collection
     */
    public function libsdata(): Collection
    {
        $appUrl = env('APP_URL');

        return items_lib::all(['shortname', 'image'])->map(function ($item) use ($appUrl) {
            $item->image = $appUrl . $item->image;
            return $item;
        });
    }
}