<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ForumPost extends Model
{
    protected $fillable = [
        'community_id',
        'user_email',
        'user_name',
        'content',
        'image_url',
    ];

    public function community(): BelongsTo
    {
        return $this->belongsTo(Community::class);
    }

    public function replies(): HasMany
    {
        return $this->hasMany(ForumReply::class);
    }

    public function getRepliesCountAttribute(): int
    {
        return $this->replies()->count();
    }
}
