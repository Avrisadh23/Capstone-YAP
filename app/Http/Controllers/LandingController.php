<?php

namespace App\Http\Controllers;

use App\Models\AppLink;
use App\Models\Feature;
use App\Models\Showcase;
use App\Models\Testimonial;

class LandingController extends Controller
{
    public function index()
    {
        $features = Feature::query()->orderBy('order')->get();
        $showcases = Showcase::query()->orderBy('order')->get();
        $testimonials = Testimonial::query()->latest()->get();
        $appLinks = AppLink::query()->orderBy('order')->get();

        $filters = [
            ['label' => 'Aktivitas', 'placeholder' => 'Pilih aktivitas'],
            ['label' => 'Lokasi', 'placeholder' => 'Pilih kota'],
            ['label' => 'Cabang Korwil', 'placeholder' => 'Pilih Cabang Korwil'],
        ];

        return view('landing', compact('features', 'showcases', 'testimonials', 'filters', 'appLinks'));
    }
}

