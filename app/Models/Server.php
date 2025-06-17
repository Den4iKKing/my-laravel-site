<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Server extends Model
{
    use HasFactory;

    protected $fillable = [
        'ip',
        'name',
        'query_port',
        'game_port',
        'zid',
        'visible',
    ];

    protected $casts = [
        'visible' => 'boolean',
    ];
}
