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
        Schema::create('promo_codes', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->enum('type', ['deposit_bonus', 'bonus_balance', 'sale_bonus']);
            $table->decimal('value', 10, 2);
            $table->integer('max_uses')->default(1);
            $table->integer('used')->default(0);
            $table->timestamps();

        });
        Schema::table('users', function (Blueprint $table) {
            $table->json('active_bonuses')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promo_codes');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('active_bonuses');
        });
    }
};
