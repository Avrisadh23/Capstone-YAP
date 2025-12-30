<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CommunityMember extends Model
{
    protected $fillable = [
        'community_id',
        'user_email',
        'user_name',
        'phone',
        'notes',
    ];

    public function community(): BelongsTo
    {
        return $this->belongsTo(Community::class);
    }
}
