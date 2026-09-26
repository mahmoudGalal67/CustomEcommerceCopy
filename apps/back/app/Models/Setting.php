<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'site_name',
        'site_description',
        'site_contact_phone',
        'site_contact_email',
        'site_location',
        'logo',
        'favicon',
        'colors',
        'socials',
        'info',
         'terms',
         'privacy',
    ];


    protected $casts = [
        'colors' => 'array',
        'socials' => 'array',
        'info' => 'array',
         'terms' => 'array',
         'privacy' => 'array',
    ];
}
