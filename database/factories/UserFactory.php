<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'steamid' => 'STEAM_' . fake()->numberBetween(0, 1) . ':' . fake()->numberBetween(0, 1) . ':' . fake()->numberBetween(1000000, 9999999),
            'balance' => fake()->randomFloat(2, 0, 50000),
            'bonus_balance' => fake()->randomFloat(2, 0, 1000),
            'avatar' => 'https://i.pravatar.cc/150?img=' . fake()->numberBetween(1, 70),
            'group' => fake()->randomElement(['user', 'admin', 'moderator']),
        ];
    }
}
