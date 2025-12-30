<?php

namespace App\Http\Controllers;

use App\Models\Community;
use App\Models\CommunityMember;
use Illuminate\Http\Request;

class CommunityController extends Controller
{
    public function index(Request $request)
    {
        $query = Community::where('is_active', true)->latest();

        // Filter by category
        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        // Filter by location
        if ($request->has('location') && $request->location) {
            $query->where('location', $request->location);
        }

        $communities = $query->paginate(12);

        $filters = [
            'category' => $request->category ?? '',
            'location' => $request->location ?? '',
        ];

        return view('communities.index', compact('communities', 'filters'));
    }

    public function show($id)
    {
        $community = Community::with('members', 'user')->findOrFail($id);
        $userEmail = session('user_email') ?? request()->cookie('user_email');
        $isJoined = false;
        
        if ($userEmail) {
            $isJoined = CommunityMember::where('community_id', $id)
                ->where('user_email', $userEmail)
                ->exists();
        }

        return view('communities.show', compact('community', 'isJoined', 'userEmail'));
    }

    public function create()
    {
        return view('communities.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'rules' => 'nullable|string',
            'contact' => 'nullable|string|max:255',
            'image_url' => 'nullable|url',
        ]);

        $user = \App\Models\User::firstOrCreate(
            ['email' => 'test@example.com'],
            ['name' => 'Test User', 'password' => bcrypt('password')]
        );
        $validated['user_id'] = $user->id;
        $validated['is_active'] = true;

        Community::create($validated);

        return redirect()->route('communities.index')->with('success', 'Komunitas berhasil dibuat!');
    }

    public function edit($id)
    {
        $community = Community::findOrFail($id);
        return view('communities.edit', compact('community'));
    }

    public function update(Request $request, $id)
    {
        $community = Community::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'rules' => 'nullable|string',
            'contact' => 'nullable|string|max:255',
            'image_url' => 'nullable|url',
        ]);

        $community->update($validated);

        return redirect()->route('communities.show', $id)->with('success', 'Komunitas berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $community = Community::findOrFail($id);
        $community->delete();

        return redirect()->route('communities.manage')->with('success', 'Komunitas berhasil dihapus!');
    }

    public function join(Request $request, $id)
    {
        $validated = $request->validate([
            'user_email' => 'required|email',
            'user_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'notes' => 'nullable|string',
        ]);

        // Check if already joined
        $existing = CommunityMember::where('community_id', $id)
            ->where('user_email', $validated['user_email'])
            ->first();

        if ($existing) {
            return back()->with('error', 'Anda sudah terdaftar di komunitas ini!');
        }

        $validated['community_id'] = $id;
        CommunityMember::create($validated);

        return back()->with('success', 'Berhasil bergabung dengan komunitas!');
    }

    public function manage()
    {
        $userEmail = session('user_email') ?? request()->cookie('user_email');
        $user = \App\Models\User::firstOrCreate(
            ['email' => 'test@example.com'],
            ['name' => 'Test User', 'password' => bcrypt('password')]
        );
        $communities = Community::where('user_id', $user->id)->latest()->paginate(12);

        return view('communities.manage', compact('communities'));
    }
}
