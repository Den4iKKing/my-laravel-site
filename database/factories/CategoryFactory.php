<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    public function definition()
    {
        return [
            'zid' => 1,
            'name' => $this->faker->word(),
            'icon' => $this->faker->word(),

            'visible' => $this->faker->boolean(90),
        ];
    }
}
