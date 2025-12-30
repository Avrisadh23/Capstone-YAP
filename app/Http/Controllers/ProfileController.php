<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function index(Request $request)
    {
        $userEmail = $request->input('user_email')
            ?? session('user_email') 
            ?? $request->cookie('user_email');
        
        $user = null;
        if ($userEmail) {
            $userEmail = trim(strtolower($userEmail));
            $user = User::whereRaw('LOWER(email) = ?', [strtolower($userEmail)])->first();
        }

        return view('profile', compact('user', 'userEmail'));
    }

    public function update(Request $request)
    {
        $userEmail = session('user_email') ?? $request->cookie('user_email');
        if (!$userEmail) {
            return back()->with('error', 'Silakan login terlebih dahulu!');
        }

        $userEmail = trim(strtolower($userEmail));
        $user = User::where('email', $userEmail)->first();
        
        if (!$user) {
            return back()->with('error', 'User tidak ditemukan!');
        }

        $validated = $request->validate([
            'nama_lengkap' => 'nullable|string|max:255',
            'tgl_lahir' => 'nullable|date',
            'foto_profile' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle foto profile upload
        if ($request->hasFile('foto_profile')) {
            // Delete old photo if exists
            if ($user->foto_profile && Storage::disk('public')->exists($user->foto_profile)) {
                Storage::disk('public')->delete($user->foto_profile);
            }
            
            $fotoProfilePath = $request->file('foto_profile')->store('profiles', 'public');
            $validated['foto_profile'] = $fotoProfilePath;
        }

        // Update user
        if (isset($validated['nama_lengkap'])) {
            $validated['name'] = $validated['nama_lengkap'];
        }
        
        $user->update($validated);

        return back()->with('success', 'Profile berhasil diperbarui!');
    }
}

