<?php

namespace App\Http\Controllers;

use App\Models\Server;
use App\Models\ShopItem;
use App\Models\BuyLog;

use App\Models\Cart;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\RateLimiter;
use Carbon\Carbon;

class ShopController extends Controller
{
    public function getShopItemInfo($itemId)
    {
        $item = ShopItem::find($itemId);

        if (!$item) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        $itemData = [
            'id' => $item->id,
            'name' => $item->name,
            'name' => $item->name,

            'price' => $item->sale > 1 ? round($item->price * (1 - $item->sale / 100)) : $item->price,
            'sale' => $item->sale,
            'original_price' => $item->sale > 1 ? $item->price : null,
            'image' => $item->image,
            'about' => $item->about,

            'category' => $item->category ? $item->category->name : null,
            'server' => $item->server ? $item->server->name : null,
            'atr' => $item->atr,
        ];


        return response()->json($itemData);
    }
    public function purchaseItem(Request $request, $itemId)
    {
        $user = Auth::user();
        $key = 'purchase_' . $user->id;
        $validated = $request->validate([
            'quantity' => 'integer|min:1'
        ]);

        $quantity = $validated['quantity'] ?? 1;
        if (RateLimiter::tooManyAttempts($key, 200)) {
            return response()->json(['message' => 'Слишком много попыток, попробуйте позже'], 429);
        }

        RateLimiter::hit($key, 60);


        $item = ShopItem::find($itemId);

        if (!$item) {
            return response()->json(['message' => 'Нет предмета'], 404);
        }

        if ($request->has('modified_atr') && !empty($request->modified_atr)) {
            $baseItems = $request->modified_atr;
        } else {
            $baseItems = json_decode($item->atr, true);
        }

        $allItems = [];

        for ($i = 0; $i < $quantity; $i++) {
            foreach ($baseItems as $baseItem) {
                $itemCopy = $baseItem;

                if (isset($itemCopy['command'])) {
                    $itemCopy['command'] = str_replace('%player%', $user->steamid, $itemCopy['command']);
                }

                $allItems[] = $itemCopy;
            }
        }

        $discountedPrice = $item->sale > 1 ? round($item->price * (1 - $item->sale / 100)) : $item->price;
        $totalPrice = $discountedPrice * $quantity;
        $priceToLog = $totalPrice;

        if ($user->bonus_balance > 0) {
            $bonusToUse = min($user->bonus_balance, $totalPrice);
            $totalPrice -= $bonusToUse;
            $user->bonus_balance -= $bonusToUse;
            $user->save();
        }

        if ($user->balance < $totalPrice) {
            return response()->json(['message' => 'Недостаточно средств'], 400);
        }

        $user->balance -= $totalPrice;
        $user->save();

        $cart = Cart::where('user_id', $user->id)
            ->where('server_id', $item->server_id)
            ->first();

        if (!$cart) {
            $cart = new Cart();
            $cart->user_id = $user->id;
            $cart->server_id = $item->server_id;
            $cart->items = [];
        }

        foreach ($allItems as &$cartItem) {
            $cartItem['shop_cart_id'] = Str::uuid()->toString();
            $cartItem['price'] = $discountedPrice;
        }

        $cart->items = array_merge($cart->items, $allItems);
        $cart->save();

        $server = Server::find($item->server_id);
        BuyLog::create([
            'item_id' => $item->id,
            'server_id' => $item->server_id,
            'user_id' => $user->id,
            'steamid' => $user->steamid,
            'item_name' => $item->name,
            'price' => $priceToLog,
            'created_at' => Carbon::now('Europe/Moscow'),

        ]);
        $botToken = env('TOKEN_BOT_TG');
        $chatIds = explode(',', env('TELEGRAM_CHAT_IDS', '491891799,6016436944,587982989'));

        $message = '🛒 Покупка предмета пользователем: ' . $user->steamid . "\n" .
            '🎮 Предмет: ' . $item->name . "\n" .
            '🔢 Количество: ' . $quantity . "\n" .
            '💰 Цена: ' . $priceToLog . ' RUB' . "\n" .
            '🌐 Сервер: ' . ($server ? $server->name : 'Неизвестно') . "\n" .
            '✅ Покупка успешно завершена!';



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
        return response()->json([
            'message' => 'Purchase successful',
            'cart' => $cart,
            'user_balance' => $user->balance,
            'user_bonus_balance' => $user->bonus_balance
        ]);
    }





}
