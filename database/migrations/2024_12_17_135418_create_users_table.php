<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('steamid')->unique();
            $table->decimal('balance', 10, 2)->default(0.00);
            $table->decimal('bonus_balance', 10, 2)->default(0.00);
            $table->string('avatar')->nullable();
            $table->string('group')->default('user');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
};
