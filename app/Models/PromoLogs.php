<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PromoLogs extends Model
{
    use HasFactory;

    protected $fillable = [
        'steamid',
        'sum',
        'created_at',
        'name',
    ];
}