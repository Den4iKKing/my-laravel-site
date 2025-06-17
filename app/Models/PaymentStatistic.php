<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentStatistic extends Model
{
    use HasFactory;

    protected $fillable = [
        'method',
        'amount',
        'created_at',
        'steamid',
        'uuid'
    ];

}
