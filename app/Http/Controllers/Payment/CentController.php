<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Models\PaymentsLogs;
use App\Models\PLogs;
use App\Models\User;
use App\Models\PaymentBonus;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use App\Models\PaymentStatistic;

use Inertia\Inertia;

class CentController extends Controller
{
    public function redirect(Request $request)
    {
        $number = $request->amount;
        $method = $request->method_name;
        $user = Auth::user();
        if (is_numeric($number) && $number >= 50) {
            $user = Auth::user();
            $apiURL = 'https://cent.app/api/v1/bill/create';
            $result = $number;

            $paymentMethod = preg_match('/карты/ui', trim($method)) ? 'BANK_CARD' : 'SBP';
            $postInput = [
                'amount' => ceil($result),
                'shop_id' => "",
                'payer_pays_commission' => 0,
                'name' => 'Пополнение счёта ' . $user->steamid,
                'custom' => $user->steamid,
                'payment_method' => $paymentMethod
            ];

            $headers = [
                'Authorization' => 'Bearer ',
            ];

            $response = Http::withHeaders($headers)->post($apiURL, $postInput);
            $responseBody = json_decode($response->getBody()->getContents(), true);
            $object = (object)$responseBody;
            return response()->json(['payment_url' => $object->link_page_url]);
        } else {
            abort(403);
        }
    }
    public function success(Request $request)
    {
        return redirect()->route('index');
    }
    public function webhook(Request $request)
    {
        $allowedIps = ['95.108.213.65', '95.216.41.201', '65.108.45.39', '188.43.12.65', '138.124.52.58', '213.136.70.221'];
        $ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $request->ip();

        if (!in_array($ip, $allowedIps)) {
            return response('Param-pam-pam.', 403);
        }

        $object = (object) $request;
        if ($object->Status !== 'SUCCESS') {
            abort(403);
        }

        $existingPayment = PaymentStatistic::where('uuid', $object->TrsId)->first();
        if ($existingPayment) {
            return response()->json(['status' => 'error', 'message' => 'Payment with this UUID already processed'], 400);
        }

        $originalAmount = round($object->OutSum / 1.05);
        $amount = $originalAmount;
        $user = User::where('steamid', $object->custom)->first();

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
        $balanceDo = $user->balance;
        $user->active_bonuses = $promoBonuses->toArray();
        $user->increment('balance', $totalAmount);
        $user->save();


        PaymentStatistic::create([
            'method' => 'cent',
            'created_at' => Carbon::now('Europe/Moscow'),

            'amount' => $amount,
            'uuid' => $object->TrsId,
            'steamid' => $user->steamid,
        ]);
        $botToken = env('TOKEN_BOT_TG');
        $chatIds = explode(',', '491891799');

        $message = "Пополнение счёта: ". $totalAmount . "₽ -> " .  (int) $object->BalanceAmount . "₽\n" .
            "Баланс игрока: " . $balanceDo . "₽ -> " . "$user->balance" . "₽\n" .
            "Бонус за оплату: " . $paymentBonusAmount . "₽\n" .
            "Игровой ник: " . $user->name . "\n" .
            "Метод: Cent\n";


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
    }

}
