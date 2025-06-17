<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'zid',
        'name',
        'icon',
        'ru_name',
        'en_name',
        'visible',
    ];

    protected $casts = [
        'visible' => 'boolean',
    ];
}
