<?php

namespace Database\Seeders;

use App\Models\PaymentStatistic;
use Illuminate\Database\Seeder;

class PaymentStatisticSeeder extends Seeder
{
    public function run()
    {
        // Генерируем 50 записей для платежной статистики
        PaymentStatistic::factory(50)->create();
    }
}
