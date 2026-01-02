<?php

namespace App\Http\Controllers;

use App\Models\Community;
use App\Models\CommunityMember;
use App\Models\ForumPost;
use App\Models\ForumReply;
use App\Helpers\ViewHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ForumController extends Controller
{
    public function index($communityId)
    {
        $community = Community::findOrFail($communityId);
        $user = ViewHelper::getCurrentUser(request());
        
        if (!$user) {
            return redirect()->route('communities.show', $communityId)
                ->with('error', 'Silakan login terlebih dahulu!');
        }

        // Check if user is a member of the community
        $userEmail = strtolower(trim($user->email));
        $isMember = CommunityMember::where('community_id', $communityId)
            ->whereRaw('LOWER(TRIM(user_email)) = ?', [$userEmail])
            ->exists();

        if (!$isMember) {
            return redirect()->route('communities.show', $communityId)
                ->with('error', 'Anda harus bergabung dengan komunitas ini untuk mengakses forum!');
        }

        $posts = ForumPost::where('community_id', $communityId)
            ->withCount('replies')
            ->latest()
            ->paginate(10);

        return view('forum.index', compact('community', 'posts', 'user'));
    }

    public function show($communityId, $postId)
    {
        $community = Community::findOrFail($communityId);
        $user = ViewHelper::getCurrentUser(request());
        
        if (!$user) {
            return redirect()->route('communities.show', $communityId)
                ->with('error', 'Silakan login terlebih dahulu!');
        }

        // Check if user is a member of the community
        $userEmail = strtolower(trim($user->email));
        $isMember = CommunityMember::where('community_id', $communityId)
            ->whereRaw('LOWER(TRIM(user_email)) = ?', [$userEmail])
            ->exists();

        if (!$isMember) {
            return redirect()->route('communities.show', $communityId)
                ->with('error', 'Anda harus bergabung dengan komunitas ini untuk mengakses forum!');
        }

        $post = ForumPost::with(['replies' => function($query) {
            $query->latest();
        }])->findOrFail($postId);

        if ($post->community_id != $communityId) {
            return redirect()->route('forum.index', $communityId)
                ->with('error', 'Post tidak ditemukan!');
        }

        return view('forum.show', compact('community', 'post', 'user'));
    }

    public function store(Request $request, $communityId)
    {
        $community = Community::findOrFail($communityId);
        $user = ViewHelper::getCurrentUser($request);
        
        if (!$user) {
            return back()->with('error', 'Silakan login terlebih dahulu!')->withInput();
        }

        // Check if user is a member of the community
        $userEmail = strtolower(trim($user->email));
        $isMember = CommunityMember::where('community_id', $communityId)
            ->whereRaw('LOWER(TRIM(user_email)) = ?', [$userEmail])
            ->exists();

        if (!$isMember) {
            return back()->with('error', 'Anda harus bergabung dengan komunitas ini untuk membuat post!')->withInput();
        }

        $validated = $request->validate([
            'content' => 'required|string|max:5000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $validated['community_id'] = $communityId;
        $validated['user_email'] = $userEmail;
        $validated['user_name'] = $user->nama_lengkap ?? $user->name ?? $user->email;

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('forum', 'public');
            $validated['image_url'] = asset('storage/' . $imagePath);
        }

        ForumPost::create($validated);

        return redirect()->route('forum.index', $communityId)
            ->with('success', 'Post berhasil dibuat!');
    }

    public function reply(Request $request, $communityId, $postId)
    {
        $community = Community::findOrFail($communityId);
        $post = ForumPost::findOrFail($postId);
        
        if ($post->community_id != $communityId) {
            return back()->with('error', 'Post tidak ditemukan!')->withInput();
        }

        $user = ViewHelper::getCurrentUser($request);
        
        if (!$user) {
            return back()->with('error', 'Silakan login terlebih dahulu!')->withInput();
        }

        // Check if user is a member of the community
        $userEmail = strtolower(trim($user->email));
        $isMember = CommunityMember::where('community_id', $communityId)
            ->whereRaw('LOWER(TRIM(user_email)) = ?', [$userEmail])
            ->exists();

        if (!$isMember) {
            return back()->with('error', 'Anda harus bergabung dengan komunitas ini untuk membalas post!')->withInput();
        }

        $validated = $request->validate([
            'content' => 'required|string|max:2000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $validated['forum_post_id'] = $postId;
        $validated['user_email'] = $userEmail;
        $validated['user_name'] = $user->nama_lengkap ?? $user->name ?? $user->email;

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('forum', 'public');
            $validated['image_url'] = asset('storage/' . $imagePath);
        }

        ForumReply::create($validated);

        return redirect()->route('forum.show', [$communityId, $postId])
            ->with('success', 'Balasan berhasil ditambahkan!');
    }
}
