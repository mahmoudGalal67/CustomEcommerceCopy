<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class category_translation extends Model
{
    protected $fillable = [
        'category_id',
        'locale',
        'name',
    ];
}
