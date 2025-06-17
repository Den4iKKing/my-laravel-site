<?php

namespace App\Http\Controllers\Dashboard;
use App\Http\Controllers\Controller;

use App\Models\ShopItem;
use App\Models\Category;
use App\Models\Server;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShopItemController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $categoryId = $request->input('category');
        $serverId = $request->input('server');

        $shopItems = ShopItem::query()
            ->when($search, fn ($query) => $query->where('name', 'like', "%$search%"))
            ->when($categoryId, fn ($query) => $query->where('category_id', $categoryId))
            ->when($serverId, fn ($query) => $query->where('server_id', $serverId))
            ->orderByDesc('zid')
            ->paginate(40)
            ->withQueryString();

        $categories = Category::orderByDesc('zid')->get();
        $servers = Server::orderByDesc('zid')->get();

        return Inertia::render('dashboard/shop', [
            'shopItems' => $shopItems,
            'categories' => $categories,
            'servers' => $servers,
            'filters' => [
                'search' => $search,
                'category' => $categoryId,
                'server' => $serverId,
            ],
        ]);
    }


    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'sale' => 'nullable|numeric',
            'zid' => 'nullable|numeric',
            'name' => 'required|string|max:255',
            'about' => 'nullable|string',
            'price' => 'required|numeric',
            'image' => 'nullable|string',
            'atr' => 'nullable',
            'category_id' => 'required|exists:categories,id',
            'server_id' => 'required|exists:servers,id',
        ]);

        ShopItem::create($data);

        return redirect()->back()->with('success', 'Успех.');
    }
    public function update(Request $request, ShopItem $shopItem)
    {
        try {
            $validated = $request->validate([
                'atr' => 'nullable',
                'name' => 'required|string|max:255',
                'image' => 'nullable|string|max:255',
                'visible' => 'nullable',
                'sale' => 'nullable',
                'price' => 'nullable',
                'zid' => 'nullable|numeric',
                'name' => 'required|string|max:255',
                'about' => 'nullable|string',
                'server_id' => 'nullable|exists:servers,id',
                'category_id' => 'nullable|exists:categories,id',
            ]);

            $shopItem->update($validated);

            return redirect()->back()->with('success', 'Успех.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->with('success', 'Успех.');
        }
    }



    public function destroy(ShopItem $shopItem)
    {
        $shopItem->delete();

    }
    public function copy(Request $request)
    {
        $request->validate([
            'item_ids' => 'required|array',
            'item_ids.*' => 'exists:shop_items,id',
            'target_server_id' => 'required|exists:servers,id',
        ]);

        $itemIds = $request->item_ids;
        $targetServerId = $request->target_server_id;

        $items = ShopItem::whereIn('id', $itemIds)->get();

        foreach ($items as $item) {
            $newItem = $item->replicate();

            $newItem->server_id = $targetServerId;
            $newItem->created_at = now();
            $newItem->updated_at = now();

//            if ($item->image && !Str::contains($item->image, 'default')) {
//                $originalPath = str_replace('/storage/', '', $item->image);
//                $extension = pathinfo($originalPath, PATHINFO_EXTENSION);
//                $newFileName = 'shop_items/' . Str::uuid() . '.' . $extension;
//
//                // Копируем файл
//                if (Storage::disk('public')->exists($originalPath)) {
//                    Storage::disk('public')->copy($originalPath, $newFileName);
//                    $newItem->image = Storage::url($newFileName);
//                }
//            }

            $newItem->save();
        }
        return redirect()->back()->with('success', 'Успех.');

    }
}
