<?php

namespace App\Http\Controllers;

use App\Models\Community;
use App\Models\Event;
use App\Helpers\ViewHelper;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    public function index(Request $request)
    {
        $user = ViewHelper::getCurrentUser($request);
        
        // Get events that have passed OR have recap (for flexibility)
        // Prioritize events with recap
        $events = Event::where('is_active', true)
            ->where(function($query) {
                $query->where('date', '<', now()->toDateString())
                      ->orWhereNotNull('recap')
                      ->where('recap', '!=', '');
            })
            ->orderByRaw('CASE WHEN recap IS NOT NULL AND recap != "" THEN 0 ELSE 1 END')
            ->latest('date')
            ->take(10)
            ->get();
        
        // Get latest communities
        $communities = Community::where('is_active', true)
            ->latest()
            ->take(10)
            ->get();
        
        return view('news.index', compact('events', 'communities', 'user'));
    }

    public function show($eventId)
    {
        $user = ViewHelper::getCurrentUser(request());
        
        // Get event that has passed OR has recap
        $event = Event::where('is_active', true)
            ->where(function($query) {
                $query->where('date', '<', now()->toDateString())
                      ->orWhereNotNull('recap')
                      ->where('recap', '!=', '');
            })
            ->with('participants', 'user')
            ->findOrFail($eventId);
        
        return view('news.show', compact('event', 'user'));
    }
}
