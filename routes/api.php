<?php

use App\Http\Controllers\Api\MonitoringController;
use App\Http\Controllers\Api\CartController;
use App\Models\items_libs;

use App\Http\Controllers\ShopController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/servers', [MonitoringController::class, 'getServerCacheData']);
Route::get('/shop-item/{id}', [ShopController::class, 'getShopItemInfo']);
Route::get('/debug2/server/{id}', [MonitoringController::class, 'checkServerById']);


Route::middleware('security')->group(function () {
    Route::get('/cart', [CartController::class, 'getCart']);
    Route::post('/check', [CartController::class, 'checkApi']);
    Route::middleware('alllogs')->group(function () {
        Route::delete('/cart/{steamid}/{server_id}/{shop_cart_id}', [CartController::class, 'removeItemFromCart']);
        Route::post('/user/balance', [CartController::class, 'updateBalance']);
    });

});
Route::get('/item/libs', [MonitoringController::class, 'libsdata']);
Route::get('/payment-bonuses', [CartController::class, 'getBonuses']);
