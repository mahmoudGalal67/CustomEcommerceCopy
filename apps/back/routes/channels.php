<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('presence.chat.{chatId}', function ($chatId) {
    return ['id' => $chatId];
});
