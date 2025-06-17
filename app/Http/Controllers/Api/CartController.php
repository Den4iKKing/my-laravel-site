<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\PaymentBonus;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use App\Models\Cart;
use App\Models\BuyLogNew;
use App\Models\OtherLogs;


use App\Models\ShopItem;
use App\Models\Server;
use App\Models\User;
use App\Models\BuyLog;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;


class CartController extends Controller
{
    public function getBonuses(Request $request)
    {
        $bonuses = PaymentBonus::select('min_amount as threshold', 'bonus_percent as percent')
            ->orderBy('min_amount', 'asc')
            ->get();

        return response()->json($bonuses);
    }
    public function get_user_balance(Request $request)
    {
        $user = $request->user();
        return response()->json(['balance' => $user->balance]);
    }

    public function checkApi(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'your_data' => $request->all(),
        ], 200);

    }


    public function updateBalance(Request $request)
    {
        $validated = $request->validate([
            'steamid' => 'required|string',
            'balance' => 'required|numeric',
            'type' => 'required|string|in:add,subtract',
            'message' => 'nullable|string',
        ]);

        $user = User::where('steamid', $validated['steamid'])->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $oldBalance = $user->balance;

        if ($validated['type'] === 'add') {
            $user->balance += $validated['balance'];
            $action = 'Пополнение';
        } elseif ($validated['type'] === 'subtract') {
            $user->balance -= $validated['balance'];
            $action = 'Списание';
        }

        $user->save();

        OtherLogs::create([
            'steamid' => $validated['steamid'],
            'sum' => $validated['balance'],
            'name' => $user->name ?? 'Неизвестно',
            'created_at' => Carbon::now('Europe/Moscow'),

            'message' => $validated['message'] ?? null,
        ]);
        $botToken = env('TOKEN_BOT_TG');
        $chatIds = explode(',', env('TELEGRAM_CHAT_IDS', '491891799,6016436944,587982989'));

        $message = "💰 Изменение баланса:\n" .
            "👤 SteamID: {$validated['steamid']}\n" .
            "📈 Тип: {$action}\n" .
            "💵 Сумма: {$validated['balance']}\n" .
            "💳 Баланс до: {$oldBalance}\n" .
            "💳 Баланс после: {$user->balance}";

        foreach ($chatIds as $chatId) {
            $url = 'https://api.telegram.org/bot' . $botToken . '/sendMessage?' . http_build_query([
                    'chat_id' => $chatId,
                    'text' => $message
                ]);

            try {
                $response = @file_get_contents($url);
                if ($response === false) {
                    error_log('Ошибка при отправке сообщения в Telegram для chat_id ' . $chatId);
                }
            } catch (Exception $e) {
                error_log('Исключение: ' . $e->getMessage());
            }
        }

        return response()->json(['message' => 'Balance updated successfully', 'balance' => $user->balance]);
    }

    public function getCart(Request $request)
    {
        $validator = Validator::make($request->query(), [
            'steamid' => 'required|string',
            'server_id' => 'required|integer|exists:servers,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $steamid = $request->query('steamid');
        $server_id = $request->query('server_id');

        $user = User::where('steamid', $steamid)->first();

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $cart = Cart::where('server_id', $server_id)
            ->where('user_id', $user->id)
            ->first();

        if ($cart) {
            $cartData = $cart->toArray();
            $cartData['user_id'] = $user->steamid;
            $cartData['server_id'] = $server_id;

            unset($cartData['price']);

            if (!empty($cartData['items'])) {
                foreach ($cartData['items'] as &$item) {
                    unset($item['price']);

                    if (isset($item['image']) && strpos($item['image'], '/images/') === 0) {
                        $item['image'] = env('APP_URL') . $item['image'];
                    }

                    if (isset($item['command'])) {
                        $item['command'] = str_ireplace(
                            ['%steamid%', '%STEAMID%', '%PLAYER%', '%player%'],
                            $user->steamid,
                            $item['command']
                        );
                    }
                }
            }

            return response()->json($cartData);
        }

        return response()->json(['error' => 'Cart not found'], 404);
    }


    public function removeItemFromCart($steamid, $server_id, $shop_cart_id)
    {
        $user = User::where('steamid', $steamid)->first();

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $cart = Cart::where('server_id', $server_id)
            ->where('user_id', $user->id)
            ->first();

        if (!$cart) {
            return response()->json(['error' => 'Cart not found'], 404);
        }

        $itemIndex = collect($cart->items)->search(fn($item) => $item['shop_cart_id'] === $shop_cart_id);

        if ($itemIndex === false) {
            return response()->json(['error' => 'Item not found in cart'], 404);
        }

        $price = $cart->items[$itemIndex]['price'];
        $name = $cart->items[$itemIndex]['name'];

        $cart->items = collect($cart->items)->reject(fn($item) => $item['shop_cart_id'] === $shop_cart_id)->values()->all();
        $cart->save();

        $botToken = env('TOKEN_BOT_TG');
        $chatIds = explode(',', env('TELEGRAM_CHAT_IDS', '491891799,6016436944,587982989'));

        BuyLogNew::create([
            'steamid' => $steamid,
            'price' => $price,
            'item_name' => $name,
            'created_at' => Carbon::now('Europe/Moscow'),
            'stats_name' => $server_id,
        ]);
//        $message = "📌 Лог Взятия с корзины:\n" .
//            "SteamID: {$steamid}\n" .
//            "Цена: {$price}\n" .
//            "Предмет: {$name}\n" .
//            "Статистика Сервера: {$server_id}";
//
//
//        foreach ($chatIds as $chatId) {
//            $url = 'https://api.telegram.org/bot' . $botToken . '/sendMessage?' . http_build_query([
//                    'chat_id' => $chatId,
//                    'text' => $message
//                ]);
//
//            try {
//                $response = @file_get_contents($url);
//                if ($response === false) {
//                    error_log('Ошибка при отправке сообщения в Telegram для chat_id ' . $chatId);
//                }
//            } catch (Exception $e) {
//                error_log('Исключение: ' . $e->getMessage());
//            }
//        }
        return response()->json($cart);
    }


}
