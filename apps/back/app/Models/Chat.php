<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    protected $fillable = [
        'user_id',
        'guest_token',
        'status',
        'ai_handled',
        'unread_by_admin',
        'unread_by_user',
        'is_chat_open',
        'assigned_admin_id',
        'last_message_at'
    ];

    public function messages()
    {
        return $this->hasMany(Message::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function assignedAdmin()
    {
        return $this->belongsTo(User::class, 'assigned_admin_id');
    }
}
