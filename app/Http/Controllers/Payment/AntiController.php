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
use Omnipay\Omnipay;
use Omnipay\Antilopay;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Omnipay\Antilopay\Model\CustomerReference;

class AntiController extends Controller
{
//    public function redirect(Request $request)
//    {
//        $number = $request->amount;
//        $user = auth()->user();
//
//        // Validate the amount
//        if (!is_numeric($number) || $number < 50) {
//            abort(403, 'Invalid amount');
//        }
//
//        // Initialize the Antilopay gateway
//        $gateway = Omnipay::create('Antilopay');
//        $gateway->setProjectId(env('ANTILOPAY_PROJECT_ID'));
//        $gateway->setSecretId(env('ANTILOPAY_MERCHANT_ID'));
//        $gateway->setSecretKey(file_get_contents('/var/www/laravel_1/storage/app/key.pem'));
////        $gateway->setCallbackKey(env('ANTILOPAY_PUBLIC_KEY')); // RSA public key for callbacks
//
//        // Generate a unique order ID
//        $orderId = $user->steamid . '_' . time();
//
//        // Prepare the purchase request
//        $purchaseRequest = $gateway->purchase([
//            'amount' => 100,
//            'orderId' => "41234343",
//            'product_name' => 'Balance',
//            'product_type' => 'goods',
//            'product_quantity' => 100,
//            'vat' => 10,
//            'description' => 'Balance top-up',
//            'returnUrl' => 'https://leet.ru/payment/success',  // success_url
//            'cancelUrl' => 'https://leet.ru/payment/fail',     // fail_url
//            'customer' => new CustomerReference(
//                email: 'customer-email@example.com',
//            ),
//            'prefer_methods' => ['SBP', 'SBER_PAY', 'CARD_RU']
//        ]);
//
//        // Log the request data for debugging
//        Log::info('📦 Purchase Request Data:', $purchaseRequest->getData());
//
//        try {
//            // Send the purchase request
//            $purchaseResponse = $purchaseRequest->send();
//
//            // Debug response in debug mode
//            if (config('app.debug')) {
//                return response()->json([
//                    'request_data' => $purchaseRequest->getData(),
//                    'response_successful' => $purchaseResponse->isSuccessful(),
//                    'response_redirect' => $purchaseResponse->isRedirect(),
//                    'response_message' => $purchaseResponse->getMessage(),
//                    'response_data' => $purchaseResponse->getData(),
//                ]);
//            }
//
//            // Handle the response
//            if ($purchaseResponse->isSuccessful() || $purchaseResponse->isRedirect()) {
//                $paymentId = $purchaseResponse->getTransactionId();
//                $paymentUrl = $purchaseResponse->getRedirectUrl();
//
//                Log::info('✅ Payment Initiated:', [
//                    'payment_id' => $paymentId,
//                    'payment_url' => $paymentUrl,
//                ]);
//
//                return response()->json([
//                    'payment_url' => $paymentUrl,
//                    'payment_id' => $paymentId,
//                ]);
//            } else {
//                Log::error('❌ Payment Creation Failed:', [
//                    'message' => $purchaseResponse->getMessage(),
//                ]);
//
//                return response()->json([
//                    'error' => 'Payment creation failed: ' . ($purchaseResponse->getMessage() ?? 'Unknown error'),
//                ], 500);
//            }
//        } catch (\Exception $e) {
//            Log::error('❌ Payment Exception:', [
//                'error' => $e->getMessage(),
//            ]);
//
//            return response()->json([
//                'error' => 'Payment creation failed: ' . $e->getMessage(),
//            ], 500);
//        }
//    }
    public function redirect(Request $request)
    {
        $number = $request->amount;
        $user = auth()->user();

        if (!is_numeric($number) || $number < 50) {
            abort(403, 'Invalid amount');
        }

        $apiURL = 'https://lk.antilopay.com/api/v1/payment/create';
        $orderId = $user->steamid . '_' . time();
        $postInput = [
            'project_identificator' => env('ANTILOPAY_PROJECT_ID'),
            'amount' => (float)number_format($number, 2, '.', ''),
            'order_id' => $orderId,
            'currency' => 'RUB',
            'product_name' => 'Пополнение игрового баланса',
            'product_type' => 'services',
            'product_quantity' => 1,
            'description' => 'Пополнение счёта ' . $user->steamid,
            'success_url' => route('payment.antilopay.success', [], true),
            'fail_url' => route('payment.antilopay.fail', [], true),
            'customer' => [
                'email' => 'asdsad@gmail.com'
            ],
        ];
        $jsonData = json_encode($postInput, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $privateKeyPem = env('ANTILOPAY_PRIVATE_KEY');
        $signature = $this->generateAntilopaySignature($jsonData, $privateKeyPem);

        $headers = [
            'X-Apay-Secret-Id' => env('ANTILOPAY_MERCHANT_ID'),
            'X-Apay-Sign' => $signature,
        ];

        Log::info("📦 Original Array:", $postInput);
        Log::info("🚀 JSON Data (str_payload): " . $jsonData);
        Log::info("🔐 Signature: " . $signature);

        $response = Http::withHeaders($headers)
            ->withBody($jsonData, 'application/json')
            ->post($apiURL);
//
//        if (config('app.debug')) {
//            return response()->json([
//                'postInput' => $postInput,
//                'jsonData' => $jsonData,
//                'signature' => $signature,
//                'response_status' => $response->status(),
//                'response_body' => $response->json(),
//            ]);
//        }
        if ($response->successful()) {
            $responseBody = $response->json();
            if (($responseBody['code'] ?? -1) === 0) {
                return response()->json([
                    'payment_url' => $responseBody['payment_url'],
                    'payment_id' => $responseBody['payment_id'],
                ]);
            } else {
                return response()->json([
                    'error' => 'Payment creation failed: ' . ($responseBody['error'] ?? 'Unknown error')
                ], 500);
            }
        }

        return response()->json([
            'error' => 'Payment creation failed',
            'status' => $response->status(),
            'body' => $response->body(),
        ], 500);
    }

    private function generateAntilopaySignature(string $jsonData, string $privateKeyBase64): string
    {
        try {
            // Формируем полный PEM ключ из base64 строки (RSA формат)
            $privateKeyPem = "-----BEGIN RSA PRIVATE KEY-----\n" .
                trim(chunk_split($privateKeyBase64, 64, "\n")) . "\n" .
                "-----END RSA PRIVATE KEY-----";

            // Загружаем приватный ключ
            $privateKey = openssl_pkey_get_private($privateKeyPem);

            if (!$privateKey) {
                throw new \Exception('Не удалось загрузить приватный ключ: ' . openssl_error_string());
            }

            $rawSignature = '';

            // Создаем цифровую подпись
            $result = openssl_sign($jsonData, $rawSignature, $privateKey, OPENSSL_ALGO_SHA256);

            if (!$result) {
                throw new \Exception('Ошибка при создании подписи: ' . openssl_error_string());
            }

            // Освобождаем ресурс ключа
            openssl_free_key($privateKey);

            // Возвращаем подпись в формате Base64
            return base64_encode($rawSignature);

        } catch (\Exception $e) {
            // Логируем ошибку для отладки

            throw new \Exception('Не удалось сгенерировать подпись для Antilopay');
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

        if ($data['type'] !== 'payment') {
            return response()->json(['status' => 'ignored'], 200);
        }

        if ($data['status'] !== 'SUCCESS') {
            return response()->json(['status' => 'ignored'], 200);
        }

        $existingPayment = PaymentStatistic::where('uuid', $data['order_id'])->first();
        if ($existingPayment) {
            return response()->json(['status' => 'error', 'message' => 'Payment with this ID already processed'], 400);
        }

        $amount = $data['amount'];
        $originalAmount = $data['original_amount'];

        if ($amount != $originalAmount) {
            return response()->json(['status' => 'error', 'message' => 'Amount mismatch'], 400);
        }

        $merchantExtra = json_decode($data['merchant_extra'] ?? '{}', true);
        $steamid = $merchantExtra['user_id'] ?? null;

        if (!$steamid) {
            return response()->json(['status' => 'error', 'message' => 'No user ID provided'], 400);
        }

        $user = User::where('steamid', $steamid)->first();
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'User not found'], 404);
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
            'method' => 'antilopay',
            'created_at' => Carbon::now('Europe/Moscow'),
            'amount' => $amount,
            'uuid' => $data['order_id'],
            'steamid' => $user->steamid,
        ]);

        // Отправляем уведомление в Telegram
        $this->sendTelegramNotification($user, $amount, $totalAmount, $balanceBefore, $paymentBonusAmount, $promoBonusAmount, $data);

        return response()->json(['status' => 'success'], 200);
    }

    private function verifyWebhookSignature(Request $request)
    {
        $signature = $request->header('X-Apay-Callback');
        $version = $request->header('X-Apay-Callback-Version');
        $publicKey = env('ANTILOPAY_PUBLIC_KEY');

        if (!$signature || !$publicKey) {
            return false;
        }

        $payload = $request->getContent();

        if ($version == '1') {
            $rawSignature = base64_decode($signature);
            $verify = openssl_verify($payload, $rawSignature, $publicKey, OPENSSL_ALGO_SHA256);

            return $verify === 1;
        }

        return false;
    }

    private function sendTelegramNotification($user, $amount, $totalAmount, $balanceBefore, $paymentBonusAmount, $promoBonusAmount, $paymentData)
    {
        $botToken = env('TOKEN_BOT_TG');
        $chatIds = explode(',', env('TELEGRAM_CHAT_IDS', '491891799,6016436944,587982989'));

        $payMethod = $paymentData['pay_method'] ?? 'N/A';
        $payData = $paymentData['pay_data'] ?? 'N/A';

        $message = "Пополнение счёта: " . $totalAmount . "₽\n" .
            "Баланс игрока: " . $balanceBefore . "₽ -> " . $user->balance . "₽\n" .
            "Сумма платежа: " . $amount . "₽\n" .
            "Бонус за оплату: " . $paymentBonusAmount . "₽\n" .
            "Промо-бонус: " . $promoBonusAmount . "₽\n" .
            "Игровой steamid: " . $user->steamid . "\n" .
            "Метод: AntilopPay (" . $payMethod . ")\n" .
            "ID платежа: " . $paymentData['payment_id'] . "\n";

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