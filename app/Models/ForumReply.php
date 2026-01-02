<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ForumReply extends Model
{
    protected $fillable = [
        'forum_post_id',
        'user_email',
        'user_name',
        'content',
        'image_url',
    ];

    public function forumPost(): BelongsTo
    {
        return $this->belongsTo(ForumPost::class);
    }
}
