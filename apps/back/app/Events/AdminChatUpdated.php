<?php

namespace App\Events;

use App\Models\Chat;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AdminChatUpdated implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public $chat;

    public function __construct(Chat $chat)
    {
        $this->chat = $chat->load('messages');
    }

    public function broadcastOn()
    {
        return [
            new Channel('admin.support')
        ];
    }

    public function broadcastAs()
    {
        return 'chat.updated';
    }

    public function broadcastWith()
    {
        return [
            'id' => $this->chat->id,
            'status' => $this->chat->status,
            'unread_by_admin' => $this->chat->messages()
                ->where('sender', 'user')
                ->where('is_read', false)
                ->count(),
            'ai_handled' => $this->chat->ai_handled,
            'is_chat_open' => $this->chat->is_chat_open,
            'last_message_at' => $this->chat->last_message_at,
            'last_message' =>
                $this->chat->messages()->latest()->first()?->message,
        ];
    }
}