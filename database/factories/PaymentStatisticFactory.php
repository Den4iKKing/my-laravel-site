<?php

namespace Database\Factories;

use App\Models\PaymentStatistic;
use App\Models\User; // Импортируем модель User
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentStatisticFactory extends Factory
{
    protected $model = PaymentStatistic::class;

    public function definition()
    {
        return [
            'method' => $this->faker->randomElement(['tome', 'crypto', 'freekassa']),
            'amount' => $this->faker->randomFloat(2, 50, 5000), // Сумма от 50 до 5000
            'steamid' => User::inRandomOrder()->first()->steamid, // Выбираем случайный steamid из пользователей
            'created_at' => $this->faker->dateTimeBetween('2024-10-01', '2025-01-01')->format('Y-m-d H:i:s'), // Случайная дата для created_at с нужным форматом
            'updated_at' => $this->faker->dateTimeBetween('2024-10-01', '2025-01-01')->format('Y-m-d H:i:s'), // Случайная дата для updated_at с нужным форматом
        ];
    }
}
