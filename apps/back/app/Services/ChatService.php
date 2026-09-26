<?php
namespace App\Services;

use App\Models\Chat;
use App\Models\Message;
use Illuminate\Http\Request;

class ChatService
{
    public function __construct(
        public TokenService $tokenService
    ) {
    }
    public function findOrCreateChat(Request $request)
    {

        $user = $this->tokenService->getUserFromRefreshCookie($request);

        if ($user) {
            $chat = Chat::firstOrCreate([
                'user_id' => $user->id
            ]);

            if ($request->guest_token) {
                $guestChat = Chat::where('guest_token', $request->guest_token)
                    ->whereNull('user_id')
                    ->first();

                if ($guestChat) {
                    Message::where('chat_id', $guestChat->id)
                        ->update(['chat_id' => $chat->id]);

                    $guestChat->delete();
                }
            }

            return $chat;
        }

        return Chat::firstOrCreate([
            'guest_token' => $request->guest_token,
            'user_id' => null
        ]);
    }
}