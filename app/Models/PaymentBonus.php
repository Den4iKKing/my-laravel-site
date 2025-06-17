<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentBonus extends Model
{
    use HasFactory;

    protected $fillable = [
        'min_amount',
        'bonus_percent',
    ];
}
