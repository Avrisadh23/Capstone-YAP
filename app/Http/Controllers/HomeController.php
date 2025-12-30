<?php

namespace App\Http\Controllers;

use App\Models\AppLink;
use App\Models\Feature;
use App\Models\Showcase;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        // Don't redirect here - let JavaScript handle it to avoid race conditions
        // The JavaScript will check both cookie and localStorage
        
        // Get user for avatar
        $userEmail = session('user_email') ?? $request->cookie('user_email');
        $user = null;
        if ($userEmail) {
            $userEmail = trim(strtolower($userEmail));
            $user = \App\Models\User::where('email', $userEmail)->first();
        }
        
        $features = Feature::query()->orderBy('order')->get();
        $showcases = Showcase::query()->orderBy('order')->get();
        $testimonials = Testimonial::query()->latest()->get();
        $appLinks = AppLink::query()->orderBy('order')->get();

        $filters = [
            ['label' => 'Aktivitas', 'placeholder' => 'Pilih aktivitas'],
            ['label' => 'Lokasi', 'placeholder' => 'Pilih kota'],
        ];

        // Dummy data for communities
        $communities = [
            [
                'id' => 1,
                'name' => 'Komunitas Wibu Jakarta',
                'description' => 'Komunitas untuk para pecinta anime dan manga di Jakarta',
                'members' => 1250,
                'image' => 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80',
                'category' => 'Hobi',
                'location' => 'Jakarta'
            ],
            [
                'id' => 2,
                'name' => 'Bengkel Motor Racing',
                'description' => 'Komunitas modifikasi motor dan racing untuk para bikers',
                'members' => 890,
                'image' => 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&q=80',
                'category' => 'Olahraga',
                'location' => 'Bandung'
            ],
            [
                'id' => 3,
                'name' => 'Futsal Community Surabaya',
                'description' => 'Komunitas futsal untuk semua level, dari pemula hingga profesional',
                'members' => 2100,
                'image' => 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&q=80',
                'category' => 'Olahraga',
                'location' => 'Surabaya'
            ],
            [
                'id' => 4,
                'name' => 'Komunitas Photography Yogyakarta',
                'description' => 'Sharing dan belajar fotografi bersama para fotografer',
                'members' => 650,
                'image' => 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80',
                'category' => 'Hobi',
                'location' => 'Yogyakarta'
            ],
            [
                'id' => 5,
                'name' => 'Basketball Club Medan',
                'description' => 'Komunitas basket untuk semua usia, latihan rutin setiap minggu',
                'members' => 450,
                'image' => 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80',
                'category' => 'Olahraga',
                'location' => 'Medan'
            ],
            [
                'id' => 6,
                'name' => 'Komunitas Gaming Online',
                'description' => 'Komunitas gamers untuk berbagai game online, tournament rutin',
                'members' => 3200,
                'image' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80',
                'category' => 'Hobi',
                'location' => 'Jakarta'
            ],
        ];

        // Dummy data for events
        $events = [
            [
                'id' => 1,
                'title' => 'Tournament Futsal Nasional 2025',
                'description' => 'Kompetisi futsal tingkat nasional dengan hadiah total 50 juta',
                'date' => '2025-01-20',
                'time' => '09:00',
                'location' => 'Jakarta',
                'image' => 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&q=80',
                'category' => 'Olahraga',
                'participants' => 120
            ],
            [
                'id' => 2,
                'title' => 'Anime Festival Jakarta',
                'description' => 'Festival anime terbesar di Jakarta dengan cosplay competition',
                'date' => '2025-02-15',
                'time' => '10:00',
                'location' => 'Jakarta',
                'image' => 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80',
                'category' => 'Hobi',
                'participants' => 5000
            ],
            [
                'id' => 3,
                'title' => 'Workshop Photography Dasar',
                'description' => 'Belajar teknik dasar fotografi dengan mentor profesional',
                'date' => '2025-01-25',
                'time' => '14:00',
                'location' => 'Yogyakarta',
                'image' => 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80',
                'category' => 'Workshop',
                'participants' => 30
            ],
            [
                'id' => 4,
                'title' => 'Basketball Championship 2025',
                'description' => 'Kejuaraan basket antar komunitas se-Indonesia',
                'date' => '2025-03-10',
                'time' => '08:00',
                'location' => 'Medan',
                'image' => 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80',
                'category' => 'Olahraga',
                'participants' => 200
            ],
            [
                'id' => 5,
                'title' => 'Gaming Tournament Mobile Legends',
                'description' => 'Tournament MLBB dengan prize pool 25 juta rupiah',
                'date' => '2025-02-01',
                'time' => '13:00',
                'location' => 'Jakarta',
                'image' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80',
                'category' => 'Gaming',
                'participants' => 64
            ],
            [
                'id' => 6,
                'title' => 'Motor Show & Modifikasi',
                'description' => 'Pameran motor modifikasi dan meetup para bikers',
                'date' => '2025-01-30',
                'time' => '09:00',
                'location' => 'Bandung',
                'image' => 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&q=80',
                'category' => 'Olahraga',
                'participants' => 300
            ],
        ];

        return view('homepage', compact('features', 'showcases', 'testimonials', 'filters', 'appLinks', 'communities', 'events', 'user'));
    }
}

