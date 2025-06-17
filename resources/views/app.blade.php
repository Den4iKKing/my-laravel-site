<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <meta
            name="description"
            content="Добро пожаловать в RustWorld! Удвоенные руды, ускоренный крафт, увеличенный инвентарь, прокачка умений, крутые ивенты и многое другое ждут тебя!"
    />
    <meta
            name="keywords"
            content="rustworld, Rust сервер, рейты x2, фарм Rust, строительство баз, Rust pvp, Rust events"
    />
    <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
    <meta property="og:image" content="/rustworld-banner.png" />
    <link rel="icon" type="image/png" href="/rustworld-favicon.png" />
    <title>RUSTWORLD — Твой игровой Rust сервер</title>

    @routes
    @vite(['resources/js/app.ts', "resources/js/Pages/{$page['component']}.vue"])
    @inertiaHead
</head>
<body class="font-sans antialiased bg-gray-900 text-white">
@inertia
</body>
</html>
