<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('items_libs', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('itemid');  // Используем unsignedBigInteger для хранения больших положительных значений
            $table->string('shortname');
            $table->string('name');
            $table->text('description');
            $table->string('category');
            $table->string('image');
            $table->timestamps();

            $table->unique('itemid');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items_libs');
    }
};
