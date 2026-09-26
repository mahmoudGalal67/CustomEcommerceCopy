<?php

namespace App\Http\Controllers;

use App\Events\AdminChatUpdated;
use App\Events\MessageSent;
use App\Models\Chat;
use App\Models\Message;
use Illuminate\Http\Request;
use App\Services\AIService;
use App\Services\KnowledgeBaseService;

use App\Services\ChatService;


class ChatController extends Controller
{
    public function __construct(
        public ChatService $chatService,

    ) {}

    public function getUnreadStats()
    {
        $chatsWithUnread = Chat::whereHas('messages', function ($query) {
            $query->where('sender', 'user')
                ->where('is_read', false);
        })->count();

        $totalUnreadMessages = Message::where('sender', 'user')
            ->where('is_read', false)
            ->count();

        return response()->json([
            'chats_with_unread' => $chatsWithUnread,
            'total_unread_messages' => $totalUnreadMessages,
        ]);
    }

    public function getChats(Request $request)
    {
        $search = $request->search;
        $status = $request->status;

        $chats = Chat::withCount([
            'messages as unread_by_admin' => function ($query) {
                $query->where('sender', 'user')
                    ->where('is_read', false);
            }
        ])
            ->with([
                'messages' => fn($q) => $q->latest()->limit(1),
                'user'
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    // Search by Chat ID
                    if (is_numeric($search)) {
                        $q->where('id', $search);
                    }

                    // Search by User Name
                    $q->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%");
                    });
                });
            })
            ->when($request->filled('status') && $request->status !== 'undefined', function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->orderByDesc('last_message_at')
            ->paginate(20);

        return response()->json($chats);
    }
    public function getMessagesAdmin($chatId)
    {
        $messages = Message::where('chat_id', $chatId)
            ->orderBy('id')
            ->get();

        Message::where('chat_id', $chatId)
            ->where('sender', 'user')
            ->update([
                'is_read' => true
            ]);

        return response()->json($messages);
    }
    public function sendMessageAdmin(Request $request)
    {
        $request->validate([
            'chat_id' => 'required|exists:chats,id',
            'message' => 'required|string'
        ]);

        $chat = Chat::findOrFail($request->chat_id);
        $user = $request->user();

        $message = Message::create([
            'chat_id' => $chat->id,
            'sender' => 'admin',
            'message' => $request->message,
        ]);

        $chat->update([
            'status' => 'resolved',
            'assigned_admin_id' => $user->id,
            'last_message_at' => now(),
        ]);

        broadcast(new MessageSent($message));

        return response()->json($message);
    }
    public function resolveChat($chatId)
    {
        $chat = Chat::findOrFail($chatId);

        $chat->update([
            'status' => 'resolved'
        ]);

        return response()->json([
            'message' => 'resolved'
        ]);
    }
    public function sendMessage(
        Request $request,
        AIService $ai,
        KnowledgeBaseService $kb
    ) {
        $request->validate([
            'message' => 'required|string',
            'guest_token' => 'nullable|string'
        ]);

        $chat = $this->chatService->findOrCreateChat(
            $request
        );


        // Save user message
        $message = Message::create([
            'chat_id' => $chat->id,
            'sender' => 'user',
            'message' => $request->message,
            'status' => 'answered'
        ]);
        $chat->update([
            'last_message_at' => now(),
        ]);
        $chat = $chat->fresh();
        broadcast(new MessageSent($message));

        broadcast(new AdminChatUpdated($chat));

        $history = "";
        // if (!$chat->is_chat_open) {
        //     return response()->json([
        //         'success' => true,
        //         'message' => $message
        //     ]);
        // }
        $messages = Message::where('chat_id', $chat->id)->orderBy('id')->get();
        foreach ($messages as $msg) {
            $history .= $msg->sender . ': ' . $msg->message . "\n";
        }
        // Search knowledge
        $knowledge = $kb->searchKnowledge(
            $request->message,
            5
        );

        $context = '';
        if (!empty($knowledge['company_context'])) {

            $context .=
                "COMPANY INFORMATION:\n\n";

            $context .=
                $knowledge['company_context'];

            $context .= "\n\n";
        }
        if (!empty($knowledge['product_context'])) {

            $context .=
                "PRODUCT INFORMATION:\n\n";

            $context .=
                $knowledge['product_context'];
        }

        $prompt = <<<PROMPT
You are a customer support assistant.

Answer the customer's question using ONLY the
information provided in the CONTEXT below.

CONTEXT:
{$context}

CONVERSATION HISTORY:
{$history}

RULES:

1. Do not invent information.
2. Do not assume information that is not present.
3. If the answer cannot be found in the context,
   respond exactly with:

NOT_FOUND

4. Answer naturally and clearly.
5. The context may contain COMPANY INFORMATION
   and PRODUCT INFORMATION.
6. Do not mention Qdrant, embeddings, RAG, context, or the database.

USER QUESTION:
{$request->message}
PROMPT;

        $aiResponse = $ai->ask($prompt);

        $status = str_contains($aiResponse, 'NOT_FOUND')
            ? 'pending'
            : 'answered';

        $message = str_contains($aiResponse, 'NOT_FOUND')
            ? 'Forwarded to support team.'
            : $aiResponse;

        $newMessage = Message::create([
            'chat_id' => $chat->id,
            'sender' => 'ai',
            'message' => $message,
            'status' => $status
        ]);
        if ($message == 'Forwarded to support team.') {
            $chat->update([
                'status' => 'pending_admin',
                'ai_handled' => true,
                'last_message_at' => now(),
            ]);
        } else {
            $chat->update([
                'status' => 'open',
                'ai_handled' => true,
                'last_message_at' => now(),
            ]);
        }

        broadcast(new MessageSent($newMessage));

        return response()->json([
            'message' => $newMessage
        ]);
    }
    public function closeChat(
        Request $request,
    ) {
        $request->validate([
            'chat_id' => 'required|exists:chats,id',
        ]);

        $chat = Chat::findOrFail($request->chat_id);

        $chat->update([
            'is_chat_open' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Chat closed successfully.',
        ]);
    }
    public function openChat(
        Request $request,
    ) {
        $request->validate([
            'chat_id' => 'required|exists:chats,id',
        ]);

        $chat = Chat::findOrFail($request->chat_id);

        $chat->update([
            'is_chat_open' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Chat opened successfully.',
        ]);
    }
    public function getMessages(Request $request)
    {
        $chat = $this->chatService->findOrCreateChat(
            $request
        );

        $messages = $chat->messages()
            ->orderBy('id', 'asc')
            ->get();

        return response()->json($messages);
    }
    public function mergeGuestChat(Request $request)
    {
        $request->validate([
            'guest_token' => 'required|string'
        ]);

        $user = $this->chatService->findOrCreateChat(
            $request
        );
        return response()->json([
            'user' => $user
        ]);

        // return response()->json([
        //     'chat_id' => $chat->id
        // ]);
    }
    public function markAdminRead(Request $request)
    {
        $chat = Chat::findOrFail($request->chat_id);

        $chat->update([
            'unread_by_admin' => 0
        ]);

        return response()->json([
            'success' => true
        ]);
    }
    public function markUserRead(Request $request)
    {
        $chat = Chat::findOrFail($request->chat_id);

        $chat->update([
            'unread_by_user' => 0
        ]);

        return response()->json([
            'success' => true
        ]);
    }
    public function markMessageIsread(Request $request)
    {
        $message = Message::findOrFail($request->message_id);

        $message->update([
            'is_read' => true
        ]);

        return response()->json([
            'success' => true
        ]);
    }
    public function markALLMessagesIsreadForUser(Request $request)
    {
        $request->validate([
            'chat_id' => 'required|exists:chats,id',
        ]);

        $updated = Message::where('chat_id', $request->chat_id)
            ->whereIn('sender', ['admin', 'ai'])
            ->update([
                'is_read' => true,
            ]);

        return response()->json([
            'success' => true,
            'updated' => $updated,
        ]);
    }
    public function markALLMessagesIsreadForAdmin(Request $request)
    {
        $request->validate([
            'chat_id' => 'required|exists:chats,id',
        ]);

        Message::where('chat_id', $request->chat_id)
            ->where('sender', 'user')
            ->where('is_read', false)
            ->update([
                'is_read' => true,
            ]);

        return response()->json([
            'success' => true,
        ]);
    }
}
