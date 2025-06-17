<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasFactory;

    protected $fillable = [
        'steamid',
        'balance',
        'bonus_balance',
        'avatar',
        'name',

        'group',
        'active_bonuses',
    ];

    protected $casts = [
        'balance' => 'float',
        'bonus_balance' => 'float',
        'active_bonuses' => 'array',
    ];
}
