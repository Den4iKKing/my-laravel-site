<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Promocode extends Model
{
    protected $table = 'promo_codes';

    protected $fillable = [
        'code',
        'type',
        'value',
        'max_uses',
        'used',
    ];

    protected $casts = [
        'value' => 'float',
        'max_uses' => 'integer',
        'used' => 'integer',
    ];
}
