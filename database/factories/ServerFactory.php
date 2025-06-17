<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Server>
 */
class ServerFactory extends Factory
{
    public function definition()
    {
        return [
            'ip' => $this->faker->ipv4(),
            'name' => $this->faker->name(),

            'query_port' => $this->faker->numberBetween(27000, 28000),
            'game_port' => $this->faker->numberBetween(27000, 28000),
            'zid' => 1,
            'visible' => $this->faker->boolean(80), // 80% вероятность, что сервер видимый
        ];
    }
}
