<?php

namespace Database\Factories;

use App\Models\items_lib;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Server;
use App\Models\Category;
use App\Models\ItemsLib; // Добавляем модель ItemsLib

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ShopItem>
 */
class ShopItemFactory extends Factory
{
    public function definition()
    {
        // Получаем случайный элемент из модели items_lib
        $item = items_lib::inRandomOrder()->first();

        // Генерация случайных предметов для поля 'atr'
        $items = items_lib::inRandomOrder()->take(rand(1, 10))->get();

        // Формируем JSON для 'atr'
        $atr = $items->map(function ($item) {
            $data = [
                'name' => $item->name,
                'amount' => rand(1, 100), // Случайное количество от 1 до 100
            ];

            // Если есть изображение, добавляем его
            if ($item->image) {
                $data['image'] = $item->image;
            }

            // Добавляем 'id' и 'type' для некоторых элементов
            if (rand(0, 1)) { // Для случайных элементов добавляем 'id' и 'type'
                $data['id'] = $item->itemid;
                $data['type'] = 'item'; // Это можно изменить в зависимости от нужд
            }

            return $data;
        })->toJson();

        return [
            'name' => $item->name, // Используем название из items_lib
            'atr' => $atr, // Вставляем сгенерированный JSON в 'atr'
            'image' => $item->image, // Используем изображение из items_lib
            'visible' => $this->faker->boolean(85), // 85% вероятность, что товар видимый
            'sale' => $this->faker->numberBetween(0, 100),
            'price' => $this->faker->numberBetween(50, 5000),

            'about' => $this->faker->text(100),
            'server_id' => Server::factory(), // Связь с сервером
            'category_id' => Category::factory(), // Связь с категорией
        ];
    }
}
