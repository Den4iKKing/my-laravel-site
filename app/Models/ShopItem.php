<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShopItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'atr',
        'name',
        'image',
        'visible',
        'zid',
        'sale',
        'name',
        'about',
        'price',
        'about',
        'server_id',
        'category_id',
    ];

    protected $casts = [
        'atr' => 'array',
        'visible' => 'boolean',
    ];

    public function server()
    {
        return $this->belongsTo(Server::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
