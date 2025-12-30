<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\CommunityMember;
use App\Models\EventParticipant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MemberCardController extends Controller
{
    public function index(Request $request)
    {
        $userEmail = $request->input('user_email')
            ?? session('user_email') 
            ?? $request->cookie('user_email');
        
        if (!$userEmail) {
            return redirect()->route('landing')->with('error', 'Silakan login terlebih dahulu.');
        }

        // Normalize email
        $userEmail = trim(strtolower($userEmail));
        
        // Find user by email
        $user = User::whereRaw('LOWER(email) = ?', [strtolower($userEmail)])->first();
        
        if (!$user) {
            return redirect()->route('landing')->with('error', 'User tidak ditemukan.');
        }

        // Check if user is pengurus in any community or event
        $isPengurus = CommunityMember::where('user_email', $userEmail)
            ->where('role', 'pengurus')
            ->exists() || 
            EventParticipant::where('user_email', $userEmail)
            ->where('role', 'pengurus')
            ->exists();

        return view('member-card', compact('user', 'isPengurus'));
    }

    public function downloadPDF(Request $request)
    {
        $userEmail = $request->input('user_email')
            ?? session('user_email') 
            ?? $request->cookie('user_email');
        
        if (!$userEmail) {
            return redirect()->route('landing')->with('error', 'Silakan login terlebih dahulu.');
        }

        // Normalize email
        $userEmail = trim(strtolower($userEmail));
        
        // Find user by email
        $user = User::whereRaw('LOWER(email) = ?', [strtolower($userEmail)])->first();
        
        if (!$user) {
            return redirect()->route('landing')->with('error', 'User tidak ditemukan.');
        }

        // For now, redirect to print page. Install dompdf later for actual PDF generation
        return redirect()->route('member-card', ['user_email' => $user->email])->with('print', true);
    }
}
