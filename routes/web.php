<?php

use App\Http\Controllers\Api\PaymentStatisticController;
use App\Http\Controllers\Api\ShopDataController;
use App\Http\Controllers\Dashboard\CategoryController;
use App\Http\Controllers\Dashboard\ServerController;
use App\Http\Controllers\Dashboard\UserController;
use App\Http\Controllers\Dashboard\ShopItemController;
use App\Http\Controllers\Dashboard\PromoController;

use App\Http\Controllers\Dashboard\PaymentBonusController;

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Payment\MoruneController;
use App\Http\Controllers\Payment\CryptoController;
use App\Http\Controllers\Payment\CentController;
use App\Http\Controllers\Payment\FreeController;

use App\Http\Controllers\Payment\AntiController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PromocodeController;
use App\Http\Controllers\ShopController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('index', [
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
Route::get('/test', function () {
    return Inertia::render('test', [
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
Route::group(['middleware' => 'logsrequest'], function () {
    Route::prefix('payment/morune')->group(function () {
        Route::post('/redirect', [MoruneController::class, 'redirect'])->name('payment.morune.redirect');
        Route::get('/success', [MoruneController::class, 'success'])->name('payment.morune.success');
        Route::get('/fail', [MoruneController::class, 'fail'])->name('payment.morune.fail');
        Route::post('/webhook', [MoruneController::class, 'webhook'])->name('payment.morune.webhook');
    });
    Route::prefix('payment/freekassa')->group(function () {
        Route::post('/redirect', [FreeController::class, 'redirect'])->name('payment.freekassa.redirect');
        Route::get('/success', [FreeController::class, 'success'])->name('payment.freekassa.success');
        Route::get('/fail', [FreeController::class, 'fail'])->name('payment.freekassa.fail');
        Route::post('/webhook', [FreeController::class, 'webhook'])->name('payment.freekassa.webhook');
    });
    Route::prefix('payment/crypto')->group(function () {
        Route::post('/redirect', [CryptoController::class, 'redirect'])->name('payment.crypto.redirect');
        Route::get('/success', [CryptoController::class, 'success'])->name('payment.crypto.success');
        Route::get('/fail', [CryptoController::class, 'fail'])->name('payment.crypto.fail');
        Route::post('/webhook', [CryptoController::class, 'webhook'])->name('payment.crypto.webhook');
    });
    Route::prefix('payment/cent')->group(function () {
        Route::post('/redirect', [CentController::class, 'redirect'])->name('payment.cent.redirect');
        Route::get('/success', [CentController::class, 'success'])->name('payment.cent.success');
        Route::get('/fail', [CentController::class, 'fail'])->name('payment.cent.fail');
        Route::post('/webhook', [CentController::class, 'webhook'])->name('payment.cent.webhook');
    });
    Route::prefix('payment/antilopay')->group(function () {
        Route::post('/redirect', [AntiController::class, 'redirect'])->name('payment.antilopay.redirect');
        Route::get('/success', [AntiController::class, 'success'])->name('payment.antilopay.success');
        Route::get('/fail', [AntiController::class, 'fail'])->name('payment.antilopay.fail');
        Route::post('/webhook', [AntiController::class, 'webhook'])->name('payment.antilopay.webhook');
    });
});


Route::get('/api/shop-data', [ShopDataController::class, 'index']);
Route::get('/api/user/balance', [\App\Http\Controllers\Api\CartController::class, 'get_user_balance']);

Route::get('/itemslib/search', [DashboardController::class, 'search_into_lib']);
Route::middleware('auth')->group(function () {


    Route::middleware('alllogs')->group(function () {
        Route::post('/promo/activate', [PromocodeController::class, 'apply']);
        Route::get('/shop/buy/{id}', [ShopController::class, 'purchaseItem']);
    });
    Route::middleware('admin')->group(function () {
        Route::get('/api/stats/top-items', [PaymentStatisticController::class, 'getTopItemsByServer']);
        Route::get('/api/stats/server-revenue', [PaymentStatisticController::class, 'getServerRevenue']);
        Route::get('/api/statistics', [PaymentStatisticController::class, 'index']);
        Route::get('/api/statistics/servers/{serverId}', [PaymentStatisticController::class, 'serverStatistics']);
        Route::get('/api/statistics/items/{itemId}', [PaymentStatisticController::class, 'itemStatistics']);
        Route::get('/logs', [PaymentStatisticController::class, 'getAllLogs'])
            ->name('logs.index');

        Route::get('/logs/statistics', [PaymentStatisticController::class, 'getLogsStatistics'])
            ->name('logs.statistics');

        Route::get('/admin', function () {
            return Inertia::render('dashboard/index', [
            ]);
        });
        Route::prefix('admin')->group(function () {
            // Ваши маршруты здесь
            Route::get('users', [DashboardController::class, 'users'])->name('users.dashboard');
            Route::get('servers', [DashboardController::class, 'servers']);
            Route::resource('users', UserController::class)->only(['show', 'update', 'destroy']);
            // увы
            Route::get('/users/purchases/{user}', [UserController::class, 'getPurchaseHistory'])->name('users.purchases');
            Route::get('/users/cart/{user}/{server}', [UserController::class, 'getUserCart'])->name('users.cart');
            Route::delete('/users/cart/{user}/{server}/{item}', [UserController::class, 'removeItemFromCart'])->name('users.cart.remove');

            // Маршрут для получения списка серверов
            Route::get('/servers/list', [UserController::class, 'getServersList'])->name('servers.list');


            Route::get('/shop', [ShopItemController::class, 'index'])->name('shop.index'); // Просмотр списка
            Route::post('/shop/create', [ShopItemController::class, 'store'])->name('shop.create'); // Сохранение нового товара
            Route::get('/shop/{shopItem}/edit', [ShopItemController::class, 'edit'])->name('shop.edit'); // Страница редактирования
            Route::put('/shop/{shopItem}', [ShopItemController::class, 'update'])->name('shop.update'); // Обновление товара
            Route::post('/shop/copy', [ShopItemController::class, 'copy'])->name('shop.copy');

            Route::delete('/shop/{shopItem}', [ShopItemController::class, 'destroy'])->name('shop.destroy'); // Удаление товара
            Route::get('/shop/categories', [CategoryController::class, 'index'])->name('categories.index');
            Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
            Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
            Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');
            Route::get('/servers', [ServerController::class, 'index'])->name('servers.index'); // Просмотр списка серверов
            Route::get('/servers/create', [ServerController::class, 'create'])->name('servers.create'); // Страница создания сервера
            Route::post('/servers', [ServerController::class, 'store'])->name('servers.store'); // Сохранение нового сервера
            Route::get('/servers/{server}/edit', [ServerController::class, 'edit'])->name('servers.edit'); // Страница редактирования сервера
            Route::put('/servers/{server}', [ServerController::class, 'update'])->name('servers.update'); // Обновление сервера
            Route::delete('/servers/{server}', [ServerController::class, 'destroy'])->name('servers.destroy'); // Удаление сервера

            Route::get('/promocodes', [PromoController::class, 'index'])->name('promocodes.index');
            Route::post('/promocodes', [PromoController::class, 'store'])->name('promocodes.store'); // Сохранение нового промокода
            Route::get('/promocodes/{promocode}/edit', [PromoController::class, 'edit'])->name('promocodes.edit'); // Страница редактирования промокода
            Route::put('/promocodes/{promocode}', [PromoController::class, 'update'])->name('promocodes.update'); // Обновление промокода
            Route::delete('/promocodes/{promocode}', [PromoController::class, 'destroy'])->name('promocodes.destroy'); // Удаление промокода


            Route::get('/payment_bonuses', [PaymentBonusController::class, 'index'])->name('payment_bonuses.index'); // Список бонусов
            Route::post('/payment_bonuses', [PaymentBonusController::class, 'store'])->name('payment_bonuses.store'); // Создание бонуса
            Route::put('/payment_bonuses/{paymentBonus}', [PaymentBonusController::class, 'update'])->name('payment_bonuses.update'); // Обновление бонуса
            Route::delete('/payment_bonuses/{paymentBonus}', [PaymentBonusController::class, 'destroy'])->name('payment_bonuses.destroy'); // Удаление бонуса


        });
    });
});

require __DIR__ . '/auth.php';
