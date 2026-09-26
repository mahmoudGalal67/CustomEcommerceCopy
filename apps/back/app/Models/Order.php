<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'payment_intent_id',
        'name',
        'email',
        'phone',
        'adress',
        'shipping',
        'tax',
        'city',
        'subtotal',
        'total',
        'status',
        'payment_status',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
    public function sellerOrders()
    {
        return $this->hasMany(SellerOrder::class);
    }
    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
}
