<?php

namespace Database\Seeders;

use App\Models\AppLink;
use App\Models\Feature;
use App\Models\Showcase;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        Feature::query()->delete();
        Showcase::query()->delete();
        Testimonial::query()->delete();
        AppLink::query()->delete();

        Feature::query()->insert([
            [
                'title' => 'Kelola komunitas lebih praktis dan memudahkan.',
                'description' => 'Waktumu buat korwil adalah lebih dari sekadar komunitas. Semuanya dimulai dengan pengelolaan yang simpel, fleksibel, dan profitable lewat Y.G.A Community Management.',
                'link_text' => 'Lihat selengkapnya',
                'link_url' => '#kelola',
                'order' => 1,
            ],
            [
                'title' => 'Cari komunitas yang cocok denganmu',
                'description' => 'Kini kamu ga perlu pusing-pusing cari komunitasmu. Dapatkan teman dan relasi baru dengan mudah hanya di Aplikasi YGA!',
                'link_text' => null,
                'link_url' => null,
                'order' => 2,
            ],
        ]);

        Showcase::query()->insert([
            [
                'title' => 'Booth tour',
                'image_url' => 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=600&q=80',
                'alt_text' => 'Booth event',
                'order' => 1,
            ],
            [
                'title' => 'Komunitas merayakan',
                'image_url' => 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=600&q=80',
                'alt_text' => 'Perayaan komunitas',
                'order' => 2,
            ],
            [
                'title' => 'Sesi workshop',
                'image_url' => 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80',
                'alt_text' => 'Workshop',
                'order' => 3,
            ],
        ]);

        Testimonial::query()->insert([
            [
                'name' => 'Opi Havidin',
                'role' => 'Bosdono Indonesia',
                'quote' => 'AYO Indonesia membawa revolusi di kalangan penggemar olahraga. Aplikasi ini memudahkan pencarian aktivitas olahraga, mengembangkan komunitas olahraga, dan memesan tempat olahraga. Ini adalah ekosistem olahraga yang menyeluruh.',
                'avatar_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
            ],
            [
                'name' => 'Testimonial 2',
                'role' => 'Role 2',
                'quote' => 'Testimonial kedua untuk keperluan carousel.',
                'avatar_url' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
            ],
            [
                'name' => 'Testimonial 3',
                'role' => 'Role 3',
                'quote' => 'Testimonial ketiga untuk keperluan carousel.',
                'avatar_url' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80',
            ],
        ]);

        AppLink::query()->insert([
            [
                'platform' => 'Google Play',
                'label' => 'Get it on Google Play',
                'url' => 'https://play.google.com/store',
                'badge_text' => 'Get it on',
                'icon' => 'google',
                'order' => 1,
            ],
            [
                'platform' => 'App Store',
                'label' => 'Download on the App Store',
                'url' => 'https://www.apple.com/app-store/',
                'badge_text' => 'Download on the',
                'icon' => 'apple',
                'order' => 2,
            ],
        ]);
    }
}
