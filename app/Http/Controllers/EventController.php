<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventParticipant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::where('is_active', true)->latest();

        // Filter by category
        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        // Filter by location
        if ($request->has('location') && $request->location) {
            $query->where('location', $request->location);
        }

        $events = $query->paginate(12);

        $filters = [
            'category' => $request->category ?? '',
            'location' => $request->location ?? '',
        ];

        return view('events.index', compact('events', 'filters'));
    }

    public function show($id)
    {
        $event = Event::with('participants', 'user')->findOrFail($id);
        $userEmail = session('user_email') ?? request()->cookie('user_email');
        $isJoined = false;
        
        if ($userEmail) {
            $isJoined = EventParticipant::where('event_id', $id)
                ->where('user_email', $userEmail)
                ->exists();
        }

        return view('events.show', compact('event', 'isJoined', 'userEmail'));
    }

    public function create()
    {
        return view('events.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date',
            'time' => 'required',
            'location' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'max_participants' => 'nullable|integer|min:1',
            'price' => 'nullable|numeric|min:0',
            'contact' => 'nullable|string|max:255',
            'requirements' => 'nullable|string',
            'image_url' => 'nullable|url',
        ]);

        $user = \App\Models\User::firstOrCreate(
            ['email' => 'test@example.com'],
            ['name' => 'Test User', 'password' => bcrypt('password')]
        );
        $validated['user_id'] = $user->id;
        $validated['is_active'] = true;

        Event::create($validated);

        return redirect()->route('events.index')->with('success', 'Event berhasil dibuat!');
    }

    public function edit($id)
    {
        $event = Event::findOrFail($id);
        return view('events.edit', compact('event'));
    }

    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date',
            'time' => 'required',
            'location' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'max_participants' => 'nullable|integer|min:1',
            'price' => 'nullable|numeric|min:0',
            'contact' => 'nullable|string|max:255',
            'requirements' => 'nullable|string',
            'image_url' => 'nullable|url',
        ]);

        $event->update($validated);

        return redirect()->route('events.show', $id)->with('success', 'Event berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $event = Event::findOrFail($id);
        $event->delete();

        return redirect()->route('events.manage')->with('success', 'Event berhasil dihapus!');
    }

    public function join(Request $request, $id)
    {
        $validated = $request->validate([
            'user_email' => 'required|email',
            'user_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'notes' => 'nullable|string',
        ]);

        $event = Event::findOrFail($id);

        // Check if already joined
        $existing = EventParticipant::where('event_id', $id)
            ->where('user_email', $validated['user_email'])
            ->first();

        if ($existing) {
            return back()->with('error', 'Anda sudah terdaftar di event ini!');
        }

        // Check max participants
        if ($event->max_participants && $event->participants_count >= $event->max_participants) {
            return back()->with('error', 'Event sudah penuh!');
        }

        $validated['event_id'] = $id;
        EventParticipant::create($validated);

        return back()->with('success', 'Berhasil bergabung dengan event!');
    }

    public function manage()
    {
        $userEmail = session('user_email') ?? request()->cookie('user_email');
        $user = \App\Models\User::firstOrCreate(
            ['email' => 'test@example.com'],
            ['name' => 'Test User', 'password' => bcrypt('password')]
        );
        $events = Event::where('user_id', $user->id)->latest()->paginate(12);

        return view('events.manage', compact('events'));
    }
}
