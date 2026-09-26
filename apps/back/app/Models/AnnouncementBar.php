<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnnouncementBar extends Model
{
    protected $fillable = [
        'enabled',
        'message',
        'link',
        'background_color',
        'text_color',
        'speed',
        'starts_at',
        'ends_at'
    ];

       protected $casts = [
        'message' => 'array',
    ];
}
