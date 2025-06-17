<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Server;
use App\Models\ShopItem;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run()
    {
        // Создаем 10 серверов
        $servers = Server::factory(10)->create();

        // Создаем 10 категорий
        $categories = Category::factory(10)->create();

        ShopItem::factory(150)->create([
            'server_id' => fn() => $servers->random()->id,
            'category_id' => fn() => $categories->random()->id,
        ]);
    }
}
