<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class items_lib extends Model
{
    use HasFactory;

    protected $fillable = [
        'itemid',
        'shortname',
        'name',
        'description',
        'category',
        'image',
    ];
}
