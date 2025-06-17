<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentStatisticsTable extends Migration
{
    public function up()
    {
        Schema::create('payment_statistics', function (Blueprint $table) {
            $table->id();
            $table->string('method');
            $table->decimal('amount', 10, 2);
            $table->string('steamid');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('payment_statistics');
    }
}
