<?php

use App\Http\Controllers\CommunityController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ForumController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\MemberCardController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', [LandingController::class, 'index'])->name('landing');
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
Route::get('/homepage', [HomeController::class, 'index'])->name('homepage');
Route::get('/news', [NewsController::class, 'index'])->name('news.index');
Route::get('/news/{eventId}', [NewsController::class, 'show'])->name('news.show');
Route::get('/profile', [ProfileController::class, 'index'])->name('profile');
Route::post('/profile/update', [ProfileController::class, 'update'])->name('profile.update');
Route::get('/member-card', [MemberCardController::class, 'index'])->name('member-card');
Route::get('/member-card/download', [MemberCardController::class, 'downloadPDF'])->name('member-card.download');

// Events Routes
Route::get('/events', [EventController::class, 'index'])->name('events.index');
Route::get('/events/create', [EventController::class, 'create'])->name('events.create');
Route::post('/events', [EventController::class, 'store'])->name('events.store');
Route::get('/events/myevent', [EventController::class, 'myEvents'])->name('events.my');
Route::get('/events/manage/list', [EventController::class, 'manage'])->name('events.manage');
Route::get('/events/{id}', [EventController::class, 'show'])->name('events.show');
Route::get('/events/{id}/edit', [EventController::class, 'edit'])->name('events.edit');
Route::put('/events/{id}', [EventController::class, 'update'])->name('events.update');
Route::delete('/events/{id}', [EventController::class, 'destroy'])->name('events.destroy');
Route::post('/events/{id}/join', [EventController::class, 'join'])->name('events.join');
Route::delete('/events/{id}/participants/{participantId}', [EventController::class, 'removeParticipant'])->name('events.remove-participant');

// Communities Routes
Route::get('/communities', [CommunityController::class, 'index'])->name('communities.index');
Route::get('/communities/create', [CommunityController::class, 'create'])->name('communities.create');
Route::post('/communities', [CommunityController::class, 'store'])->name('communities.store');
Route::get('/communities/mycommunity', [CommunityController::class, 'myCommunities'])->name('communities.my');
Route::get('/communities/manage/list', [CommunityController::class, 'manage'])->name('communities.manage');
Route::get('/communities/{id}', [CommunityController::class, 'show'])->name('communities.show');
Route::get('/communities/{id}/edit', [CommunityController::class, 'edit'])->name('communities.edit');
Route::put('/communities/{id}', [CommunityController::class, 'update'])->name('communities.update');
Route::delete('/communities/{id}', [CommunityController::class, 'destroy'])->name('communities.destroy');
Route::post('/communities/{id}/join', [CommunityController::class, 'join'])->name('communities.join');
Route::delete('/communities/{id}/members/{memberId}', [CommunityController::class, 'removeMember'])->name('communities.remove-member');

// Forum Routes
Route::get('/communities/{communityId}/forum', [ForumController::class, 'index'])->name('forum.index');
Route::get('/communities/{communityId}/forum/{postId}', [ForumController::class, 'show'])->name('forum.show');
Route::post('/communities/{communityId}/forum', [ForumController::class, 'store'])->name('forum.store');
Route::post('/communities/{communityId}/forum/{postId}/reply', [ForumController::class, 'reply'])->name('forum.reply');
