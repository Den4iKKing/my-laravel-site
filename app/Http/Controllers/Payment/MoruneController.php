<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Models\PLogs;
use App\Models\User;
use App\Models\PaymentBonus;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use App\Models\PaymentStatistic;

use Inertia\Inertia;

class MoruneController extends Controller
{
    public function redirect(Request $request)
    {
        $number = $request->amount;
        $method = $request->input('additional_method'); // забираем способ оплаты
        Auth::user();

        if (is_numeric($number) && $number >= 50) {
            $user = Auth::user();
            $apiURL = 'https://api.morune.com/invoice/create';
            $result = $number;
            $orderId = $user->steamid . '_' . time();

            // По умолчанию — sbp, но если указана карта — меняем
            $includeService = match ($method) {
                'card' => ['card'],
                'sbp' => ['sbp'],
                default => ['sbp'], // fallback, если вдруг не передали или чёт странное
            };

            $postInput = [
                'amount' => (float)number_format($result, 2, '.', ''),
                'currency' => 'RUB',
                'order_id' => $orderId,
                'expire' => 60,
                'shop_id' => env('MORUNE_MERCHANT_ID'),
                'comment' => 'Пополнение счёта ' . $user->steamid,
                'custom_fields' => [
                    'user_id' => $user->steamid,
                    'original_amount' => $result
                ],
                'success_url' => route('payment.morune.success', [], true),
                'fail_url' => route('payment.morune.fail'),
                'hook_url' => route('payment.morune.webhook'),
                'include_service' => $includeService
            ];

            $headers = [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                'x-api-key' => env('MORUNE_API_KEY'),
            ];

            $response = Http::withHeaders($headers)->post($apiURL, $postInput);
            if ($response->successful()) {
                $responseBody = $response->json();

                return response()->json([
                    'payment_url' => $responseBody['data']['url'],
                ]);
            } else {
                return response()->json(['error' => 'Payment creation failed'], 500);
            }
        } else {
            abort(403, 'Invalid amount');
        }
    }

    public function success(Request $request)
    {
        return redirect()->route('index')->with('message', 'Платеж успешно обработан');
    }

    public function fail(Request $request)
    {
        return redirect()->route('index')->with('error', 'Платеж отклонен');
    }

    public function webhook(Request $request)
    {
        if (!$this->verifyWebhookSignature($request)) {
            return response('Unauthorized', 403);
        }

        $data = $request->all();

        if ($data['status'] !== 'success' && $data['status'] !== 'completed') {
            return response()->json(['status' => 'ignored'], 200);
        }

        $existingPayment = PaymentStatistic::where('uuid', $data['order_id'])->first();
        if ($existingPayment) {
            return response()->json(['status' => 'error', 'message' => 'Payment with this ID already processed'], 400);
        }

        $amount = $data['amount'];
        $customData = $data['custom_fields'] ?? [];
        $steamid = $customData['user_id'] ?? null;

        if (!$steamid) {
            return response()->json(['status' => 'error', 'message' => 'No user ID provided'], 400);
        }

        $user = User::where('steamid', $steamid)->first();
        if (!$user) {
            abort(404, 'User not found');
        }

        $promoBonuses = is_array($user->active_bonuses) ? collect($user->active_bonuses) : collect([]);
        $promoBonusApplied = false;
        $promoBonusAmount = 0;

        $promoBonuses = $promoBonuses->map(function ($bonus) use ($amount, &$promoBonusAmount, &$promoBonusApplied) {
            if ($promoBonusApplied) {
                return $bonus;
            }

            if ($bonus['type'] === 'deposit_bonus' && $bonus['status'] === 'available') {
                $promoBonusAmount = ($amount * $bonus['value']) / 100;
                $bonus['status'] = 'claimed';
                $promoBonusApplied = true;
            }

            return $bonus;
        });

        $paymentBonuses = PaymentBonus::orderBy('min_amount', 'desc')->get();
        $paymentBonusAmount = 0;

        foreach ($paymentBonuses as $bonus) {
            if ($amount >= $bonus->min_amount) {
                $paymentBonusAmount = ($amount * $bonus->bonus_percent) / 100;
                break;
            }
        }

        $promoBonusAmount = floor($promoBonusAmount);
        $paymentBonusAmount = floor($paymentBonusAmount);

        $totalBonusAmount = $promoBonusAmount + $paymentBonusAmount;
        $totalAmount = $amount + $totalBonusAmount;
        $balanceBefore = $user->balance;

        $user->active_bonuses = $promoBonuses->toArray();
        $user->increment('balance', $totalAmount);
        $user->save();

        PaymentStatistic::create([
            'method' => 'morune',
            'created_at' => Carbon::now('Europe/Moscow'),
            'amount' => $amount,
            'uuid' => $data['order_id'],
            'steamid' => $user->steamid,
        ]);

        $this->sendTelegramNotification($user, $amount, $totalAmount, $balanceBefore, $paymentBonusAmount, $promoBonusAmount);

        return response()->json(['status' => 'success']);
    }
    private function verifyWebhookSignature(Request $request)
    {
        $signature = $request->header('X-Morune-Signature');
        $secret = env('MORUNE_WEBHOOK_SECRET');

        if (!$signature || !$secret) {
            return true;
        }

        $payload = $request->getContent();
        $expectedSignature = hash_hmac('sha256', $payload, $secret);

        return hash_equals($signature, $expectedSignature);
    }

    private function sendTelegramNotification($user, $amount, $totalAmount, $balanceBefore, $paymentBonusAmount, $promoBonusAmount)
    {
        $botToken = env('TOKEN_BOT_TG');
        $chatIds = explode(',', env('TELEGRAM_CHAT_IDS', '491891799,6016436944,587982989'));

        $message = "Пополнение счёта: " . $totalAmount . "₽\n" .
            "Баланс игрока: " . $balanceBefore . "₽ -> " . $user->balance . "₽\n" .
            "Сумма платежа: " . $amount . "₽\n" .
            "Бонус за оплату: " . $paymentBonusAmount . "₽\n" .
            "Промо-бонус: " . $promoBonusAmount . "₽\n" .
            "Игровой steamid: " . $user->steamid . "\n" .
            "Метод: Morune\n";

        foreach ($chatIds as $chatId) {
            $chatId = trim($chatId);
            if (empty($chatId)) continue;

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
                error_log('Исключение при отправке в Telegram: ' . $e->getMessage());
            }
        }
    }
}
