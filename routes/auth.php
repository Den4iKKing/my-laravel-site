<?php
use App\Http\Controllers\Auth\SteamAuthController;




// Перенаправление на Steam
Route::get('/login', [SteamAuthController::class, 'redirectToSteam'])->name('auth.steam');

// Callback от Steam
Route::get('/auth/steam/callback', [SteamAuthController::class, 'handleSteamCallback']);

// Выход из системы
Route::get('/logout', function () {
    Auth::logout();
    return redirect('/');
})->name('logout');
