<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('shop_items', function (Blueprint $table) {
            $table->id();
            $table->integer('price');
            $table->string('about');
            $table->string('name');

            $table->integer('sale');

            $table->text('atr'); // Дополнительные атрибуты
            $table->string('image')->nullable();
            $table->boolean('visible')->default(true);
            $table->foreignId('server_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('shop_items');
    }
};
