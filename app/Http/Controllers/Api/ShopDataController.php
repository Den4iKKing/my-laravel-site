<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Server;
use App\Models\Category;
use App\Models\ShopItem;
use Illuminate\Http\JsonResponse;

class ShopDataController extends Controller
{
    /**
     * Получить список серверов, категорий и предметов для фронта.
     *
     * @return JsonResponse
     */
    public function index()
    {
        $servers = Server::where('visible', true)
            ->select('id', 'ip', 'name', 'query_port', 'game_port', 'zid')
            ->orderByDesc('zid')
            ->get();

        $categories = Category::where('visible', true)
            ->select('id', 'zid', 'icon', 'name')
            ->orderByDesc('zid')
            ->get();

        $shopItems = ShopItem::where('visible', true)
            ->select('id', 'name', 'price', 'atr', 'image', 'sale', 'about', 'server_id', 'category_id', 'zid')
            ->with(['server:id,name', 'category:id,name'])
            ->orderByDesc('zid')
            ->get();

        return response()->json([
            'servers' => $servers,
            'categories' => $categories,
            'shop_items' => $shopItems,
        ]);
    }

}
