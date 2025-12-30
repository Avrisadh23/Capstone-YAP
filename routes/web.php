<?php

use App\Http\Controllers\CommunityController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', [LandingController::class, 'index'])->name('landing');
Route::get('/homepage', [HomeController::class, 'index'])->name('homepage');
Route::get('/profile', [ProfileController::class, 'index'])->name('profile');

// Events Routes
Route::get('/events', [EventController::class, 'index'])->name('events.index');
Route::get('/events/create', [EventController::class, 'create'])->name('events.create');
Route::post('/events', [EventController::class, 'store'])->name('events.store');
Route::get('/events/{id}', [EventController::class, 'show'])->name('events.show');
Route::get('/events/{id}/edit', [EventController::class, 'edit'])->name('events.edit');
Route::put('/events/{id}', [EventController::class, 'update'])->name('events.update');
Route::delete('/events/{id}', [EventController::class, 'destroy'])->name('events.destroy');
Route::post('/events/{id}/join', [EventController::class, 'join'])->name('events.join');
Route::get('/events/manage/list', [EventController::class, 'manage'])->name('events.manage');

// Communities Routes
Route::get('/communities', [CommunityController::class, 'index'])->name('communities.index');
Route::get('/communities/create', [CommunityController::class, 'create'])->name('communities.create');
Route::post('/communities', [CommunityController::class, 'store'])->name('communities.store');
Route::get('/communities/{id}', [CommunityController::class, 'show'])->name('communities.show');
Route::get('/communities/{id}/edit', [CommunityController::class, 'edit'])->name('communities.edit');
Route::put('/communities/{id}', [CommunityController::class, 'update'])->name('communities.update');
Route::delete('/communities/{id}', [CommunityController::class, 'destroy'])->name('communities.destroy');
Route::post('/communities/{id}/join', [CommunityController::class, 'join'])->name('communities.join');
Route::get('/communities/manage/list', [CommunityController::class, 'manage'])->name('communities.manage');
