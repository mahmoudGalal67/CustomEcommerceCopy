<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index()
    {
        return Event::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required',
            'start' => 'required|date',
            'end' => 'required|date',
            'description' => 'nullable',
            'color' => 'nullable',
            'all_day' => 'boolean'
        ]);

        return Event::create($validated);
    }

    public function show(Event $event)
    {
        return $event;
    }

    public function update(Request $request, Event $event)
    {
        $event->update($request->all());

        return $event;
    }

    public function destroy(Event $event)
    {
        $event->delete();

        return response()->json([
            'message' => 'deleted'
        ]);
    }
}