<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PopupCampaign extends Model
{
    protected $fillable = [
        'enabled',
        'title',
        'description',
        'image',
        'button_text',
        'button_link',
        'delay_seconds',
        'show_once_days',
        'starts_at',
        'ends_at'
    ];
}
