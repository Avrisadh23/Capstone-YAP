<?php

namespace App\Helpers;

use App\Models\User;

class ViewHelper
{
    public static function getCurrentUser($request)
    {
        // Try multiple sources for user_email
        $userEmail = $request->input('user_email')
            ?? session('user_email') 
            ?? $request->cookie('user_email');
        
        if (!$userEmail) {
            return null;
        }
        
        // Normalize email (trim and lowercase)
        $userEmail = trim(strtolower($userEmail));
        
        // Validate email format - if it's not a valid email (e.g., encoded string), skip it
        if (!filter_var($userEmail, FILTER_VALIDATE_EMAIL)) {
            // If request input is invalid, try session/cookie only
            $userEmail = session('user_email') ?? $request->cookie('user_email');
            if (!$userEmail || !filter_var(trim(strtolower($userEmail)), FILTER_VALIDATE_EMAIL)) {
                return null;
            }
            $userEmail = trim(strtolower($userEmail));
        }
        
        // Try exact match first
        $user = User::where('email', $userEmail)->first();
        
        // If not found, try case-insensitive search
        if (!$user) {
            $user = User::whereRaw('LOWER(TRIM(email)) = ?', [$userEmail])->first();
        }
        
        return $user;
    }
}

