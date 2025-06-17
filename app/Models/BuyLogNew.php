<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BuyLogNew extends Model
{
    use HasFactory;

    protected $fillable = [
        'steamid',
        'price',
        'item_name',
        'created_at',
        'stats_name',
    ];
}