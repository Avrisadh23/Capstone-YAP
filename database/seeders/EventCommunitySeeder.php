<?php

namespace Database\Seeders;

use App\Models\Community;
use App\Models\Event;
use Illuminate\Database\Seeder;

class EventCommunitySeeder extends Seeder
{
    public function run(): void
    {
        // Get or create user
        $user = \App\Models\User::firstOrCreate(
            ['email' => 'test@example.com'],
            ['name' => 'Test User', 'password' => bcrypt('password')]
        );

        // Seed Communities
        $communities = [
            [
                'user_id' => $user->id,
                'name' => 'Komunitas Wibu Jakarta',
                'description' => 'Komunitas untuk para pecinta anime dan manga di Jakarta',
                'location' => 'Jakarta',
                'image_url' => 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80',
                'category' => 'Hobi',
                'is_active' => true,
            ],
            [
                'user_id' => $user->id,
                'name' => 'Bengkel Motor Racing',
                'description' => 'Komunitas modifikasi motor dan racing untuk para bikers',
                'location' => 'Bandung',
                'image_url' => 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&q=80',
                'category' => 'Olahraga',
                'is_active' => true,
            ],
            [
                'user_id' => $user->id,
                'name' => 'Futsal Community Surabaya',
                'description' => 'Komunitas futsal untuk semua level, dari pemula hingga profesional',
                'location' => 'Surabaya',
                'image_url' => 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&q=80',
                'category' => 'Olahraga',
                'is_active' => true,
            ],
            [
                'user_id' => $user->id,
                'name' => 'Komunitas Photography Yogyakarta',
                'description' => 'Sharing dan belajar fotografi bersama para fotografer',
                'location' => 'Yogyakarta',
                'image_url' => 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80',
                'category' => 'Hobi',
                'is_active' => true,
            ],
            [
                'user_id' => $user->id,
                'name' => 'Basketball Club Medan',
                'description' => 'Komunitas basket untuk semua usia, latihan rutin setiap minggu',
                'location' => 'Medan',
                'image_url' => 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80',
                'category' => 'Olahraga',
                'is_active' => true,
            ],
            [
                'user_id' => $user->id,
                'name' => 'Komunitas Gaming Online',
                'description' => 'Komunitas gamers untuk berbagai game online, tournament rutin',
                'location' => 'Jakarta',
                'image_url' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80',
                'category' => 'Hobi',
                'is_active' => true,
            ],
        ];

        foreach ($communities as $community) {
            Community::create($community);
        }

        // Seed Events
        $events = [
            [
                'user_id' => $user->id,
                'title' => 'Tournament Futsal Nasional 2025',
                'description' => 'Kompetisi futsal tingkat nasional dengan hadiah total 50 juta',
                'date' => '2025-01-20',
                'time' => '09:00',
                'location' => 'Jakarta',
                'image_url' => 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&q=80',
                'category' => 'Olahraga',
                'max_participants' => 200,
                'price' => 0,
                'is_active' => true,
            ],
            [
                'user_id' => $user->id,
                'title' => 'Anime Festival Jakarta',
                'description' => 'Festival anime terbesar di Jakarta dengan cosplay competition',
                'date' => '2025-02-15',
                'time' => '10:00',
                'location' => 'Jakarta',
                'image_url' => 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80',
                'category' => 'Hobi',
                'max_participants' => 5000,
                'price' => 50000,
                'is_active' => true,
            ],
            [
                'user_id' => $user->id,
                'title' => 'Workshop Photography Dasar',
                'description' => 'Belajar teknik dasar fotografi dengan mentor profesional',
                'date' => '2025-01-25',
                'time' => '14:00',
                'location' => 'Yogyakarta',
                'image_url' => 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80',
                'category' => 'Workshop',
                'max_participants' => 30,
                'price' => 150000,
                'is_active' => true,
            ],
            [
                'user_id' => $user->id,
                'title' => 'Basketball Championship 2025',
                'description' => 'Kejuaraan basket antar komunitas se-Indonesia',
                'date' => '2025-03-10',
                'time' => '08:00',
                'location' => 'Medan',
                'image_url' => 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80',
                'category' => 'Olahraga',
                'max_participants' => 200,
                'price' => 0,
                'is_active' => true,
            ],
            [
                'user_id' => $user->id,
                'title' => 'Gaming Tournament Mobile Legends',
                'description' => 'Tournament MLBB dengan prize pool 25 juta rupiah',
                'date' => '2025-02-01',
                'time' => '13:00',
                'location' => 'Jakarta',
                'image_url' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80',
                'category' => 'Gaming',
                'max_participants' => 64,
                'price' => 100000,
                'is_active' => true,
            ],
            [
                'user_id' => $user->id,
                'title' => 'Motor Show & Modifikasi',
                'description' => 'Pameran motor modifikasi dan meetup para bikers',
                'date' => '2025-01-30',
                'time' => '09:00',
                'location' => 'Bandung',
                'image_url' => 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&q=80',
                'category' => 'Olahraga',
                'max_participants' => 300,
                'price' => 0,
                'is_active' => true,
            ],
        ];

        foreach ($events as $event) {
            Event::create($event);
        }
    }
}
