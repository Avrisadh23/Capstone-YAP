<?php

namespace App\Http\Controllers;

use App\Models\Community;
use App\Models\CommunityMember;
use App\Helpers\ViewHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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

        $user = ViewHelper::getCurrentUser($request);

        return view('communities.index', compact('communities', 'filters', 'user'));
    }

    public function show($id)
    {
        $community = Community::with('members', 'user')->findOrFail($id);
        
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
            $member = CommunityMember::where('community_id', $id)
                ->where('user_email', $userEmail)
                ->first();
            
            // If not found, try case-insensitive search
            if (!$member) {
                $member = CommunityMember::where('community_id', $id)
                    ->whereRaw('LOWER(TRIM(user_email)) = ?', [$userEmail])
                    ->first();
            }
            
            if ($member) {
                $isJoined = true;
                $userRole = $member->role;
                $isPengurus = $member->role === 'pengurus';
            }
        }
        
        return view('communities.show', compact('community', 'isJoined', 'userEmail', 'isPengurus', 'userRole', 'user'));
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
            $imagePath = $request->file('image')->store('communities', 'public');
            $validated['image_url'] = asset('storage/' . $imagePath);
        } else {
            $validated['image_url'] = null;
        }

        // Create community
        $community = Community::create($validated);

        // Auto-add creator as pengurus
        CommunityMember::create([
            'community_id' => $community->id,
            'user_email' => strtolower(trim($user->email)),
            'user_name' => $user->name ?? $user->nama_lengkap ?? 'User',
            'role' => 'pengurus',
        ]);

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
        
        // Check if user is pengurus
        $userEmail = session('user_email') ?? request()->cookie('user_email');
        if (!$userEmail) {
            return back()->with('error', 'Silakan login terlebih dahulu!');
        }

        $isPengurus = CommunityMember::where('community_id', $id)
            ->where('user_email', strtolower(trim($userEmail)))
            ->where('role', 'pengurus')
            ->exists();

        if (!$isPengurus) {
            return back()->with('error', 'Anda tidak memiliki izin untuk mengedit komunitas ini!');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'rules' => 'nullable|string',
            'contact' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($community->image_url && strpos($community->image_url, 'storage/') !== false) {
                $oldPath = str_replace(asset('storage/'), '', $community->image_url);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }
            
            $imagePath = $request->file('image')->store('communities', 'public');
            $validated['image_url'] = asset('storage/' . $imagePath);
        }

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

        // Check if already joined
        $existing = CommunityMember::where('community_id', $id)
            ->where('user_email', $validated['user_email'])
            ->first();

        if ($existing) {
            return back()->with('error', 'Anda sudah terdaftar di komunitas ini!');
        }

        $validated['community_id'] = $id;
        // Normalize email to lowercase
        $validated['user_email'] = trim(strtolower($validated['user_email']));
        // Set default role as anggota
        $validated['role'] = 'anggota';
        
        try {
            $member = CommunityMember::create($validated);
            
            \Log::info('Community member created:', [
                'community_id' => $id,
                'user_email' => $validated['user_email'],
                'member_id' => $member->id
            ]);
            
            // Verify data was saved
            $saved = CommunityMember::where('community_id', $id)
                ->whereRaw('LOWER(user_email) = ?', [strtolower($validated['user_email'])])
                ->exists();
            
            if (!$saved) {
                \Log::error('Failed to save community member', $validated);
                return back()->with('error', 'Gagal menyimpan data. Silakan coba lagi.');
            }
            
            return back()->with('success', 'Berhasil bergabung dengan komunitas!');
        } catch (\Exception $e) {
            \Log::error('Error joining community: ' . $e->getMessage(), $validated);
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

        // Get communities where user is pengurus
        $communityIds = CommunityMember::where('user_email', $userEmail)
            ->where('role', 'pengurus')
            ->pluck('community_id');
            
        $communities = Community::whereIn('id', $communityIds)->latest()->paginate(12);

        return view('communities.manage', compact('communities'));
    }

    public function myCommunities(Request $request)
    {
        // Get user first to ensure we have the correct email
        $user = ViewHelper::getCurrentUser($request);
        
        if (!$user) {
            // Don't redirect immediately, show page with message
            $communities = new \Illuminate\Pagination\LengthAwarePaginator(collect([]), 0, 12, 1);
            return view('communities.my-communities', compact('communities'))->with('error', 'Silakan login terlebih dahulu atau refresh halaman.');
        }

        // Use email from User model, normalized
        $userEmail = trim(strtolower($user->email));
        
        // Get all community IDs where user has joined
        // Try multiple approaches to find all communities
        $joinedCommunityIds = [];
        
        // Approach 1: Exact match (normalized email)
        $exactMatch = CommunityMember::where('user_email', $userEmail)
            ->pluck('community_id')
            ->toArray();
        $joinedCommunityIds = array_merge($joinedCommunityIds, $exactMatch);
        
        // Approach 2: Case-insensitive match (for old data)
        $caseInsensitive = CommunityMember::whereRaw('LOWER(TRIM(user_email)) = ?', [$userEmail])
            ->pluck('community_id')
            ->toArray();
        $joinedCommunityIds = array_merge($joinedCommunityIds, $caseInsensitive);
        
        // Approach 3: Get all members and filter manually (most robust)
        $allMembers = CommunityMember::all();
        foreach ($allMembers as $member) {
            $memberEmail = trim(strtolower($member->user_email));
            if ($memberEmail === $userEmail && !in_array($member->community_id, $joinedCommunityIds)) {
                $joinedCommunityIds[] = $member->community_id;
            }
        }
        
        // Remove duplicates
        $joinedCommunityIds = array_unique($joinedCommunityIds);

        // Get ONLY communities where user has joined
        if (empty($joinedCommunityIds)) {
            $communities = new \Illuminate\Pagination\LengthAwarePaginator(
                collect([]),
                0,
                12,
                1
            );
        } else {
            $communities = Community::whereIn('id', $joinedCommunityIds)
                ->where('is_active', true)
                ->with('members')
                ->latest()
                ->paginate(12);
        }
        
        return view('communities.my-communities', compact('communities', 'userEmail', 'user'));
    }

    public function removeMember($id, $memberId)
    {
        $community = Community::findOrFail($id);
        
        // Check if user is pengurus
        $userEmail = session('user_email') ?? request()->cookie('user_email');
        if (!$userEmail) {
            return back()->with('error', 'Silakan login terlebih dahulu!');
        }

        $isPengurus = CommunityMember::where('community_id', $id)
            ->where('user_email', strtolower(trim($userEmail)))
            ->where('role', 'pengurus')
            ->exists();

        if (!$isPengurus) {
            return back()->with('error', 'Anda tidak memiliki izin untuk menghapus anggota!');
        }

        // Don't allow removing pengurus
        $member = CommunityMember::findOrFail($memberId);
        if ($member->role === 'pengurus') {
            return back()->with('error', 'Tidak dapat menghapus pengurus!');
        }

        $member->delete();

        return back()->with('success', 'Anggota berhasil dihapus dari komunitas!');
    }
}
