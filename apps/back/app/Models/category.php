<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class category extends Model
{
    protected $fillable = [
        'seller_id',
        'slug',
        'description',
        'icon',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function products()
    {
        return $this->belongsToMany(Product::class);
    }
    public function translations()
    {
        return $this->hasMany(category_translation::class);
    }
}
