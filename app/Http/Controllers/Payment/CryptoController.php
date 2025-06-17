<?php
namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;

use App\Models\PaymentBonus;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use App\Models\PaymentStatistic;

class CryptoController extends Controller
{

    public function redirect(Request $request)
    {
        $number = $request->amount;

        if (is_numeric($number) && $number >= 10) {
            $user = Auth::user();
            $currency = 'rub';
            $orderId = time() . $user->steamid;
            $exchangeRate = 90;

            $dollars = $number / $exchangeRate;
            $lastSum =  $number;
            $dollars = round($dollars, 2);
            $payload = [
                'amount' => (string) $number,
                'currency' => $currency,
                'order_id' => $orderId,
                'additional_data' => $user->steamid . ',' . $number,
                'lifetime' => '4200',
                'url_callback' => route('payment.crypto.webhook', [], true),
            ];

            $data = json_encode($payload);

            $apikey = "pg3tzHM8f34i3zNgxuNz011UNgWyDQBBBFyvrKVfVLyDXKdyW9guRFiCvXUS4bi4XYu2ZxeFiJO4TqLxQFcXiB1FgW6cyHoXRHFcGR5smNnTAYQInEyA6SecbYILwKJO";
            $sign = md5(base64_encode($data) . $apikey);

            $response = Http::withHeaders([
                'merchant' => 'c5bd8602-dbae-4477-b5d3-44dc0e4fc4f3',
                'sign' => $sign,
                'Content-Type' => 'application/json',
            ])->post('https://api.heleket.com/v1/payment', $payload);

            $responseArray = $response->json();
            $url = $responseArray['result']['url'];
            return response()->json(['payment_url' => $url]);
        }

    }
    public function success(Request $request)
    {
        return redirect()->route('index');
    }
    public function webhook(Request $request)
    {
//        $allowedIps = ['91.227.144.54'];
//        $ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $request->ip();
//
//        if (!in_array($ip, $allowedIps)) {
//            return response('Param-pam-pam.', 403);
//        }
        $webhookData = $request->all();
        $status = $webhookData['status'];

        if ($status !== 'paid' && $status !== 'paid_over') {
            abort(403);
        }

        $existingPayment = PaymentStatistic::where('uuid', $webhookData['uuid'])->first();
        if ($existingPayment) {
            return response()->json(['status' => 'error', 'message' => 'Payment with this UUID already processed'], 400);
        }

        [$steamid, $number] = explode(',', $webhookData['additional_data']);
        $amount = (int) $number;

        $user = User::where('steamid', $steamid)->first();

        if ($user) {
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

            $totalBonusAmount = $promoBonusAmount + $paymentBonusAmount;
            $totalAmount = $amount + $totalBonusAmount;
            $balanceDo = $user->balance;

            $user->active_bonuses = $promoBonuses->toArray();
            $user->increment('balance', $totalAmount);
            $user->save();
            $merchantAmount = (float) $webhookData['merchant_amount'];
            $exchangeRate = (float) $webhookData['payer_amount_exchange_rate'];
            $convertedAmount = (int) ($merchantAmount * $exchangeRate);
            PaymentStatistic::create([
                'method' => 'Crypto',
                'amount' => $convertedAmount,
                'created_at' => Carbon::now('Europe/Moscow'),
                'uuid' => $webhookData['uuid'],
                'steamid' => $user->steamid,
            ]);


            $botToken = env('TOKEN_BOT_TG');
            $chatIds = explode(',', env('TELEGRAM_CHAT_IDS', '491891799,6016436944,587982989'));


            $message = "Пополнение счёта: " . $totalAmount . "₽\n" .
                "Баланс игрока: " . $balanceDo . "₽ -> " . $user->balance . "₽\n" .
                "Сумма платежа: " . $amount . "₽\n" .
                "Бонус за оплату: " . $paymentBonusAmount . "₽\n" .
                "Промо-бонус: " . $promoBonusAmount . "₽\n" .
                "Игровой steamid: " . $user->steamid . "\n" .
                "Метод: Crypto\n";


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

            return response()->json(['status' => 'success']);
        } else {
            abort(404, 'User not found');
        }
    }

}
