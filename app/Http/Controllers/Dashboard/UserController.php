<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Cart;
use App\Models\BuyLog;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Показать одного пользователя.
     */
    public function show(User $user)
    {
        return response()->json([
            'user' => $user,
        ]);
    }

    /**
     * Обновить данные пользователя.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'balance' => 'required|numeric|min:0',
            'bonus_balance' => 'nullable|numeric|min:0',
            'group' => 'nullable|string|max:255',
        ]);

        $user->update($validated);

        return redirect()->back()->with('success', 'Пользователь успешно обновлён.');
    }

    /**
     * Удалить пользователя.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->back()->with('success', 'Успех.');
    }

    /**
     * Получить историю покупок пользователя.
     */
    public function getPurchaseHistory(User $user)
    {
        $purchases = BuyLog::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'purchases' => $purchases
        ]);
    }

    /**
     * Получить список серверов.
     */
    public function getServersList()
    {
        $servers = Server::select('id', 'name')->get();

        return response()->json([
            'servers' => $servers
        ]);
    }

    /**
     * Получить корзину пользователя.
     */


    /**
     * Удалить предмет из корзины пользователя.
     */
    public function removeItemFromCart(User $user, $server_id, $item_id)
    {
        $cart = Cart::where('user_id', $user->id)
            ->where('server_id', $server_id)
            ->first();

        if (!$cart) {
            return response()->json([
                'error' => 'Корзина не найдена'
            ], 404);
        }

        // Get the items array
        $items = $cart->items;

        // Check if the item exists
        $itemIndex = collect($items)->search(function ($item) use ($item_id) {
            return $item['shop_cart_id'] === $item_id;
        });

        if ($itemIndex === false) {
            return response()->json([
                'error' => 'Предмет не найден в корзине'
            ], 404);
        }

        // Filter out the item
        $updatedItems = collect($items)->reject(function ($item) use ($item_id) {
            return $item['shop_cart_id'] === $item_id;
        })->values()->all();

        // Assign the modified array back to the model
        $cart->items = $updatedItems;
        $cart->save();

        return response()->json([
            'success' => true,
            'message' => 'Предмет успешно удален из корзины',
            'cart' => $cart
        ]);
    }

    /**
     * Получить корзину пользователя по SteamID и ID сервера (API метод).
     */
    public function getUserCart(User $user, $server_id)
    {
        $cart = Cart::where('user_id', $user->id)
            ->where('server_id', $server_id)
            ->first();

        if (!$cart) {
            return response()->json([
                'cart' => [
                    'items' => []
                ]
            ]);
        }

        // Create a new array with the updated image paths
        $items = $cart->items;
        if (!empty($items)) {
            foreach ($items as $key => $item) {
                if (isset($item['image']) && strpos($item['image'], '/images/') === 0) {
                    $items[$key]['image'] = env('APP_URL') . $item['image'];
                }
            }
        }

        // For display purposes only (not saving back to database)
        $cart->items = $items;

        return response()->json([
            'cart' => $cart
        ]);
    }

    /**
     * Удалить предмет из корзины по API.
     */

}