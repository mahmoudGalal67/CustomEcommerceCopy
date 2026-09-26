<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;
use App\Notifications\ContactMessageReply;
class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $contactMessage = ContactMessage::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'status' => 'new',
        ]);

        return response()->json([
            'message' => 'Your message has been sent successfully.',
            'data' => $contactMessage,
        ], 201);
    }

    /**
     * Get all contact messages.
     */
    public function index(Request $request)
    {
        $query = ContactMessage::query();

        /*
        |--------------------------------------------------------------------------
        | Search
        |--------------------------------------------------------------------------
        */

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%");
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Filter by status
        |--------------------------------------------------------------------------
        */

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        /*
        |--------------------------------------------------------------------------
        | Pagination
        |--------------------------------------------------------------------------
        */

        $messages = $query
            ->latest()
            ->paginate(
                $request->integer('per_page', 15)
            );

        return response()->json($messages);
    }

    /**
     * Get one contact message.
     */
    public function show(ContactMessage $contactMessage)
    {
        /*
        |--------------------------------------------------------------------------
        | Mark as read
        |--------------------------------------------------------------------------
        */

        if ($contactMessage->status === 'new') {
            $contactMessage->update([
                'status' => 'read',
                'read_at' => now(),
            ]);
        }

        return response()->json($contactMessage->fresh());
    }

    /**
     * Update status / admin notes.
     */
    public function update(
        Request $request,
        ContactMessage $contactMessage
    ) {
        $validated = $request->validate([
            'status' => [
                'sometimes',
                'required',
                'in:new,read,replied,closed',
            ],

            'admin_notes' => [
                'nullable',
                'string',
                'max:5000',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Status timestamps
        |--------------------------------------------------------------------------
        */

        if (
            isset($validated['status']) &&
            $validated['status'] === 'read' &&
            !$contactMessage->read_at
        ) {
            $validated['read_at'] = now();
        }

        if (
            isset($validated['status']) &&
            $validated['status'] === 'replied' &&
            !$contactMessage->replied_at
        ) {
            $validated['replied_at'] = now();
        }

        $contactMessage->update($validated);

        return response()->json([
            'message' => 'Contact message updated successfully.',
            'data' => $contactMessage->fresh(),
        ]);
    }

    /**
     * Delete a contact message.
     */
    public function destroy(ContactMessage $contactMessage)
    {
        $contactMessage->delete();

        return response()->json([
            'message' => 'Contact message deleted successfully.',
        ]);
    }

    public function reply(
    Request $request,
    ContactMessage $contactMessage
) {
    $validated = $request->validate([
        'message' => [
            'required',
            'string',
            'max:5000',
        ],
    ]);

    /*
    |--------------------------------------------------------------------------
    | Send email
    |--------------------------------------------------------------------------
    */

    $contactMessage->notify(
        new ContactMessageReply(
            $contactMessage,
            $validated['message']
        )
    );

    /*
    |--------------------------------------------------------------------------
    | Update message status
    |--------------------------------------------------------------------------
    */

    $contactMessage->update([
        'status' => 'replied',
        'replied_at' => now(),
    ]);

    return response()->json([
        'message' => 'Reply has been queued successfully.',
        'data' => $contactMessage->fresh(),
    ]);
}
}