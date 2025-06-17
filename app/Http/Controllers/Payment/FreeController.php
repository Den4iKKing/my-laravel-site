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

class FreeController extends Controller
{
    private $merchantId;
    private $secretWord1;
    private $secretWord2;

    public function __construct()
    {
        $this->merchantId = env('FREEKASSA_MERCHANT_ID');
        $this->secretWord1 = env('FREEKASSA_SECRET_WORD_1');
        $this->secretWord2 = env('FREEKASSA_SECRET_WORD_2');
    }

    public function redirect(Request $request)
    {
        $number = $request->amount;
        $method = $request->method_name;
        $user = Auth::user();

        if (is_numeric($number) && $number >= 50) {
            $orderId = 'order_' . $user->steamid . '_' . time();
            $amount = number_format($number, 2, '.', '');
            $currency = 'RUB';
            $sign = md5($this->merchantId . ':' . $amount . ':' . $this->secretWord1 . ':' . $currency . ':' . $orderId);

            $paymentParams = [
                'm' => $this->merchantId,
                'oa' => $amount,
                'o' => $orderId,
                's' => $sign,
                'currency' => $currency,
                'lang' => 'ru',
                'us_steamid' => $user->steamid,
                'us_user_id' => $user->id
            ];
            $paymentUrl = 'https://pay.fk.money/?' . http_build_query($paymentParams);

            return response()->json(['payment_url' => $paymentUrl]);
        } else {
            abort(403);
        }
    }

    public function success(Request $request)
    {
        return redirect()->route('index');
    }

    private function getIP()
    {
        if (isset($_SERVER['HTTP_X_REAL_IP'])) {
            return $_SERVER['HTTP_X_REAL_IP'];
        }
        return $_SERVER['REMOTE_ADDR'] ?? request()->ip();
    }

    public function webhook(Request $request)
    {
        // Проверяем IP адрес
        $allowedIps = ['168.119.157.136', '168.119.60.227', '178.154.197.79', '51.250.54.238'];
        $ip = $this->getIP();

        if (!in_array($ip, $allowedIps)) {
            return response('Param-pam-pam.', 403);
        }

        // Получаем данные из запроса
        $merchantId = $request->input('MERCHANT_ID');
        $amount = $request->input('AMOUNT');
        $intId = $request->input('intid');
        $orderId = $request->input('MERCHANT_ORDER_ID');
        $email = $request->input('P_EMAIL');
        $phone = $request->input('P_PHONE');
        $curId = $request->input('CUR_ID');
        $sign = $request->input('SIGN');
        $steamid = $request->input('us_steamid');
        $userId = $request->input('us_user_id');
        $payerAccount = $request->input('payer_account');
        $commission = $request->input('commission');

        // Проверяем подпись
        // md5('MERCHANT_ID:AMOUNT:SECRET_WORD_2:MERCHANT_ORDER_ID')
        $expectedSign = md5($merchantId . ':' . $amount . ':' . $this->secretWord2 . ':' . $orderId);

        if ($sign !== $expectedSign) {
            return response('Wrong signature', 403);
        }

        // Проверяем ID магазина
        if ($merchantId != $this->merchantId) {
            return response('Wrong merchant ID', 403);
        }

        // Проверяем, не был ли уже обработан этот платеж
        $existingPayment = PaymentStatistic::where('uuid', $intId)->first();
        if ($existingPayment) {
            return response('YES'); // Платеж уже обработан, но возвращаем YES
        }

        // Находим пользователя
        $user = null;
        if ($steamid) {
            $user = User::where('steamid', $steamid)->first();
        } elseif ($userId) {
            $user = User::find($userId);
        }

        if (!$user) {
            return response('User not found', 404);
        }

        // Обработка бонусов (сохраняем оригинальную логику)
        $originalAmount = floatval($amount);
        $promoBonuses = is_array($user->active_bonuses) ? collect($user->active_bonuses) : collect([]);
        $promoBonusApplied = false;
        $promoBonusAmount = 0;

        $promoBonuses = $promoBonuses->map(function ($bonus) use ($originalAmount, &$promoBonusAmount, &$promoBonusApplied) {
            if ($promoBonusApplied) {
                return $bonus;
            }

            if ($bonus['type'] === 'deposit_bonus' && $bonus['status'] === 'available') {
                $promoBonusAmount = ($originalAmount * $bonus['value']) / 100;
                $bonus['status'] = 'claimed';
                $promoBonusApplied = true;
            }

            return $bonus;
        });

        // Бонусы за оплату
        $paymentBonuses = PaymentBonus::orderBy('min_amount', 'desc')->get();
        $paymentBonusAmount = 0;

        foreach ($paymentBonuses as $bonus) {
            if ($originalAmount >= $bonus->min_amount) {
                $paymentBonusAmount = ($originalAmount * $bonus->bonus_percent) / 100;
                break;
            }
        }

        $promoBonusAmount = floor($promoBonusAmount);
        $paymentBonusAmount = floor($paymentBonusAmount);

        $totalBonusAmount = $promoBonusAmount + $paymentBonusAmount;
        $totalAmount = $originalAmount + $totalBonusAmount;
        $balanceBefore = $user->balance;

        // Обновляем пользователя
        $user->active_bonuses = $promoBonuses->toArray();
        $user->increment('balance', $totalAmount);
        $user->save();

        // Сохраняем статистику платежа
        PaymentStatistic::create([
            'method' => 'freekassa',
            'created_at' => Carbon::now('Europe/Moscow'),
            'amount' => $originalAmount,
            'uuid' => $intId,
            'steamid' => $user->steamid,
        ]);

        // Отправляем уведомление в Telegram
        $this->sendTelegramNotification([
            'totalAmount' => $totalAmount,
            'originalAmount' => $originalAmount,
            'balanceBefore' => $balanceBefore,
            'balanceAfter' => $user->balance,
            'paymentBonusAmount' => $paymentBonusAmount,
            'promoBonusAmount' => $promoBonusAmount,
            'userName' => $user->name,
            'payerAccount' => $payerAccount,
            'commission' => $commission
        ]);

        return response('YES');
    }

    private function sendTelegramNotification($data)
    {
        $botToken = env('TOKEN_BOT_TG');
        $chatIds = explode(',', '491891799');

        $message = "Пополнение счёта: " . $data['totalAmount'] . "₽\n" .
            "Сумма платежа: " . $data['originalAmount'] . "₽\n" .
            "Баланс игрока: " . $data['balanceBefore'] . "₽ -> " . $data['balanceAfter'] . "₽\n" .
            "Бонус за оплату: " . $data['paymentBonusAmount'] . "₽\n" .
            ($data['promoBonusAmount'] > 0 ? "Промо бонус: " . $data['promoBonusAmount'] . "₽\n" : "") .
            "Игровой ник: " . $data['userName'] . "\n" .
            "Метод: FreeKassa\n" .
            ($data['payerAccount'] ? "Счет плательщика: " . $data['payerAccount'] . "\n" : "") .
            ($data['commission'] ? "Комиссия: " . $data['commission'] . "₽\n" : "");

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
            } catch (\Exception $e) {
                error_log('Исключение: ' . $e->getMessage());
            }
        }
    }
}