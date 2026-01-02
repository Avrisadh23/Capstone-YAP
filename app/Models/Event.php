<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'date',
        'time',
        'location',
        'image_url',
        'category',
        'max_participants',
        'price',
        'contact',
        'requirements',
        'recap',
        'is_active',
    ];

    protected $casts = [
        'date' => 'date',
        'time' => 'datetime',
        'price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function participants(): HasMany
    {
        return $this->hasMany(EventParticipant::class);
    }

    public function getParticipantsCountAttribute(): int
    {
        return $this->participants()->count();
    }
}
