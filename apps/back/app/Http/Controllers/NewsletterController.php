<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => [
                'required',
                'email',
                'max:255',
            ],
        ]);

        $subscriber = NewsletterSubscriber::where(
            'email',
            $validated['email']
        )->first();

        /*
        |--------------------------------------------------------------------------
        | Existing subscriber
        |--------------------------------------------------------------------------
        */

        if ($subscriber) {

            // Already subscribed
            if ($subscriber->status === 'subscribed') {
                return response()->json([
                    'message' => 'You are already subscribed to our newsletter.',
                ]);
            }

            // Re-subscribe
            $subscriber->update([
                'status' => 'subscribed',
                'subscribed_at' => now(),
                'unsubscribed_at' => null,
            ]);

            return response()->json([
                'message' => 'You have been subscribed again successfully.',
                'data' => $subscriber->fresh(),
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | New subscriber
        |--------------------------------------------------------------------------
        */

        $subscriber = NewsletterSubscriber::create([
            'email' => $validated['email'],
            'status' => 'subscribed',
            'subscribed_at' => now(),
        ]);

        return response()->json([
            'message' => 'You have been subscribed successfully.',
            'data' => $subscriber,
        ], 201);
    }

    public function unsubscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => [
                'required',
                'email',
                'max:255',
            ],
        ]);

        $subscriber = NewsletterSubscriber::where(
            'email',
            $validated['email']
        )->first();

        if (!$subscriber) {
            return response()->json([
                'message' => 'Subscriber not found.',
            ], 404);
        }

        $subscriber->update([
            'status' => 'unsubscribed',
            'unsubscribed_at' => now(),
        ]);

        return response()->json([
            'message' => 'You have been unsubscribed successfully.',
        ]);
    }

        /**
     * List newsletter subscribers.
     */
    public function index(Request $request)
    {
        $query = NewsletterSubscriber::query();

        // Search by email
        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where('email', 'like', "%{$search}%");
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $subscribers = $query
            ->latest()
            ->paginate($request->input('per_page', 15));

        return response()->json($subscribers);
    }

    /**
     * Show subscriber.
     */
    public function show(NewsletterSubscriber $newsletterSubscriber)
    {
        return response()->json($newsletterSubscriber);
    }

    /**
     * Update subscriber status.
     */
    public function update(
        Request $request,
        NewsletterSubscriber $newsletterSubscriber
    ) {
        $validated = $request->validate([
            'status' => [
                'required',
                'in:subscribed,unsubscribed',
            ],
        ]);

        if (
            $validated['status'] === 'subscribed' &&
            $newsletterSubscriber->status !== 'subscribed'
        ) {
            $newsletterSubscriber->update([
                'status' => 'subscribed',
                'subscribed_at' => now(),
                'unsubscribed_at' => null,
            ]);
        } elseif (
            $validated['status'] === 'unsubscribed' &&
            $newsletterSubscriber->status !== 'unsubscribed'
        ) {
            $newsletterSubscriber->update([
                'status' => 'unsubscribed',
                'unsubscribed_at' => now(),
            ]);
        }

        return response()->json([
            'message' => 'Subscriber updated successfully.',
            'data' => $newsletterSubscriber->fresh(),
        ]);
    }

    /**
     * Delete subscriber.
     */
    public function destroy(NewsletterSubscriber $newsletterSubscriber)
    {
        $newsletterSubscriber->delete();

        return response()->json([
            'message' => 'Subscriber deleted successfully.',
        ]);
    }
}