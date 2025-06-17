<?php

namespace App\Http\Controllers;


namespace App\Http\Controllers;
use App\Models\PromoLogs;
use App\Models\Promocode;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;


class PromocodeController extends Controller
{
    public function apply(Request $request)
    {
        $user = $request->user();
        $code = $request->input('code');

        $key = 'apply_promo_' . $user->id;
        if (RateLimiter::tooManyAttempts($key, 5)) {
            return response()->json(['message' => 'Слишком много попыток, попробуйте позже'], 429);
        }
        RateLimiter::hit($key, 10);

        $promo = Promocode::where('code', $code)->first();

        if (!$promo || $promo->used >= $promo->max_uses) {
            return response()->json(['message' => 'Промокод недействителен или исчерпан'], 400);
        }

        $activeBonuses = $user->active_bonuses ?? [];

        foreach ($activeBonuses as $bonus) {
            if ($bonus['id'] === $promo->id) {
                return response()->json(['message' => 'Этот промокод уже был использован'], 400);
            }
        }
        $promo->increment('used', 1);

        $activeBonuses[] = [
            'id' => $promo->id,
            'code' => $promo->code,
            'type' => $promo->type,
            'value' => $promo->value,
            'applied_at' => now(),
            'status' => 'available',
        ];

        if ($promo->type === 'bonus_balance') {
            $user->balance += $promo->value;
        }

        $user->active_bonuses = $activeBonuses;
        $user->save();
        $botToken = '7225924363:AAFG-vN1c2Asz9bKqLWGsNA1Es9IOsLTgHE';
        $chatIds = explode(',', env('TELEGRAM_CHAT_IDS', '491891799,6016436944,587982989'));

        $message = '🎉 Промокод активирован пользователем: ' . $user->steamid . "\n" .
            '🧾 Промокод: ' . $promo->code . "\n" .
            '💸 Сумма бонуса: ' . $promo->value . ' RUB' . "\n" .
            '🔑 Тип бонуса: ' . ucfirst($promo->type) . "\n" .
            '🕒 Применён: ' . now()->toDateTimeString();



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
        PromoLogs::create([
            'steamid' => $user->steamid,
            'sum' => $promo->value,
            'name' => 'Активация промокода ' . $promo->code,
            'created_at' => Carbon::now('Europe/Moscow'),
        ]);
        return response()->json([
            'message' => 'Промокод успешно применён',
            'bonus_balance' => $user->balance,
            'active_bonuses' => $user->active_bonuses
        ]);
    }
}
