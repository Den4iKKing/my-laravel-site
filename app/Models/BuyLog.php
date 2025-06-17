<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BuyLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id',
        'server_id',
        'user_id',
        'steamid',
        'created_at',
        'item_name',
        'price',
    ];

    public function item()
    {
        return $this->belongsTo(ShopItem::class, 'item_id');
    }
    public function server()
    {
        return $this->belongsTo(Server::class, 'server_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
