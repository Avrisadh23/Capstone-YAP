<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            // Normalize email first before validation
            $request->merge(['email' => strtolower(trim($request->email))]);
            
            $validated = $request->validate([
                'email' => 'required|email|unique:users,email',
                'nama_lengkap' => 'required|string|max:255',
                'tgl_lahir' => 'required|date',
                'foto_profile' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            // Handle foto profile upload
            $fotoProfilePath = null;
            if ($request->hasFile('foto_profile')) {
                $fotoProfilePath = $request->file('foto_profile')->store('profiles', 'public');
            }

            // Email is already normalized from validation above
            $email = $validated['email'];

            // Double check if email already exists (case-insensitive) as safety
            $existingUser = User::where('email', $email)->first();
            
            if ($existingUser) {
                return back()->with('error', 'Email sudah terdaftar')->withInput();
            }

            // Create user
            $user = User::create([
                'name' => $validated['nama_lengkap'],
                'email' => $email,
                'nama_lengkap' => $validated['nama_lengkap'],
                'tgl_lahir' => $validated['tgl_lahir'],
                'foto_profile' => $fotoProfilePath,
                'password' => Hash::make('password'), // Default password, bisa diganti nanti
            ]);

            // Set session and redirect
            session(['user_email' => $user->email]);
            
            // Create cookie with proper settings
            $cookie = cookie('user_email', $user->email, 60 * 24 * 30, '/', null, false, false); // 30 days, path: /, httpOnly: false so JS can read it
            
            // Redirect to homepage with success message
            return redirect('/homepage')->with('success', 'Registrasi berhasil!')
                ->withCookie($cookie);
                
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat registrasi: ' . $e->getMessage())->withInput();
        }
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
        ]);

        // Normalize email (trim and lowercase)
        $email = strtolower(trim($validated['email']));

        // Check if user exists in database
        // Since we normalize email on register, we can do exact match
        $user = User::where('email', $email)->first();
        
        // If not found with exact match, try to find any user and check manually
        // This handles cases where email might have been stored before normalization
        if (!$user) {
            $allUsers = User::all();
            foreach ($allUsers as $u) {
                if (strtolower(trim($u->email)) === $email) {
                    $user = $u;
                    break;
                }
            }
        }

        if (!$user) {
            return back()->with('error', 'Akun anda tidak terdaftar')->with('_login_error', true);
        }

        // Set session and redirect
        session(['user_email' => $user->email]);
        
        // Create cookie with proper settings
        $cookie = cookie('user_email', $user->email, 60 * 24 * 30, '/', null, false, false); // 30 days, path: /, httpOnly: false so JS can read it
        
        return redirect('/homepage')->with('success', 'Login berhasil!')->with('_login_success', true)
            ->withCookie($cookie);
    }

    public function logout(Request $request)
    {
        // Clear session
        session()->forget('user_email');
        session()->flush();
        
        // Redirect to landing page and clear cookie
        return redirect('/')->withCookie(cookie()->forget('user_email'));
    }
}
