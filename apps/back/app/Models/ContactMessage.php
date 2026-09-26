<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;


class ContactMessage extends Model
{
    use Notifiable;
    protected $fillable = [
        'name',
        'email',
        'phone',
        'subject',
        'message',
        'status',
        'admin_notes',
        'read_at',
        'replied_at',
    ];

    protected $casts = [
        'read_at' => 'datetime',
        'replied_at' => 'datetime',
    ];
    
        public function routeNotificationForMail(
        object $notification
    ): array|string {
        return [
            $this->email => $this->name,
        ];
    }
}