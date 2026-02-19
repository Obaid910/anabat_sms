<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeadFollowup extends Model
{
    use HasFactory;

    protected $fillable = [
        'lead_id',
        'user_id',
        'type',
        'status',
        'notes',
        'outcome',
        'scheduled_at',
        'completed_at',
        'next_action',
        'next_follow_up_date',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'completed_at' => 'datetime',
        'next_follow_up_date' => 'date',
    ];

    /**
     * Type constants
     */
    const TYPE_PHONE_CALL = 'phone_call';
    const TYPE_EMAIL = 'email';
    const TYPE_SMS = 'sms';
    const TYPE_WHATSAPP = 'whatsapp';
    const TYPE_IN_PERSON = 'in_person';
    const TYPE_VIDEO_CALL = 'video_call';
    const TYPE_OTHER = 'other';

    /**
     * Status constants
     */
    const STATUS_COMPLETED = 'completed';
    const STATUS_SCHEDULED = 'scheduled';
    const STATUS_CANCELLED = 'cancelled';

    /**
     * Get the lead that owns the followup.
     */
    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class);
    }

    /**
     * Get the user who performed the followup.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Mark followup as completed.
     */
    public function markAsCompleted(string $outcome = null): void
    {
        $this->update([
            'status' => self::STATUS_COMPLETED,
            'completed_at' => now(),
            'outcome' => $outcome,
        ]);
    }

    /**
     * Get scheduled followups.
     */
    public static function scopeScheduled($query)
    {
        return $query->where('status', self::STATUS_SCHEDULED)
                     ->whereNotNull('scheduled_at');
    }

    /**
     * Get overdue followups.
     */
    public static function scopeOverdue($query)
    {
        return $query->where('status', self::STATUS_SCHEDULED)
                     ->where('scheduled_at', '<', now());
    }

    /**
     * Get today's followups.
     */
    public static function scopeToday($query)
    {
        return $query->where('status', self::STATUS_SCHEDULED)
                     ->whereDate('scheduled_at', today());
    }
}
