<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $fillable = [
        'slug',
        'title',
        'sections',
    ];

    protected $casts = [
        'sections' => 'array',
          'title' => 'array',
    ];
}
