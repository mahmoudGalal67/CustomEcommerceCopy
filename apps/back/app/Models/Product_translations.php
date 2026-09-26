<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product_translations extends Model
{
    protected $fillable = [
        'product_id',
        'locale',
        'name',
        'description',
    ];
}
