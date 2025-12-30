<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventParticipant;
use App\Helpers\ViewHelper;
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

        $user = ViewHelper::getCurrentUser($request);

        return view('events.index', compact('events', 'filters', 'user'));
    }

    public function show($id)
    {
        $event = Event::with('participants', 'user')->findOrFail($id);
        
        // Get user first to ensure we have the correct email
        $user = ViewHelper::getCurrentUser(request());
        $userEmail = null;
        $isJoined = false;
        $isPengurus = false;
        $userRole = null;
        
        if ($user) {
            // Use email from User model, not from session/cookie (which might be encoded)
            $userEmail = strtolower(trim($user->email));
            
            // Try exact match first
            $participant = EventParticipant::where('event_id', $id)
                ->where('user_email', $userEmail)
                ->first();
            
            // If not found, try case-insensitive search
            if (!$participant) {
                $participant = EventParticipant::where('event_id', $id)
                    ->whereRaw('LOWER(TRIM(user_email)) = ?', [$userEmail])
                    ->first();
            }
            
            if ($participant) {
                $isJoined = true;
                $userRole = $participant->role;
                $isPengurus = $participant->role === 'pengurus';
            }
        }
        
        return view('events.show', compact('event', 'isJoined', 'userEmail', 'isPengurus', 'userRole', 'user'));
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

        // Get current user from session
        $userEmail = session('user_email') ?? request()->cookie('user_email');
        if (!$userEmail) {
            return back()->with('error', 'Silakan login terlebih dahulu!')->withInput();
        }

        // Find or get user
        $user = \App\Models\User::where('email', $userEmail)->first();
        if (!$user) {
            return back()->with('error', 'User tidak ditemukan!')->withInput();
        }

        $validated['user_id'] = $user->id;
        $validated['is_active'] = true;

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('events', 'public');
            $validated['image_url'] = asset('storage/' . $imagePath);
        } else {
            $validated['image_url'] = null;
        }

        // Create event
        $event = Event::create($validated);

        // Auto-add creator as pengurus
        EventParticipant::create([
            'event_id' => $event->id,
            'user_email' => strtolower(trim($user->email)),
            'user_name' => $user->name ?? $user->nama_lengkap ?? 'User',
            'role' => 'pengurus',
        ]);

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
        
        // Check if user is pengurus
        $userEmail = session('user_email') ?? request()->cookie('user_email');
        if (!$userEmail) {
            return back()->with('error', 'Silakan login terlebih dahulu!');
        }

        $isPengurus = EventParticipant::where('event_id', $id)
            ->where('user_email', strtolower(trim($userEmail)))
            ->where('role', 'pengurus')
            ->exists();

        if (!$isPengurus) {
            return back()->with('error', 'Anda tidak memiliki izin untuk mengedit event ini!');
        }

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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($event->image_url && strpos($event->image_url, 'storage/') !== false) {
                $oldPath = str_replace(asset('storage/'), '', $event->image_url);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }
            
            $imagePath = $request->file('image')->store('events', 'public');
            $validated['image_url'] = asset('storage/' . $imagePath);
        }

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
            'user_email' => 'required|email:rfc,dns|max:255',
            'user_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'notes' => 'nullable|string',
        ]);
        
        // Additional email validation
        $email = trim($validated['user_email']);
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return back()->with('error', 'Format email tidak valid!')->withInput();
        }

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
        // Normalize email to lowercase
        $validated['user_email'] = trim(strtolower($validated['user_email']));
        // Set default role as peserta
        $validated['role'] = 'peserta';
        
        try {
            $participant = EventParticipant::create($validated);
            
            \Log::info('Event participant created:', [
                'event_id' => $id,
                'user_email' => $validated['user_email'],
                'participant_id' => $participant->id
            ]);
            
            // Verify data was saved
            $saved = EventParticipant::where('event_id', $id)
                ->whereRaw('LOWER(user_email) = ?', [strtolower($validated['user_email'])])
                ->exists();
            
            if (!$saved) {
                \Log::error('Failed to save event participant', $validated);
                return back()->with('error', 'Gagal menyimpan data. Silakan coba lagi.');
            }
            
            return back()->with('success', 'Berhasil bergabung dengan event!');
        } catch (\Exception $e) {
            \Log::error('Error joining event: ' . $e->getMessage(), $validated);
            return back()->with('error', 'Terjadi kesalahan saat bergabung. Silakan coba lagi.');
        }
    }

    public function manage()
    {
        $userEmail = session('user_email') ?? request()->cookie('user_email');
        if (!$userEmail) {
            return redirect()->route('landing')->with('error', 'Silakan login terlebih dahulu!');
        }

        $userEmail = strtolower(trim($userEmail));
        $user = \App\Models\User::where('email', $userEmail)->first();
        
        if (!$user) {
            return redirect()->route('landing')->with('error', 'User tidak ditemukan!');
        }

        // Get events where user is pengurus
        $eventIds = EventParticipant::where('user_email', $userEmail)
            ->where('role', 'pengurus')
            ->pluck('event_id');
            
        $events = Event::whereIn('id', $eventIds)->latest()->paginate(12);

        return view('events.manage', compact('events'));
    }

    public function myEvents(Request $request)
    {
        // Get user first to ensure we have the correct email
        $user = ViewHelper::getCurrentUser($request);
        
        if (!$user) {
            // Don't redirect immediately, show page with message
            $events = new \Illuminate\Pagination\LengthAwarePaginator(collect([]), 0, 12, 1);
            return view('events.my-events', compact('events'))->with('error', 'Silakan login terlebih dahulu atau refresh halaman.');
        }

        // Use email from User model, normalized
        $userEmail = trim(strtolower($user->email));
        
        // Get all event IDs where user has joined
        // Try multiple approaches to find all events
        $joinedEventIds = [];
        
        // Approach 1: Exact match (normalized email)
        $exactMatch = EventParticipant::where('user_email', $userEmail)
            ->pluck('event_id')
            ->toArray();
        $joinedEventIds = array_merge($joinedEventIds, $exactMatch);
        
        // Approach 2: Case-insensitive match (for old data)
        $caseInsensitive = EventParticipant::whereRaw('LOWER(TRIM(user_email)) = ?', [$userEmail])
            ->pluck('event_id')
            ->toArray();
        $joinedEventIds = array_merge($joinedEventIds, $caseInsensitive);
        
        // Approach 3: Get all participants and filter manually (most robust)
        $allParticipants = EventParticipant::all();
        foreach ($allParticipants as $participant) {
            $participantEmail = trim(strtolower($participant->user_email));
            if ($participantEmail === $userEmail && !in_array($participant->event_id, $joinedEventIds)) {
                $joinedEventIds[] = $participant->event_id;
            }
        }
        
        // Remove duplicates
        $joinedEventIds = array_unique($joinedEventIds);

        // Get ONLY events where user has joined
        if (empty($joinedEventIds)) {
            $events = new \Illuminate\Pagination\LengthAwarePaginator(
                collect([]),
                0,
                12,
                1
            );
        } else {
            $events = Event::whereIn('id', $joinedEventIds)
                ->where('is_active', true)
                ->with('participants')
                ->latest()
                ->paginate(12);
        }
        
        return view('events.my-events', compact('events', 'userEmail', 'user'));
    }

    public function removeParticipant($id, $participantId)
    {
        $event = Event::findOrFail($id);
        
        // Check if user is pengurus
        $userEmail = session('user_email') ?? request()->cookie('user_email');
        if (!$userEmail) {
            return back()->with('error', 'Silakan login terlebih dahulu!');
        }

        $isPengurus = EventParticipant::where('event_id', $id)
            ->where('user_email', strtolower(trim($userEmail)))
            ->where('role', 'pengurus')
            ->exists();

        if (!$isPengurus) {
            return back()->with('error', 'Anda tidak memiliki izin untuk menghapus peserta!');
        }

        // Don't allow removing pengurus
        $participant = EventParticipant::findOrFail($participantId);
        if ($participant->role === 'pengurus') {
            return back()->with('error', 'Tidak dapat menghapus pengurus!');
        }

        $participant->delete();

        return back()->with('success', 'Peserta berhasil dihapus dari event!');
    }
}
