<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Laravel\Socialite\Facades\Socialite;
use function Symfony\Component\String\s;

class SteamAuthController extends Controller
{
    public function redirectToSteam()
    {
        $baseUrl = 'https://steamcommunity.com/openid/login';

        $params = [
            'openid.ns' => 'http://specs.openid.net/auth/2.0',
            'openid.mode' => 'checkid_setup',
            'openid.return_to' => 'https://r1.steelrust.shop/auth/steam/callback',
            'openid.realm' => config('app.url'), 
            'openid.identity' => 'http://specs.openid.net/auth/2.0/identifier_select',
            'openid.claimed_id' => 'http://specs.openid.net/auth/2.0/identifier_select',
        ];

        $url = $baseUrl . '?' . http_build_query($params);

        return redirect($url);
    }


    public function handleSteamCallback()
    {
        try {
            $steamUser = Socialite::driver('steam')->user();
            $user = User::firstOrCreate(
                ['steamid' => $steamUser->id],
                [
                    'name' => $steamUser->nickname,
                    'avatar' => $steamUser->avatar,
                    'balance' => 0,
                    'bonus_balance' => 0.00,
                    'group' => 'user',
                ]
            );

            // Обновляем только нужные поля
            $user->update([
                'name' => $steamUser->nickname,
                'avatar' => $steamUser->avatar,
            ]);
            
            
            Auth::login($user);

            if (!Auth::check()) {
                dd('Пользователь не залогинен!');
            }
            session()->regenerate();
            return redirect()->intended('/');
            // return redirect('/')->with('auth_error', 'Слишком много попыток авторизации через Steam. Попробуйте через пару минут.');
            // return 'Авторизация прошла успешно, пользователь: ' . $user->name;

        } catch (\Exception $e) {
            return redirect('/')->with('auth_error', 'Слишком много попыток авторизации через Steam. Попробуйте через пару минут.');
        }


    }


}




// $steamUser = Socialite::driver('steam')->user();
//             $user = User::firstOrCreate(
//                 ['steamid' => $steamUser->id],
//                 [
//                     'name' => $steamUser->nickname,
//                     'avatar' => $steamUser->avatar,
//                     'balance' => 0,
//                     'bonus_balance' => 0.00,
//                     'group' => 'user',
//                 ]
//             );

//             // Обновляем только нужные поля
//             $user->update([
//                 'name' => $steamUser->nickname,
//                 'avatar' => $steamUser->avatar,
//             ]);

//             Auth::login($user);
//             if (!Auth::check()) {
//                 dd('Пользователь не залогинен!');
//             }
//             session()->regenerate();

//             return redirect()->intended('/');
//             // return 'Авторизация прошла успешно, пользователь: ' . $user->name;
